import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts(state, { payload }) {
      console.log(payload);
      state.value = payload.accounts;
    }
  }
});

export const { setAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;