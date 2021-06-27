import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  print: null
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const printerSlice = createSlice({
  name: "printer",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
      setPrinter: (state, action) => {
          console.log("set printer", action.payload);
      state.print = action.payload;
    }},
});

export const { setPrinter } = printerSlice.actions;
export const selectPrinter = (state) => state.printer.print;

export default printerSlice.reducer;
