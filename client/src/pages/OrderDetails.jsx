import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder, orderPayReset } from '../redux/slices/orderSlice';
import api from '../utils/api';
import { Package, CheckCircle, Clock } from 'lucide-react';

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const { order, loading, error } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      // If we are using Razorpay, we ensure the script is loaded
      const addRazorpayScript = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };

      if (!window.Razorpay) {
        addRazorpayScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, order]);

  const successPaymentHandler = async (paymentResult) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Verify payment on backend
      const { data } = await api.post('/api/orders/razorpay/verify', paymentResult, config);
      
      if(data.message === 'Payment verified successfully') {
         dispatch(payOrder({ orderId, paymentResult }));
         dispatch(orderPayReset());
         dispatch(getOrderDetails(orderId)); // Refresh order details
      }
    } catch (err) {
      console.error(err);
      alert('Payment verification failed');
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      // Create Razorpay order on backend
      const { data: rzpOrder } = await api.post('/api/orders/razorpay', { amount: order.totalPrice }, config);
      
      const { data: clientId } = await api.get('/api/config/razorpay');
      
      const options = {
        key: clientId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "E-Commerce Project",
        description: `Order ${order._id}`,
        order_id: rzpOrder.id,
        handler: function (response) {
          successPaymentHandler({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            id: response.razorpay_payment_id,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: userInfo.email
          });
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Failed to initiate Razorpay payment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-12"><div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">{error}</div></div>;
  }

  if (!order) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center break-all">
        <Package className="mr-3 text-blue-500 flex-shrink-0" size={32} /> Order: {order._id}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
             {order.isDelivered ? (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-xl font-medium text-sm flex items-center">
                  <CheckCircle size={16} className="mr-1"/> Delivered
                </div>
             ) : (
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 rounded-bl-xl font-medium text-sm flex items-center">
                  <Clock size={16} className="mr-1"/> Not Delivered
                </div>
             )}
            <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Details</h2>
            <p className="text-slate-600 mb-2">
              <strong>Name: </strong> {order.user.name}
            </p>
            <p className="text-slate-600 mb-2">
              <strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-500 hover:underline">{order.user.email}</a>
            </p>
            <p className="text-slate-600">
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
             {order.isPaid ? (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-xl font-medium text-sm flex items-center">
                  <CheckCircle size={16} className="mr-1"/> Paid on {order.paidAt.substring(0, 10)}
                </div>
             ) : (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-xl font-medium text-sm flex items-center">
                  <Clock size={16} className="mr-1"/> Not Paid
                </div>
             )}
            <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Method</h2>
            <p className="text-slate-600">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p className="text-slate-500">Order is empty</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="py-4 flex items-center gap-6">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                    <span className="flex-grow font-medium text-slate-900">
                      {item.name}
                    </span>
                    <div className="text-slate-600 font-medium whitespace-nowrap">
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
                <span>${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-4 border-b border-slate-200">
                <span>Tax</span>
                <span>${order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-slate-900 pt-2">
                <span>Total</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div className="pt-2">
                {order.paymentMethod === 'Razorpay' ? (
                   <button
                    onClick={handleRazorpayPayment}
                    disabled={!sdkReady}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg"
                  >
                    Pay with Razorpay
                  </button>
                ) : (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-center text-sm font-medium">
                     Please pay upon delivery.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
