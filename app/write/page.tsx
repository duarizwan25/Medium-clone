"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/database"
import { Header } from "@/components/layout/header"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WritePage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const editId = searchParams.get("edit")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/signin")
      return
    }

    // Load article for editing
    if (editId) {
      loadArticleForEdit(editId)
    }
  }, [user, router, editId])

  const loadArticleForEdit = async (articleId: string) => {
    setIsLoading(true)
    try {
      const article = await db.getArticleById(articleId)
      if (article && article.authorId === user?._id) {
        setTitle(article.title)
        setContent(article.content)
        setTags(article.tags)
      } else {
        toast({
          description: "Article not found or you don't have permission to edit it",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        description: "Error loading article",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || isLoading) {
    return null
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200
    const textContent = content.replace(/<[^>]*>/g, "")
    const wordCount = textContent.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        description: "Please enter a title",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const articleData = {
        title,
        content,
        excerpt: content.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
        authorId: user._id,
        tags,
        claps: 0,
        clappers: [],
        comments: [],
        published: false,
        readTime: calculateReadTime(content),
      }

      if (editId) {
        await db.updateArticle(editId, articleData)
        toast({
          description: "Draft updated successfully!",
        })
      } else {
        await db.createArticle(articleData)
        toast({
          description: "Draft saved successfully!",
        })
      }

      router.push("/dashboard")
    } catch (error) {
      toast({
        description: "Error saving draft",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        description: "Please enter both title and content",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    try {
      const articleData = {
        title,
        content,
        excerpt: content.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
        authorId: user._id,
        tags,
        claps: 0,
        clappers: [],
        comments: [],
        published: true,
        publishedAt: new Date(),
        readTime: calculateReadTime(content),
      }

      let articleId = editId
      if (editId) {
        await db.updateArticle(editId, articleData)
      } else {
        const newArticle = await db.createArticle(articleData)
        articleId = newArticle._id
      }

      toast({
        description: "Article published successfully!",
      })
      router.push(`/article/${articleId}`)
    } catch (error) {
      toast({
        description: "Error publishing article",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{editId ? "Edit Article" : "Write New Article"}</h1>
          </div>

          {/* Title input */}
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold border-none px-0 py-4 placeholder:text-gray-300 focus-visible:ring-0 mb-4"
          />

          {/* Rich text editor */}
          <div className="mb-8">
            <RichTextEditor content={content} onChange={setContent} placeholder="Tell your story..." />
          </div>

          {/* Tags input */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="max-w-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={handlePublish} disabled={!title || !content || isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
