import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { ShoppingBag, CheckCircle, XCircle } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/api/orders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.role === 'admin') {
      fetchOrders();
    }
  }, [userInfo]);

  const deliverHandler = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await api.put(`/api/orders/${id}/deliver`, {}, config);
      // Update local state to reflect delivery
      setOrders(orders.map(order => order._id === id ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } : order));
    } catch (err) {
      alert('Failed to update delivery status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <ShoppingBag className="mr-3 text-purple-500" size={32} /> Orders Management
        </h1>
        <Link to="/admin" className="text-blue-600 hover:underline font-medium">Back to Dashboard</Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivered</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      <Link to={`/order/${order._id}`} className="hover:text-blue-600">{order._id.substring(0, 8)}...</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {order.user && order.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      ${order.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isPaid ? (
                        <CheckCircle size={20} className="text-green-500 inline" />
                      ) : (
                        <XCircle size={20} className="text-red-500 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isDelivered ? (
                         <CheckCircle size={20} className="text-green-500 inline" />
                      ) : (
                        <XCircle size={20} className="text-yellow-500 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!order.isDelivered && (
                        <button
                          onClick={() => deliverHandler(order._id)}
                          className="text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1 rounded-lg"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
