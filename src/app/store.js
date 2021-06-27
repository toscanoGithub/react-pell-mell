import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import productsReducer from "../features/products/productsSlice";
import userReducer from "../features/user/userSlice";
import printerReducer from "../features/printer/printerSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productsReducer,
    user: userReducer,
    printer: printerReducer,
  },
});
