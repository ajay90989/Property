import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/pages/HomePage";
import PropertyListingPage from "./components/pages/PropertyListingPage";
import BlogListingPage from "./components/pages/BlogListingPage";
import BlogDetailPage from "./components/pages/BlogDetailPage";
import { SignInPage } from "./components/pages/SignInPage";
import ContactPage from "./components/pages/ContactPage";
import { PropertyDetailPage } from "./components/PropertyDetailPage";
import AdminApp from "./admin/AdminApp";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import RoleRedirect from "./components/RoleRedirect";

function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin && !isAdminRoute) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isAdminRoute, navigate]);

  // If we're on an admin route, don't render the main app
  if (isAdminRoute) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <>
            <Header />
            <main>
              <HomePage onNavigate={(page, id) => {
                if (page === 'properties') {
                  navigate('/properties');
                } else if (page === 'contact') {
                  navigate('/contact');
                } else if (page === 'blog') {
                  navigate('/blog');
                } else if (page === 'property' && id) {
                  navigate(`/property/${id}`);
                }
              }} />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/properties" element={
          <>
            <Header />
            <main>
              <PropertyListingPage />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/blog" element={
          <>
            <Header />
            <main>
              <BlogListingPage />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/blog/:slug" element={
          <>
            <Header />
            <main>
              <BlogDetailPage />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/contact" element={
          <>
            <Header />
            <main>
              <ContactPage />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/property/:id" element={
          <>
            <Header />
            <main>
              <PropertyDetailPage />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/signin" element={<SignInPage />} />
        
        {/* Redirect any other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Role-based redirect */}
          <Route path="/redirect" element={<RoleRedirect />} />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminApp />} />
          
          {/* Main app routes */}
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}