import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import taskSlice from "./slices/taskSlice"
import chatSlice from "./slices/chatSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
    chat: chatSlice,
  },
})
