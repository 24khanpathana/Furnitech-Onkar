import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { getDeletedOrders } from '../services/api';

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

function DeletedOrdersPage() {
  const [deletedOrders, setDeletedOrders] = useState([]);

  useEffect(() => {
    getDeletedOrders().then(({ data }) => setDeletedOrders(data)).catch(console.error);
  }, []);

  return (
    <AppShell title="Deleted Orders" description="Archive of orders removed by admin, with deletion history preserved." navItems={adminNav}>
      <div className="panel-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm text-slate-200">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Deleted By</th>
                <th className="pb-3">Deleted At</th>
              </tr>
            </thead>
            <tbody>
              {deletedOrders.map((item) => (
                <tr key={item._id} className="border-t border-white/10">
                  <td className="py-3">{item.payload?.orderId}</td>
                  <td className="py-3">{item.payload?.customerName}</td>
                  <td className="py-3">{item.payload?.productName}</td>
                  <td className="py-3">{item.deletedBy?.name || 'Unknown'}</td>
                  <td className="py-3">{new Date(item.deletedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export default DeletedOrdersPage;
