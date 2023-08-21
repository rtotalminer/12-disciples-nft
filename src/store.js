import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './features/accounts'

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
  },
  
});