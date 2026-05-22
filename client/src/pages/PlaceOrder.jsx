import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, orderReset } from '../redux/slices/orderSlice';
import { clearCartItems } from '../redux/slices/cartSlice';
import { CheckCircle } from 'lucide-react';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const { order, success, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  useEffect(() => {
    if (success) {
      dispatch(clearCartItems());
      navigate(`/order/${order._id}`);
      dispatch(orderReset());
    }
  }, [success, navigate, order, dispatch]);

  // Calculate Prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2))); // 15% tax
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
        <CheckCircle className="mr-3 text-blue-500" size={32} /> Place Order
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping</h2>
            <p className="text-slate-600">
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Method</h2>
            <p className="text-slate-600">
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Items</h2>
            {cartItems.length === 0 ? (
              <p className="text-slate-500">Your cart is empty</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {cartItems.map((item, index) => (
                  <li key={index} className="py-4 flex items-center gap-6">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                    <Link to={`/product/${item.product}`} className="flex-grow font-medium text-slate-900 hover:text-blue-500 transition-colors">
                      {item.name}
                    </Link>
                    <div className="text-slate-600 font-medium">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600">
                <span>Items</span>
                <span>${itemsPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-4 border-b border-slate-200">
                <span>Tax</span>
                <span>${taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-slate-900 pt-2">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</div>}

            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
