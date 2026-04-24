import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { getDashboardSummary, getOrders } from '../services/api';

const workerNav = [
  { label: 'Dashboard', to: '/worker/dashboard' },
  { label: 'Order Status', to: '/worker/order-status' },
  { label: 'Add Order', to: '/worker/add-order' },
];

function WorkerPage() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [summaryRes, ordersRes] = await Promise.all([getDashboardSummary(), getOrders()]);
      setSummary(summaryRes.data);
      setOrders(ordersRes.data.slice(0, 6));
    };

    load().catch(console.error);
  }, []);

  return (
    <AppShell title="Worker Desk" description="Create new orders and track only the orders linked to your worker profile." navItems={workerNav} accent="sky">
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="metric-card">
            <span>Your Total Orders</span>
            <strong>{summary?.stats.totalOrders ?? 0}</strong>
          </div>
          <div className="metric-card">
            <span>Completed Orders</span>
            <strong>{summary?.stats.completedOrders ?? 0}</strong>
          </div>
          <div className="metric-card">
            <span>Active Orders</span>
            <strong>{summary?.stats.pendingOrders ?? 0}</strong>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <div className="panel-card p-5">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm text-slate-200">
                <thead className="text-slate-400">
                  <tr>
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
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

          <div className="panel-card p-5">
            <h2 className="text-xl font-bold text-white">Your Workflow Load</h2>
            <div className="mt-5 space-y-3">
              {Object.entries(summary?.workflowCounts || {}).map(([status, count]) => (
                <div key={status} className="rounded-2xl bg-white/5 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{status}</span>
                    <span className="text-lg font-bold text-white">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default WorkerPage;
