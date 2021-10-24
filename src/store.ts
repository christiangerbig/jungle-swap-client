import { configureStore } from "@reduxjs/toolkit";
import jungleSwapSlice from "./reducer/jungleSwapSlice";

export const store = configureStore({
  reducer: { jungleSwap: jungleSwapSlice },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
