import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TradeInService from "../services/TradeInService";

export const tradeInManufacturerInfo = createAsyncThunk(
  "tradeIn/tradeInManufacturers",
  async () => {
    try {
      let response = await TradeInService.tradeInManufacturers();
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const tradeInManufacturersModelInfo = createAsyncThunk(
  "tradeIn/tradeInManufacturersModels",
  async ({ tradeInManId }) => {
    try {
      let response = await TradeInService.tradeInManufacturersModels({
        tradeInManId,
      });
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const tradeInVariantsInfo = createAsyncThunk(
  "tradeIn/tradeInVariants",
  async (tradeInObj) => {
    try {
      let response = await TradeInService.tradeInVariants(tradeInObj);
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const tradeInVehiclesInfo = createAsyncThunk(
  "tradeIn/tradeInVehicles",
  async (tradeInObj) => {
    try {
      let response = await TradeInService.tradeInVehicles(tradeInObj);
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const tradeInPostInfo = createAsyncThunk(
  "tradeIn/tradeInPostData",
  async (tradeInPostParams) => {
    try {
      let response = await TradeInService.tradeInPostData(tradeInPostParams);
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const tradeInManufacturerSlice = createSlice({
  name: "tradeIn",
  initialState: {
    loading: false,
    error: null,
    data: [],
    tradeInManufacturersData: [],
    tradeInModelsData: [],
    tradeInVariantsData: [],
    tradeInVehiclesData: [],
    isEnableDisableChasisOrManufacturerWrap: false,
    isShowTradeInSummary: false,
  },
  reducers: {
    enableManufacturerWrap: (state) => {
      state.isEnableDisableChasisOrManufacturerWrap = false;
    },
    enableChasisWrap: (state) => {
      state.isEnableDisableChasisOrManufacturerWrap = true;
    },

    showTradeInForm: (state) => {
      state.isShowTradeInSummary = false;
    },
    showTradeInSummary: (state) => {
      state.isShowTradeInSummary = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tradeInManufacturerInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(tradeInManufacturerInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(tradeInManufacturerInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.tradeInManufacturersData = action.payload;
      });

    builder
      .addCase(tradeInManufacturersModelInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(tradeInManufacturersModelInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(tradeInManufacturersModelInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.tradeInModelsData = action.payload;
      });

    builder
      .addCase(tradeInVariantsInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(tradeInVariantsInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(tradeInVariantsInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.tradeInVariantsData = action.payload;
      });

    builder
      .addCase(tradeInVehiclesInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(tradeInVehiclesInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(tradeInVehiclesInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.tradeInVehiclesData = action.payload;
      });

    builder
      .addCase(tradeInPostInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(tradeInPostInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(tradeInPostInfo.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});

export const {
  enableManufacturerWrap,
  enableChasisWrap,
  showTradeInForm,
  showTradeInSummary,
} = tradeInManufacturerSlice.actions;

export default tradeInManufacturerSlice.reducer;
