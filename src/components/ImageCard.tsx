import React, { useState, useEffect } from 'react'
import { Heart, MessageCircle } from 'lucide-react'

type ImageCardProps = {
  id: string
  url: string
  alt: string
}

type Comment = {
  id: number
  text: string
  timestamp: string
}

const ImageCard = ({ id, url, alt }: ImageCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [showComments, setShowComments] = useState<boolean>(false)

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(savedFavorites.includes(id))

    const savedComments = JSON.parse(
      localStorage.getItem(`comments_${id}`) || '[]'
    )
    setComments(savedComments)
  }, [id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    let newFavorites: string[]

    if (isFavorite) {
      newFavorites = savedFavorites.filter((favId: string) => favId !== id)
    } else {
      newFavorites = [...savedFavorites, id]
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleAddComment = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toLocaleString(),
      }

      const updatedComments = [...comments, newCommentObj]
      localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments))
      setComments(updatedComments)
      setNewComment('')
    }
  }

  const handleDeleteComment = (e: React.MouseEvent, commentId: number) => {
    e.preventDefault() // Prevent Link navigation
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    )
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments))
    setComments(updatedComments)
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <div className="group relative">
        <img
          src={url}
          alt={alt}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all">
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-full bg-white shadow-md"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                setShowComments(!showComments)
              }}
              className="p-2 rounded-full bg-white shadow-md"
            >
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div
          className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg p-4 z-10"
          onClick={(e) => e.preventDefault()} // Prevent Link navigation for the comments section
        >
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Add a comment..."
              rows={2}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Comment
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded-md">
                <div className="flex justify-between items-start">
                  <p className="text-sm">{comment.text}</p>
                  <button
                    onClick={(e) => handleDeleteComment(e, comment.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageCard
