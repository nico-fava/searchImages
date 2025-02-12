import { configureStore } from '@reduxjs/toolkit'
import imageReducer from './imageSlice'

// The store is set up with a single slice of state named "images" managed by the imageReducer.
export const store = configureStore({
  reducer: {
    // state property
    // to image data will be handled by imageReducer.
    images: imageReducer,
  },
})

// The type is inferred from the store's getState method, which provides the complete state tree.
export type RootState = ReturnType<typeof store.getState>

// This helps ensure that when dispatching actions, the correct types are enforced.
export type AppDispatch = typeof store.dispatch
