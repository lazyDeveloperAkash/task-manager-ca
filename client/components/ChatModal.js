"use client"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMessages, sendMessage, addMessage } from "../store/slices/chatSlice"
import apiService from "../utils/api"
import io from "socket.io-client"
import { X, Send, User, MessageCircle } from "lucide-react"

export default function ChatModal({ onClose }) {
  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [receiverId, setReceiverId] = useState("")
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const messagesEndRef = useRef(null)

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { messages, isLoading } = useSelector((state) => state.chat)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    })
    setSocket(newSocket)

    // Join user's room
    newSocket.emit("join-room", user.id)

    // Listen for incoming messages
    newSocket.on("receive-message", (data) => {
      dispatch(addMessage(data))
    })

    return () => newSocket.close()
  }, [user.id, dispatch])

  useEffect(() => {
    // Fetch available users for chat
    const fetchUsers = async () => {
      try {
        const response = await apiService.getUsers()
        setUsers(response.data.users)

        // Auto-select first user if available
        if (response.data.users.length > 0) {
          const firstUser = response.data.users[0]
          setSelectedUser(firstUser)
          setReceiverId(firstUser._id)
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (receiverId) {
      dispatch(fetchMessages(receiverId))
    }
  }, [receiverId, dispatch])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser)
    setReceiverId(selectedUser._id)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && receiverId) {
      const messageData = {
        receiverId,
        message: message.trim(),
      }

      dispatch(sendMessage(messageData))

      // Emit to socket for real-time delivery
      if (socket) {
        socket.emit("send-message", {
          ...messageData,
          sender: user,
          timestamp: new Date(),
        })
      }

      setMessage("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[600px] flex overflow-hidden">
        {/* Users List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contacts
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {users.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No users available</p>
              </div>
            ) : (
              <div className="p-2">
                {users.map((chatUser) => (
                  <div
                    key={chatUser._id}
                    onClick={() => handleUserSelect(chatUser)}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedUser?._id === chatUser._id ? "bg-blue-50 border border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {chatUser.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">{chatUser.email}</div>
                        <div className="text-xs text-gray-500 capitalize">{chatUser.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              {selectedUser ? (
                <>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {selectedUser.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedUser.email}</h2>
                    <p className="text-sm text-gray-500 capitalize">{selectedUser.role}</p>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">Select a user to start chatting</div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender._id === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            msg.sender._id === user.id
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${msg.sender._id === user.id ? "text-blue-100" : "text-gray-500"}`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Message Input */}
          {selectedUser && (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
