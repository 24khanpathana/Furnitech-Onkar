import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { getDashboardSummary, getRecentOrders, downloadOrdersCsv } from '../services/api';

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

const BarChartCard = ({ title, data }) => {
  const entries = Object.entries(data || {});
  const max = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <div className="panel-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">{entries.length} segments</span>
      </div>
      <div className="mt-6 space-y-4">
        {entries.length === 0 && <p className="text-sm text-slate-400">No data available yet.</p>}
        {entries.map(([label, value]) => (
          <div key={label}>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500" style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [summaryRes, recentRes] = await Promise.all([getDashboardSummary(), getRecentOrders(6)]);
      setSummary(summaryRes.data);
      setRecentOrders(recentRes.data);
    };

    loadData().catch(console.error);
  }, []);

  const handleDownload = async () => {
    const response = await downloadOrdersCsv();
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'onkar-orders.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Admin Control" description="Centralized oversight across production, approvals, and order progression." navItems={adminNav}>
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="metric-card">
            <span>Total Orders</span>
            <strong>{summary?.stats.totalOrders ?? 0}</strong>
          </div>
          <div className="metric-card">
            <span>Completed Orders</span>
            <strong>{summary?.stats.completedOrders ?? 0}</strong>
          </div>
          <div className="metric-card">
            <span>Pending Orders</span>
            <strong>{summary?.stats.pendingOrders ?? 0}</strong>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <BarChartCard title="Weekly Orders" data={summary?.charts.weeklyOrders} />
          <BarChartCard title="Monthly Orders" data={summary?.charts.monthlyOrders} />
          <BarChartCard title="Yearly Orders" data={summary?.charts.yearlyOrders} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="panel-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Recent Orders</h3>
              <button className="btn-ghost" onClick={handleDownload}>
                Download Order Data (CSV)
              </button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Branch</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t border-white/10">
                      <td className="py-3">{order.orderId}</td>
                      <td className="py-3">{order.customerName}</td>
                      <td className="py-3">{order.productName}</td>
                      <td className="py-3">{order.branch}</td>
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
            <h3 className="text-xl font-bold text-white">Workflow Snapshot</h3>
            <div className="mt-5 space-y-3">
              {Object.entries(summary?.workflowCounts || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-sm text-slate-300">{status}</span>
                  <span className="text-lg font-bold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default AdminDashboard;
