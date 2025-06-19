"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { db, type Article } from "@/lib/database"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Eye, MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/signin")
      return
    }

    loadArticles()
  }, [user, router])

  const loadArticles = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const userArticles = await db.getArticlesByAuthor(user._id)
      setArticles(userArticles)
    } catch (error) {
      console.error("Error loading articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const success = await db.deleteArticle(articleId)
      if (success) {
        setArticles(articles.filter((article) => article._id !== articleId))
        toast({
          description: "Article deleted successfully",
        })
      }
    } catch (error) {
      toast({
        description: "Error deleting article",
        variant: "destructive",
      })
    }
  }

  const handleTogglePublish = async (articleId: string, currentStatus: boolean) => {
    try {
      const updatedArticle = await db.updateArticle(articleId, {
        published: !currentStatus,
        publishedAt: !currentStatus ? new Date() : undefined,
      })

      if (updatedArticle) {
        setArticles(articles.map((article) => (article._id === articleId ? updatedArticle : article)))
        toast({
          description: `Article ${!currentStatus ? "published" : "unpublished"} successfully`,
        })
      }
    } catch (error) {
      toast({
        description: "Error updating article",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return null
  }

  const publishedArticles = articles.filter((article) => article.published)
  const draftArticles = articles.filter((article) => !article.published)
  const totalClaps = articles.reduce((sum, article) => sum + article.claps, 0)
  const totalComments = articles.reduce((sum, article) => sum + article.comments.length, 0)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Link href="/write">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Write Article
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{articles.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedArticles.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Claps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClaps}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalComments}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Articles Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Articles ({articles.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({publishedArticles.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftArticles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ArticlesList
              articles={articles}
              onDelete={handleDeleteArticle}
              onTogglePublish={handleTogglePublish}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="published" className="mt-6">
            <ArticlesList
              articles={publishedArticles}
              onDelete={handleDeleteArticle}
              onTogglePublish={handleTogglePublish}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <ArticlesList
              articles={draftArticles}
              onDelete={handleDeleteArticle}
              onTogglePublish={handleTogglePublish}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

interface ArticlesListProps {
  articles: Article[]
  onDelete: (id: string) => void
  onTogglePublish: (id: string, currentStatus: boolean) => void
  isLoading: boolean
}

function ArticlesList({ articles, onDelete, onTogglePublish, isLoading }: ArticlesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600 mb-4">No articles found</p>
          <Link href="/write">
            <Button>Write your first article</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold line-clamp-1">{article.title}</h3>
                  <Badge variant={article.published ? "default" : "secondary"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                <p className="text-gray-600 line-clamp-2 mb-4">{article.excerpt}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>
                    {article.published && article.publishedAt
                      ? `Published ${formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}`
                      : `Created ${formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}`}
                  </span>
                  <span>·</span>
                  <span>{article.readTime} min read</span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{article.claps}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{article.comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>0</span> {/* Views would be tracked in real app */}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mt-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/write?edit=${article._id}`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTogglePublish(article._id, article.published)}>
                    {article.published ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
                  {article.published && (
                    <DropdownMenuItem asChild>
                      <Link href={`/article/${article._id}`}>View Article</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onDelete(article._id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
