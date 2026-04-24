import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { getDashboardSummary } from '../services/api';

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

function WorkflowPage() {
  const [workflowCounts, setWorkflowCounts] = useState({});

  useEffect(() => {
    getDashboardSummary()
      .then(({ data }) => setWorkflowCounts(data.workflowCounts || {}))
      .catch(console.error);
  }, []);

  return (
    <AppShell title="Workflow Control" description="Track the production pipeline stage by stage across the full order queue." navItems={adminNav}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(workflowCounts).map(([status, count]) => (
          <div key={status} className="panel-card p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{status}</p>
            <p className="mt-4 text-5xl font-black text-white">{count}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export default WorkflowPage;
