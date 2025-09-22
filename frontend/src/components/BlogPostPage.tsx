import { useState } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share, 
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Tag,
  ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BlogPostPageProps {
  postId?: string;
  onNavigate: (page: string, id?: string) => void;
}

// Mock blog post data
const mockPost = {
  id: "1",
  title: "Top 10 Real Estate Investment Tips for 2024",
  excerpt: "Discover the most effective strategies for real estate investment in today's market. Learn from industry experts about timing, location, and market trends.",
  content: `
    <p>Real estate investment continues to be one of the most reliable ways to build wealth in India. With the market showing strong signs of recovery and growth, 2024 presents excellent opportunities for both new and seasoned investors.</p>

    <h2>1. Research Market Trends Thoroughly</h2>
    <p>Before making any investment decision, it's crucial to understand local market trends. Look at factors such as:</p>
    <ul>
      <li>Price appreciation over the past 3-5 years</li>
      <li>Upcoming infrastructure developments</li>
      <li>Employment growth in the area</li>
      <li>Population migration patterns</li>
    </ul>

    <h2>2. Location is Everything</h2>
    <p>The age-old adage "location, location, location" remains true. Focus on areas with:</p>
    <ul>
      <li>Good connectivity to business districts</li>
      <li>Established or planned infrastructure</li>
      <li>Educational institutions and healthcare facilities</li>
      <li>Future development potential</li>
    </ul>

    <h2>3. Understand Your Budget and Financing Options</h2>
    <p>Clear financial planning is essential. Consider:</p>
    <ul>
      <li>Down payment requirements (typically 20-25%)</li>
      <li>EMI obligations and your debt-to-income ratio</li>
      <li>Additional costs like registration, stamp duty, and maintenance</li>
      <li>Tax implications and benefits</li>
    </ul>

    <h2>4. Consider Both Appreciation and Rental Yield</h2>
    <p>A good investment property should offer both capital appreciation and steady rental income. Aim for areas where rental yields are at least 3-4% annually.</p>

    <h2>5. Due Diligence is Non-Negotiable</h2>
    <p>Always verify:</p>
    <ul>
      <li>Clear property titles</li>
      <li>RERA registration for new projects</li>
      <li>Builder's track record and financial stability</li>
      <li>All necessary approvals and clearances</li>
    </ul>

    <h2>6. Time Your Entry</h2>
    <p>Market timing can significantly impact your returns. Look for opportunities during:</p>
    <ul>
      <li>Market corrections or slowdowns</li>
      <li>End of financial year when developers offer discounts</li>
      <li>Pre-launch phases of quality projects</li>
    </ul>

    <h2>7. Diversify Your Portfolio</h2>
    <p>Don't put all your money in one property or location. Consider diversifying across:</p>
    <ul>
      <li>Different cities or micro-markets</li>
      <li>Various property types (residential, commercial)</li>
      <li>Different price segments</li>
    </ul>

    <h2>8. Plan Your Exit Strategy</h2>
    <p>Before investing, have a clear exit strategy. Decide whether you're investing for:</p>
    <ul>
      <li>Long-term capital appreciation (7-10 years)</li>
      <li>Regular rental income</li>
      <li>Short to medium-term gains (3-5 years)</li>
    </ul>

    <h2>9. Work with Experienced Professionals</h2>
    <p>Partner with:</p>
    <ul>
      <li>Experienced real estate agents who know the local market</li>
      <li>Property lawyers for legal verification</li>
      <li>Financial advisors for investment planning</li>
      <li>Tax consultants for optimal structuring</li>
    </ul>

    <h2>10. Stay Updated with Policy Changes</h2>
    <p>Keep track of:</p>
    <ul>
      <li>Interest rate movements</li>
      <li>Government policies affecting real estate</li>
      <li>Tax law changes</li>
      <li>RERA updates and regulations</li>
    </ul>

    <h2>Conclusion</h2>
    <p>Real estate investment in 2024 offers tremendous opportunities for those who approach it with the right knowledge and strategy. Remember that successful real estate investment is a marathon, not a sprint. Take time to research, plan carefully, and make informed decisions.</p>

    <p>If you're looking to start your real estate investment journey, consider consulting with our experienced agents who can guide you through the process and help you find properties that align with your investment goals.</p>
  `,
  author: {
    name: "Priya Sharma",
    title: "Senior Real Estate Consultant",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=150&h=150&fit=crop&crop=face",
    bio: "Priya has over 8 years of experience in Mumbai's real estate market and specializes in luxury properties and investment advisory."
  },
  date: "2024-03-15",
  readTime: "8 min read",
  category: "Investment",
  tags: ["Investment", "Tips", "Market Analysis", "2024", "Strategy"],
  image: "https://images.unsplash.com/flagged/photo-1558954157-aa76c0d246c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwaW52ZXN0bWVudCUyMGFuYWx5c2lzfGVufDF8fHx8MTc1NzMxOTgxNnww&ixlib=rb-4.1.0&q=80&w=1080",
  featured: true,
  likes: 245,
  shares: 89
};

const relatedPosts = [
  {
    id: "2",
    title: "Understanding Home Loan EMI Calculations",
    excerpt: "A comprehensive guide to understanding how home loan EMIs are calculated...",
    author: "Raj Kumar",
    date: "2024-03-12",
    readTime: "6 min read",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop"
  },
  {
    id: "3", 
    title: "Mumbai vs Pune: Where Should You Invest?",
    excerpt: "Comparing investment opportunities between Mumbai and Pune...",
    author: "Anita Singh",
    date: "2024-03-10", 
    readTime: "10 min read",
    category: "Market Analysis",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=200&fit=crop"
  },
  {
    id: "4",
    title: "First-Time Home Buyer's Complete Checklist", 
    excerpt: "Everything you need to know when buying your first home...",
    author: "Vikram Patel",
    date: "2024-03-08",
    readTime: "12 min read", 
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop"
  }
];

export function BlogPostPage({ postId, onNavigate }: BlogPostPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = mockPost.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('blog')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-blue-600 text-white">
                {mockPost.category}
              </Badge>
              {mockPost.featured && (
                <Badge className="bg-green-600 text-white">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {mockPost.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {mockPost.excerpt}
            </p>
          </div>

          {/* Author & Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <img src={mockPost.author.image} alt={mockPost.author.name} className="w-full h-full object-cover" />
              </Avatar>
              <div>
                <h4 className="font-semibold text-gray-900">{mockPost.author.name}</h4>
                <p className="text-sm text-gray-600">{mockPost.author.title}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(mockPost.date)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {mockPost.readTime}
              </span>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{mockPost.likes + (isLiked ? 1 : 0)}</span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span>{mockPost.shares}</span>
                </button>

                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                    >
                      <Link className="w-4 h-4 text-gray-600" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {mockPost.tags.map((tag, index) => (
                <span key={index} className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="aspect-video rounded-xl overflow-hidden">
            <ImageWithFallback
              src={mockPost.image}
              alt={mockPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>ul]:mb-4 [&>ul]:pl-6 [&>li]:mb-2 [&>li]:list-disc"
            dangerouslySetInnerHTML={{ __html: mockPost.content }}
          />
        </div>

        {/* Author Bio */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Card className="p-6 bg-gray-50">
            <div className="flex items-start space-x-4">
              <Avatar className="w-16 h-16">
                <img src={mockPost.author.image} alt={mockPost.author.name} className="w-full h-full object-cover" />
              </Avatar>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">About {mockPost.author.name}</h4>
                <p className="text-gray-600 mb-4">{mockPost.author.bio}</p>
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('agent', '1')}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </article>

      {/* Related Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
          <p className="text-gray-600">Continue reading with these helpful guides</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-gray-200 overflow-hidden"
              onClick={() => onNavigate('blog-post', post.id)}
            >
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <Badge variant="outline" className="mb-3">{post.category}</Badge>
                
                <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {post.author}
                  </span>
                  <span>{post.readTime}</span>
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
      </section>
    </div>
  );
}