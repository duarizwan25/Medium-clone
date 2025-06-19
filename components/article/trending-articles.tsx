"use client"

import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const trendingArticles = [
  {
    id: "1",
    title: "The Rise of AI in Modern Web Development",
    author: { name: "Sarah Chen", username: "sarahchen", avatar: "" },
    readTime: 8,
    rank: 1,
  },
  {
    id: "2",
    title: "Building Scalable Applications with Next.js 14",
    author: { name: "Mike Johnson", username: "mikej", avatar: "" },
    readTime: 12,
    rank: 2,
  },
  {
    id: "3",
    title: "The Future of Remote Work: Trends and Predictions",
    author: { name: "Emily Davis", username: "emilyd", avatar: "" },
    readTime: 6,
    rank: 3,
  },
]

export function TrendingArticles() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Trending on Medium</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingArticles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`}>
            <div className="group cursor-pointer">
              <div className="flex gap-4">
                <span className="text-3xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                  0{article.rank}
                </span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{article.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{article.author.name}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <span className="text-sm text-gray-500">{article.readTime} min read</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
