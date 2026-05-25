import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '../../types/Status';

const initialState = {
  query: '',
  status: 'all' as Status,
  category: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    clean: () => {
      return initialState;
    },
  },
});

export const { actions } = filterSlice;
