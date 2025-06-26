import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TestDriveService from "../services/TestDriveService";

export const getTimeSlots = createAsyncThunk(
  "testDrive/getTimeSlots",
  async (vehicleId) => {
    const response = await TestDriveService.getTimeSlots(vehicleId);
    const data = response.data;
    return data;
  },
);

export const uploadFileAttachments = createAsyncThunk(
  "testDrive/uploadFileAttachments",
  async ({ name, file }, { rejectWithValue }) => {
    try {
      const response = await TestDriveService.uploadFileAttachments(name, file);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const requestTestDrive = createAsyncThunk(
  "testDrive/requestTestDrive",
  async ({
    company,
    consentPrivacyPolicy,
    emailAddress,
    firstName,
    imprintUrl,
    privacyUrl,
    privatPerson,
    lastName,
    telephone,
    town,
    zipCode,
    streetNumber,
    vehicleId,
    testDrive,
    googleAdTrackingInfo,
  }) => {
    try {
      const response = await TestDriveService.requestTestDrive({
        company,
        consentPrivacyPolicy,
        emailAddress,
        firstName,
        imprintUrl,
        privacyUrl,
        privatPerson,
        lastName,
        telephone,
        town,
        zipCode,
        streetNumber,
        vehicleId,
        testDrive,
        googleAdTrackingInfo,
      });
      return response;
    } catch (e) {
      return e.response.data;
    }
  },
);

export const testDriveSlice = createSlice({
  name: "testDrive",
  initialState: {
    loading: false,
    isSummarySection: false,
    timeSlots: null,
  },
  reducers: {
    showTestDriveForm: (state) => {
      state.isSummarySection = false;
    },
    showSummary: (state) => {
      state.isSummarySection = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimeSlots.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlots = action.payload;
      });
    builder
      .addCase(uploadFileAttachments.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFileAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(uploadFileAttachments.fulfilled, (state, action) => {
        state.loading = false;
      });
    builder
      .addCase(requestTestDrive.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestTestDrive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(requestTestDrive.fulfilled, (state) => {
        state.loading = false;
      });
  },
});
export const { showTestDriveForm, showSummary } = testDriveSlice.actions;
export default testDriveSlice.reducer;
