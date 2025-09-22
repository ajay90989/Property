import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Home, 
  DollarSign,
  Calendar,
  Download
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    avgPrice: 0,
    topProperties: [],
    monthlyStats: [],
    propertyTypeStats: [],
    locationStats: []
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        totalViews: 15420,
        uniqueVisitors: 3840,
        conversionRate: 12.5,
        avgPrice: 8500000,
        topProperties: [
          { id: 1, title: 'Luxury Villa in Mumbai', views: 450, price: 25000000 },
          { id: 2, title: '3BHK Apartment in Delhi', views: 380, price: 8500000 },
          { id: 3, title: 'Commercial Space in Bangalore', views: 320, price: 15000000 },
          { id: 4, title: 'Plot in Pune', views: 280, price: 5000000 },
          { id: 5, title: 'House in Chennai', views: 250, price: 12000000 }
        ],
        monthlyStats: [
          { month: 'Jan', views: 1200, visitors: 300, properties: 15 },
          { month: 'Feb', views: 1350, visitors: 340, properties: 18 },
          { month: 'Mar', views: 1580, visitors: 380, properties: 22 },
          { month: 'Apr', views: 1420, visitors: 360, properties: 20 },
          { month: 'May', views: 1680, visitors: 420, properties: 25 },
          { month: 'Jun', views: 1820, visitors: 450, properties: 28 }
        ],
        propertyTypeStats: [
          { type: 'Apartment', count: 45, percentage: 35 },
          { type: 'Villa', count: 25, percentage: 20 },
          { type: 'House', count: 30, percentage: 23 },
          { type: 'Commercial', count: 15, percentage: 12 },
          { type: 'Plot', count: 13, percentage: 10 }
        ],
        locationStats: [
          { city: 'Mumbai', count: 35, avgPrice: 15000000 },
          { city: 'Delhi', count: 28, avgPrice: 12000000 },
          { city: 'Bangalore', count: 25, avgPrice: 10000000 },
          { city: 'Pune', count: 20, avgPrice: 8000000 },
          { city: 'Chennai', count: 15, avgPrice: 7500000 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Property performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalViews)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.uniqueVisitors)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(analytics.avgPrice)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{property.title}</h3>
                      <p className="text-sm text-gray-600">{formatPrice(property.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{property.views}</div>
                    <div className="text-sm text-gray-600">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Types */}
        <Card>
          <CardHeader>
            <CardTitle>Property Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.propertyTypeStats.map((stat, index) => (
                <div key={stat.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{stat.type}</span>
                    <span className="text-sm text-gray-600">{stat.count} properties</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">City</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Properties</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Avg. Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {analytics.locationStats.map((location, index) => (
                  <tr key={location.city} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{location.city}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{location.count}</td>
                    <td className="py-3 px-4">{formatPrice(location.avgPrice)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(location.count / Math.max(...analytics.locationStats.map(l => l.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round((location.count / analytics.locationStats.reduce((sum, l) => sum + l.count, 0)) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
