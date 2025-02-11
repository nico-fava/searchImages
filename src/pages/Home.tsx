import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchImages } from '../store/imageSlice'
import { RootState, AppDispatch } from '../store/store'
import SearchBar from '../components/SearchBar'
import ImageCard from '../components/ImageCard'

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const images = useSelector((state: RootState) => state.images.images)
  const searchKeyword = useSelector(
    (state: RootState) => state.images.searchKeyword
  )
  const status = useSelector((state: RootState) => state.images.status)

  useEffect(() => {
    dispatch(fetchImages())
  }, [dispatch])

  return (
    <div>
      <SearchBar />
      <h2>
        Showing results for: <strong>{searchKeyword}</strong>
      </h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Failed to load images.</p>}
      <div className="image-grid">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            id={image.id}
            url={image.urls.small}
            alt={image.alt_description}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
