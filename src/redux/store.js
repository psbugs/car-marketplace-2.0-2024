import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage
import { combineReducers } from "redux";
import UiConfigReducer from "./UiConfigurationSlice";
import CriteriaReducer from "./CriteriaSlice";
import vehiclesSlice from "./VehiclesSlice";
import transferCodeSlice from "./TransferCodeSlice";
import testDriveSlice from "./TestDriveSlice";
import tradeInSlice from "./TradeInSlice";

// Define persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine all reducers
const rootReducer = combineReducers({
  uiConfig: UiConfigReducer,
  criteria: CriteriaReducer,
  vehicles: vehiclesSlice,
  transferCode: transferCodeSlice,
  testDrive: testDriveSlice,
  tradeIn: tradeInSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Disable in production
      serializableCheck: false,
    }),
});

// Create a persistor to handle rehydration
export const persistor = persistStore(store);
