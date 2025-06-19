"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  _id: string
  content: string
  author: {
    name: string
    username: string
    avatar?: string
  }
  createdAt: Date
}

interface CommentsSectionProps {
  articleId: string
  comments: Comment[]
}

export function CommentsSection({ articleId, comments: initialComments }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const comment: Comment = {
      _id: Date.now().toString(),
      content: newComment,
      author: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      createdAt: new Date(),
    }

    setComments([comment, ...comments])
    setNewComment("")
    setIsSubmitting(false)
  }

  return (
    <section id="comments-section" className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {/* Comment form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                className="mb-3"
                rows={3}
              />
              <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{comment.author.name}</h4>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
