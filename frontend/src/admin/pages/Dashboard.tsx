import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus,
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalUsers: 0,
    totalViews: 0,
    monthlyRevenue: 0,
    recentProperties: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalProperties: 156,
        activeProperties: 142,
        totalUsers: 89,
        totalViews: 2847,
        monthlyRevenue: 125000,
        recentProperties: [
          {
            id: 1,
            title: "Luxury Villa in Mumbai",
            price: 25000000,
            location: "Bandra West, Mumbai",
            status: "active",
            views: 45,
            createdAt: "2024-01-15"
          },
          {
            id: 2,
            title: "3BHK Apartment in Delhi",
            price: 8500000,
            location: "Gurgaon, Delhi",
            status: "active",
            views: 32,
            createdAt: "2024-01-14"
          },
          {
            id: 3,
            title: "Commercial Space in Bangalore",
            price: 15000000,
            location: "Whitefield, Bangalore",
            status: "pending",
            views: 18,
            createdAt: "2024-01-13"
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%"
    },
    {
      title: "Active Properties",
      value: stats.activeProperties,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15%"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+22%"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your property management dashboard</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatPrice(stats.monthlyRevenue)}
          </div>
          <p className="text-sm text-gray-600 mt-1">+18% from last month</p>
        </CardContent>
      </Card>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{property.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="mr-1 h-4 w-4" />
                    {property.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatPrice(property.price)}</div>
                    <div className="text-sm text-gray-600">{property.views} views</div>
                  </div>
                  {getStatusBadge(property.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
