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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value.toString());
        }
      });

      // Add images
      images.forEach((image, index) => {
        submitData.append('images', image);
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Property data:', formData);
      console.log('Images:', images);
      
      // Navigate back to properties list
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter property title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(value) => handleInputChange('propertyType', value)}
                >
                  <SelectTrigger>
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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="listingType">Listing Type *</Label>
                <Select 
                  value={formData.listingType} 
                  onValueChange={(value) => handleInputChange('listingType', value)}
                >
                  <SelectTrigger>
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
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                    className="pl-10"
                    required
                  />
                </div>
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
              />
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
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.location.pincode}
                  onChange={(e) => handleInputChange('location.pincode', e.target.value)}
                  placeholder="Enter pincode"
                  required
                />
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
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
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
                />
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
