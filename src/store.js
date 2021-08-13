import { configureStore } from "@reduxjs/toolkit";
import jungleSwapSlice from "./Reducer/jungleSwapSlice";

export const store = configureStore({ reducer: {jungleSwap: jungleSwapSlice} });