import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/pages/HomePage";
import { PropertiesPage } from "./components/pages/PropertiesPage";
import { BlogPage } from "./components/pages/BlogPage";
import { SignInPage } from "./components/pages/SignInPage";
import { PropertyDetailPage } from "./components/PropertyDetailPage";
import { BlogPostPage } from "./components/BlogPostPage";
import { ContactPage } from "./components/ContactPage";
import AdminApp from "./admin/AdminApp";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import RoleRedirect from "./components/RoleRedirect";

type Page = 'home' | 'properties' | 'blog' | 'contact' | 'signin' | 'property' | 'blog-post';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedId, setSelectedId] = useState<string | undefined>();
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

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page as Page);
    setSelectedId(id);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'properties':
        return <PropertiesPage onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'signin':
        return <SignInPage onNavigate={handleNavigate} />;
      case 'property':
        return <PropertyDetailPage propertyId={selectedId} onNavigate={handleNavigate} />;
      case 'blog-post':
        return <BlogPostPage postId={selectedId} onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // If we're on an admin route, don't render the main app
  if (isAdminRoute) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'signin' ? (
        // Sign in page without header and footer for cleaner experience
        renderCurrentPage()
      ) : (
        <>
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <main>
            {renderCurrentPage()}
          </main>
          <Footer onNavigate={handleNavigate} />
        </>
      )}
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