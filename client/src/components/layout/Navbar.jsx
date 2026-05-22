import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-wider text-primary">
            E-SHOP
          </Link>
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 hover:text-primary transition-colors">
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div className="flex items-center space-x-4">
              {userInfo.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <User size={24} />
                <span>{userInfo.name}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <User size={24} />
              <span className="hidden sm:block">Sign In</span>
            </Link>
          )}
          <button className="md:hidden p-2 hover:text-primary transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
