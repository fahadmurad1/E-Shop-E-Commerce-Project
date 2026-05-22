import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import { getCategoryDetails } from '../redux/slices/categorySlice';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.product);
  const { category, loading: categoryLoading, error: categoryError } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategoryDetails(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (category && category.slug === slug) {
      dispatch(listProducts({ categorySlug: slug }));
    }
  }, [dispatch, category, slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Home
      </Link>

      {categoryLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : categoryError ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{categoryError}</div>
      ) : category ? (
        <div className="mb-12">
          <div className="relative h-64 rounded-3xl overflow-hidden mb-8 shadow-md">
            <div className="absolute inset-0 bg-slate-900">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">{category.name}</h1>
              <p className="text-lg text-slate-200 max-w-2xl drop-shadow-md">{category.description}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">Products</h2>
            <span className="text-slate-500 font-medium">{products?.length || 0} items found</span>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : productsError ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{productsError}</div>
          ) : products.length === 0 ? (
            <div className="bg-slate-50 p-12 text-center rounded-3xl border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
              <p className="text-slate-500">We're currently restocking this category. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CategoryPage;
