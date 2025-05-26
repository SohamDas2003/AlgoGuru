"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Calendar, Save, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function ProfileEditor() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    location: "",
    website: "",
  })

  if (!user) return null

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      await updateProfile({
        name: formData.name,
        // Note: In a real app, email changes would require verification
      })
      setMessage("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: "",
      location: "",
      website: "",
    })
    setIsEditing(false)
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={true} // Email changes require verification in real apps
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View your account details and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-gray-600">
                    {new Date(user.joinedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Problems Solved</p>
                <p className="text-2xl font-bold text-green-600">{user.problemsSolved}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-600">{user.totalSubmissions}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
