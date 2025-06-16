import axios from "axios"
import { encrypt, decrypt } from "./encryption"

const API_BASE_URL = "http://localhost:5000/api"

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to encrypt data
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data && config.method !== "get") {
      config.data = { data: encrypt(config.data) }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to decrypt data
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      const decryptedData = decrypt(response.data.data)
      response.data = { ...response.data, data: decryptedData }
    }
    return response
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Redirect to login or dispatch logout action
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

class ApiService {
  // Auth methods
  async signup(userData) {
    const response = await axiosInstance.post("/auth/signup", userData)
    return response.data
  }

  async login(credentials) {
    const response = await axiosInstance.post("/auth/login", credentials)
    return response.data
  }

  async logout() {
    const response = await axiosInstance.post("/auth/logout")
    return response.data
  }

  // async getCurrentUser() {
  //   const response = await axiosInstance.get("/auth/me")
  //   return response.data
  // }

  // Task methods
  async getTasks() {
    const response = await axiosInstance.get("/tasks")
    return response.data
  }

  async createTask(taskData) {
    const response = await axiosInstance.post("/tasks", taskData)
    return response.data
  }

  async updateTask(taskId, taskData) {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData)
    return response.data
  }

  async deleteTask(taskId) {
    const response = await axiosInstance.delete(`/tasks/${taskId}`)
    return response.data
  }

  // Chat methods
  async getMessages(receiverId) {
    const response = await axiosInstance.get(`/chat/${receiverId}`)
    return response.data
  }

  async sendMessage(messageData) {
    const response = await axiosInstance.post("/chat", messageData)
    return response.data
  }

  // User methods
  async getUsers() {
    const response = await axiosInstance.get("/users")
    return response.data
  }
}

export default new ApiService()
