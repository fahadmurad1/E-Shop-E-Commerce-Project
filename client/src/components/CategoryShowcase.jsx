import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCategories } from '../redux/slices/categorySlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryShowcase = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (error) return null; // Fallback quietly if error
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Shop by Category</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Explore our wide range of collections curated just for you.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.slice(0, 8).map((category) => (
            <motion.div key={category._id} variants={itemVariants}>
              <Link to={`/category/${category.slug}`} className="group relative block h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-slate-900">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <span className="inline-flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now <span className="ml-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
