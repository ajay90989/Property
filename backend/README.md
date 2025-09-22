# Property Management Backend

A Node.js + Express + MongoDB backend for a property listing application with admin and user roles.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Property Management**: CRUD operations with image uploads
- **Advanced Filtering**: Search by location, type, price, area, amenities
- **Pagination**: Efficient data loading with pagination
- **Image Upload**: Multer-based image handling
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- Node.js (v18+)
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Express Validator for validation
- Helmet for security
- Morgan for logging

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

5. Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/property-management
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   CLIENT_URL=http://localhost:3000
   ```

6. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Properties
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/owner/:ownerId` - Get properties by owner
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Admin only)
- `PUT /api/properties/:id` - Update property (Admin only)
- `DELETE /api/properties/:id` - Delete property (Admin only)
- `PATCH /api/properties/:id/toggle` - Toggle property status (Admin only)

### Health Check
- `GET /api/health` - Server health check

## Query Parameters for Properties

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Filtering
- `propertyType` - apartment, house, villa, plot, commercial, office, shop, warehouse
- `listingType` - sale, rent
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `city` - City name
- `state` - State name
- `bedrooms` - Minimum bedrooms
- `bathrooms` - Minimum bathrooms
- `minArea` - Minimum area
- `maxArea` - Maximum area
- `facing` - north, south, east, west, north-east, north-west, south-east, south-west
- `furnished` - furnished, semi-furnished, unfurnished
- `search` - Text search in title and description
- `isActive` - Active status (default: true)

### Sorting
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

## Sample Requests

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "user"
}
```

### Login User
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Property (Admin)
```json
POST /api/properties
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "title": "Beautiful 3BHK Apartment",
  "description": "Spacious apartment with modern amenities",
  "propertyType": "apartment",
  "listingType": "sale",
  "price": 5000000,
  "area": {
    "value": 1200,
    "unit": "sqft"
  },
  "bedrooms": 3,
  "bathrooms": 2,
  "facing": "north",
  "furnished": "semi-furnished",
  "location": {
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "contact": {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com"
  }
}
```

### Get Properties with Filters
```
GET /api/properties?propertyType=apartment&listingType=sale&minPrice=1000000&maxPrice=10000000&city=Mumbai&bedrooms=2&page=1&limit=10
```

## File Upload

The API supports image uploads for properties using multipart/form-data. Images are stored in the `uploads` directory and accessible via `/uploads/filename`.

## Error Handling

All errors are returned in a consistent format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- File upload restrictions

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `MAX_FILE_SIZE` - Maximum file size for uploads
- `UPLOAD_PATH` - Directory for uploaded files
- `CLIENT_URL` - Frontend URL for CORS

## Development

- Use `npm run dev` for development with nodemon
- Use `npm start` for production
- Check logs for debugging
- Use Postman or similar tools for API testing
