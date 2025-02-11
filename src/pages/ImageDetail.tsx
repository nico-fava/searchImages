import { useParams } from 'react-router-dom'

const ImageDetail = () => {
  const { id } = useParams()

  return (
    <div>
      <h2>Image Details for {id}</h2>
    </div>
  )
}

export default ImageDetail
