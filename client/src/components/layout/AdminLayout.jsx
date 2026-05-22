import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <Link to="/" className="text-2xl font-bold tracking-wider text-primary hover:text-white transition-colors">
            E-SHOP
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <TrendingUp size={20} className="mr-3" /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <Package size={20} className="mr-3" /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <ShoppingBag size={20} className="mr-3" /> Orders
          </Link>
          <Link to="/admin/categories" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <Package size={20} className="mr-3" /> Categories
          </Link>
          <Link to="/admin/users" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <Users size={20} className="mr-3" /> Users
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logoutHandler} className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-red-900/50 rounded-xl transition-colors">
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8">
          <h2 className="text-xl font-semibold text-slate-800">Admin Panel</h2>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm font-medium text-slate-600">Logged in as {userInfo?.name}</span>
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
            {/* Mobile menu toggle could go here, but for now we provide a direct logout for mobile or they use desktop */}
            <button onClick={logoutHandler} className="md:hidden text-slate-500 hover:text-red-500">
              <LogOut size={24} />
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-2 sm:p-6">
          {/* Outlet renders the matched child route (e.g. AdminDashboard) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
