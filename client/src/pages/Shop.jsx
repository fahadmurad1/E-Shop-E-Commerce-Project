import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { Filter, Search } from 'lucide-react';

const Shop = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [keyword, setKeyword] = useState('');
  
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    // This would typically trigger an API call with the keyword
    console.log("Searching for:", keyword);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 md:mb-0">Shop All Products</h1>
        
        <form onSubmit={handleSearch} className="flex relative max-w-md w-full">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 font-semibold text-lg mb-4 pb-4 border-b border-slate-100">
              <Filter size={20} /> Filters
            </div>
            {/* Mock Categories */}
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900">Categories</h3>
              <div className="flex items-center">
                <input type="checkbox" id="cat-1" className="rounded text-blue-500 focus:ring-blue-500" />
                <label htmlFor="cat-1" className="ml-2 text-slate-600 cursor-pointer">Electronics</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="cat-2" className="rounded text-blue-500 focus:ring-blue-500" />
                <label htmlFor="cat-2" className="ml-2 text-slate-600 cursor-pointer">Clothing</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="cat-3" className="rounded text-blue-500 focus:ring-blue-500" />
                <label htmlFor="cat-3" className="ml-2 text-slate-600 cursor-pointer">Home & Garden</label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
