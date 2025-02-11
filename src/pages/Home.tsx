import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import SearchBar from '../components/SearchBar'
import ImageCard from '../components/ImageCard'

const Home = () => {
  const images = useSelector((state: RootState) => state.images.images)

  return (
    <div>
      <SearchBar />
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
