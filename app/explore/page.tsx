"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { ArticleCard } from "@/components/article/article-card"
import { TrendingArticles } from "@/components/article/trending-articles"

// Mock articles data
const articles = [
  {
    _id: "1",
    title: "The Future of Web Development",
    excerpt: "Exploring the latest trends and technologies shaping the web development landscape in 2024 and beyond.",
    author: { name: "John Doe", username: "johndoe", avatar: "" },
    publishedAt: new Date("2024-01-15"),
    readTime: 5,
    claps: 42,
    tags: ["Technology", "Web Development"],
    coverImage: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "2",
    title: "Building Scalable Applications",
    excerpt: "Learn how to architect and build applications that can handle millions of users with ease.",
    author: { name: "Jane Smith", username: "janesmith", avatar: "" },
    publishedAt: new Date("2024-01-14"),
    readTime: 8,
    claps: 67,
    tags: ["Architecture", "Scalability"],
    coverImage: "/placeholder.svg?height=200&width=300",
  },
  {
    _id: "3",
    title: "The Art of Technical Writing",
    excerpt: "Tips and techniques for writing clear, engaging technical content that resonates with your audience.",
    author: { name: "Mike Johnson", username: "mikej", avatar: "" },
    publishedAt: new Date("2024-01-13"),
    readTime: 6,
    claps: 89,
    tags: ["Writing", "Communication"],
    coverImage: "/placeholder.svg?height=200&width=300",
  },
]

export default function ExplorePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Trending Section */}
        <section className="py-12 border-b">
          <TrendingArticles />
        </section>

        {/* Articles Feed */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8">Recommended for you</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
