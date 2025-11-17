import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { matchApi } from '../../services/api';

interface MatchState {
  matches: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  loading: false,
  error: null,
};

export const fetchMatches = createAsyncThunk(
  'matches/fetch',
  async () => {
    const response = await matchApi.getMatches();
    return response;
  }
);

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    addMatch: (state, action) => {
      state.matches.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch matches';
      });
  },
});

export const { addMatch } = matchSlice.actions;
export default matchSlice.reducer;

