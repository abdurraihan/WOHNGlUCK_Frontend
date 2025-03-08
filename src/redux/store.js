import { combineReducers, configureStore } from "@reduxjs/toolkit"; // Corrected import
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./user/userSlice.js";

// 1. Define persistConfig *FIRST*
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// 2. Combine reducers (using the correct function name)
const rootReducer = combineReducers({
  user: userReducer,
});

// 3. Create the persisted reducer *AFTER* defining persistConfig
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //  Consider re-enabling this!
    }),
});

// 5. Create the persistor *AFTER* creating the store, and pass the STORE
export const persistor = persistStore(store);
