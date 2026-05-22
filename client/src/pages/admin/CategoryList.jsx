import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listCategories, deleteCategory } from '../../redux/slices/categorySlice';
import { Edit, Trash2, Plus, Package } from 'lucide-react';

const CategoryList = () => {
  const dispatch = useDispatch();

  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <Package className="mr-3 text-blue-500" size={32} /> Categories
        </h1>
        <Link to="/admin/categories/create" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-colors flex items-center">
          <Plus size={20} className="mr-2" /> Create Category
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={category.image} alt={category.name} className="h-12 w-12 object-cover rounded-lg shadow-sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <Link to={`/admin/categories/${category._id}/edit`} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg">
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteHandler(category._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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

export default CategoryList;
