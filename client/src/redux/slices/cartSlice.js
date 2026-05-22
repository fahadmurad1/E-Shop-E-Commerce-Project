import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: 'Razorpay',
};

import { logout } from './authSlice';
import api from '../../utils/api';

export const fetchCartFromBackend = createAsyncThunk(
  'cart/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo }, cart: { cartItems: localCartItems } } = getState();
      if (!userInfo) return localCartItems;

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: dbCartItems } = await api.get('/api/cart', config);
      
      let mergedCart = [...dbCartItems];
      let hasNewLocalItems = false;
      
      localCartItems.forEach(localItem => {
        const existItem = mergedCart.find(x => x.product === localItem.product);
        if (existItem) {
          if (localItem.qty !== existItem.qty) {
            existItem.qty = localItem.qty;
            hasNewLocalItems = true;
          }
        } else {
          mergedCart.push(localItem);
          hasNewLocalItems = true;
        }
      });

      if (hasNewLocalItems) {
        await api.post('/api/cart', { cartItems: mergedCart }, config);
      }
      
      return mergedCart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const syncCartToBackend = createAsyncThunk(
  'cart/sync',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo }, cart: { cartItems } } = getState();
      if (!userInfo) return;
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await api.post('/api/cart', { cartItems }, config);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.cartItems = [];
        state.shippingAddress = {};
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingAddress');
      })
      .addCase(fetchCartFromBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
