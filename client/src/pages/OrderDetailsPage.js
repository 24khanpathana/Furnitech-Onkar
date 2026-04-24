import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import { getOrders } from '../services/api';

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

function OrderDetailsPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    getOrders().then(({ data }) => setOrders(data)).catch(console.error);
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        [order.orderId, order.customerName, order.productName, order.branch].some((value) =>
          value?.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [orders, search]
  );

  return (
    <AppShell title="Order Details" description="Review complete order information, customer data, and worker ownership in one place." navItems={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <div className="panel-card p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-white">All Orders</h2>
            <input
              className="input max-w-sm"
              placeholder="Search orders"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm text-slate-200">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Branch</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-white/10">
                    <td className="py-3">{order.orderId}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3">{order.productName}</td>
                    <td className="py-3">{order.branch}</td>
                    <td className="py-3">
                      <button className="btn-ghost px-4 py-2" onClick={() => setSelectedOrder(order)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card p-5">
          <h2 className="text-xl font-bold text-white">Selected Order</h2>
          {!selectedOrder && <p className="mt-5 text-sm text-slate-400">Choose an order to inspect full details.</p>}
          {selectedOrder && (
            <div className="mt-5 grid gap-4">
              {[
                ['Order ID', selectedOrder.orderId],
                ['Customer Name', selectedOrder.customerName],
                ['Mobile Number', selectedOrder.mobileNumber],
                ['Address', selectedOrder.address || 'Not provided'],
                ['Product Name', selectedOrder.productName],
                ['Material Type', selectedOrder.materialType || 'Not provided'],
                ['Product Details', selectedOrder.productDetails || 'Not provided'],
                ['Date', selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : 'Not provided'],
                ['Branch', selectedOrder.branch],
                ['Worker ID', selectedOrder.worker?._id || 'Unavailable'],
                ['Worker Name', selectedOrder.worker?.name || selectedOrder.workerName],
                ['Status', selectedOrder.status],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-white">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default OrderDetailsPage;
