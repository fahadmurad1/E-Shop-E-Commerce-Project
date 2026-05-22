import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
        <TrendingUp className="mr-3 text-blue-500" size={32} /> Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/admin/products" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Package size={32} />
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-bold text-slate-900">Products</h2>
            <p className="text-slate-500">Manage inventory</p>
          </div>
        </Link>

        <Link to="/admin/orders" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <ShoppingBag size={32} />
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-bold text-slate-900">Orders</h2>
            <p className="text-slate-500">View and update</p>
          </div>
        </Link>

        <Link to="/admin/users" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Users size={32} />
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-bold text-slate-900">Users</h2>
            <p className="text-slate-500">Customer details</p>
          </div>
        </Link>
      </div>
      
      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 text-center">
        <p className="text-blue-800 text-lg">Welcome to the Admin Control Panel. Select an option above to manage the platform.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
