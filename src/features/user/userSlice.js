import { MobileStepper } from "@material-ui/core";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  basket: [],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state, action) => {
      console.log("set user ", action.payload);
      state.user = action.payload;
    },

    logoutUser: (state) => {
      state.user = null;
      console.log("user", state.user);
    },

    setPaidOrders: (state, action) => {
      state.paidOrders = action.payload;
    },

    addtoBasket: (state, action) => {
      state.basket = [...state.basket, action.payload];
    },

    removeformBasket: (state, action) => {
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.payload
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action.id}) as its not in basket!`
        );
      }

      state.basket = newBasket;
    },

    emptyBasket: (state) => {
      state.basket = [];
    },
  },
});

export const {
  setUser,
  logoutUser,
  setPaidOrders,
  addtoBasket,
  removeformBasket,
  emptyBasket,
} = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectBasket = (state) => state.user.basket;
export const selectPaidCOrders = (state) => state.user.paidOrders;
export default userSlice.reducer;
