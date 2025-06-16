# Task Management System (Trello Lite)

A modern, responsive task management system built with Next.js frontend and Node.js backend, featuring real-time chat, role-based access control, drag & drop functionality, and end-to-end encryption.

## ✨ Features

### 🎨 Enhanced UI/UX
- **Modern Design**: Clean, professional interface with Lucide React icons
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Elements**: Hover effects, smooth transitions, and visual feedback
- **Drag & Drop**: Intuitive task status updates with react-beautiful-dnd
- **Dynamic Columns**: Column heights adjust based on task count with minimum height

### 🔐 Security & Authentication
- **Cookie-based Auth**: Secure HTTP-only cookies instead of localStorage
- **JWT Tokens**: Encrypted JWT tokens for enhanced security
- **Role-based Access**: Admin and User roles with different permissions
- **Auto-redirect**: Automatic redirect to dashboard after signup
- **Session Persistence**: Maintains login state across browser refreshes

### 📋 Task Management
- **Kanban Board**: Visual task organization with To Do, In Progress, and Completed columns
- **CRUD Operations**: Create, read, update, and delete tasks
- **Status Tracking**: Visual status indicators with color coding
- **Due Date Alerts**: Overdue task notifications
- **Task Details**: Comprehensive task information display

### 💬 Real-time Communication
- **Live Chat**: One-to-one chat between Admin and Users
- **Socket.io Integration**: Real-time message delivery
- **User Selection**: Choose from available users to chat with
- **Message History**: Persistent chat history

### 🏗️ Architecture
- **MVC Pattern**: Clean separation of concerns in backend
- **Redux Toolkit**: Centralized state management
- **Axios Integration**: HTTP client with interceptors for encryption
- **Component-based**: Reusable React components

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email notifications

### Backend Setup

1. Navigate to the server directory:
\`\`\`bash
cd app/server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_jwt_secret_key_here
ENCRYPTION_KEY=your_32_character_encryption_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
\`\`\`

4. Start the server:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Navigate to the client directory:
\`\`\`bash
cd app/client
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Navigation

### 🏠 Landing Page (`/`)
- Hero section with feature highlights
- Call-to-action buttons for Sign In/Sign Up
- Responsive design with gradient background

### 🔑 Authentication Pages
- **Sign In** (`/signin`): Dedicated login page with email/password
- **Sign Up** (`/signup`): Registration page (age field removed)
- **Auto-redirect**: Successful auth redirects to dashboard

### 📊 Dashboard (`/dashboard`)
- **Header**: User info, role badge, action buttons
- **Kanban Board**: Three columns with drag & drop
- **Task Cards**: Rich task information with icons
- **Modals**: Task creation/editing and chat

## 🎯 Key Improvements

### 1. **UI/UX Enhancements**
- ✅ Modern, clean design with professional styling
- ✅ Lucide React icons throughout the interface
- ✅ Responsive design for all screen sizes
- ✅ Smooth animations and transitions
- ✅ Visual feedback for user interactions

### 2. **Dashboard Improvements**
- ✅ Minimum height for columns (400px)
- ✅ Dynamic height based on task count
- ✅ Drag & drop functionality with visual feedback
- ✅ Color-coded status indicators
- ✅ Overdue task alerts

### 3. **Backend Architecture**
- ✅ MVC pattern implementation
- ✅ Separate controllers for each feature
- ✅ Middleware for request decryption
- ✅ Clean route organization

### 4. **Authentication Improvements**
- ✅ Removed age field from signup
- ✅ JWT token generation on signup
- ✅ Automatic dashboard redirect
- ✅ Separate signin/signup pages
- ✅ Fixed refresh redirect issue

### 5. **Responsive Design**
- ✅ Mobile-first approach
- ✅ Flexible grid layouts
- ✅ Touch-friendly interface
- ✅ Optimized for all screen sizes

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Latest React features
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **React Beautiful DnD**: Drag and drop functionality
- **Axios**: HTTP client with interceptors
- **Socket.io Client**: Real-time communication

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Socket.io**: Real-time communication
- **JWT**: Authentication tokens
- **Bcrypt.js**: Password hashing
- **Nodemailer**: Email notifications
- **Crypto-js**: Encryption/decryption
- **Cookie-parser**: Cookie handling

## 📁 Project Structure

\`\`\`
app/
├── client/                 # Next.js Frontend
│   ├── app/
│   │   ├── dashboard/      # Dashboard page
│   │   ├── signin/         # Sign in page
│   │   ├── signup/         # Sign up page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.js       # Root layout
│   │   └── page.js         # Landing page
│   ├── components/
│   │   ├── ChatModal.js    # Chat interface
│   │   ├── TaskBoard.js    # Kanban board
│   │   ├── TaskCard.js     # Task card component
│   │   └── TaskModal.js    # Task form modal
│   ├── store/
│   │   ├── slices/         # Redux slices
│   │   └── store.js        # Redux store
│   ├── utils/
│   │   ├── api.js          # API service
│   │   └── encryption.js   # Encryption utilities
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── controllers/        # MVC Controllers
    │   ├── authController.js
    │   ├── taskController.js
    │   ├── chatController.js
    │   └── userController.js
    ├── models/             # Database models
    │   ├── User.js
    │   ├── Task.js
    │   └── Chat.js
    ├── routes/             # API routes
    │   ├── auth.js
    │   ├── tasks.js
    │   ├── chat.js
    │   └── users.js
    ├── middleware/
    │   └── auth.js         # Authentication middleware
    ├── utils/
    │   ├── email.js        # Email utilities
    │   └── encryption.js   # Encryption utilities
    ├── config/
    │   └── database.js     # Database configuration
    ├── .env                # Environment variables
    ├── package.json
    └── server.js           # Main server file
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with JWT
- `POST /api/auth/login` - User login with cookie
- `POST /api/auth/logout` - Logout and clear cookie
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Chat
- `GET /api/chat/:receiverId` - Get messages
- `POST /api/chat` - Send message

### Users
- `GET /api/users` - Get all users for chat

## 👥 User Roles

### 👑 Admin
- Create, edit, update, and delete tasks
- Receive email notifications for task updates
- Chat with all users
- Full system access

### 👤 User
- View and update task status
- Edit task details
- Chat with admin
- Limited permissions

## 🔒 Security Features

- **End-to-End Encryption**: AES encryption for all API communications
- **HTTP-only Cookies**: Secure token storage
- **CSRF Protection**: SameSite cookie attributes
- **Role-based Access**: Granular permission system
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for security

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop Enhanced**: Full desktop functionality
- **Touch Friendly**: Large touch targets
- **Flexible Layouts**: Adapts to any screen size

## 🚀 Deployment

### Backend
1. Set environment variables
2. Configure MongoDB connection
3. Deploy to Heroku, Railway, or DigitalOcean

### Frontend
1. Update API base URL
2. Deploy to Vercel or Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please create an issue in the GitHub repository.

---

**Built with ❤️ using modern web technologies**
