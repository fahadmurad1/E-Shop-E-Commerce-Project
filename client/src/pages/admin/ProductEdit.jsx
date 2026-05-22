import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, updateProduct } from '../../redux/slices/productSlice';
import { listCategories } from '../../redux/slices/categorySlice';
import { Package, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: '',
  });

  const { product, loading, error } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch categories and product details on mount
  useEffect(() => {
    dispatch(listCategories());
    dispatch(listProductDetails(productId));
  }, [dispatch, productId]);

  // Populate form when product loads
  useEffect(() => {
    if (product && product._id === productId) {
      setFormData({
        name: product.name || '',
        price: product.price || 0,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        brand: product.brand || '',
        category: product.category?._id || product.category || '',
        countInStock: product.countInStock || 0,
        description: product.description || '',
      });
    }
  }, [product, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateProduct({
          _id: productId,
          name: formData.name,
          price: Number(formData.price),
          images: [formData.image],
          brand: formData.brand,
          category: formData.category,
          description: formData.description,
          countInStock: Number(formData.countInStock),
        })
      ).unwrap();
      navigate('/admin/products');
    } catch (err) {
      alert(err);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await api.post('/api/upload', formDataUpload, config);
      setFormData((prev) => ({ ...prev, image: data }));
    } catch (error) {
      console.error(error);
      alert('Image upload failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <Link to="/admin/products" className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium mb-6">
        <ArrowLeft size={20} className="mr-2" /> Go Back
      </Link>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <Package className="mr-3 text-blue-500" size={32} /> Edit Product
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 mb-6">{error}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Count In Stock</label>
                <input
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Paste image URL or upload below"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-2"
              />
              <input
                type="file"
                onChange={uploadFileHandler}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.image && (
                <img src={formData.image} alt="preview" className="mt-3 h-28 rounded-xl object-contain border border-slate-200" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  required
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg"
            >
              Update Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;
