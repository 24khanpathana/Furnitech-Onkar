import React, { useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

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

const makeOrderId = () => String(Math.floor(1000 + Math.random() * 899999));

function AddOrderPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    orderId: makeOrderId(),
    customerName: '',
    mobileNumber: '',
    address: '',
    productName: '',
    materialType: '',
    productDetails: '',
    date: new Date().toISOString().slice(0, 10),
    branch: user?.branch || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navItems = useMemo(() => (user?.role === 'admin' ? adminNav : workerNav), [user?.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const { data } = await createOrder(form);
      setMessage(`Order ${data.orderId} created successfully and status set to Pending.`);
      setForm({
        orderId: makeOrderId(),
        customerName: '',
        mobileNumber: '',
        address: '',
        productName: '',
        materialType: '',
        productDetails: '',
        date: new Date().toISOString().slice(0, 10),
        branch: user?.branch || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create order.');
    }
  };

  return (
    <AppShell
      title="Add New Order"
      description="Create a production order with worker ownership, branch details, and automatic pending status."
      navItems={navItems}
      accent={user?.role === 'admin' ? 'amber' : 'sky'}
    >
      <div className="panel-card p-6">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="label">Order ID</label>
            <input className="input" value={form.orderId} readOnly />
          </div>
          <div>
            <label className="label">Date</label>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Customer Name*</label>
            <input className="input" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} required />
          </div>
          <div>
            <label className="label">Customer Mobile*</label>
            <input className="input" value={form.mobileNumber} onChange={(event) => setForm({ ...form, mobileNumber: event.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <label className="label">Customer Address</label>
            <input className="input" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          </div>
          <div>
            <label className="label">Product Name*</label>
            <input className="input" value={form.productName} onChange={(event) => setForm({ ...form, productName: event.target.value })} required />
          </div>
          <div>
            <label className="label">Material Type</label>
            <input className="input" value={form.materialType} onChange={(event) => setForm({ ...form, materialType: event.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Product Details</label>
            <textarea className="input min-h-32" value={form.productDetails} onChange={(event) => setForm({ ...form, productDetails: event.target.value })} />
          </div>
          <div>
            <label className="label">Branch</label>
            <input className="input" value={form.branch} onChange={(event) => setForm({ ...form, branch: event.target.value })} required />
          </div>
          <div>
            <label className="label">Worker Login ID</label>
            <input className="input" value={user?.email || ''} readOnly />
          </div>

          {message && <div className="alert-success md:col-span-2">{message}</div>}
          {error && <div className="alert-error md:col-span-2">{error}</div>}

          <div className="md:col-span-2">
            <button className={user?.role === 'admin' ? 'btn-amber' : 'btn-sky'} type="submit">
              Save Order
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export default AddOrderPage;
