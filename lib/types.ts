export interface User {
  _id: string
  email: string
  username: string
  name: string
  bio?: string
  avatar?: string
  followers: string[]
  following: string[]
  createdAt: Date
}

export interface Article {
  _id: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  author: User
  tags: string[]
  claps: number
  clappers: string[]
  comments: Comment[]
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  readTime: number
}

export interface Comment {
  _id: string
  content: string
  author: User
  articleId: string
  createdAt: Date
  replies?: Comment[]
}

export interface TTSSettings {
  voice: string
  rate: number
  pitch: number
  volume: number
}
