'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Clock,
  Eye,
  FileText,
  CreditCard,
  Calculator,
  Target,
  Activity,
  Zap,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('2025');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    {
      id: 'overview',
      name: 'Overview Dashboard',
      icon: BarChart3,
      description: 'High-level financial overview and KPIs'
    },
    {
      id: 'budget',
      name: 'Budget Reports',
      icon: PieChart,
      description: 'Budget allocation and utilization analysis'
    },
    {
      id: 'expenditure',
      name: 'Expenditure Reports',
      icon: TrendingDown,
      description: 'Detailed spending analysis and trends'
    },
    {
      id: 'revenue',
      name: 'Revenue Reports',
      icon: TrendingUp,
      description: 'Income and revenue collection analysis'
    },
    {
      id: 'department',
      name: 'Department Reports',
      icon: Building2,
      description: 'Department-wise financial performance'
    },
    {
      id: 'workflow',
      name: 'Workflow Reports',
      icon: Activity,
      description: 'Approval workflow performance metrics'
    }
  ];

  const mockData = {
    overview: {
      totalBudget: 5000000000,
      totalSpent: 3500000000,
      totalRevenue: 2800000000,
      budgetUtilization: 70,
      revenueCollection: 80,
      departments: 8,
      activeProjects: 24,
      pendingApprovals: 15
    },
    trends: [
      { month: 'Jan', budget: 400000000, spent: 280000000, revenue: 220000000 },
      { month: 'Feb', budget: 420000000, spent: 300000000, revenue: 240000000 },
      { month: 'Mar', budget: 450000000, spent: 320000000, revenue: 260000000 },
      { month: 'Apr', budget: 480000000, spent: 340000000, revenue: 280000000 },
      { month: 'May', budget: 500000000, spent: 360000000, revenue: 300000000 },
      { month: 'Jun', budget: 520000000, spent: 380000000, revenue: 320000000 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive financial reports and performance analytics
            </p>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Report Types</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="2025">Fiscal Year 2025</option>
              <option value="2024">Fiscal Year 2024</option>
              <option value="2023">Fiscal Year 2023</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reportTypes.map((report) => (
            <Card
              key={report.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedReport === report.id ? 'ring-2 ring-primary' : ''
                }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-primary/10 rounded-lg inline-block mb-3">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {report.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {report.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Overview Dashboard */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(mockData.overview.totalBudget)}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12% from last year</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(mockData.overview.totalSpent)}
                    </p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+8% from last year</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(mockData.overview.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+15% from last year</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(mockData.overview.budgetUtilization)}
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mockData.overview.budgetUtilization}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg inline-block mb-3">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {mockData.overview.departments}
                  </h3>
                  <p className="text-gray-600">Active Departments</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-indigo-100 rounded-lg inline-block mb-3">
                    <Activity className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {mockData.overview.activeProjects}
                  </h3>
                  <p className="text-gray-600">Active Projects</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-orange-100 rounded-lg inline-block mb-3">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {mockData.overview.pendingApprovals}
                  </h3>
                  <p className="text-gray-600">Pending Approvals</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trends Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Financial Trends (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Interactive chart will be implemented here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Using Recharts or Chart.js for data visualization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Financial Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'Payment', amount: 50000000, status: 'Approved', time: '2 hours ago' },
                  { type: 'Budget Allocation', amount: 200000000, status: 'Pending', time: '4 hours ago' },
                  { type: 'Revenue Collection', amount: 150000000, status: 'Completed', time: '6 hours ago' },
                  { type: 'Expense Claim', amount: 2500000, status: 'Under Review', time: '8 hours ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {activity.type === 'Payment' && <CreditCard className="h-4 w-4 text-primary" />}
                        {activity.type === 'Budget Allocation' && <PieChart className="h-4 w-4 text-primary" />}
                        {activity.type === 'Revenue Collection' && <TrendingUp className="h-4 w-4 text-primary" />}
                        {activity.type === 'Expense Claim' && <Calculator className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(activity.amount)}
                      </p>
                      <Badge
                        variant="secondary"
                        className={
                          activity.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              activity.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Other Report Types Placeholder */}
      {selectedReport !== 'overview' && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-primary/10 rounded-lg inline-block mb-6">
              {(() => {
                const report = reportTypes.find(r => r.id === selectedReport);
                const IconComponent = report?.icon;
                return IconComponent ? <IconComponent className="h-16 w-16 text-primary" /> : null;
              })()}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h3>
            <p className="text-gray-600 mb-6">
              {reportTypes.find(r => r.id === selectedReport)?.description}
            </p>
            <p className="text-sm text-gray-500">
              This report type will be implemented with detailed data visualization,
              interactive charts, and comprehensive analytics specific to {selectedReport.replace('_', ' ')}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}