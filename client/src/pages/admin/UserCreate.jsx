import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, UserPlus } from 'lucide-react';
import api from '../../utils/api';

const UserCreate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await api.post('/api/auth/users', { name, email, password, role }, config);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <Link to="/admin/users" className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium mb-6">
        <ArrowLeft size={20} className="mr-2" /> Go Back
      </Link>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <UserPlus className="mr-3 text-green-500" size={32} /> Create New User
        </h1>

        <form onSubmit={submitHandler} className="space-y-6">
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;
