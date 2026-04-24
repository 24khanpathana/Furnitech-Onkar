import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { getNotifications, getPendingWorkers, reviewWorkerRequest } from '../services/api';

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

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const [notificationsRes, workersRes] = await Promise.all([getNotifications(), getPendingWorkers()]);
    setNotifications(notificationsRes.data);
    setWorkers(workersRes.data);
  };

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  const handleReview = async (workerId, action) => {
    setMessage('');
    setError('');
    try {
      const { data } = await reviewWorkerRequest(workerId, action);
      setMessage(data.message);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process worker request.');
    }
  };

  return (
    <AppShell title="Notifications" description="Review worker signup requests and monitor recent admin activity notices." navItems={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel-card p-5">
          <h2 className="text-xl font-bold text-white">Worker Approval Requests</h2>
          {message && <div className="alert-success mt-5">{message}</div>}
          {error && <div className="alert-error mt-5">{error}</div>}
          <div className="mt-5 grid gap-4">
            {workers.map((worker) => (
              <div key={worker._id} className="rounded-3xl bg-white/5 p-5">
                <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                  <p><span className="text-slate-400">Name:</span> {worker.name}</p>
                  <p><span className="text-slate-400">Branch:</span> {worker.branch}</p>
                  <p><span className="text-slate-400">Mobile:</span> {worker.mobileNumber}</p>
                  <p><span className="text-slate-400">Email:</span> {worker.email}</p>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="btn-emerald" onClick={() => handleReview(worker._id, 'accept')}>
                    Accept
                  </button>
                  <button className="btn-danger" onClick={() => handleReview(worker._id, 'reject')}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {workers.length === 0 && <p className="text-sm text-slate-400">No pending worker approvals right now.</p>}
          </div>
        </div>

        <div className="panel-card p-5">
          <h2 className="text-xl font-bold text-white">Activity Feed</h2>
          <div className="mt-5 space-y-4">
            {notifications.map((notification) => (
              <div key={notification._id} className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{notification.type}</p>
                <p className="mt-2 text-lg font-bold text-white">{notification.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{notification.message}</p>
                <p className="mt-3 text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default NotificationsPage;
