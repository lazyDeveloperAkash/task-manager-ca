"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentUser } from "../store/slices/authSlice"
import { CheckSquare, Users, MessageCircle } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, isInitialized, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isInitialized, router])

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <CheckSquare className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Task Management System</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize your work, collaborate with your team, and boost productivity with our intuitive task management
            platform.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <CheckSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">Create, organize, and track tasks with our Kanban-style board.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Work together with role-based access and real-time updates.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600">Communicate instantly with team members and stay connected.</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <div className="space-x-4">
            <button
              onClick={() => router.push("/signin")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
