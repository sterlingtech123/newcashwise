'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  PieChart,
  Calculator,
  TrendingUp,
  FileText,
  BarChart3,
  Calendar,
  Building2,
  Users,
  DollarSign,
  Target,
  Activity,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const quickActions = [
    {
      title: 'Create Budget',
      description: 'Start a new budget planning cycle',
      href: '/budgets/create',
      icon: Calculator,
      color: 'bg-blue-500'
    },
    {
      title: 'Economic Heads',
      description: 'Manage budget structure and categories',
      href: '/budgets/economic-heads',
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      title: 'Payment Requests',
      description: 'Create and manage payment requests',
      href: '/payment-requests',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Generate Reports',
      description: 'Create budget and financial reports',
      href: '/reports',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New Budget Cycle Created',
      description: 'Q1 2025 Budget Cycle has been created',
      timestamp: '2 hours ago',
      type: 'budget'
    },
    {
      id: 2,
      title: 'Payment Request Approved',
      description: 'Infrastructure Development payment approved',
      timestamp: '1 day ago',
      type: 'payment'
    },
    {
      id: 3,
      title: 'Economic Head Updated',
      description: 'Healthcare Equipment budget line modified',
      timestamp: '2 days ago',
      type: 'budget'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your budgets.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Temporarily commented out to debug server/client component issues */}
          {/*
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
          */}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">₦12.6B</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active MDAs</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Fiscal Year</p>
                <p className="text-2xl font-bold text-gray-900">2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className={`p-3 rounded-lg ${action.color} inline-block mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-1">Budget Performance</h4>
                <p className="text-sm text-green-700">Your Q1 2025 budget is performing above expectations with 78% utilization.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-1">Pending Approvals</h4>
                <p className="text-sm text-blue-700">You have 12 payment requests awaiting your approval.</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-1">Upcoming Deadlines</h4>
                <p className="text-sm text-orange-700">Q2 2025 budget planning starts in 2 weeks.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}