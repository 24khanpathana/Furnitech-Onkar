import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import { deleteOrder, getOrders, updateOrderStatus } from '../services/api';

const adminNav = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Inventory', to: '/admin/inventory' },
  { label: 'Work-flow', to: '/admin/workflow' },
  { label: 'Order Status', to: '/admin/order-status' },
  { label: 'Order Details', to: '/admin/order-details' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Add Order', to: '/admin/add-order' },
  { label: 'Update Order Status', to: '/admin/update-order-status' },
  { label: 'Deleted Orders', to: '/admin/deleted-orders' },
  { label: 'Notifications', to: '/admin/notifications' },
];

const statusOptions = [
  'Cutting and Sizing',
  'Shaping and Milling',
  'Joinery and Assembly',
  'Sanding and Surface Preparation',
  'Finishing',
  'Quality Inspection',
  'Completed',
];

function UpdateOrderStatusPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadOrders = async () => {
    const { data } = await getOrders();
    setOrders(data);
    setStatusMap(
      data.reduce((acc, order) => {
        acc[order._id] = order.status;
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    loadOrders().catch(console.error);
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        [order.orderId, order.customerName, order.productName].some((value) =>
          value?.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [orders, search]
  );

  const handleStatusUpdate = async (orderId) => {
    setMessage('');
    setError('');
    try {
      await updateOrderStatus(orderId, statusMap[orderId]);
      setMessage('Order status updated successfully.');
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update order status.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setMessage('');
    setError('');
    try {
      await deleteOrder(orderId);
      setMessage('Order deleted and moved to deleted orders archive.');
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete order.');
    }
  };

  return (
    <AppShell title="Update Order Status" description="Admin-only control for workflow progression, completion, and deleted order handling." navItems={adminNav}>
      <div className="panel-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-white">Manage Orders</h2>
          <input className="input max-w-sm" placeholder="Search by order or customer" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        {message && <div className="alert-success mt-5">{message}</div>}
        {error && <div className="alert-error mt-5">{error}</div>}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm text-slate-200">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Current Status</th>
                <th className="pb-3">Update Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t border-white/10">
                  <td className="py-3">{order.orderId}</td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">{order.productName}</td>
                  <td className="py-3">
                    <span className="pill">{order.status}</span>
                  </td>
                  <td className="py-3">
                    <select
                      className="input min-w-60"
                      value={statusMap[order._id] || order.status}
                      onChange={(event) => {
                        setSelectedOrderId(order._id);
                        setStatusMap((prev) => ({ ...prev, [order._id]: event.target.value }));
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="btn-amber px-4 py-2" onClick={() => handleStatusUpdate(order._id)} disabled={selectedOrderId === order._id && !statusMap[order._id]}>
                        Save
                      </button>
                      <button className="btn-danger px-4 py-2" onClick={() => handleDeleteOrder(order._id)}>
                        Delete Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export default UpdateOrderStatusPage;
