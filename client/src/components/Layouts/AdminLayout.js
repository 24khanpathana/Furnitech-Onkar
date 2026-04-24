import React from 'react';
import AdminNavbar from '../AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AdminNavbar />
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;