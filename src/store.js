import { configureStore } from "@reduxjs/toolkit";
import jungleSwapSlice from "./reducer/jungleSwapSlice";

export const store = configureStore({
  reducer: { jungleSwap: jungleSwapSlice },
});
