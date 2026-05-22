import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Get all categories
export const listCategories = createAsyncThunk(
  'category/list',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/categories');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get category details (by slug)
export const getCategoryDetails = createAsyncThunk(
  'category/details',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/categories/slug/${slug}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  'category/create',
  async (categoryData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.post('/api/categories', categoryData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, categoryData }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.put(`/api/categories/${id}`, categoryData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await api.delete(`/api/categories/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  categories: [],
  category: {},
  loading: false,
  error: null,
  successCreate: false,
  successUpdate: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    resetCategoryStatus: (state) => {
      state.successCreate = false;
      state.successUpdate = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(listCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Details
      .addCase(getCategoryDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(getCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successCreate = true;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successUpdate = true;
        state.categories = state.categories.map(c => c._id === action.payload._id ? action.payload : c);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      });
  },
});

export const { resetCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
