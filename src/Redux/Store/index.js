import { configureStore } from "@reduxjs/toolkit";

import userSlice from '../Reducers/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice
  },
})