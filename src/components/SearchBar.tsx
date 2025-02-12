import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchImages } from '../store/imageSlice'
import { AppDispatch } from '../store/store'
import '../styles/search.scss'

const SearchBar = () => {
  const [query, setQuery] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(fetchImages(query))
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search images..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>
        <span>Search</span>
      </button>
    </div>
  )
}

export default SearchBar
