import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TransferCodeService from "../services/TransferCodeService";
import { toast } from "react-toastify";
import StyledToastContainer from "../components/StyledToastContainer";
import { getEdgeClass } from "../utils";

export const generateTransferCode = createAsyncThunk(
  "transferCode/generateTransferCode",
  async ({ data, scope }) => {
    try {
      let response = await TransferCodeService.generateTransferCode(
        data,
        scope,
      );
      if (response.status >= 400) {
        throw new Error(
          response.data.message || "Failed to generate transfer code",
        );
      }
      return response.data;
    } catch (error) {
      return console.error(error?.response?.data || error?.message);
    }
  },
);

export const getDataFromTransferCode = createAsyncThunk(
  "transferCode/getDataFromTransferCode",
  async ({ transferCode, scope }) => {
    try {
      let response = await TransferCodeService.getDataFromTransferCode(
        transferCode,
        scope,
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

const getInitialData = (data) => {
  const storedData = sessionStorage.getItem(data);
  return storedData ? JSON.parse(storedData) : { items: [] };
};

const initialFavData = getInitialData("favorites");
const initialComparablesData = getInitialData("comparables");

export const transferCodeSlice = createSlice({
  name: "transferCode",
  initialState: {
    loading: false,
    error: null,
    data: [],
    favData: initialFavData,
    comparablesData: initialComparablesData,
    parkingSpaceData: [],
  },
  reducers: {
    toggleItem: (state, action) => {
      const { id, dataType, t, edge } = action.payload;
      const dataKey = dataType === "favorites" ? "favData" : "comparablesData";
      const rawItems = state?.[dataKey]?.items;
      const items = Array.isArray(rawItems) ? rawItems : [];
      const isItemPresent = items.some((item) => item?.id === id);
      if (isItemPresent) {
        state[dataKey].items = items?.filter((item) => item?.id !== id);
        toast.info(
          <StyledToastContainer
            primaryText={
              dataType === "favorites"
                ? t("/vehicleDetails.Vehicle removed from favorites")
                : t("/vehicleDetails.Vehicle removed from comparison")
            }
            vehicleId={id}
          />,
          {
            className: `vehicle-removed-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}
          `,
          },
        );
      } else {
        state[dataKey].items = [...items, { id }];
        toast.success(
          <StyledToastContainer
            primaryText={
              dataType === "favorites"
                ? t("/vehicleDetails.Vehicle added to favorites")
                : t("/vehicleDetails.Vehicle added to comparison")
            }
            vehicleId={id}
          />,
          {
            className: `vehicle-added-toast-class ${getEdgeClass(edge, "!rounded-lg", "!rounded-none")}
            `,
          },
        );
      }
      sessionStorage.setItem(dataType, JSON.stringify(state[dataKey]));
    },
    updateTransferCodeGeneratedData: (state, action) => {
      const { items, dataType } = action.payload;
      const dataKey = dataType === "favorites" ? "favData" : "comparablesData";
      state[dataKey].items = items;
      sessionStorage.setItem(dataType, JSON.stringify({ items }));
    },
    clearStorageData: (state) => {
      state.favData = { items: [] };
      state.comparablesData = { items: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTransferCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateTransferCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(generateTransferCode.fulfilled, (state) => {
        state.loading = false;
      });
    builder
      .addCase(getDataFromTransferCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDataFromTransferCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getDataFromTransferCode.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingSpaceData = action.payload;
      });
  },
});

export const { toggleItem, updateTransferCodeGeneratedData, clearStorageData } =
  transferCodeSlice.actions;
export default transferCodeSlice.reducer;
