import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchImages } from '../store/imageSlice'
import { RootState, AppDispatch } from '../store/store'
import { Heart } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ImageCard from '../components/ImageCard'
import '../styles/home.scss'

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const images = useSelector((state: RootState) => state.images.images)
  const searchKeyword = useSelector(
    (state: RootState) => state.images.searchKeyword
  )
  const status = useSelector((state: RootState) => state.images.status)
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    dispatch(fetchImages())
  }, [dispatch])

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites') || '[]')
  }

  const handleToggleFavorites = () => {
    setIsAnimating(true)
    setShowOnlyFavorites(!showOnlyFavorites)
    setTimeout(() => setIsAnimating(false), 300) // Match with animation duration
  }

  const filteredImages = showOnlyFavorites
    ? images.filter((image) => getFavorites().includes(image.id))
    : images

  return (
    <div className="home-container">
      <div className="search-section">
        <SearchBar />
      </div>

      <div className="header-section">
        <h2 className="results-title">
          {searchKeyword ? (
            <>
              Showing results for:{' '}
              <span className="keyword">{searchKeyword}</span>
            </>
          ) : (
            'All Images'
          )}
        </h2>

        <button
          onClick={handleToggleFavorites}
          className={`favorite-toggle ${showOnlyFavorites ? 'active' : ''}`}
        >
          <Heart
            className={`heart-icon ${showOnlyFavorites ? 'filled' : ''}`}
          />
          {showOnlyFavorites ? 'Show All' : 'Show Favorites'}
        </button>
      </div>

      <div className="content-container">
        {status === 'loading' && (
          <div className="loading-container fade-enter">
            <div className="loading-spinner"></div>
          </div>
        )}

        {status === 'failed' && (
          <div className="error-container fade-enter">
            <p>Failed to load images.</p>
            <button
              onClick={() => dispatch(fetchImages())}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'idle' && filteredImages.length === 0 && (
          <div className="empty-container fade-enter">
            <p>
              {showOnlyFavorites
                ? 'No favorite images yet.'
                : 'No images found.'}
            </p>
          </div>
        )}

        <div
          className={`image-grid ${isAnimating ? 'fade-out' : 'fade-enter'}`}
        >
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              id={image.id}
              url={image.urls.small}
              alt={image.alt_description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
