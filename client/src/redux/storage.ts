import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import studentReducer from "./studentSlice";
import recruiterReducer from './recruiterSlice';
import adminReducer from './adminSlice';

const studentPersistConfig = {
  key: "student",
  version: 1,
  storage,
};
const recruiterPersistConfig = {
  key: "recruiter",
  version: 1,
  storage,
};
const adminPersistConfig = {
  key: "admin",
  version: 1,
  storage,
};
const persistedStudentReducer = persistReducer(studentPersistConfig, studentReducer);
const persistedRecruiterReducer = persistReducer(recruiterPersistConfig, recruiterReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);

export const store = configureStore({
  reducer: {
    student: persistedStudentReducer,
    recruiter: persistedRecruiterReducer,
    admin: persistedAdminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
