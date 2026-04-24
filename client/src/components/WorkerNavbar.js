import React from 'react';
import { Link } from 'react-router-dom';

const WorkerNavbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Onkar Worker</div>
        <div className="space-x-4">
            <Link to="/add-order" className="text-gray-300 hover:text-white">Add Order</Link>
            <Link to="/order-status" className="text-gray-300 hover:text-white">Check Order Status</Link>
        </div>
      </div>
    </nav>
  );
};

export default WorkerNavbar;