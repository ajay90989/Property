import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddProperty from './AddProperty';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch property data
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock property data
        const mockProperty = {
          title: 'Luxury Villa in Mumbai',
          description: 'Beautiful villa with modern amenities',
          propertyType: 'villa',
          listingType: 'sale',
          price: '25000000',
          area: {
            value: '3000',
            unit: 'sqft'
          },
          bedrooms: '4',
          bathrooms: '3',
          floors: '2',
          facing: 'north',
          age: '5',
          furnished: 'semi-furnished',
          parking: '2',
          balcony: '3',
          amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security'],
          location: {
            address: '123 Main Street, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            landmark: 'Near Bandra Station'
          },
          contact: {
            name: 'John Doe',
            phone: '9876543210',
            email: 'john@example.com',
            whatsapp: '9876543210'
          }
        };
        
        setPropertyData(mockProperty);
      } catch (error) {
        console.error('Error fetching property:', error);
        navigate('/admin/properties');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/admin/properties')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/properties')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-1">Update property information</p>
        </div>
      </div>

      {/* Pass the property data to AddProperty component for editing */}
      <AddProperty initialData={propertyData} isEdit={true} propertyId={id} />
    </div>
  );
};

export default EditProperty;
