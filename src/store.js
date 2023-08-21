import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './features/accountsSlice'

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
  },
});