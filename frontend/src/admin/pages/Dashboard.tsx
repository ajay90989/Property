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
import { adminService } from '../../services/adminService';

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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardData('30d');
        
        if (response.success) {
          const data = response.data;
          setStats({
            totalProperties: data.overview.totalProperties,
            activeProperties: data.overview.activeProperties,
            totalUsers: data.overview.totalUsers,
            totalViews: data.pageViews.reduce((sum: number, item: any) => sum + item.count, 0),
            monthlyRevenue: 125000, // This would come from a separate revenue calculation
            recentProperties: data.propertyViews.slice(0, 3).map((property: any) => ({
              id: property.propertyId,
              title: property.title,
              price: 0, // Price would need to be fetched separately
              location: "Location", // Location would need to be fetched separately
              status: "active",
              views: property.views,
              createdAt: new Date().toISOString()
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to demo data
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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

     
    
    </div>
  );
};

export default Dashboard;
