import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserLoginApi, UserRegisterApi } from "../../Service/Auth";
import { LoginData } from "../../Service/Auth";


export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use real API login function
      const response = await UserLoginApi({
        email: signInData.email,
        password: signInData.password
      });
      
      if (response.success && response.data) {
        
        // Update auth context
        authLogin(response.data.user, response.data.token);
        
        // Navigate based on user role
        setTimeout(() => {
          if (response.data!.user.role === 'admin') {
            // For admin, use window.location to navigate to admin route
            window.location.href = '/admin';
          } else {
            navigate('/');
          }
        }, 100);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use real API register function
      const userData = {
        name: `${signUpData.firstName} ${signUpData.lastName}`,
        email: signUpData.email,
        phone: signUpData.phone,
        password: signUpData.password,
        role: 'user' as const, // Static user role
      };
      
      const response = await UserRegisterApi(userData);
      
      if (response.success && response.data) {
        // Show success message
        setSuccessMessage('Registration successful! Please login with your credentials.');
        setErrorMessage('');
        
        // Switch to sign in tab
        setActiveTab('signin');
        
        // Clear signup form
        setSignUpData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          agreeTerms: false,
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
        navigate('/');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear messages when switching tabs
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BhooLink</h1>
          <p className="text-gray-600">Your Gateway to Dream Properties</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#1E73BE] to-[#28A745] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  {errorMessage}
                </div>
              )}

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <div className="text-center mb-4">
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-[#1E73BE] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#1E73BE] hover:bg-blue-700 text-white transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                    OR CONTINUE WITH
                  </span>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin('google')}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin('facebook')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </Button>
                </div>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <div className="text-center mb-4">
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Join BhooLink to find your dream property</CardDescription>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded border-gray-300"
                      checked={signUpData.agreeTerms}
                      onChange={(e) => setSignUpData({ ...signUpData, agreeTerms: e.target.checked })}
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <button type="button" className="text-[#1E73BE] hover:underline">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button type="button" className="text-[#1E73BE] hover:underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#28A745] hover:bg-green-700 text-white transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Back to Home Link */}
            <div className="text-center mt-6 pt-4 border-t">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 hover:text-[#1E73BE] transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-[#28A745]" />
              Secure & Encrypted
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-[#28A745]" />
              Trusted by 10,000+ Users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}