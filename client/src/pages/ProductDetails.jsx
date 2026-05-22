import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails } from '../redux/slices/productSlice';
import { addToCart, syncCartToBackend } from '../redux/slices/cartSlice';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      countInStock: product.countInStock,
      qty: Number(qty),
    }));
    dispatch(syncCartToBackend());
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center text-slate-500 hover:text-blue-500 mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Shop
      </Link>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div>
      ) : product._id ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex items-center justify-center bg-slate-50">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="max-w-full rounded-2xl shadow-lg mix-blend-multiply" />
            ) : (
              <div className="w-full aspect-square bg-slate-200 rounded-2xl flex items-center justify-center">No Image</div>
            )}
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-2">{product.brand}</h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-slate-500">({product.numReviews} reviews)</span>
            </div>
            
            <div className="text-3xl font-bold text-slate-900 mb-6">${product.price}</div>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="border-t border-slate-100 pt-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-slate-700">Status</span>
                <span className={`font-semibold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {product.countInStock > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Quantity</span>
                  <select 
                    value={qty} 
                    onChange={(e) => setQty(e.target.value)}
                    className="border border-slate-300 rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30"
            >
              <ShoppingCart className="mr-2" />
              Add To Cart
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
