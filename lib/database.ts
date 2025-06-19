// Simulated database using localStorage (replace with real MongoDB in production)

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
  password: string
}

export interface Article {
  _id: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  authorId: string
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
  authorId: string
  articleId: string
  createdAt: Date
}

class Database {
  private getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("medium_users")
    return users ? JSON.parse(users) : []
  }

  private saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem("medium_users", JSON.stringify(users))
  }

  private getArticles(): Article[] {
    if (typeof window === "undefined") return []
    const articles = localStorage.getItem("medium_articles")
    return articles ? JSON.parse(articles) : []
  }

  private saveArticles(articles: Article[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem("medium_articles", JSON.stringify(articles))
  }

  // Initialize with sample data
  init(): void {
    const users = this.getUsers()
    if (users.length === 0) {
      const sampleUsers: User[] = [
        {
          _id: "1",
          email: "john@example.com",
          username: "johndoe",
          name: "John Doe",
          bio: "Software developer and writer passionate about technology",
          avatar: "",
          followers: [],
          following: [],
          createdAt: new Date(),
          password: "password123",
        },
        {
          _id: "2",
          email: "jane@example.com",
          username: "janesmith",
          name: "Jane Smith",
          bio: "Tech enthusiast and blogger",
          avatar: "",
          followers: [],
          following: [],
          createdAt: new Date(),
          password: "password123",
        },
      ]
      this.saveUsers(sampleUsers)
    }

    const articles = this.getArticles()
    if (articles.length === 0) {
      const sampleArticles: Article[] = [
        {
          _id: "1",
          title: "Getting Started with React Hooks",
          content: "<h2>Introduction</h2><p>React Hooks have revolutionized how we write React components...</p>",
          excerpt: "Learn the fundamentals of React Hooks and how they can improve your code.",
          authorId: "1",
          tags: ["React", "JavaScript", "Web Development"],
          claps: 45,
          clappers: [],
          comments: [],
          published: true,
          publishedAt: new Date("2024-01-10"),
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-10"),
          readTime: 5,
        },
        {
          _id: "2",
          title: "The Future of Web Development",
          content: "<h2>Trends to Watch</h2><p>Web development is constantly evolving...</p>",
          excerpt: "Exploring the latest trends and technologies shaping web development.",
          authorId: "1",
          tags: ["Web Development", "Technology", "Future"],
          claps: 67,
          clappers: [],
          comments: [],
          published: false,
          createdAt: new Date("2024-01-12"),
          updatedAt: new Date("2024-01-12"),
          readTime: 8,
        },
      ]
      this.saveArticles(sampleArticles)
    }
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | null> {
    const users = this.getUsers()
    return users.find((user) => user.email === email) || null
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const users = this.getUsers()
    return users.find((user) => user.username === username) || null
  }

  async createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User> {
    const users = this.getUsers()
    const newUser: User = {
      ...userData,
      _id: Date.now().toString(),
      createdAt: new Date(),
    }
    users.push(newUser)
    this.saveUsers(users)
    return newUser
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = this.getUsers()
    const userIndex = users.findIndex((user) => user._id === userId)
    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    this.saveUsers(users)
    return users[userIndex]
  }

  // Article methods
  async getArticlesByAuthor(authorId: string): Promise<Article[]> {
    const articles = this.getArticles()
    return articles.filter((article) => article.authorId === authorId)
  }

  async getPublishedArticles(): Promise<Article[]> {
    const articles = this.getArticles()
    return articles.filter((article) => article.published)
  }

  async getArticleById(id: string): Promise<Article | null> {
    const articles = this.getArticles()
    return articles.find((article) => article._id === id) || null
  }

  async createArticle(articleData: Omit<Article, "_id" | "createdAt" | "updatedAt">): Promise<Article> {
    const articles = this.getArticles()
    const newArticle: Article = {
      ...articleData,
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    articles.push(newArticle)
    this.saveArticles(articles)
    return newArticle
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    const articles = this.getArticles()
    const articleIndex = articles.findIndex((article) => article._id === id)
    if (articleIndex === -1) return null

    articles[articleIndex] = {
      ...articles[articleIndex],
      ...updates,
      updatedAt: new Date(),
    }
    this.saveArticles(articles)
    return articles[articleIndex]
  }

  async deleteArticle(id: string): Promise<boolean> {
    const articles = this.getArticles()
    const filteredArticles = articles.filter((article) => article._id !== id)
    if (filteredArticles.length === articles.length) return false

    this.saveArticles(filteredArticles)
    return true
  }
}

export const db = new Database()

// Initialize database on client side
if (typeof window !== "undefined") {
  db.init()
}
