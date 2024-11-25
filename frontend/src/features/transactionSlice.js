import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch the token from localStorage for each request
const getToken = () => localStorage.getItem('token');
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust according to your API base URL

// Define async actions using createAsyncThunk
export const addTransaction = createAsyncThunk(
  'transactions/addTransaction', // Action name should be descriptive
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData, {
        headers: {
          Authorization: `${getToken()}`, // Attach token for authentication
        },
      });
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error adding transaction');
    }
  }
);

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: {
          Authorization: `${getToken()}`, // Attach token for authentication
        },
      });
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error retrieving transactions');
    }
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/editTransaction', // Action name should be descriptive
  async ({ transactionId, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/transactions/${transactionId}`, transactionData, {
        headers: {
          Authorization: `${getToken()}`, // Attach token for authentication
        },
      });
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error editing transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`, {
        headers: {
          Authorization: `${getToken()}`, // Attach token for authentication
        },
      });
      return transactionId; // Return the deleted transaction ID for removing it from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting transaction');
    }
  }
);

// Define the initial state
const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

// Create the slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (transaction) => transaction._id === action.payload._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(editTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== action.payload
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
