import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Users, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/api/auth/users', config);
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.role === 'admin') {
      fetchUsers();
    }
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await api.delete(`/api/auth/users/${id}`, config);
        setUsers(users.filter((user) => user._id !== id));
      } catch (err) {
        alert(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <Users className="mr-3 text-green-500" size={32} /> Users Management
        </h1>
        <div className="flex gap-4 items-center">
          <Link to="/admin" className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2">Back</Link>
          <Link to="/admin/users/create" className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition-colors">
            Create User
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'admin' ? (
                        <CheckCircle size={20} className="text-green-500 inline" />
                      ) : (
                        <XCircle size={20} className="text-red-500 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg inline-flex"
                      >
                        <Trash2 size={18} />
                      </button>
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

export default UserList;
