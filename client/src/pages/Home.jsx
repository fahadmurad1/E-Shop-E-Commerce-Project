import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import CategoryShowcase from '../components/CategoryShowcase';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Discover <span className="text-blue-500">Premium</span> Tech
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg">
              Elevate your lifestyle with our curated collection of cutting-edge electronics and accessories. 
            </p>
            <Link to="/shop" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
              Shop Now <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Mockup or Graphic */}
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 absolute"></div>
            <div className="relative z-10 bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md aspect-[4/3] border border-white/10 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Featured Tech" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-slate-500 mt-2">Our latest and greatest arrivals.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex text-blue-600 font-medium hover:text-blue-700 transition-colors items-center">
            View All <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
