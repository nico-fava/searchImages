import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from '@reduxjs/toolkit'
import axios from 'axios'

const UNSPLASH_ACCESS_KEY = '4InBsA0I_J0T2AxOwutZn1_CDSDm8U8Fk_eg0JoDCy8'

// List of random keywords for the first load
const RANDOM_KEYWORDS = [
  'nature',
  'city',
  'technology',
  'space',
  'animals',
  'travel',
  'food',
  'art',
]

type Image = {
  id: string
  urls: { small: string }
  alt_description: string
}

type ImageState = {
  images: Image[]
  status: 'idle' | 'loading' | 'failed'
  searchKeyword: string
}

const initialState: ImageState = {
  images: [],
  status: 'idle',
  searchKeyword: '',
}

// Create an async thunk to fetch images from the Unsplash API.
// The thunk accepts an optional query string, and uses redux-thunk middleware
// to dispatch additional actions based on the fetch lifecycle (pending, fulfilled, rejected).
export const fetchImages = createAsyncThunk(
  'images/fetchImages', // Action type string for the async thunk.
  async (query: string | undefined, { dispatch }: { dispatch: Dispatch }) => {
    // - If a valid query string is provided (non-empty after trimming), use it.
    // - Otherwise, select a random keyword from the RANDOM_KEYWORDS array.
    const searchQuery =
      query && query.trim()
        ? query
        : RANDOM_KEYWORDS[Math.floor(Math.random() * RANDOM_KEYWORDS.length)]

    // Immediately dispatch an action to update the search keyword in the state.
    // This ensures that the UI can reflect the current search query (even if it's randomly chosen).
    dispatch(setSearchKeyword(searchQuery))

    // Make an HTTP GET request to the Unsplash API using axios.
    // The request uses the searchQuery and a client access key for authentication.
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}`
    )

    // Return the list of image results from the API response.
    // This returned value will be used as the payload in the fulfilled action.
    return response.data.results
  }
)

// Redux Toolkit's createSlice.
// The slice includes both synchronous reducers and extra reducers that handle async actions.
const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    // This can be used both by the thunk and by other components if needed.
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload
    },
  },
  // It updates the state based on the lifecycle of the fetchImages async thunk.
  extraReducers: (builder) => {
    builder
      // When the async thunk is pending (i.e., the API call has been initiated),
      // update the state to reflect a loading status.
      .addCase(fetchImages.pending, (state) => {
        state.status = 'loading'
      })
      // When the async thunk is fulfilled (i.e., the API call succeeded),
      // update the state with the fetched images and set the status to idle.
      .addCase(
        fetchImages.fulfilled,
        (state, action: PayloadAction<Image[]>) => {
          state.status = 'idle'
          state.images = action.payload
        }
      )
      // update the state to reflect the failure status.
      .addCase(fetchImages.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

// Export the synchronous action for setting the search keyword.
export const { setSearchKeyword } = imageSlice.actions

export default imageSlice.reducer
