import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';
import Cookies from 'js-cookie';

export const fetchStylistAvailability = createAsyncThunk(
  'stylistAvailability/fetchStylistAvailability',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token');
      const res = await axios.get(`${API_BASE_URL}/stylist/get-availability`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data && res.data.success) {
        return res.data.data;
      } else {
        return rejectWithValue('Availability fetch failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching availability');
    }
  }
);

const stylistAvailabilitySlice = createSlice({
  name: 'stylistAvailability',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStylistAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStylistAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStylistAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stylistAvailabilitySlice.reducer;
