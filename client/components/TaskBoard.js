"use client"
import { useDispatch, useSelector } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { updateTask, deleteTask } from "../store/slices/taskSlice"
import TaskCard from "./TaskCard"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function TaskBoard({ tasks, onEditTask }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId
      dispatch(updateTask({ taskId: draggableId, taskData: { status: newStatus } }))
    }
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId))
    }
  }

  const Column = ({ title, tasks, status, bgColor, icon: Icon, droppableId }) => {
    const minHeight = Math.max(400, tasks.length * 120 + 100)

    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className={`${bgColor} text-white p-4 rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm font-medium">{tasks.length}</span>
          </div>
        </div>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-4 transition-colors ${snapshot.isDraggingOver ? "bg-gray-50" : ""}`}
              style={{ minHeight: `${minHeight}px` }}
            >
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-transform ${snapshot.isDragging ? "rotate-2 scale-105" : ""}`}
                      >
                        <TaskCard
                          task={task}
                          onEdit={onEditTask}
                          onDelete={handleDeleteTask}
                          canDelete={user?.role === "admin"}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Column
          title="To Do"
          tasks={todoTasks}
          status="todo"
          bgColor="bg-red-500"
          icon={AlertCircle}
          droppableId="todo"
        />
        <Column
          title="In Progress"
          tasks={inProgressTasks}
          status="inprogress"
          bgColor="bg-yellow-500"
          icon={Clock}
          droppableId="inprogress"
        />
        <Column
          title="Completed"
          tasks={completedTasks}
          status="completed"
          bgColor="bg-green-500"
          icon={CheckCircle}
          droppableId="completed"
        />
      </div>
    </DragDropContext>
  )
}
