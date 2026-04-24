import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNavbar = () => {
  const activeLink = "bg-blue-700 text-white";
  const normalLink = "text-gray-300 hover:bg-blue-600 hover:text-white";

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-blue-700">
        Onkar Admin
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `${isActive ? activeLink : normalLink} block py-2.5 px-4 rounded transition duration-200`}>
          Dashboard
        </NavLink>
        <NavLink to="/add-order" className={({ isActive }) => `${isActive ? activeLink : normalLink} block py-2.5 px-4 rounded transition duration-200`}>
          Add Order
        </NavLink>
        <NavLink to="/admin/update-status" className={({ isActive }) => `${isActive ? activeLink : normalLink} block py-2.5 px-4 rounded transition duration-200`}>
          Update Order Status
        </NavLink>
         <NavLink to="/order-status" className={({ isActive }) => `${isActive ? activeLink : normalLink} block py-2.5 px-4 rounded transition duration-200`}>
          Check Order Status
        </NavLink>
        {/* Add other links like Inventory, Products etc. here */}
      </nav>
    </div>
  );
};

export default AdminNavbar;