import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, syncCartToBackend } from '../redux/slices/cartSlice';
import { Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    dispatch(syncCartToBackend());
  };

  const handleCheckout = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
          <p className="text-slate-500 mb-6 text-lg">Your cart is currently empty.</p>
          <Link to="/shop" className="inline-block bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-600 transition-colors">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <li key={item.product} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                    
                    <div className="flex-grow text-center sm:text-left">
                      <Link to={`/product/${item.product}`} className="font-semibold text-lg text-slate-900 hover:text-blue-500 transition-colors">
                        {item.name}
                      </Link>
                      <div className="text-blue-500 font-bold mt-1">${item.price}</div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <select 
                        value={item.qty} 
                        onChange={(e) => {
                          dispatch(addToCart({ ...item, qty: Number(e.target.value) }));
                          dispatch(syncCartToBackend());
                        }}
                        className="border border-slate-300 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>

                      <button 
                        onClick={() => handleRemove(item.product)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                  <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 pb-4 border-b border-slate-200">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-slate-900 pt-2">
                  <span>Total</span>
                  <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg"
              >
                Proceed to Checkout <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
