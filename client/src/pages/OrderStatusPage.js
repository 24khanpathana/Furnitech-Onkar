import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import { getOrderByOrderId, getRecentOrders } from '../services/api';

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

const workerNav = [
  { label: 'Dashboard', to: '/worker/dashboard' },
  { label: 'Order Status', to: '/worker/order-status' },
  { label: 'Add Order', to: '/worker/add-order' },
];

function OrderStatusPage() {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getRecentOrders(12)
      .then(({ data }) => setRecentOrders(data))
      .catch(console.error);
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setSelectedOrder(null);

    try {
      const { data } = await getOrderByOrderId(orderId.trim());
      setSelectedOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found.');
    }
  };

  const navItems = user?.role === 'admin' ? adminNav : workerNav;
  const homeTitle = user?.role === 'admin' ? 'Order Status' : 'My Order Status';
  const homeDesc =
    user?.role === 'admin'
      ? 'Search any order ID and monitor the latest production state across all branches.'
      : 'Search your own orders by order ID and review the current production stage.';

  return (
    <AppShell title={homeTitle} description={homeDesc} navItems={navItems} accent={user?.role === 'admin' ? 'amber' : 'sky'}>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
        <div className="panel-card p-5">
          <h2 className="text-xl font-bold text-white">Search by Order ID</h2>
          <form className="mt-5 flex flex-col gap-4 sm:flex-row" onSubmit={handleSearch}>
            <input
              className="input"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter 4-6 digit Order ID"
            />
            <button className={user?.role === 'admin' ? 'btn-amber' : 'btn-sky'} type="submit">
              Search
            </button>
          </form>
          {error && <div className="alert-error mt-5">{error}</div>}

          {selectedOrder && (
            <div className="mt-6 space-y-4 rounded-3xl bg-white/5 p-5">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Order ID</p>
                <p className="mt-1 text-2xl font-black text-white">{selectedOrder.orderId}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-400">Customer Name</p>
                  <p className="mt-1 text-white">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Product Name</p>
                  <p className="mt-1 text-white">{selectedOrder.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Current Status</p>
                  <p className="mt-1"><span className="pill">{selectedOrder.status}</span></p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Branch</p>
                  <p className="mt-1 text-white">{selectedOrder.branch}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="panel-card p-5">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-slate-200">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-white/10">
                    <td className="py-3">{order.orderId}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3">{order.productName}</td>
                    <td className="py-3">
                      <span className="pill">{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default OrderStatusPage;
