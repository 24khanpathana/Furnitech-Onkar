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

function ProductsPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(({ data }) => setOrders(data)).catch(console.error);
  }, []);

  const groupedProducts = useMemo(() => {
    return Object.entries(
      orders.reduce((acc, order) => {
        if (!acc[order.productName]) {
          acc[order.productName] = { total: 0, materials: new Set(), branches: new Set() };
        }
        acc[order.productName].total += 1;
        if (order.materialType) acc[order.productName].materials.add(order.materialType);
        if (order.branch) acc[order.productName].branches.add(order.branch);
        return acc;
      }, {})
    ).map(([productName, value]) => ({
      productName,
      total: value.total,
      materials: Array.from(value.materials),
      branches: Array.from(value.branches),
    }));
  }, [orders]);

  return (
    <AppShell title="Product Intelligence" description="See which products are being ordered most often and where they are being produced." navItems={adminNav}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groupedProducts.map((product) => (
          <div key={product.productName} className="panel-card p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Product</p>
            <h2 className="mt-2 text-2xl font-black text-white">{product.productName}</h2>
            <p className="mt-4 text-4xl font-black text-amber-300">{product.total}</p>
            <p className="mt-1 text-sm text-slate-400">total orders</p>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Materials</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.materials.length === 0 && <span className="pill">Unspecified</span>}
                {product.materials.map((material) => (
                  <span className="pill" key={material}>
                    {material}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Branches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.branches.map((branch) => (
                  <span className="pill" key={branch}>
                    {branch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export default ProductsPage;
