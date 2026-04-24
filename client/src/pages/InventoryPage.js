import React, { useEffect, useState } from 'react';
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

function InventoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(({ data }) => setOrders(data)).catch(console.error);
  }, []);

  const branchCounts = orders.reduce((acc, order) => {
    acc[order.branch] = (acc[order.branch] || 0) + 1;
    return acc;
  }, {});

  const materialCounts = orders.reduce((acc, order) => {
    const key = order.materialType || 'Unspecified';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <AppShell title="Inventory View" description="Branch and material-level visibility based on live order demand." navItems={adminNav}>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel-card p-5">
          <h2 className="text-xl font-bold text-white">Orders by Branch</h2>
          <div className="mt-5 space-y-3">
            {Object.entries(branchCounts).map(([branch, count]) => (
              <div key={branch} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4">
                <span className="text-slate-300">{branch}</span>
                <span className="text-2xl font-black text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card p-5">
          <h2 className="text-xl font-bold text-white">Material Mix</h2>
          <div className="mt-5 space-y-3">
            {Object.entries(materialCounts).map(([material, count]) => (
              <div key={material} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4">
                <span className="text-slate-300">{material}</span>
                <span className="text-2xl font-black text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default InventoryPage;
