import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchImages } from '../store/imageSlice'
import { AppDispatch } from '../store/store'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  const handleSearch = () => {
    dispatch(fetchImages(query))
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search images..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar
