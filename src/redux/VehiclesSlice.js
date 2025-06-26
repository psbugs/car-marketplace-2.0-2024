import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import VehiclesService from "../services/VehiclesService";
let url = window.location.href;
const urlObject = new URL(url);
urlObject.search = "";
url = urlObject.pathname.toString();

export const getVehicleDetails = createAsyncThunk(
  "vehicles/getVehicleDetails",
  async (vehicleId) => {
    try {
      let response = await VehiclesService.getVehicleDetails(vehicleId);
      return response;
    } catch (error) {
      return error.code;
    }
  },
);

export const getPrevNextVehicle = createAsyncThunk(
  "vehicles/getPrevNextVehicle",
  async (defaultParams) => {
    try {
      let response = await VehiclesService.getPrevNextVehicle(defaultParams);
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const getVehicleSimilar = createAsyncThunk(
  "vehicles/getVehicleSimilar",
  async (vehicleId) => {
    try {
      let response = await VehiclesService.getVehicleSimilar(vehicleId);
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const downloadPdf = createAsyncThunk(
  "vehicles/downloadPdf",
  async (vehicleId) => {
    const response = await VehiclesService.downloadPdf(vehicleId);
    const data = response.data;
    return data;
  },
);

export const getAllVehiclesCountsUsingSpecificFilters = createAsyncThunk(
  "vehicles/getAllVehiclesCountsUsingSpecificFilters",
  async (apiUrl) => {
    const response =
      await VehiclesService.getAllVehiclesCountsUsingSpecificFilters(apiUrl);
    const data = response.data;
    return data;
  },
);

export const postSendMessage = createAsyncThunk(
  "vehicles/postSendMessage",
  async ({
    additionalAnnotation,
    company,
    consentPrivacyPolicy,
    emailAddress,
    firstName,
    imprintUrl,
    privacyUrl,
    privatPerson,
    requestConsultation,
    requestIndividualInstalment,
    streetNumber,
    lastName,
    telephone,
    town,
    vehicleId,
    zipCode,
    googleAdTrackingInfo,
  }) => {
    try {
      const response = await VehiclesService.postSendMessage({
        additionalAnnotation,
        company,
        consentPrivacyPolicy,
        emailAddress,
        firstName,
        imprintUrl,
        privacyUrl,
        privatPerson,
        requestConsultation,
        requestIndividualInstalment,
        streetNumber,
        lastName,
        telephone,
        town,
        vehicleId,
        zipCode,
        googleAdTrackingInfo,
      });
      return response;
    } catch (e) {
      return e.response.data;
    }
  },
);

export const getVehicleOffers = createAsyncThunk(
  "vehicles/getVehicleOffers",
  async (params) => {
    const response = await VehiclesService.getVehicleOffers(params);
    const data = response.data;
    return data;
  },
);

export const getVehicleOfferCalculations = createAsyncThunk(
  "vehicles/getVehicleOfferCalculations",
  async (params) => {
    const response = await VehiclesService.getVehicleOfferCalculations(params);
    const data = response.data;
    return data;
  },
);

export const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    loading: false,
    error: null,
    data: [],
    vehicleDetails: [],
    vehicleSimilar: [],
    vehiclesRegistrationDates: [],
    vehicleItemsFromCountsData: [],
    updatedManufactureList: [],
    redirectedUrl: null,
    offerCalculations: [],
    prevNextVehicleData: false,
    showFilter: false,
    vehicleDetailsHeaders: false,
    openFilterDrawer: false,
    showSaveSearchRequest: false,
    vehicleOffers: null,
    isAccessoriesScrolled: false,
  },
  reducers: {
    updateManufactureWithType: (state, action) => {
      state.updatedManufactureList = action.payload;
    },
    triggerAccessoriesScroll: (state) => {
      state.isAccessoriesScrolled = !state.isAccessoriesScrolled;
    },
    setIsAccessoriesScrolledToFalse: (state) => {
      state.isAccessoriesScrolled = false;
    },
    setShowFilter: (state, action) => {
      state.showFilter =
        state.showFilter !== action.payload ? action.payload : false;
    },
    setOpenFilterDrawer: (state, action) => {
      state.openFilterDrawer = action.payload;
    },
    searchRequestHandleClick: (state, action) => {
      state.showSaveSearchRequest = !state.showSaveSearchRequest;
    },
    setVehicleDataManually: (state, action) => {
      state.vehicleDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicleOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicleOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getVehicleOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleOffers = action.payload;
      });
    builder
      .addCase(getVehicleDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getVehicleDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleDetails = action.payload.data;
        state.vehicleDetailsHeaders = action.payload.headers;
      });
    builder
      .addCase(getPrevNextVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPrevNextVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getPrevNextVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.prevNextVehicleData = action.payload;
      });
    builder
      .addCase(getVehicleSimilar.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicleSimilar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getVehicleSimilar.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleSimilar = action?.payload?.items;
      });
    builder
      .addCase(downloadPdf.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(downloadPdf.fulfilled, (state) => {
        state.loading = false;
      });
    builder
      .addCase(postSendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(postSendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postSendMessage.fulfilled, (state) => {
        state.loading = false;
      });
    builder
      .addCase(getAllVehiclesCountsUsingSpecificFilters.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllVehiclesCountsUsingSpecificFilters.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        },
      )
      .addCase(
        getAllVehiclesCountsUsingSpecificFilters.fulfilled,
        (state, action) => {
          state.loading = false;
          state.vehiclesRegistrationDates = action?.payload;
          state.vehicleItemsFromCountsData = action?.payload?.items;
          state.vehicleItemsTotalCount = action?.payload?.total;
          state.redirectedUrl =
            window?.location?.search !== "" ? window.location.search : url;
        },
      );
    builder
      .addCase(getVehicleOfferCalculations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicleOfferCalculations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getVehicleOfferCalculations.fulfilled, (state, action) => {
        state.loading = false;
        state.offerCalculations = action?.payload;
      });
  },
});
export const {
  updateManufactureWithType,
  setShowFilter,
  setOpenFilterDrawer,
  searchRequestHandleClick,
  triggerAccessoriesScroll,
  setIsAccessoriesScrolledToFalse,
  setVehicleDataManually,
} = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
