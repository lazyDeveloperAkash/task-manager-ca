"use client"
import { useSelector } from "react-redux"
import { Calendar, User, Edit, Trash2, Clock, AlertCircle } from "lucide-react"

export default function TaskCard({ task, onEdit, onDelete, canDelete }) {
  const { user } = useSelector((state) => state.auth)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-red-100 text-red-800 border-red-200"
      case "inprogress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
          {task.status.replace("inprogress", "in progress")}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            Due: {formatDate(task.dueDate)}
            {isOverdue && <span className="ml-1">(Overdue)</span>}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <User className="h-3 w-3 mr-1" />
          <span>Created by: {task.createdBy?.email}</span>
        </div>
        {task.assignedTo && (
          <div className="flex items-center text-xs text-gray-500">
            <User className="h-3 w-3 mr-1" />
            <span>Assigned to: {task.assignedTo.email}</span>
          </div>
        )}
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <Edit className="h-3 w-3" />
            <span>Edit</span>
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </button>
          )}
        </div>
        {isOverdue && (
          <div className="flex items-center text-xs text-red-600 font-medium">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>Overdue</span>
          </div>
        )}
      </div>
    </div>
  )
}
