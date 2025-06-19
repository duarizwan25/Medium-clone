"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TextToSpeech } from "@/components/article/text-to-speech"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ArticleActions } from "@/components/article/article-actions"
import { CommentsSection } from "@/components/article/comments-section"

// Mock article data
const article = {
  _id: "1",
  title: "The Future of Web Development: Trends to Watch in 2024",
  content: `
    <h2>Introduction</h2>
    <p>Web development continues to evolve at a rapid pace, with new technologies and frameworks emerging regularly. As we look ahead to 2024, several key trends are shaping the future of how we build and interact with web applications.</p>
    
    <h2>Key Trends</h2>
    <p>From AI-powered development tools to the rise of edge computing, the landscape is changing dramatically. Developers need to stay informed about these developments to remain competitive in the field.</p>
    
    <p>The integration of artificial intelligence into development workflows is becoming increasingly common, helping developers write better code faster and catch potential issues before they become problems.</p>
    
    <h2>Conclusion</h2>
    <p>As we move forward, the key to success will be adaptability and continuous learning. The developers who thrive will be those who embrace change and stay curious about new technologies.</p>
  `,
  author: {
    name: "John Doe",
    username: "johndoe",
    avatar: "",
    bio: "Senior Full Stack Developer with 10+ years of experience",
    followers: 1250,
  },
  publishedAt: new Date("2024-01-15"),
  readTime: 8,
  claps: 142,
  tags: ["Web Development", "Technology", "Future", "AI"],
  comments: [],
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [claps, setClaps] = useState(article.claps)
  const [hasClapped, setHasClapped] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const handleClap = () => {
    if (!hasClapped) {
      setClaps((prev) => prev + 1)
      setHasClapped(true)
      // Here you would typically make an API call to update the clap count
    }
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // Here you would typically make an API call to follow/unfollow the user
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          {/* Article header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">{article.title}</h1>

            {/* Author info */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={handleFollow}
                      className="h-6 px-2 text-xs"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
                    <span>·</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Action buttons */}
            <ArticleActions
              articleId={article._id}
              initialClaps={claps}
              initialBookmarked={false}
              commentsCount={article.comments.length}
            />
          </header>

          {/* Text-to-Speech */}
          <div className="mb-8">
            <TextToSpeech content={article.content} title={article.title} />
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Tags */}
          <div className="flex items-center gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Clap section */}
          <div className="flex items-center justify-center py-8 border-t">
            <Button
              variant="outline"
              size="lg"
              onClick={handleClap}
              className={`gap-2 px-8 ${hasClapped ? "border-green-500 text-green-600" : ""}`}
            >
              <Heart className={`h-5 w-5 ${hasClapped ? "fill-current" : ""}`} />
              {hasClapped ? "Clapped!" : "Clap"}
            </Button>
          </div>

          {/* Comments Section */}
          <CommentsSection articleId={article._id} comments={article.comments} />
        </article>
      </main>
    </div>
  )
}
