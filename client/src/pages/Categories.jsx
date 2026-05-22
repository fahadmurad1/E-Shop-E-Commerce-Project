import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listCategories } from '../redux/slices/categorySlice';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">All Categories</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Browse our wide range of product categories.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {categories.map((category) => (
            <motion.div key={category._id} variants={itemVariants}>
              <Link
                to={`/category/${category.slug}`}
                className="group relative flex flex-col h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-900"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                    Shop Now <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Categories;
