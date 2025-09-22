import { useState } from "react";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BlogPageProps {
  onNavigate: (page: string, id?: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 10 Real Estate Investment Tips for 2024",
    excerpt: "Discover the most effective strategies for real estate investment in today's market. Learn from industry experts about timing, location, and market trends.",
    content: "Complete guide to real estate investment...",
    author: "Priya Sharma",
    date: "2024-03-15",
    readTime: "8 min read",
    category: "Investment",
    tags: ["Investment", "Tips", "Market Analysis"],
    image: "real estate investment tips",
    featured: true
  },
  {
    id: "2",
    title: "Understanding Home Loan EMI Calculations",
    excerpt: "A comprehensive guide to understanding how home loan EMIs are calculated and tips to reduce your monthly payments.",
    content: "Detailed explanation of EMI calculations...",
    author: "Raj Kumar",
    date: "2024-03-12",
    readTime: "6 min read",
    category: "Finance",
    tags: ["Home Loans", "EMI", "Finance"],
    image: "home loan calculator",
    featured: false
  },
  {
    id: "3",
    title: "Mumbai vs Pune: Where Should You Invest?",
    excerpt: "Comparing investment opportunities between Mumbai and Pune. Analysis of market trends, growth potential, and ROI expectations.",
    content: "Market comparison analysis...",
    author: "Anita Singh",
    date: "2024-03-10",
    readTime: "10 min read",
    category: "Market Analysis",
    tags: ["Mumbai", "Pune", "Investment", "Comparison"],
    image: "mumbai pune comparison",
    featured: true
  },
  {
    id: "4",
    title: "First-Time Home Buyer's Complete Checklist",
    excerpt: "Everything you need to know when buying your first home. From documentation to legal aspects, we cover it all.",
    content: "Complete first-time buyer guide...",
    author: "Vikram Patel",
    date: "2024-03-08",
    readTime: "12 min read",
    category: "Buying Guide",
    tags: ["First Time Buyers", "Checklist", "Documentation"],
    image: "first home buyer guide",
    featured: false
  },
  {
    id: "5",
    title: "RERA Act: How It Benefits Property Buyers",
    excerpt: "Understanding the Real Estate Regulation and Development Act and how it protects property buyers' interests.",
    content: "RERA act benefits and protections...",
    author: "Meera Joshi",
    date: "2024-03-05",
    readTime: "7 min read",
    category: "Legal",
    tags: ["RERA", "Legal", "Buyer Protection"],
    image: "rera act legal",
    featured: false
  },
  {
    id: "6",
    title: "Emerging Areas in Bangalore for Property Investment",
    excerpt: "Explore the upcoming localities in Bangalore that offer great potential for property investment and capital appreciation.",
    content: "Bangalore emerging areas analysis...",
    author: "Suresh Gupta",
    date: "2024-03-03",
    readTime: "9 min read",
    category: "Location Guide",
    tags: ["Bangalore", "Emerging Areas", "Investment"],
    image: "bangalore emerging areas",
    featured: true
  }
];

export function BlogPage({ onNavigate }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Real Estate Insights & Guides</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and insights from real estate experts
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search articles, guides, and tips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="investment">Investment</option>
                  <option value="finance">Finance</option>
                  <option value="market analysis">Market Analysis</option>
                  <option value="buying guide">Buying Guide</option>
                  <option value="legal">Legal</option>
                  <option value="location guide">Location Guide</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-gray-200 overflow-hidden"
                  onClick={() => onNavigate('blog-post', post.id)}
                >
                  <div className="aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=300&fit=crop&crop=center`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className="bg-blue-600 text-white">Featured</Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          <p className="text-gray-600">
            Showing {filteredPosts.length} articles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-gray-200 overflow-hidden"
              onClick={() => onNavigate('blog-post', post.id)}
            >
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=center`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center space-x-2 mb-4">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="flex items-center text-xs text-gray-500">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.date)}
                  </span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with BhooLink Insights</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest real estate tips, market insights, and expert advice delivered to your inbox every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email address"
              className="flex-1 bg-white text-gray-900 border-0"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}