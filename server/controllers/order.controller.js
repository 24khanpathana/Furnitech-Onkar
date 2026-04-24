const Order = require('../models/order.model');
const DeletedOrder = require('../models/deletedOrder.model');
const { sendOrderCreatedEmail } = require('../utils/email');

const STATUS_FLOW = [
  'Pending',
  'Cutting and Sizing',
  'Shaping and Milling',
  'Joinery and Assembly',
  'Sanding and Surface Preparation',
  'Finishing',
  'Quality Inspection',
  'Completed',
];

const buildOrderQuery = (user, search) => {
  const query = {};

  if (user.role === 'worker') {
    query.worker = user._id;
  }

  if (search) {
    query.$or = [
      { orderId: new RegExp(search, 'i') },
      { customerName: new RegExp(search, 'i') },
      { productName: new RegExp(search, 'i') },
    ];
  }

  return query;
};

const orderProjection = {
  passwordHash: 0,
  resetCodeHash: 0,
};

const mapOrder = (order) => ({
  ...order.toObject(),
  worker: order.worker
    ? {
        _id: order.worker._id,
        name: order.worker.name,
        email: order.worker.email,
        branch: order.worker.branch,
        mobileNumber: order.worker.mobileNumber,
      }
    : null,
});

exports.getDashboardSummary = async (req, res) => {
  try {
    const query = buildOrderQuery(req.user, req.query.search);
    const orders = await Order.find(query).sort({ createdAt: -1 });
    const totalOrders = orders.length;
    const completedOrders = orders.filter((order) => order.status === 'Completed').length;
    const pendingOrders = totalOrders - completedOrders;

    const groupByDate = (formatter) =>
      orders.reduce((acc, order) => {
        const key = formatter(order.createdAt);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    const weeklyOrders = groupByDate((date) => {
      const parsedDate = new Date(date);
      const start = new Date(parsedDate);
      start.setDate(parsedDate.getDate() - parsedDate.getDay());
      return start.toISOString().slice(0, 10);
    });

    const monthlyOrders = groupByDate((date) => new Date(date).toISOString().slice(0, 7));
    const yearlyOrders = groupByDate((date) => new Date(date).getFullYear().toString());

    res.json({
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
      },
      charts: {
        weeklyOrders,
        monthlyOrders,
        yearlyOrders,
      },
      workflowCounts: STATUS_FLOW.reduce((acc, status) => {
        acc[status] = orders.filter((order) => order.status === status).length;
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load dashboard summary.', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      worker: req.user.role === 'worker' ? req.user._id : req.body.worker || req.user._id,
      workerName: req.user.name,
      workerEmail: req.user.email,
      branch: req.body.branch || req.user.branch,
      status: 'Pending',
    };

    const order = await Order.create(orderData);
    const populatedOrder = await Order.findById(order._id).populate('worker', '-passwordHash -resetCodeHash');

    await sendOrderCreatedEmail(populatedOrder).catch(() => null);

    res.status(201).json(mapOrder(populatedOrder));
  } catch (error) {
    res.status(400).json({ message: 'Unable to create order.', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const query = buildOrderQuery(req.user, req.query.search);

    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('worker', '-passwordHash -resetCodeHash')
      .sort({ createdAt: -1 });

    res.json(orders.map(mapOrder));
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch orders.', error: error.message });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const query = buildOrderQuery(req.user, req.query.search);
    const limit = Number(req.query.limit) || 10;
    const orders = await Order.find(query)
      .populate('worker', '-passwordHash -resetCodeHash')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(orders.map(mapOrder));
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch recent orders.', error: error.message });
  }
};

exports.getOrderByOrderId = async (req, res) => {
  try {
    const query = buildOrderQuery(req.user);
    query.orderId = req.params.orderId;

    const order = await Order.findOne(query).populate('worker', '-passwordHash -resetCodeHash');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(mapOrder(order));
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch order.', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS_FLOW.includes(status) || status === 'Pending') {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('worker', '-passwordHash -resetCodeHash');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(mapOrder(order));
  } catch (error) {
    res.status(400).json({ message: 'Unable to update order status.', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('worker', '-passwordHash -resetCodeHash');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await DeletedOrder.create({
      originalOrderId: order._id,
      deletedBy: req.user._id,
      deletedAt: new Date(),
      payload: mapOrder(order),
    });

    await order.deleteOne();

    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete order.', error: error.message });
  }
};

exports.getDeletedOrders = async (req, res) => {
  try {
    const deletedOrders = await DeletedOrder.find()
      .populate('deletedBy', 'name email role')
      .sort({ deletedAt: -1 });

    res.json(deletedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch deleted orders.', error: error.message });
  }
};

exports.downloadOrdersCsv = async (req, res) => {
  try {
    const orders = await Order.find().populate('worker', '-passwordHash -resetCodeHash').sort({ createdAt: -1 });
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Mobile',
      'Customer Address',
      'Product Name',
      'Material Type',
      'Product Details',
      'Date',
      'Branch',
      'Status',
      'Worker Name',
      'Worker Email',
      'Created At',
    ];

    const escapeCsv = (value = '') => `"${String(value).replace(/"/g, '""')}"`;

    const rows = orders.map((order) =>
      [
        order.orderId,
        order.customerName,
        order.mobileNumber,
        order.address,
        order.productName,
        order.materialType,
        order.productDetails,
        order.date ? new Date(order.date).toISOString().slice(0, 10) : '',
        order.branch,
        order.status,
        order.worker?.name || order.workerName || '',
        order.worker?.email || order.workerEmail || '',
        order.createdAt.toISOString(),
      ]
        .map(escapeCsv)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="onkar-orders.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Unable to export orders.', error: error.message });
  }
};
