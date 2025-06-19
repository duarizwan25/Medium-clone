"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, Share, BookmarkCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ArticleActionsProps {
  articleId: string
  initialClaps: number
  initialBookmarked?: boolean
  commentsCount: number
}

export function ArticleActions({
  articleId,
  initialClaps,
  initialBookmarked = false,
  commentsCount,
}: ArticleActionsProps) {
  const [claps, setClaps] = useState(initialClaps)
  const [hasClapped, setHasClapped] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const { toast } = useToast()

  const handleClap = () => {
    if (!hasClapped) {
      setClaps((prev) => prev + 1)
      setHasClapped(true)
      toast({
        description: "Thanks for the clap! 👏",
      })
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      description: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
    })
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/article/${articleId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this article",
          url: url,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url)
      toast({
        description: "Link copied to clipboard!",
      })
    }
  }

  const handleComment = () => {
    // Scroll to comments section
    const commentsSection = document.getElementById("comments-section")
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex items-center justify-between border-y py-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClap}
          className={`gap-2 ${hasClapped ? "text-green-600" : ""}`}
        >
          <Heart className={`h-4 w-4 ${hasClapped ? "fill-current" : ""}`} />
          {claps}
        </Button>

        <Button variant="ghost" size="sm" className="gap-2" onClick={handleComment}>
          <MessageCircle className="h-4 w-4" />
          {commentsCount}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBookmark}>
          {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-blue-600" /> : <Bookmark className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
