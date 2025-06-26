import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Criteria from "../services/CriteriaService";

export const criteriaPromotions = createAsyncThunk(
  "criteria/criteriaPromotions",
  async () => {
    try {
      let response = await Criteria.criteriaPromotions();
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaAll = createAsyncThunk(
  "criteria/criteriaAll",
  async () => {
    try {
      let response = await Criteria.criteriaAll();
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaManufacturers = createAsyncThunk(
  "criteria/criteriaManufacturers",
  async () => {
    try {
      let response = await Criteria.criteriaManufacturers();
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaModelGroups = createAsyncThunk(
  "criteria/criteriaModelGroups",
  async (criteriaModelGrpParams) => {
    try {
      let response = await Criteria.criteriaModelGroups(criteriaModelGrpParams);
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaSeries = createAsyncThunk(
  "criteria/criteriaSeries",
  async (seriesParams) => {
    try {
      let response = await Criteria.criteriaSeries(seriesParams);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaVariants = createAsyncThunk(
  "criteria/criteriaVariants",
  async (variantParams) => {
    try {
      let response = await Criteria.criteriaVariants(variantParams);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaPaints = createAsyncThunk(
  "criteria/criteriaPaints",
  async () => {
    try {
      let response = await Criteria.criteriaPaints();
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaOptions = createAsyncThunk(
  "criteria/criteriaOptions",
  async () => {
    try {
      let response = await Criteria.criteriaOptions();
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaModels = createAsyncThunk(
  "criteria/criteriaModels",
  async (modelParams) => {
    try {
      let response = await Criteria.criteriaModels(modelParams);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
);

export const criteriaSlice = createSlice({
  name: "criteria",
  initialState: {
    loading: false,
    error: null,
    promotionsList: [],
    criteriaAll: [],
    criteriaManufacturers: [],
    carSummaryData: [],
    criteriaModelGroupsData: [],
    criteriaSeriesAll: [],
    criteriaVariantsData: [],
    promotionList: [],
    criteriaPaintsAll: [],
    criteriaOptionsData: [],
    criteriaModelsData: [],
    manufacturersList: [],
    storeApiKey: document
      .getElementById("am-marketplace")
      ?.getAttribute("apikey"),
  },
  reducers: {
    appendManufacturersList: (state, action) => {
      switch (action.payload.name) {
        case "models":
          state.manufacturersList.find(
            (obj) =>
              obj.manufacturersId ===
                action.payload.manufacturer.manufacturersId &&
              obj.manufacturersType ===
                action.payload.manufacturer.manufacturersType,
          )[action.payload.name] = action.payload?.data;
          return;
        case "series":
          state.manufacturersList.find(
            (obj) =>
              obj.manufacturersId ===
                action.payload.manufacturer.manufacturersId &&
              obj.manufacturersType ===
                action.payload.manufacturer.manufacturersType,
          )[action.payload.name] = action.payload?.data;
          return;
        case "variants":
          state.manufacturersList = state.manufacturersList.map(
            (manufacturer) => {
              if (
                manufacturer.manufacturersId ===
                  action.payload.manufacturer.manufacturersId &&
                manufacturer.manufacturersType ===
                  action.payload.manufacturer.manufacturersType
              ) {
                const updatedSeries = manufacturer.series.map((ser) => {
                  if (ser?.value === action.payload.value) {
                    return {
                      ...ser,
                      variants: action.payload.data,
                    };
                  }
                  return ser;
                });
                return {
                  ...manufacturer,
                  series: updatedSeries,
                };
              }
              return manufacturer;
            },
          );
          return;
        case "engine":
          state.manufacturersList = state.manufacturersList.map(
            (manufacturer) => {
              if (
                manufacturer.manufacturersId ===
                  action.payload.manufacturer.manufacturersId &&
                manufacturer.manufacturersType ===
                  action.payload.manufacturer.manufacturersType &&
                manufacturer.series.length > 0
              ) {
                manufacturer.series = manufacturer.series.map((ser) => {
                  if (ser.value === action.payload.seriesValue) {
                    ser.variants = ser.variants.map((variant) => {
                      if (variant.value === action.payload.value) {
                        return {
                          ...variant,
                          engines: action.payload.data,
                        };
                      }
                      return variant;
                    });
                  }
                  return ser;
                });
                if (manufacturer?.manufacturersId === 319) {
                  return {
                    ...manufacturer,
                    variants:
                      manufacturer?.series?.map((variant) => {
                        if (variant.value === action.payload.value) {
                          return {
                            ...variant,
                            engines: action.payload.data,
                          };
                        }
                        return variant;
                      }) || [],
                  };
                }
              }
              return manufacturer;
            },
          );
          return;
        case "other-manufacturers-models":
          state.manufacturersList = state.manufacturersList.map(
            (manufacturer) => {
              if (
                manufacturer.manufacturersId ===
                action.payload.manufacturer.manufacturersId
              ) {
                manufacturer.models = manufacturer.models.map((model) => {
                  if (model.manufacturersId === Number(action.payload.value)) {
                    return {
                      ...model,
                      engines: action.payload.data,
                    };
                  }
                  return model;
                });
              }
              return manufacturer;
            },
          );
          return;
        default:
          return console.error("EWWWW....");
      }
    },
    createManufacturersList: (state, action) => {
      state.manufacturersList = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    addCarSummaryData: (state, action) => {
      state.carSummaryData = action.payload;
    },
    removeCarSummaryData: (state, action) => {
      if (state.carSummaryData.length === 0) {
        const data = state.carSummaryData?.filter(
          (ele) => ele.label !== action.payload,
        );
        state.carSummaryData = data;
      } else {
        const data = state.carSummaryData?.filter(
          (ele) => ele.label !== action.payload,
        );
        state.carSummaryData = data;
      }
    },
    clearCarSummaryData: (state, action) => {
      state.carSummaryData = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(criteriaPromotions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaPromotions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaPromotions.fulfilled, (state, action) => {
      state.loading = false;
      state.promotionsList = action.payload;
    });
    builder.addCase(criteriaAll.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaAll.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaAll = action.payload;
      state.promotionList = action?.payload?.promotions;
    });
    builder.addCase(criteriaManufacturers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaManufacturers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaManufacturers.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaManufacturers = action.payload;
    });
    builder.addCase(criteriaModelGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaModelGroups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaModelGroups.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaModelGroupsData = action.payload.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.isActive),
      }));
    });
    builder.addCase(criteriaSeries.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaSeries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaSeries.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaSeriesAll = action.payload;
    });
    builder.addCase(criteriaVariants.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaVariants.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaVariants.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaVariantsData = action.payload
        ?.filter((variant) => variant?.isActive === true)
        .map((variant) => ({
          ...variant,
          isVariant: true,
        }));
    });
    builder.addCase(criteriaPaints.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaPaints.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaPaints.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaPaintsAll = action.payload;
    });
    builder.addCase(criteriaOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaOptions.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaOptionsData = action.payload;
    });
    builder.addCase(criteriaModels.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(criteriaModels.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(criteriaModels.fulfilled, (state, action) => {
      state.loading = false;
      state.criteriaModelsData = action.payload;
    });
  },
});

export const {
  addCarSummaryData,
  removeCarSummaryData,
  clearCarSummaryData,
  createManufacturersList,
  appendManufacturersList,
} = criteriaSlice.actions;
export default criteriaSlice.reducer;
