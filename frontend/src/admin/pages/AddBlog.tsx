import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Save, 
  Upload,
  X
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';

const AddBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error('File reader error:', error);
      };
      reader.readAsDataURL(file);
    } else {
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      await Swal.fire({
        title: 'Missing Fields!',
        text: 'Please fill in title and content.',
        icon: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await adminService.createBlog(formData, featuredImage);
      
      if (response.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Blog post created successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/admin/blogs');
      } else {
        await Swal.fire({
          title: 'Error!',
          text: response.message || 'Failed to create blog post.',
          icon: 'error'
        });
      }
    } catch (error: any) {
      console.error('Error creating blog:', error);
      await Swal.fire({
        title: 'Error!',
        text: `An error occurred: ${error.message}`,
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ marginLeft: '228px', marginTop: '50px' }}>
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/blogs')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blogs</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Blog Post</h1>
          <p className="text-gray-600 mt-1">Create a new blog post for your website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Blog Information */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter blog title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Description *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter blog description"
                    className="mt-1"
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Upload blog image</p>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        id="featuredImage"
                        name="featuredImage"
                      />
                      <p className="text-xs text-gray-400">Or click the button below</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const fileInput = document.getElementById('featuredImage') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.click();
                          } else {
                            console.error('File input not found');
                          }
                        }}
                      >
                        Choose Image
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Blog Post
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/admin/blogs')}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
