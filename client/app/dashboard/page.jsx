"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { logoutUser, getCurrentUser } from "../../store/slices/authSlice"
import { fetchTasks } from "../../store/slices/taskSlice"
import TaskBoard from "../../components/TaskBoard"
import TaskModal from "../../components/TaskModal"
import ChatModal from "../../components/ChatModal"
import { Plus, MessageCircle, LogOut, User } from "lucide-react"

export default function Dashboard() {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth)
  const { tasks, isLoading, error } = useSelector((state) => state.tasks)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(getCurrentUser())
    }
  }, [isInitialized, dispatch])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/signin")
      return
    }
    if (isAuthenticated) {
      dispatch(fetchTasks())
    }
  }, [isAuthenticated, isInitialized, dispatch, router])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push("/")
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                  {user?.role}
                </span>
              </div>
              {user?.role === "admin" && (
                <button
                  onClick={handleCreateTask}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Task</span>
                </button>
              )}
              <button
                onClick={() => setShowChatModal(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <TaskBoard tasks={tasks} onEditTask={handleEditTask} />
        )}
      </main>

      {/* Modals */}
      {showTaskModal && <TaskModal task={editingTask} onClose={() => setShowTaskModal(false)} />}
      {showChatModal && <ChatModal onClose={() => setShowChatModal(false)} />}
    </div>
  )
}
