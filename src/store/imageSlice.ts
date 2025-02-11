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

export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async (query: string | undefined, { dispatch }: { dispatch: Dispatch }) => {
    const searchQuery =
      query && query.trim()
        ? query
        : RANDOM_KEYWORDS[Math.floor(Math.random() * RANDOM_KEYWORDS.length)]

    dispatch(setSearchKeyword(searchQuery))

    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}`
    )

    return response.data.results
  }
)

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(
        fetchImages.fulfilled,
        (state, action: PayloadAction<Image[]>) => {
          state.status = 'idle'
          state.images = action.payload
        }
      )
      .addCase(fetchImages.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { setSearchKeyword } = imageSlice.actions
export default imageSlice.reducer
