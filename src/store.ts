import { configureStore } from "@reduxjs/toolkit";
import jungleSwapSlice from "./reducer/jungleSwapSlice";

const store = configureStore({
  reducer: { jungleSwap: jungleSwapSlice },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
