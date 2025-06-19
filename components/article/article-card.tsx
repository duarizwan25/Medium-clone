"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ArticleCardProps {
  article: {
    _id: string
    title: string
    excerpt: string
    author: {
      name: string
      username: string
      avatar?: string
    }
    publishedAt: Date
    readTime: number
    claps: number
    tags: string[]
    coverImage?: string
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group cursor-pointer">
      <Link href={`/article/${article._id}`}>
        <div className="space-y-4">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{article.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{article.author.name}</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
            </span>
          </div>

          {/* Article content */}
          <div className="flex gap-6">
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-gray-600 line-clamp-3 leading-relaxed">{article.excerpt}</p>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover image */}
            {article.coverImage && (
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0">
                <img
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Article meta */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{article.readTime} min read</span>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{article.claps}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </article>
  )
}
