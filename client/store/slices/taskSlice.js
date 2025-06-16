import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import apiService from "../../utils/api"

// Async thunks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.getTasks()
    return response.data.tasks
  } catch (error) {
    return rejectWithValue(error.response?.data?.data?.message || "Failed to fetch tasks")
  }
})

export const createTask = createAsyncThunk("tasks/createTask", async (taskData, { rejectWithValue }) => {
  try {
    const response = await apiService.createTask(taskData)
    return response.data.task
  } catch (error) {
    return rejectWithValue(error.response?.data?.data?.message || "Failed to create task")
  }
})

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ taskId, taskData }, { rejectWithValue }) => {
  try {
    const response = await apiService.updateTask(taskId, taskData)
    return response.data.task
  } catch (error) {
    return rejectWithValue(error.response?.data?.data?.message || "Failed to update task")
  }
})

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId, { rejectWithValue }) => {
  try {
    await apiService.deleteTask(taskId)
    return taskId
  } catch (error) {
    return rejectWithValue(error.response?.data?.data?.message || "Failed to delete task")
  }
})

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearError } = taskSlice.actions
export default taskSlice.reducer
