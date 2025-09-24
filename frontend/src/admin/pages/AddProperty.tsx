import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Plus, 
  MapPin, 
  Home, 
  DollarSign,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    listingType: '',
    price: '',
    area: {
      value: '',
      unit: 'sqft'
    },
    bedrooms: '',
    bathrooms: '',
    floors: '1',
    facing: '',
    age: '0',
    furnished: 'unfurnished',
    parking: '0',
    balcony: '0',
    amenities: [] as string[],
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    contact: {
      name: '',
      phone: '',
      email: '',
      whatsapp: ''
    }
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const propertyTypes = [
    'apartment', 'house', 'villa', 'plot', 'commercial', 'office', 'shop', 'warehouse'
  ];

  const listingTypes = ['sale', 'rent'];

  const areaUnits = ['sqft', 'sqm', 'acre', 'hectare'];

  const facingOptions = [
    'north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west'
  ];

  const furnishedOptions = ['furnished', 'semi-furnished', 'unfurnished'];

  const amenityOptions = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony',
    'Lift', 'Power Backup', 'Water Supply', 'Internet', 'CCTV', 'Club House'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.listingType) newErrors.listingType = 'Listing type is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.area.value || parseFloat(formData.area.value) <= 0) newErrors.area = 'Valid area is required';
    if (!formData.location.address.trim()) newErrors.address = 'Address is required';
    if (!formData.location.city.trim()) newErrors.city = 'City is required';
    if (!formData.location.state.trim()) newErrors.state = 'State is required';
    if (!formData.location.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.contact.name.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contact.phone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!formData.contact.email.trim()) newErrors.contactEmail = 'Contact email is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contact.email && !emailRegex.test(formData.contact.email)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.contact.phone && !phoneRegex.test(formData.contact.phone.replace(/\D/g, ''))) {
      newErrors.contactPhone = 'Please enter a valid 10-digit phone number';
    }

    // Pincode validation
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (formData.location.pincode && !pincodeRegex.test(formData.location.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare property data
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        price: parseFloat(formData.price),
        area: {
          value: parseFloat(formData.area.value),
          unit: formData.area.unit
        },
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        floors: parseInt(formData.floors) || 1,
        facing: formData.facing || undefined,
        age: parseInt(formData.age) || 0,
        furnished: formData.furnished,
        parking: parseInt(formData.parking) || 0,
        balcony: parseInt(formData.balcony) || 0,
        amenities: formData.amenities,
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          pincode: formData.location.pincode.trim(),
          landmark: formData.location.landmark.trim() || undefined
        },
        contact: {
          name: formData.contact.name.trim(),
          phone: formData.contact.phone.trim(),
          email: formData.contact.email.trim(),
          whatsapp: formData.contact.whatsapp.trim() || undefined
        }
      };

      
      // Create property using admin service
      const response = await adminService.createProperty(propertyData, images);
      
      
      if (response.success) {
        // Navigate back to properties list
        navigate('/admin/properties');
      } else {
        throw new Error(response.message || 'Failed to create property');
      }
    } catch (error: any) {
      console.error('Error creating property:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setErrors({ submit: error.message || 'Failed to create property. Please try again.' });
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
          size="sm"
          onClick={() => navigate('/admin/properties')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-600 mt-1">Create a new property listing</p>
        </div>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
          <ul className="text-red-600 text-sm space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>• {message}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-700 font-medium">
                  Property Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter property title"
                  required
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(value) => handleInputChange('propertyType', value)}
                >
                  <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property in detail"
                rows={4}
                required
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="listingType">Listing Type *</Label>
                <Select 
                  value={formData.listingType} 
                  onValueChange={(value) => handleInputChange('listingType', value)}
                >
                  <SelectTrigger className={errors.listingType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.listingType && <p className="text-red-500 text-sm mt-1">{errors.listingType}</p>}
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="price"
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                    className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label htmlFor="furnished">Furnished Status</Label>
                <Select 
                  value={formData.furnished} 
                  onValueChange={(value) => handleInputChange('furnished', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {furnishedOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="floors">Floors</Label>
                <Input
                  id="floors"
                  type="number"
                  min="1"
                  value={formData.floors}
                  onChange={(e) => handleInputChange('floors', e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="area">Area *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="area"
                    type="number"
                    min="0"
                    value={formData.area.value}
                    onChange={(e) => handleInputChange('area.value', e.target.value)}
                    placeholder="Area value"
                    required
                    className={errors.area ? 'border-red-500' : ''}
                  />
                  <Select 
                    value={formData.area.unit} 
                    onValueChange={(value) => handleInputChange('area.unit', value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areaUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>
              <div>
                <Label htmlFor="facing">Facing</Label>
                <Select 
                  value={formData.facing} 
                  onValueChange={(value) => handleInputChange('facing', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent>
                    {facingOptions.map(facing => (
                      <SelectItem key={facing} value={facing}>
                        {facing.charAt(0).toUpperCase() + facing.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parking">Parking</Label>
                <Input
                  id="parking"
                  type="number"
                  min="0"
                  value={formData.parking}
                  onChange={(e) => handleInputChange('parking', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="balcony">Balcony</Label>
                <Input
                  id="balcony"
                  type="number"
                  min="0"
                  value={formData.balcony}
                  onChange={(e) => handleInputChange('balcony', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                placeholder="Enter complete address"
                rows={2}
                required
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  placeholder="Enter city"
                  required
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  placeholder="Enter state"
                  required
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.location.pincode}
                  onChange={(e) => handleInputChange('location.pincode', e.target.value)}
                  placeholder="Enter pincode"
                  required
                  className={errors.pincode ? 'border-red-500' : ''}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
              <div>
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={formData.location.landmark}
                  onChange={(e) => handleInputChange('location.landmark', e.target.value)}
                  placeholder="Nearby landmark"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contact.name}
                  onChange={(e) => handleInputChange('contact.name', e.target.value)}
                  placeholder="Enter contact person name"
                  required
                  className={errors.contactName ? 'border-red-500' : ''}
                />
                {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder="Enter phone number"
                  required
                  className={errors.contactPhone ? 'border-red-500' : ''}
                />
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  placeholder="Enter email address"
                  required
                  className={errors.contactEmail ? 'border-red-500' : ''}
                />
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleInputChange('contact.whatsapp', e.target.value)}
                  placeholder="Enter WhatsApp number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenityOptions.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
            {formData.amenities.length > 0 && (
              <div className="mt-4">
                <Label>Selected Amenities:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary">{amenity}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload property images
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </span>
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/admin/properties')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Property
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
