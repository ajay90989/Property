import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share, 
  Heart,
  Eye,
  Tag,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { blogService, Blog } from '../../services/blogService';

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogBySlug(slug!);
      if (response.success) {
        setBlog(response.data);
        // Fetch related blogs
        fetchRelatedBlogs(response.data.category);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category: string) => {
    try {
      const response = await blogService.getBlogsByCategory(category, { limit: 3 });
      if (response.success) {
        setRelatedBlogs(response.data.filter(blog => blog.slug !== slug));
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryBadge = (category: string) => {
    const colors: { [key: string]: string } = {
      'real-estate': 'bg-blue-100 text-blue-800',
      'investment': 'bg-green-100 text-green-800',
      'market-trends': 'bg-purple-100 text-purple-800',
      'home-decor': 'bg-pink-100 text-pink-800',
      'legal': 'bg-red-100 text-red-800',
      'tips': 'bg-orange-100 text-orange-800',
      'news': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    const text = blog?.excerpt || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="h-16 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/blog')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Back Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className={`${getCategoryBadge(blog.category)} px-3 py-1 text-sm font-medium`}>
                {blog.category.charAt(0).toUpperCase() + blog.category.slice(1).replace('-', ' ')}
              </Badge>
              {blog.isFeatured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-sm font-medium">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {blog.excerpt}
            </p>
          </div>

          {/* Author & Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {blog.author?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{blog.author?.name || 'Unknown Author'}</p>
                <p className="text-sm text-gray-500">{blog.author?.email || 'No email'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {blog.readTime || 5} min read
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {blog.views} views
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blog.featuredImage?.url || '/placeholder.jpg'}
              alt={blog.title}
              className="w-full h-64 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 px-3 py-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Share & Like */}
        <div className="flex items-center justify-between mb-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500 border-red-500' : 'text-gray-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </Button>
            
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 text-gray-600"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
              
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border p-2 z-10">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare('facebook')}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare('twitter')}
                      className="text-blue-400 hover:bg-blue-50"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare('linkedin')}
                      className="text-blue-700 hover:bg-blue-50"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare('copy')}
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Card key={relatedBlog._id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedBlog.featuredImage?.url || '/placeholder.jpg'}
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getCategoryBadge(relatedBlog.category)} px-3 py-1 text-sm font-medium shadow-lg`}>
                        {relatedBlog.category.charAt(0).toUpperCase() + relatedBlog.category.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                      {relatedBlog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {relatedBlog.author.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;
