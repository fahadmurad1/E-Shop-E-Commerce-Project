import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const listProducts = createAsyncThunk('product/list', async ({ keyword = '', pageNumber = '', categorySlug = '' } = {}, { rejectWithValue }) => {
  try {
    let url = `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`;
    if (categorySlug) {
      url += `&categorySlug=${categorySlug}`;
    }
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const listProductDetails = createAsyncThunk('product/details', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createProduct = createAsyncThunk('product/create', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await api.post('/api/products', {}, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProduct = createAsyncThunk('product/update', async (product, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await api.put(`/api/products/${product._id}`, product, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteProduct = createAsyncThunk('product/delete', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    await api.delete(`/api/products/${id}`, config);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    product: {},
    loading: false,
    error: null,
    pages: 1,
    page: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(listProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export default productSlice.reducer;
