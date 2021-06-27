import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: []
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.


export const productsSlice = createSlice({
  name: "products",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
      setProducts: (state, action) => {
          let extendedProducts = action.payload.map(product => ({...product, count: 0}))
      state.products = extendedProducts;
    },
  },
  
});

export const { setProducts } = productsSlice.actions;
export const selectProducts = (state) => state.products.products;

export default productsSlice.reducer;
