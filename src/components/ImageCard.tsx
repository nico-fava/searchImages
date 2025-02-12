import React, { useState, useEffect } from 'react'
import {
  Heart,
  MessageCircle,
  ThumbsUp,
  Clock,
  Edit2,
  Check,
  X,
} from 'lucide-react'

type ImageCardProps = {
  id: string
  url: string
  alt: string
}

type Comment = {
  id: number
  text: string
  timestamp: string
  likes: number
  isEditing?: boolean
}

type SortOrder = 'newest' | 'oldest' | 'mostLiked'

const ImageCard = ({ id, url, alt }: ImageCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [showComments, setShowComments] = useState<boolean>(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [editingComment, setEditingComment] = useState<string>('')

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(savedFavorites.includes(id))

    const savedComments = JSON.parse(
      localStorage.getItem(`comments_${id}`) || '[]'
    )
    setComments(savedComments)
  }, [id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
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
    e.preventDefault()
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toLocaleString(),
        likes: 0,
      }

      const updatedComments = [...comments, newCommentObj]
      localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments))
      setComments(updatedComments)
      setNewComment('')
    }
  }

  const handleDeleteComment = (e: React.MouseEvent, commentId: number) => {
    e.preventDefault()
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    )
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments))
    setComments(updatedComments)
  }

  const handleEditComment = (e: React.MouseEvent, commentId: number) => {
    e.preventDefault()
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, isEditing: true }
      }
      return comment
    })
    setComments(updatedComments)
    const comment = comments.find((c) => c.id === commentId)
    if (comment) {
      setEditingComment(comment.text)
    }
  }

  const handleSaveEdit = (e: React.MouseEvent, commentId: number) => {
    e.preventDefault()
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          text: editingComment,
          isEditing: false,
        }
      }
      return comment
    })
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments))
    setComments(updatedComments)
    setEditingComment('')
  }

  const handleLikeComment = (e: React.MouseEvent, commentId: number) => {
    e.preventDefault()
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 }
      }
      return comment
    })
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments))
    setComments(updatedComments)
  }

  const getSortedComments = () => {
    return [...comments].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        case 'oldest':
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        case 'mostLiked':
          return b.likes - a.likes
        default:
          return 0
      }
    })
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
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
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowComments(!showComments)
              }}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 relative"
            >
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {comments.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div
          className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg p-4 z-10"
          onClick={(e) => e.stopPropagation()}
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

          <div className="mb-4 flex gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="p-1 border rounded-md text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {getSortedComments().map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded-md">
                <div className="flex justify-between items-start">
                  {comment.isEditing ? (
                    <div className="flex-1 mr-2">
                      <textarea
                        value={editingComment}
                        onChange={(e) => setEditingComment(e.target.value)}
                        className="w-full p-1 border rounded-md text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={(e) => handleSaveEdit(e, comment.id)}
                          className="text-green-500 hover:text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const updatedComments = comments.map((c) => ({
                              ...c,
                              isEditing:
                                c.id === comment.id ? false : c.isEditing,
                            }))
                            setComments(updatedComments)
                            setEditingComment('')
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{comment.text}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleLikeComment(e, comment.id)}
                          className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-xs">{comment.likes}</span>
                        </button>
                        <button
                          onClick={(e) => handleEditComment(e, comment.id)}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteComment(e, comment.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{comment.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default ImageCard
