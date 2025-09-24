import { Button } from "./ui/button";
import { Home, Building, FileText, Phone, Menu, Shield, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 leading-none">Property</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="leading-none">Home</span>
            </Link>
            {/* <Link 
              to="/properties"
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/properties') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Building className="w-4 h-4" />
              <span className="leading-none">Properties</span>
            </Link> */}
            <Link 
              to="/blog"
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/blog') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="leading-none">Blog</span>
            </Link>
            <Link 
              to="/contact"
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/contact') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="leading-none">Contact</span>
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>Welcome, {user?.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <Button 
                    variant="outline"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 py-2 transition-colors ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="leading-none">Home</span>
              </Link>
              <Link 
                to="/properties"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 py-2 transition-colors ${
                  isActive('/properties') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Building className="w-4 h-4" />
                <span className="leading-none">Properties</span>
              </Link>
              <Link 
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 py-2 transition-colors ${
                  isActive('/blog') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="leading-none">Blog</span>
              </Link>
              <Link 
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 py-2 transition-colors ${
                  isActive('/contact') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="leading-none">Contact</span>
              </Link>
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 py-2">
                      <User className="w-4 h-4" />
                      <span>Welcome, {user?.name}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        window.open('/admin', '_blank');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}