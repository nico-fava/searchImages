// The Home component serves as the main page that displays images.
// It handles fetching images, filtering (including favorites), search display, and error/loading states.
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchImages } from '../store/imageSlice'
import { RootState, AppDispatch } from '../store/store'
import { Heart } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ImageCard from '../components/ImageCard'
import '../styles/home.scss'

const Home = () => {
  // This allows us to dispatch actions to our Redux store.
  const dispatch = useDispatch<AppDispatch>()

  // Retrieve the images array from the Redux store.
  // `state.images.images` is expected to be managed by our imageSlice.
  const images = useSelector((state: RootState) => state.images.images)

  // Retrieve the current search keyword from the Redux store.
  // This keyword can be used to indicate if the user is filtering images via search.
  const searchKeyword = useSelector(
    (state: RootState) => state.images.searchKeyword
  )

  // Retrieve the status of the image fetching process.
  // It helps to control the UI (loading, error, or idle states).
  const status = useSelector((state: RootState) => state.images.status)

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  // Local state used to trigger animation effects (e.g., fade-out/fade-in) when toggling filters.
  const [isAnimating, setIsAnimating] = useState(false)

  // useEffect hook to fetch images when the component mounts.
  // The dependency array includes `dispatch` to avoid lint warnings, though it effectively runs once.
  useEffect(() => {
    dispatch(fetchImages())
  }, [dispatch])

  // Helper function to retrieve the favorite images stored in localStorage.
  // It parses the stored JSON or returns an empty array if nothing is stored.
  const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites') || '[]')
  }

  // Handler for toggling the display of favorite images.
  // It triggers an animation effect and then toggles the filter state.
  const handleToggleFavorites = () => {
    setIsAnimating(true)
    setShowOnlyFavorites(!showOnlyFavorites) // Toggle the favorites filter state
    setTimeout(() => setIsAnimating(false), 300) // Reset the animation state after 300ms
  }

  // Filter images based on the favorites filter.
  // If `showOnlyFavorites` is true, it only returns images whose IDs are present in the favorites list.
  // Otherwise, it returns all images.
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

        {/* Button to toggle between showing all images and only favorite images */}
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

      {/* Content Container: Displays loading spinners, error messages, or the image grid */}
      <div className="content-container">
        {/* Loading State: Displays a spinner if images are being fetched */}
        {status === 'loading' && (
          <div className="loading-container fade-enter">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Error State: Displays an error message and a retry button if fetching images fails */}
        {status === 'failed' && (
          <div className="error-container fade-enter">
            <p>Nope...Failed to load images.</p>
            <button
              onClick={() => dispatch(fetchImages())}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State: In case no images match the criteria (e.g., favorites filter or search results are empty) */}
        {status === 'idle' && filteredImages.length === 0 && (
          <div className="empty-container fade-enter">
            <p>
              {showOnlyFavorites
                ? 'No favorite images yet.'
                : 'No images found.'}
            </p>
          </div>
        )}

        {/* Image Grid: Displays the list of images using the ImageCard component.
            The grid's class toggles between animation states based on `isAnimating`.
         */}
        <div
          className={`image-grid ${isAnimating ? 'fade-out' : 'fade-enter'}`}
        >
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              id={image.id}
              url={image.urls.small} // Using a smaller version of the image for quicker load times
              alt={image.alt_description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
