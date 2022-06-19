import { configureStore } from '@reduxjs/toolkit'

import user from './user/reducer'

const store = configureStore({
  reducer: {
    user,
  },
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
