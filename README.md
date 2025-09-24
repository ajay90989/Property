# Property Management System

A comprehensive property management system built with Node.js, Express, MongoDB, and React. The system supports both admin and user roles with different access levels and features.

## 🚀 Features

### Backend Features
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Property Management**: Full CRUD operations for properties with image uploads
- **Blog System**: Content management with SEO optimization
- **Contact Management**: Contact form handling with admin response system
- **Analytics**: Comprehensive tracking and reporting
- **Agent Management**: Agent profiles with testimonials and ratings
- **File Uploads**: Secure image handling with Multer
- **API Documentation**: Complete REST API documentation

### Frontend Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Role-based UI**: Different interfaces for admin and users
- **Service Layer**: Comprehensive service modules for API communication
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Reusable UI components with Radix UI
- **State Management**: Context-based state management
- **Analytics Integration**: Automatic tracking for user interactions

## 📁 Project Structure

```
Property/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads directory
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── admin/         # Admin dashboard components
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API service modules
│   │   ├── styles/        # Global styles
│   │   └── App.tsx        # Main app component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Router** - Routing
- **Lucide React** - Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Property
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create `backend/.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/property-management
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Admin Dashboard: http://localhost:3000/admin

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

### Main Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password

#### Properties (`/api/properties`)
- `GET /` - Get all properties (with filters)
- `GET /:id` - Get single property
- `POST /` - Create property (Admin)
- `PUT /:id` - Update property (Admin)
- `DELETE /:id` - Delete property (Admin)
- `GET /featured` - Get featured properties

#### Blogs (`/api/blogs`)
- `GET /` - Get all blogs
- `GET /:slug` - Get single blog
- `POST /` - Create blog (Admin)
- `PUT /:id` - Update blog (Admin)
- `DELETE /:id` - Delete blog (Admin)
- `GET /featured` - Get featured blogs

#### Contacts (`/api/contacts`)
- `POST /` - Submit contact form
- `GET /` - Get all contacts (Admin)
- `GET /:id` - Get single contact (Admin)
- `PUT /:id/status` - Update contact status (Admin)
- `POST /:id/respond` - Respond to contact (Admin)

#### Analytics (`/api/analytics`)
- `POST /track` - Track event
- `GET /dashboard` - Get dashboard analytics (Admin)
- `GET /properties` - Get property analytics (Admin)
- `GET /users` - Get user analytics (Admin)

#### Agents (`/api/agents`)
- `GET /` - Get all agents
- `GET /:id` - Get single agent
- `POST /` - Create agent (Admin)
- `PUT /:id` - Update agent
- `DELETE /:id` - Delete agent (Admin)
- `GET /featured` - Get featured agents

For complete API documentation, see [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## 🎨 Frontend Services

The frontend uses a comprehensive service layer for API communication:

### Service Modules
- `authService` - Authentication and user management
- `propertyService` - Property operations
- `blogService` - Blog management
- `contactService` - Contact form handling
- `analyticsService` - Analytics tracking
- `agentService` - Agent management
- `adminService` - Admin-specific operations
- `userService` - User-specific operations with auto-tracking

### Usage Example
```typescript
import { userService } from './services/userService';

// Get properties
const properties = await userService.getProperties({
  page: 1,
  limit: 10,
  city: 'Mumbai'
});

// Track page view
await userService.trackPageView('/properties');
```

For complete service documentation, see [frontend/SERVICES_DOCUMENTATION.md](frontend/SERVICES_DOCUMENTATION.md)

## 🔐 User Roles

### Admin
- Full access to all features
- Property management
- Blog management
- Contact management
- Analytics dashboard
- Agent management
- User management

### User
- Browse properties
- View property details
- Search and filter properties
- Read blogs
- Submit contact forms
- View agent profiles
- Add testimonials

## 📊 Database Models

### User
- Basic user information
- Role-based access
- Address and contact details

### Property
- Comprehensive property details
- Image management
- Location information
- Status and visibility controls

### Blog
- Content management
- SEO optimization
- Category and tag system

### Contact
- Contact form submissions
- Status and priority management
- Response tracking

### Analytics
- Event tracking
- User behavior analysis
- Performance metrics

### Agent
- Agent profiles
- Specialties and experience
- Rating and testimonial system

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)
4. Set up file storage for uploads

### Frontend Deployment
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy to your preferred platform (Vercel, Netlify, etc.)
3. Update API base URL in production

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
npm start    # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start development server
npm run build # Build for production
```

### Code Structure
- **Backend**: MVC pattern with controllers, models, and routes
- **Frontend**: Component-based architecture with service layer
- **TypeScript**: Full type safety throughout
- **Error Handling**: Comprehensive error handling and logging

## 📝 API Response Format

All API responses follow this format:
```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "count": number,    // for paginated responses
  "total": number,    // for paginated responses
  "page": number,     // for paginated responses
  "pages": number     // for paginated responses
}
```

## 🛡️ Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- File upload security
- Role-based access control
- Helmet security headers

## 📈 Performance Features

- Database indexing
- Pagination
- Image optimization
- Caching strategies
- Lazy loading
- Code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API documentation
- Check the service documentation
- Open an issue on GitHub

## 🔄 Updates

### Recent Updates
- ✅ Complete backend API implementation
- ✅ Comprehensive frontend service layer
- ✅ Admin dashboard integration
- ✅ User interface integration
- ✅ Analytics tracking system
- ✅ File upload handling
- ✅ TypeScript support throughout
- ✅ Comprehensive documentation

### Future Enhancements
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Advanced reporting

---

**Built with ❤️ using Node.js, Express, MongoDB, React, and TypeScript**
