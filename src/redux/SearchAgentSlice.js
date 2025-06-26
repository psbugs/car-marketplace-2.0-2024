import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SearchAgentService from "../services/SearchAgentService";

export const saveSearchAgentInfo = createAsyncThunk(
  "searchAgents/saveSearchAgentInfo",
  async (searchAgentParams) => {
    try {
      let response =
        await SearchAgentService.saveSearchAgentInfo(searchAgentParams);
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const searchAgentSlice = createSlice({
  name: "search-agents",
  initialState: {
    loading: false,
    error: null,
    data: [],
    searchAgentsData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveSearchAgentInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveSearchAgentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveSearchAgentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleDetails = action.payload;
      });
  },
});

export default searchAgentSlice.reducer;
