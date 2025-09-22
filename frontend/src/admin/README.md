# Admin Dashboard

A comprehensive admin dashboard for property management with modern UI and full CRUD functionality.

## Features

### 🏠 Property Management
- **Add Properties**: Complete form with image upload, location details, amenities
- **Edit Properties**: Update existing property information
- **Delete Properties**: Soft delete with confirmation
- **Property Listing**: Advanced filtering, search, and pagination
- **Status Management**: Activate/deactivate properties
- **Image Management**: Multiple image upload with preview

### 📊 Dashboard & Analytics
- **Overview Dashboard**: Key metrics and statistics
- **Property Analytics**: Performance tracking and insights
- **Location Analytics**: City-wise property distribution
- **Type Analytics**: Property type performance
- **Revenue Tracking**: Monthly revenue and trends

### 🔐 Authentication & Security
- **Admin Login**: Secure authentication system
- **Protected Routes**: Role-based access control
- **Session Management**: Token-based authentication

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach
- **Sidebar Navigation**: Clean and intuitive navigation
- **Data Tables**: Sortable and filterable property listings
- **Form Validation**: Real-time form validation
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages

## File Structure

```
admin/
├── layouts/
│   └── AdminLayout.tsx          # Main admin layout with sidebar
├── pages/
│   ├── Dashboard.tsx            # Main dashboard with stats
│   ├── Properties.tsx           # Property listing and management
│   ├── AddProperty.tsx          # Add new property form
│   ├── EditProperty.tsx         # Edit existing property
│   ├── AdminLogin.tsx           # Admin authentication
│   └── Analytics.tsx            # Analytics and insights
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── AdminApp.tsx                 # Main admin app with routing
└── index.ts                     # Export all components
```

## Usage

### Accessing Admin Panel
1. Navigate to `/admin` in your browser
2. You'll be redirected to `/admin/login` if not authenticated
3. Use any email and password for demo purposes
4. After login, you'll be redirected to the dashboard

### Adding Properties
1. Go to "Add Property" from the sidebar
2. Fill in all required fields:
   - Basic information (title, description, type)
   - Property details (bedrooms, bathrooms, area, etc.)
   - Location information
   - Contact details
   - Amenities selection
   - Upload images
3. Click "Create Property" to save

### Managing Properties
1. Go to "Properties" from the sidebar
2. Use filters to find specific properties
3. Use the action menu (three dots) to:
   - View property details
   - Edit property
   - Activate/deactivate
   - Delete property

### Analytics
1. Go to "Analytics" from the sidebar
2. View performance metrics
3. Filter by time range
4. Export data if needed

## Key Components

### AdminLayout
- Responsive sidebar navigation
- Mobile-friendly design
- User authentication status
- Logout functionality

### Property Management
- **AddProperty**: Comprehensive form with validation
- **Properties**: Data table with filtering and pagination
- **EditProperty**: Pre-populated form for editing

### Dashboard
- Key performance indicators
- Recent properties list
- Revenue tracking
- Quick actions

### Analytics
- Property performance metrics
- Location-based insights
- Type distribution
- Top performing properties

## Styling

The admin dashboard uses:
- **Tailwind CSS** for styling
- **Shadcn/ui** components for UI elements
- **Lucide React** for icons
- **Responsive design** for all screen sizes

## Authentication

- Demo authentication (accepts any email/password)
- JWT token storage in localStorage
- Protected routes with role checking
- Automatic redirect to login if not authenticated

## Future Enhancements

- Real API integration
- User management
- Media library
- Advanced analytics
- Email notifications
- Bulk operations
- Property templates
- Advanced search filters
