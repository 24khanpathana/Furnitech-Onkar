import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import WorkerSignupPage from './pages/WorkerSignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import WorkerPage from './pages/WorkerPage';
import InventoryPage from './pages/InventoryPage';
import WorkflowPage from './pages/WorkflowPage';
import OrderStatusPage from './pages/OrderStatusPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProductsPage from './pages/ProductsPage';
import AddOrderPage from './pages/AddOrderPage';
import UpdateOrderStatusPage from './pages/UpdateOrderStatusPage';
import DeletedOrdersPage from './pages/DeletedOrdersPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<LoginPage role="admin" />} />
        <Route path="/worker/login" element={<LoginPage role="worker" />} />
        <Route path="/worker/signup" element={<WorkerSignupPage />} />
        <Route path="/worker/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute role="admin">
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workflow"
          element={
            <ProtectedRoute role="admin">
              <WorkflowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order-status"
          element={
            <ProtectedRoute role="admin">
              <OrderStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order-details"
          element={
            <ProtectedRoute role="admin">
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-order"
          element={
            <ProtectedRoute role="admin">
              <AddOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-order-status"
          element={
            <ProtectedRoute role="admin">
              <UpdateOrderStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/deleted-orders"
          element={
            <ProtectedRoute role="admin">
              <DeletedOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute role="admin">
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute role="worker">
              <WorkerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/add-order"
          element={
            <ProtectedRoute role="worker">
              <AddOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/order-status"
          element={
            <ProtectedRoute role="worker">
              <OrderStatusPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
