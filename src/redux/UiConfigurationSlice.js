import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UiConfiguration from "../services/UiConfigurationService";

// const savedEdgeValue = localStorage.getItem("market-place-saved-edge") || null;

export const uiConfigAll = createAsyncThunk(
  "uiConfiguration/uiConfigAll",
  async () => {
    try {
      let response = await UiConfiguration.uiConfigAll();
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);
const getInitialUiConfigState = () => ({
  loading: false,
  error: null,
  data: [],
  theme: {},
  imageServerUrl: "",
  imprintUrl: "",
  privacyUrl: "",
  edge: localStorage.getItem("market-place-saved-edge") || null,
  manufacturer: [],
});

export const uiConfigurationSlice = createSlice({
  name: "uiConfiguration",
  initialState: getInitialUiConfigState(),
  reducers: {
    updateEdge: (state, action) => {
      state.edge = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uiConfigAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(uiConfigAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uiConfigAll.fulfilled, (state, action) => {
        state.loading = false;
        state.uiConfigData = action.payload;
        state.theme = action?.payload?.content;
        state.imageServerUrl = action?.payload?.content?.imageServerUri;
        state.imprintUrl = action?.payload?.urls?.imprint?.de;
        state.privacyUrl = action?.payload?.urls?.privacy?.de;
        state.edge = localStorage.getItem("market-place-saved-edge") || null;
      });
  },
});
export const { updateEdge } = uiConfigurationSlice.actions;
export default uiConfigurationSlice.reducer;
