import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { CreditCard, ArrowRight } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod: initialPaymentMethod } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || 'Razorpay');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <CreditCard className="mr-3 text-blue-500" size={32} /> Payment Method
        </h2>
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-slate-700 mb-4">Select Method</label>
            
            <div className="relative flex items-center p-4 border border-blue-500 rounded-xl bg-blue-50 cursor-pointer transition-all">
              <input
                type="radio"
                id="Razorpay"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="Razorpay" className="ml-3 block text-md font-medium text-slate-900 cursor-pointer flex-grow">
                Razorpay (Credit Card / UPI / NetBanking)
              </label>
            </div>

            <div className="relative flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
              <input
                type="radio"
                id="CashOnDelivery"
                name="paymentMethod"
                value="CashOnDelivery"
                checked={paymentMethod === 'CashOnDelivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="CashOnDelivery" className="ml-3 block text-md font-medium text-slate-900 cursor-pointer flex-grow">
                Cash On Delivery
              </label>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-500/30"
            >
              Continue to Place Order <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
