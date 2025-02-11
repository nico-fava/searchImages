import { Link } from 'react-router-dom'

interface ImageCardProps {
  id: string
  url: string
  alt: string
}

const ImageCard = ({ id, url, alt }: ImageCardProps) => {
  return (
    <div>
      <Link to={`/image/${id}`}>
        <img src={url} alt={alt} />
      </Link>
    </div>
  )
}

export default ImageCard
