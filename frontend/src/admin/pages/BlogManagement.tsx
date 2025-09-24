import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  FileText,
  Power,
  PowerOff,
  X,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Blog {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isActive: boolean;
  views: number;
  author?: {
    name: string;
    email: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
  };
  createdAt: string;
  publishedAt?: string;
}

const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);


  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setIsSearching(!!debouncedSearchTerm);
      
      const filters: any = {
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm || undefined
        // Remove isActive filter to show both active and inactive blogs in admin
      };

      const response = await adminService.getBlogs(filters);
      
      if (response.success) {
        
        // Map _id to id for consistency
        const mappedBlogs = response.data.map((blog: any) => ({
          ...blog,
          id: blog._id || blog.id
        }));
        
        setBlogs(mappedBlogs);
        setTotalPages(response.pages);
        setTotalBlogs(response.total);
      } else {
        console.error('API response not successful:', response);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to page 1 when search term changes
      setCurrentPage(1);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch blogs when debounced search term or other filters change
  useEffect(() => {
    fetchBlogs();
  }, [currentPage, debouncedSearchTerm]);

  const handleDelete = async (blogId: string) => {
    const blog = blogs.find(b => (b.id === blogId) || (b._id === blogId));
    
    const result = await Swal.fire({
      title: 'Permanently Delete Blog?',
      html: `
        <div class="text-left">
          <p class="mb-3"><strong>Blog:</strong> ${blog?.title}</p>
          <p class="mb-3 text-red-600"><strong>⚠️ WARNING:</strong> This action will permanently delete the blog and cannot be undone!</p>
          <p class="text-sm text-gray-600">All data including images, content, and metadata will be lost forever.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete permanently!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.deleteBlog(blogId);
        console.log('Delete response:', response);
        
        if (response.success) {
          // Remove from local state immediately
          setBlogs(prevBlogs => 
            prevBlogs.filter(b => (b.id !== blogId) && (b._id !== blogId))
          );
          
          await Swal.fire({
            title: 'Deleted!',
            text: 'Blog post has been permanently deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Failed to delete blog post. Please try again.',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'An error occurred while deleting the blog post.',
          icon: 'error'
        });
      }
    }
  };

  const handleToggleStatus = async (blogId: string) => {
    console.log('Toggle clicked for blog ID:', blogId);
    console.log('Available blogs:', blogs.map(b => ({ id: b.id, _id: b._id, title: b.title })));
    
    if (!blogId || blogId === 'undefined') {
      await Swal.fire({
        title: 'Error!',
        text: 'Invalid blog ID. Please refresh the page and try again.',
        icon: 'error'
      });
      return;
    }
    
    const blog = blogs.find(b => (b.id === blogId) || (b._id === blogId));
    
    if (!blog) {
      await Swal.fire({
        title: 'Error!',
        text: 'Blog not found. Please refresh the page and try again.',
        icon: 'error'
      });
      return;
    }
    
    const newStatus = blog?.isActive ? 'inactive' : 'active';
    
    // Skip confirmation for faster toggle
    try {
      console.log('Calling toggle API with ID:', blogId);
      const response = await adminService.toggleBlogStatus(blogId);
      console.log('Toggle API response:', response);
      
      if (response.success) {
        // Update the blog in the local state immediately
        setBlogs(prevBlogs => 
          prevBlogs.map(b => 
            (b.id === blogId || b._id === blogId) 
              ? { ...b, isActive: !b.isActive }
              : b
          )
        );
        
        await Swal.fire({
          title: 'Success!',
          text: `Blog "${blog?.title}" has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        console.error('Toggle failed:', response);
        await Swal.fire({
          title: 'Error!',
          text: response.message || 'Failed to toggle blog status. Please try again.',
          icon: 'error'
        });
      }
    } catch (error: any) {
      console.error('Error toggling blog status:', error);
      await Swal.fire({
        title: 'Error!',
        text: `An error occurred while toggling blog status: ${error.message}`,
        icon: 'error'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6" style={{ marginLeft: '228px', marginTop: '50px' }}>
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ marginLeft: '228px', marginTop: '50px' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/admin/blogs/add')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Blog
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-3xl font-bold text-gray-900">{totalBlogs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {blogs.filter(b => b.status === 'published').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {blogs.filter(b => b.status === 'draft').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-purple-600">
                  {blogs.reduce((sum, blog) => sum + blog.views, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                )}
                <Input
                  placeholder="Search blogs by title, excerpt, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-800">Blog Posts ({totalBlogs})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Image</TableHead>
                  <TableHead className="font-semibold text-gray-700">Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex flex-col items-center">
                      <span>Active Status</span>
                      <div className="text-xs font-normal text-gray-500 mt-1 text-center">
                        Toggle to show/hide from users
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Author</TableHead>
                  <TableHead className="font-semibold text-gray-700">Views</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-gray-500">
                        <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                        <p>Loading blogs...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No blogs found</p>
                        <p className="text-sm">Create your first blog post to get started.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => {
                    console.log('Rendering blog:', blog);
                    console.log('Blog featured image:', blog.featuredImage);
                    console.log('Blog featured image URL:', blog.featuredImage?.url);
                    console.log('Blog featured image alt:', blog.featuredImage?.alt);
                    return (
                    <TableRow key={blog._id || blog.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border-2 border-blue-500">
                        {blog.featuredImage?.url ? (
                          <div className="relative">
                            <img
                              src={`http://localhost:5000${blog.featuredImage.url}`}
                          
                            alt={blog.featuredImage.alt || blog.title}
                            className="w-full h-full object-cover rounded-lg"
                            style={{
                              display: 'block',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                            onError={(e) => {
                              console.log('Image load error for blog:', blog.title);
                              console.log('Original URL:', blog.featuredImage?.url);
                              console.log('Constructed URL:', blog.featuredImage?.url?.startsWith('http') 
                                ? blog.featuredImage.url 
                                : `http://localhost:5000${blog.featuredImage?.url}`);
                              // Show fallback image
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI0IDI0SDQwVjQwSDI0VjI0WiIgZmlsbD0iI0U1RTdFQiIvPgo8L3N2Zz4K';
                              e.currentTarget.alt = 'Image failed to load';
                            }}
                            onLoad={(e) => {
                              console.log('Image loaded successfully for blog:', blog.title);
                              console.log('Image element:', e.currentTarget);
                              console.log('Image dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                              console.log('Image display style:', window.getComputedStyle(e.currentTarget).display);
                              console.log('Image visibility:', window.getComputedStyle(e.currentTarget).visibility);
                            }}
                          />
                          {/* Test with a simple image */}
                          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center">
                            T
                          </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{blog.title}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {blog.excerpt}
                        </div>
                        {blog.isFeatured && (
                          <Badge className="mt-1 bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadge(blog.category)}>
                        {blog.category.charAt(0).toUpperCase() + blog.category.slice(1).replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(blog.status)}>
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={`px-3 py-1 text-xs font-medium ${
                            blog.isActive 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {blog.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                console.log('Button clicked for blog:', blog);
                                const blogId = blog.id || blog._id || '';
                                console.log('Using blog ID:', blogId);
                                handleToggleStatus(blogId);
                              }}
                              className={`group relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                blog.isActive 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-200' 
                                  : 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg shadow-gray-200'
                              }`}
                              title={`Click to ${blog.isActive ? 'hide from users' : 'show to users'}`}
                            >
                            <span
                              className={`inline-flex h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                                blog.isActive ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {blog.isActive ? (
                                  <Power className="h-3 w-3 text-green-600" />
                                ) : (
                                  <PowerOff className="h-3 w-3 text-gray-500" />
                                )}
                              </div>
                            </span>
                            </button>
                          </div>
                        </div>
                        
                        {blog.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 text-xs">
                            ⭐ Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{blog.author?.name || 'Unknown Author'}</div>
                        <div className="text-gray-500">{blog.author?.email || 'No email'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="mr-1 h-4 w-4" />
                        {blog.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(blog.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {/* Direct Edit Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Direct Edit clicked for blog:', blog);
                            const blogId = blog.id || blog._id;
                            console.log('Navigating to edit blog:', blogId);
                            navigate(`/admin/blogs/edit/${blogId}`);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        {/* Direct Delete Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Direct Delete clicked for blog:', blog);
                            handleDelete(blog.id || blog._id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        
                        {/* Dropdown Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => console.log('Dropdown trigger clicked')}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => console.log('View clicked')}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                console.log('Edit clicked for blog:', blog);
                                const blogId = blog.id || blog._id;
                                console.log('Navigating to edit blog:', blogId);
                                navigate(`/admin/blogs/edit/${blogId}`);
                              }}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                console.log('Delete clicked for blog:', blog);
                                handleDelete(blog.id || blog._id);
                              }}
                              className="text-red-600 cursor-pointer hover:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalBlogs)} of {totalBlogs} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
