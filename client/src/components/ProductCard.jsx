import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      countInStock: product.countInStock,
      qty: 1,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-slate-800">
            ${product.price}
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-lg text-slate-900 truncate mb-2">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-slate-700">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.numReviews})</span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="p-2 bg-slate-100 hover:bg-primary hover:text-white rounded-full transition-colors duration-300"
              disabled={product.countInStock === 0}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
