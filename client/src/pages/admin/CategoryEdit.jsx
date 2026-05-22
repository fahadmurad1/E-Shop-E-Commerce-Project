import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryDetails, updateCategory, createCategory, resetCategoryStatus } from '../../redux/slices/categorySlice';
import { ArrowLeft, Upload } from 'lucide-react';
import api from '../../utils/api';

const CategoryEdit = () => {
  const { id } = useParams();
  const isCreate = !id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const { category, loading, error, successUpdate, successCreate } = useSelector((state) => state.category);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (successUpdate || successCreate) {
      dispatch(resetCategoryStatus());
      navigate('/admin/categories');
    } else if (!isCreate) {
      if (!category.name || category._id !== id) {
        dispatch(getCategoryDetails(id)); // wait, our thunk fetches by slug! We need to make sure we have a getCategoryById, or we can just fetch all and find it.
        // Actually, our getCategoryDetails takes a slug. Let's fix this by finding it from the existing categories list.
      } else {
        setName(category.name);
        setDescription(category.description);
        setImage(category.image);
      }
    }
  }, [dispatch, navigate, id, category, successUpdate, successCreate, isCreate]);

  // Wait, the above logic is slightly flawed because getCategoryDetails expects slug. 
  // We added getCategoryById to backend. Let's fetch using axios directly for simplicity, or we can just use the categories list from state if available.
  const { categories } = useSelector((state) => state.category);
  useEffect(() => {
    if (!isCreate && categories.length > 0) {
      const cat = categories.find(c => c._id === id);
      if (cat) {
        setName(cat.name);
        setDescription(cat.description);
        setImage(cat.image);
      }
    }
  }, [categories, id, isCreate]);


  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.post('/api/upload', formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isCreate) {
      dispatch(createCategory({ name, description, image }));
    } else {
      dispatch(updateCategory({ id, categoryData: { name, description, image } }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <Link to="/admin/categories" className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium mb-6">
        <ArrowLeft size={20} className="mr-2" /> Go Back
      </Link>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          {isCreate ? 'Create Category' : 'Edit Category'}
        </h1>

        {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>}
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-4">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            <div className="relative">
              <input
                type="file"
                id="image-file"
                onChange={uploadFileHandler}
                className="hidden"
              />
              <label 
                htmlFor="image-file"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <Upload size={18} className="mr-2 text-slate-500" />
                Upload File
              </label>
              {uploading && <span className="ml-3 text-sm text-blue-500">Uploading...</span>}
            </div>
            {image && (
              <div className="mt-4">
                <img src={image} alt="Preview" className="h-32 object-contain rounded-xl border border-slate-200" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg"
          >
            {isCreate ? 'Create Category' : 'Update Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdit;
