"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, X, Mail, Calendar, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { user, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/signin")
      return
    }

    // Check if this is the user's own profile
    if (params.username !== user.username) {
      // In a real app, you'd fetch the other user's profile
      router.push(`/${user.username}`)
      return
    }

    setEditData({
      name: user.name,
      username: user.username,
      bio: user.bio || "",
      avatar: user.avatar || "",
    })
  }, [user, params.username, router])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    })
  }

  const handleSave = async () => {
    const success = await updateProfile(editData)
    if (success) {
      setIsEditing(false)
      toast({
        description: "Profile updated successfully!",
      })
    } else {
      toast({
        description: "Error updating profile",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={isEditing ? editData.avatar : user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{(isEditing ? editData.name : user.name)?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditing ? (
                    <div>
                      <Label htmlFor="avatar">Profile Picture URL</Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        value={editData.avatar}
                        onChange={handleChange}
                        placeholder="Enter image URL (e.g., https://example.com/avatar.jpg)"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a URL to an image you'd like to use as your profile picture
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-gray-600">@{user.username}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input id="name" name="name" value={editData.name} onChange={handleChange} className="mt-1" />
                  ) : (
                    <p className="mt-1 text-lg font-semibold">{user.name}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                  </Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      name="username"
                      value={editData.username}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">@{user.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <p className="mt-1 text-gray-700">{user.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Member Since */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </Label>
                  <p className="mt-1 text-gray-700">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Biography */}
              <div>
                <Label htmlFor="bio">Biography</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    name="bio"
                    value={editData.bio}
                    onChange={handleChange}
                    className="mt-1"
                    rows={4}
                    placeholder="Tell us about yourself... What do you write about? What are your interests?"
                  />
                ) : (
                  <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[100px]">
                    {user.bio ? (
                      <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                    ) : (
                      <p className="text-gray-500 italic">No biography added yet. Click "Edit Profile" to add one.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-6 border-t">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{user.followers?.length || 0}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{user.following?.length || 0}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="articles">My Articles</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              </TabsList>
              <TabsContent value="articles" className="mt-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 mb-4">Your published articles will appear here</p>
                    <Button asChild>
                      <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="drafts" className="mt-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 mb-4">Your draft articles will appear here</p>
                    <Button asChild>
                      <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="bookmarks" className="mt-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">No bookmarked articles yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
