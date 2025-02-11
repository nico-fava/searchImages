import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const UNSPLASH_ACCESS_KEY = '4InBsA0I_J0T2AxOwutZn1_CDSDm8U8Fk_eg0JoDCy8'

// List of random keywords to use when no search term is provided
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
  urls: {
    small: string
  }
  alt_description: string
}

type ImageState = {
  images: Image[]
  status: 'idle' | 'loading' | 'failed'
}

const initialState: ImageState = {
  images: [],
  status: 'idle',
}

export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async (query?: string) => {
    // If no query, pick a random keyword
    const searchQuery =
      query && query.trim()
        ? query
        : RANDOM_KEYWORDS[Math.floor(Math.random() * RANDOM_KEYWORDS.length)]

    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}`
    )

    return response.data.results
  }
)

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
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

export default imageSlice.reducer
