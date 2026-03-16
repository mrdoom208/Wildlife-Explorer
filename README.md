# Wildlife Explorer

A comprehensive full-stack web application for wildlife enthusiasts to explore, learn about, and contribute to wildlife conservation efforts. Discover animals, wildlife reserves, and stay updated with the latest news through an interactive map-based interface.

## 🌟 Features

- **Interactive Map**: Explore wildlife reserves and animal locations using Leaflet-powered maps
- **Animal Database**: Comprehensive collection of wildlife species with detailed information
- **User Authentication**: Secure login and registration system with role-based access
- **Admin Dashboard**: Manage users, animals, reserves, and news updates
- **Newsletter Subscription**: Stay informed with wildlife conservation news
- **Image Upload**: Cloudinary integration for animal and reserve photos
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Live news feed and dynamic content management

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Interactive maps library
- **React Router** - Declarative routing for React
- **Framer Motion** - Animation library for React

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service

### DevOps & Tools

- **Vercel** - Cloud platform for deployment
- **Cloudinary** - Image hosting and management
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/wildlife-explorer.git
   cd wildlife-explorer
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env` (if available) or create a new `.env` file
   - Configure the following environment variables:
     ```env
     NODE_ENV=development
     MONGO_URI=your-mongodb-connection-string
     JWT_SECRET=your-super-secret-jwt-key
     NODEMAILER_EMAIL=your-email@gmail.com
     NODEMAILER_PASS=your-app-password
     FRONTEND_URL=http://localhost:5173
     VITE_API_URL=http://localhost:5000
     VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
     VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
     ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## 💻 Usage

1. **Start the backend server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

2. **Start the frontend development server**

   ```bash
   cd client
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   cd client
   npm run build
   ```

## 📚 API Documentation

The API provides endpoints for:

- **Authentication**: `/api/auth`
  - POST `/login` - User login
  - POST `/register` - User registration
  - POST `/logout` - User logout

- **Animals**: `/api/animals`
  - GET `/` - Get all animals
  - POST `/` - Create new animal (Admin)
  - PUT `/:id` - Update animal (Admin)
  - DELETE `/:id` - Delete animal (Admin)

- **Reserves**: `/api/reserves`
  - GET `/` - Get all wildlife reserves
  - POST `/` - Create new reserve (Admin)

- **News Updates**: `/api/news`
  - GET `/` - Get all news updates
  - POST `/` - Create news update (Admin)

- **Users**: `/api/users` (Admin only)
  - GET `/` - Get all users
  - PUT `/:id` - Update user
  - DELETE `/:id` - Delete user

- **Newsletter**: `/api/subscribe`
  - POST `/` - Subscribe to newsletter

For detailed API documentation, refer to the Postman collection or Swagger docs.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Project Maintainer:** Karl Formentera

- **Email:** karlformentera2@gmail.com
- **GitHub:** [mrdoom208](https://github.com/mrdoom208)


For support or questions, please open an issue on GitHub or contact the maintainer directly.

---

⭐ If you find this project helpful, please give it a star on GitHub!</content>
<parameter name="filePath">c:\Users\John Estorca\Desktop\ReactJS\Wildlife-Explorer\wildlife-explorer\README.md
