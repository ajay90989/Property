import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Tag,
  ArrowRight,
  Star,
  Clock,
  Search
} from 'lucide-react';
import { blogService } from '../../services/blogService';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  views: number;
  readTime?: number;
  author?: {
    name: string;
    email: string;
  };
  featuredImage: {
    url: string;
    alt: string;
  };
  createdAt: string;
  publishedAt?: string;
}

const BlogListingPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: 9,
        status: 'published'
      };

      const response = await blogService.getBlogs(filters);

      if (response.success) {
        setBlogs(response.data);
        setTotalPages(response.pages);
        setTotalBlogs(response.total);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

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
      investment: 'bg-green-100 text-green-800',
      'market-trends': 'bg-purple-100 text-purple-800',
      'home-decor': 'bg-pink-100 text-pink-800',
      legal: 'bg-red-100 text-red-800',
      tips: 'bg-orange-100 text-orange-800',
      news: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleViewBlog = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="animate-pulse border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="h-56 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Property Blog</h1>
          <p className="text-lg text-gray-600">
            Latest insights and trends in real estate
          </p>
        </div>

        {/* Blogs */}
        {blogs.length === 0 ? (
          <Card className="text-center py-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="text-gray-400 mb-6">
                <Search className="h-20 w-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Articles Found
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Try adjusting your search criteria to find more articles.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Card
                key={blog._id}
                className="group relative overflow-hidden border border-gray-100 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full">
                  {blog.featuredImage?.url ? (
                    <img
                      src={
                        blog.featuredImage.url.startsWith('http')
                          ? blog.featuredImage.url
                          : `http://localhost:5000${blog.featuredImage.url}`
                      }
                      alt={blog.featuredImage.alt || blog.title}
                      className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-700"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
                    style={{ display: blog.featuredImage?.url ? 'none' : 'flex' }}
                  >
                    <span className="text-5xl">📰</span>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Category */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${getCategoryBadge(
                        blog.category
                      )} px-3 py-1 text-xs font-semibold shadow-md`}
                    >
                      {blog.category
                        .charAt(0)
                        .toUpperCase() +
                        blog.category.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Featured */}
                  {blog.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs shadow-md">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs bg-gray-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Author */}
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {blog.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {blog.author?.name || 'Unknown Author'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-purple-600" />
                        {blog.views}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-orange-600" />
                        {blog.readTime || 5} min
                      </div>
                    </div>
                  </div>

                  {/* Read More */}
                  <Button
                    onClick={() => handleViewBlog(blog.slug)}
                    className="mt-5 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListingPage;
