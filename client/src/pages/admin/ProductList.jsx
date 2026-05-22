import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts, deleteProduct, createProduct } from '../../redux/slices/productSlice';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listProducts({}));
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = async () => {
    try {
      const newProduct = await dispatch(createProduct()).unwrap();
      navigate(`/admin/products/${newProduct._id}/edit`);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <Package className="mr-3 text-blue-500" size={32} /> Products Management
        </h1>
        <div className="flex gap-4">
          <Link to="/admin" className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2">Back</Link>
          <button 
            onClick={createProductHandler}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl flex items-center transition-colors"
          >
            <Plus size={20} className="mr-1" /> Create Product
          </button>
        </div>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {product._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {product.category && typeof product.category === 'object' ? product.category.name : product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {product.countInStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Link to={`/admin/products/${product._id}/edit`} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg mr-2 inline-flex">
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id)}
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

export default ProductList;
