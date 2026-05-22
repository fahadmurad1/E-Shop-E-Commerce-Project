import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';
import UserCreate from './pages/admin/UserCreate';
import ProductEdit from './pages/admin/ProductEdit';
import CategoryList from './pages/admin/CategoryList';
import CategoryEdit from './pages/admin/CategoryEdit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartFromBackend } from './redux/slices/cartSlice';

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCartFromBackend());
    }
  }, [dispatch, userInfo]);

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/categories" element={<Categories />} />
          
          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/users/create" element={<UserCreate />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/products/:id/edit" element={<ProductEdit />} />
            <Route path="/admin/products/create" element={<ProductEdit />} />
            <Route path="/admin/categories" element={<CategoryList />} />
            <Route path="/admin/categories/create" element={<CategoryEdit />} />
            <Route path="/admin/categories/:id/edit" element={<CategoryEdit />} />
            <Route path="/admin/orders" element={<OrderList />} />
          </Route>
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
