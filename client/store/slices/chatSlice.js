import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import apiService from "../../utils/api"

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (receiverId, { rejectWithValue }) => {
  try {
    const response = await apiService.getMessages(receiverId)
    return response.data.messages
  } catch (error) {
    return rejectWithValue(error.response?.data?.data?.message || "Failed to fetch messages")
  }
})

export const sendMessage = createAsyncThunk("chat/sendMessage", async (messageData, { rejectWithValue }) => {
  try {
    const response = await apiService.sendMessage(messageData)
    return response.data.chat
  } catch (error) {
    return rejectWithValue(error.response?.data?.data?.message || "Failed to send message")
  }
})

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
        state.isLoading = false
      })
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload
        state.isLoading = false
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { addMessage, clearMessages, clearError } = chatSlice.actions
export default chatSlice.reducer
