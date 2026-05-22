import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { setCredentials, logout } from '../redux/slices/authSlice';
import { Package, User as UserIcon, LogOut } from 'lucide-react';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchMyOrders();
    }
  }, [userInfo, navigate]);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await api.get('/api/orders/myorders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Ensure you have a user update route implemented on the backend!
        const { data } = await api.put('/api/users/profile', { id: userInfo._id, name, email, password }, config);
        dispatch(setCredentials(data));
        setSuccess(true);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
      }
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* User Profile Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <UserIcon className="mr-2 text-blue-500" size={24} /> User Profile
              </h2>
              <button onClick={logoutHandler} className="text-slate-500 hover:text-red-500 transition-colors p-2">
                <LogOut size={20} />
              </button>
            </div>
            
            {message && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4">{message}</div>}
            {success && <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4">Profile Updated</div>}
            
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:w-2/3">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
              <Package className="mr-2 text-blue-500" size={24} /> My Orders
            </h2>
            
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Delivered</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {order.createdAt.substring(0, 10)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          ${order.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.isPaid ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {order.paidAt.substring(0, 10)}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.isDelivered ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {order.deliveredAt.substring(0, 10)}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
