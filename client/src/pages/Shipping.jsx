import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { MapPin, ArrowRight, Home, CreditCard, ShoppingBag } from 'lucide-react';

const steps = [
  { label: 'Cart', icon: ShoppingBag, path: '/cart' },
  { label: 'Shipping', icon: MapPin, path: '/shipping' },
  { label: 'Payment', icon: CreditCard, path: '/payment' },
];

const Shipping = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [state, setState] = useState(shippingAddress?.state || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || 'India');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');
  const [fullName, setFullName] = useState(shippingAddress?.fullName || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ fullName, address, city, state, postalCode, country, phone }));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      {/* Stepper */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-0">
          {steps.map((step, idx) => {
            const isActive = step.label === 'Shipping';
            const isDone = step.label === 'Cart';
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                      ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : isDone ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`mt-1 text-xs font-semibold ${isActive ? 'text-blue-600' : isDone ? 'text-green-500' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 w-16 sm:w-24 mx-1 mt-[-14px] ${isDone ? 'bg-green-400' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Home className="text-blue-500" size={28} />
            Delivery Address
          </h2>
          <p className="text-slate-500 text-sm mb-8">Please fill in your complete delivery details.</p>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 border border-r-0 border-slate-200 rounded-l-xl bg-slate-100 text-slate-600 font-medium text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Address (House No., Building, Street, Area)
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. 123, MG Road, Sector 5"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none"
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City / Town</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                >
                  <option value="">Select State</option>
                  {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Postal Code + Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit PIN code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 text-base"
              >
                Continue to Payment <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Safe & Secure Badge */}
        <p className="text-center text-slate-400 text-sm mt-6 flex items-center justify-center gap-1.5">
          🔒 Safe and Secure Payments. Easy returns. 100% Authentic products.
        </p>
      </div>
    </div>
  );
};

export default Shipping;
