'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface BudgetUtilizationData {
  organizationName: string;
  economicHeadName: string;
  category: string;
  approvedAmount: number;
  allottedAmount: number;
  committedAmount: number;
  obligatedAmount: number;
  paidAmount: number;
  utilizationPercentage: number;
  availableAmount: number;
}

interface BudgetUtilizationChartProps {
  data: BudgetUtilizationData[];
  period: 'monthly' | 'quarterly' | 'yearly';
  groupBy: 'organization' | 'economic_head' | 'category';
}

const COLORS = {
  approved: '#e2e8f0',
  allotted: '#cbd5e1',
  committed: '#94a3b8',
  obligated: '#64748b',
  paid: '#059669',
  available: '#10b981',
  overutilized: '#dc2626',
};

const CHART_COLORS = [
  '#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export function BudgetUtilizationChart({
  data,
  period,
  groupBy,
}: BudgetUtilizationChartProps) {
  const chartData = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      const key = groupBy === 'organization' 
        ? item.organizationName 
        : groupBy === 'economic_head' 
        ? item.economicHeadName 
        : item.category;

      if (!acc[key]) {
        acc[key] = {
          name: key,
          approvedAmount: 0,
          allottedAmount: 0,
          committedAmount: 0,
          obligatedAmount: 0,
          paidAmount: 0,
          availableAmount: 0,
        };
      }

      acc[key].approvedAmount += item.approvedAmount;
      acc[key].allottedAmount += item.allottedAmount;
      acc[key].committedAmount += item.committedAmount;
      acc[key].obligatedAmount += item.obligatedAmount;
      acc[key].paidAmount += item.paidAmount;
      acc[key].availableAmount += item.availableAmount;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).map((item: any) => ({
      ...item,
      utilizationPercentage: item.approvedAmount > 0 
        ? (item.paidAmount / item.approvedAmount) * 100 
        : 0,
    }));
  }, [data, groupBy]);

  const utilizationByCategory = useMemo(() => {
    const categories = ['personnel', 'overhead', 'capital'];
    return categories.map(category => {
      const categoryData = data.filter(item => 
        item.category.toLowerCase() === category
      );
      
      const total = categoryData.reduce((sum, item) => sum + item.approvedAmount, 0);
      const utilized = categoryData.reduce((sum, item) => sum + item.paidAmount, 0);
      
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: total,
        utilized,
        percentage: total > 0 ? (utilized / total) * 100 : 0,
      };
    });
  }, [data]);

  const topUtilizers = useMemo(() => {
    return [...chartData]
      .sort((a, b) => b.utilizationPercentage - a.utilizationPercentage)
      .slice(0, 10);
  }, [chartData]);

  const budgetTrend = useMemo(() => {
    // This would normally come from time-series data
    // For demo, generate sample trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      approved: Math.random() * 1000000000 + 500000000,
      utilized: Math.random() * 800000000 + 200000000,
      committed: Math.random() * 600000000 + 100000000,
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.approvedAmount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all budget lines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.paidAmount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(
                data.reduce((sum, item) => sum + item.paidAmount, 0) /
                data.reduce((sum, item) => sum + item.approvedAmount, 0) * 100
              )} of approved budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.availableAmount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for commitment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Committed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.committedAmount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending obligations
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization by {groupBy.replace('_', ' ')}</CardTitle>
              <CardDescription>
                Compare approved vs utilized amounts across {groupBy.replace('_', ' ')}s
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="approvedAmount" 
                    name="Approved" 
                    fill={COLORS.approved}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="paidAmount" 
                    name="Utilized" 
                    fill={COLORS.paid}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Utilization by Category</CardTitle>
                <CardDescription>
                  Budget utilization across expense categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={utilizationByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${formatPercentage(percentage)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="utilized"
                    >
                      {utilizationByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Utilized']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
                  Detailed breakdown by expense category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {utilizationByCategory.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant={category.percentage > 80 ? 'destructive' : 'default'}>
                        {formatPercentage(category.percentage)}
                      </Badge>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Utilized: {formatCurrency(category.utilized, true)}</span>
                      <span>Total: {formatCurrency(category.value, true)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Trend Analysis</CardTitle>
              <CardDescription>
                Monthly budget approval and utilization trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={budgetTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="approved" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Approved"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="committed" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Committed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="utilized" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    name="Utilized"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Budget Utilizers</CardTitle>
              <CardDescription>
                Organizations with highest budget utilization rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUtilizers.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.paidAmount)} of {formatCurrency(item.approvedAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          item.utilizationPercentage > 90 ? 'destructive' :
                          item.utilizationPercentage > 70 ? 'default' : 'secondary'
                        }
                      >
                        {formatPercentage(item.utilizationPercentage)}
                      </Badge>
                      <div className="mt-1 w-20">
                        <Progress value={item.utilizationPercentage} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}