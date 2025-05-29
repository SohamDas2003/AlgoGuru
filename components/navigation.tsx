"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Code, User, LogOut, Menu, X, Sun, Moon, Monitor, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useTheme } from "@/lib/theme"

export function Navigation() {
  const { user, logout } = useAuth()
  const { theme, setTheme, mounted } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileMenu = document.getElementById("profile-menu")
      const profileButton = document.getElementById("profile-button")

      if (
        profileMenu &&
        profileButton &&
        !profileMenu.contains(event.target as Node) &&
        !profileButton.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (pathname === "/auth" || user?.role === "admin") {
    return null
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/practice", label: "Practice" },
    { href: "/#algorithms", label: "Algorithms" },
    { href: "/#features", label: "Features" },
  ]

  if (!mounted) {
    return (
      <header className="border-b border-gray-200 bg-white backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlgoGuru
              </h1>
            </Link>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AlgoGuru
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  id="profile-button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {isProfileOpen && (
                  <div
                    id="profile-menu"
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{user.role}</p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>

                    <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Theme</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleThemeChange("light")}
                          className={`flex items-center justify-center p-2 rounded-md flex-1 transition-colors ${
                            theme === "light"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Sun className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleThemeChange("dark")}
                          className={`flex items-center justify-center p-2 rounded-md flex-1 transition-colors ${
                            theme === "dark"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Moon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleThemeChange("system")}
                          className={`flex items-center justify-center p-2 rounded-md flex-1 transition-colors ${
                            theme === "system"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Monitor className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Dashboard
                  </Link>
                  <div className="px-2 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Theme</p>
                    <div className="flex space-x-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleThemeChange("light")}
                        className="flex-1"
                      >
                        <Sun className="h-4 w-4 mr-1" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleThemeChange("dark")}
                        className="flex-1"
                      >
                        <Moon className="h-4 w-4 mr-1" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleThemeChange("system")}
                        className="flex-1"
                      >
                        <Monitor className="h-4 w-4 mr-1" />
                        Auto
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 px-2 rounded-md transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
