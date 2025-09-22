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
    <div className="space-y-6" style={{ marginLeft: '228px', marginTop: '50px' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Management Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome to your property management dashboard</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-xs text-green-600 font-semibold">{stat.change} from last month</p>
                  </div>
                  <div className={`p-4 rounded-full ${stat.bgColor} shadow-md`}>
                    <Icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Card */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center text-green-800">
            <DollarSign className="mr-2 h-6 w-6" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {formatPrice(stats.monthlyRevenue)}
          </div>
          <p className="text-sm text-gray-600 font-semibold">+18% from last month</p>
        </CardContent>
      </Card>

      {/* Recent Properties */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-800">Recent Properties</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {stats.recentProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{property.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                    {property.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-lg">{formatPrice(property.price)}</div>
                    <div className="text-sm text-gray-600 font-medium">{property.views} views</div>
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
