import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ url: string; isPrimary: boolean }>>([]);

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

  const amenityOptions = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony',
    'Lift', 'Power Backup', 'Water Supply', 'Internet', 'CCTV', 'Club House'
  ];

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Debug amenities
  useEffect(() => {
  }, [formData.amenities]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProperty(id!);
      
      if (response.success && response.data) {
        const propertyData = response.data;
        
        
        setFormData({
          title: propertyData.title,
          description: propertyData.description,
          propertyType: propertyData.propertyType,
          listingType: propertyData.listingType,
          price: propertyData.price.toString(),
          area: {
            value: propertyData.area.value.toString(),
            unit: propertyData.area.unit
          },
          bedrooms: propertyData.bedrooms.toString(),
          bathrooms: propertyData.bathrooms.toString(),
          floors: propertyData.floors.toString(),
          facing: propertyData.facing || '',
          age: propertyData.age.toString(),
          furnished: propertyData.furnished,
          parking: propertyData.parking.toString(),
          balcony: propertyData.balcony.toString(),
          amenities: propertyData.amenities || [],
          location: {
            address: propertyData.location.address,
            city: propertyData.location.city,
            state: propertyData.location.state,
            pincode: propertyData.location.pincode,
            landmark: propertyData.location.landmark || ''
          },
          contact: {
            name: propertyData.contact.name,
            phone: propertyData.contact.phone,
            email: propertyData.contact.email,
            whatsapp: propertyData.contact.whatsapp || ''
          }
        });
        
        setExistingImages(propertyData.images || []);
      } else {
        console.error('Property not found');
        navigate('/admin/properties');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
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
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.listingType) newErrors.listingType = 'Listing type is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.area.value || parseFloat(formData.area.value) <= 0) newErrors['area.value'] = 'Valid area is required';
    if (!formData.location.address.trim()) newErrors['location.address'] = 'Address is required';
    if (!formData.location.city.trim()) newErrors['location.city'] = 'City is required';
    if (!formData.location.state.trim()) newErrors['location.state'] = 'State is required';
    if (!formData.location.pincode.trim()) newErrors['location.pincode'] = 'Pincode is required';
    if (!formData.contact.name.trim()) newErrors['contact.name'] = 'Contact name is required';
    if (!formData.contact.phone.trim()) newErrors['contact.phone'] = 'Contact phone is required';
    if (!formData.contact.email.trim()) newErrors['contact.email'] = 'Contact email is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contact.email && !emailRegex.test(formData.contact.email)) {
      newErrors['contact.email'] = 'Valid email is required';
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.contact.phone && !phoneRegex.test(formData.contact.phone.replace(/\D/g, ''))) {
      newErrors['contact.phone'] = 'Valid 10-digit phone number is required';
    }
    
    // Pincode validation
    const pincodeRegex = /^[0-9]{6}$/;
    if (formData.location.pincode && !pincodeRegex.test(formData.location.pincode)) {
      newErrors['location.pincode'] = 'Valid 6-digit pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setSaving(false);
      return;
    }

    setSaving(true);
    setErrors({}); // Clear previous errors

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


      // Update property using admin service
      const response = await adminService.updateProperty(id!, propertyData, images);


      if (response.success) {
        // Navigate back to properties list
        navigate('/admin/properties');
      } else {
        throw new Error(response.message || 'Failed to update property');
      }
    } catch (error: any) {
      console.error('Error updating property:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setErrors({ submit: error.message || 'Failed to update property. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ marginLeft: '228px', marginTop: '50px' }}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/properties')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Properties</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600">Update property details</p>
        </div>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                  <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
              </div>
              <div>
                <Label htmlFor="listingType">Listing Type *</Label>
                <Select value={formData.listingType} onValueChange={(value) => handleSelectChange('listingType', value)}>
                  <SelectTrigger className={errors.listingType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.listingType && <p className="text-red-500 text-sm mt-1">{errors.listingType}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Property Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="floors">Floors</Label>
                <Input
                  id="floors"
                  name="floors"
                  type="number"
                  value={formData.floors}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area.value">Area *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="area.value"
                    name="area.value"
                    type="number"
                    value={formData.area.value}
                    onChange={handleInputChange}
                    className={errors['area.value'] ? 'border-red-500' : ''}
                  />
                  <Select value={formData.area.unit} onValueChange={(value) => handleSelectChange('area.unit', value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">Sq Ft</SelectItem>
                      <SelectItem value="sqm">Sq M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors['area.value'] && <p className="text-red-500 text-sm mt-1">{errors['area.value']}</p>}
              </div>
              <div>
                <Label htmlFor="facing">Facing</Label>
                <Select value={formData.facing} onValueChange={(value) => handleSelectChange('facing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="north-east">North-East</SelectItem>
                    <SelectItem value="north-west">North-West</SelectItem>
                    <SelectItem value="south-east">South-East</SelectItem>
                    <SelectItem value="south-west">South-West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="furnished">Furnished</Label>
                <Select value={formData.furnished} onValueChange={(value) => handleSelectChange('furnished', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furnished">Furnished</SelectItem>
                    <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parking">Parking</Label>
                <Input
                  id="parking"
                  name="parking"
                  type="number"
                  value={formData.parking}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="balcony">Balcony</Label>
              <Input
                id="balcony"
                name="balcony"
                type="number"
                value={formData.balcony}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location.address">Address *</Label>
              <Input
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                className={errors['location.address'] ? 'border-red-500' : ''}
              />
              {errors['location.address'] && <p className="text-red-500 text-sm mt-1">{errors['location.address']}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location.city">City *</Label>
                <Input
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className={errors['location.city'] ? 'border-red-500' : ''}
                />
                {errors['location.city'] && <p className="text-red-500 text-sm mt-1">{errors['location.city']}</p>}
              </div>
              <div>
                <Label htmlFor="location.state">State *</Label>
                <Input
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className={errors['location.state'] ? 'border-red-500' : ''}
                />
                {errors['location.state'] && <p className="text-red-500 text-sm mt-1">{errors['location.state']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location.pincode">Pincode *</Label>
                <Input
                  id="location.pincode"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                  className={errors['location.pincode'] ? 'border-red-500' : ''}
                />
                {errors['location.pincode'] && <p className="text-red-500 text-sm mt-1">{errors['location.pincode']}</p>}
              </div>
              <div>
                <Label htmlFor="location.landmark">Landmark</Label>
                <Input
                  id="location.landmark"
                  name="location.landmark"
                  value={formData.location.landmark}
                  onChange={handleInputChange}
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
                <Label htmlFor="contact.name">Contact Name *</Label>
                <Input
                  id="contact.name"
                  name="contact.name"
                  value={formData.contact.name}
                  onChange={handleInputChange}
                  className={errors['contact.name'] ? 'border-red-500' : ''}
                />
                {errors['contact.name'] && <p className="text-red-500 text-sm mt-1">{errors['contact.name']}</p>}
              </div>
              <div>
                <Label htmlFor="contact.phone">Phone *</Label>
                <Input
                  id="contact.phone"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className={errors['contact.phone'] ? 'border-red-500' : ''}
                />
                {errors['contact.phone'] && <p className="text-red-500 text-sm mt-1">{errors['contact.phone']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact.email">Email *</Label>
                <Input
                  id="contact.email"
                  name="contact.email"
                  type="email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className={errors['contact.email'] ? 'border-red-500' : ''}
                />
                {errors['contact.email'] && <p className="text-red-500 text-sm mt-1">{errors['contact.email']}</p>}
              </div>
              <div>
                <Label htmlFor="contact.whatsapp">WhatsApp</Label>
                <Input
                  id="contact.whatsapp"
                  name="contact.whatsapp"
                  value={formData.contact.whatsapp}
                  onChange={handleInputChange}
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

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Images</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <Label>Current Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {image.isPrimary && (
                        <Badge className="absolute bottom-1 left-1 text-xs">Primary</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <Label htmlFor="images">Add New Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-2"
              />
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
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
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? 'Updating...' : 'Update Property'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;