'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, Calendar } from 'lucide-react';

interface DashboardOverviewProps {
  data: {
    totalAllocated: number;
    totalSpent: number;
    available: number;
    utilizationRate: number;
    totalDepartments: number;
    activeProjects: number;
    fiscalYear: string;
  };
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-danger-600';
    if (rate >= 75) return 'text-warning-600';
    return 'text-success-600';
  };

  const getProgressVariant = (rate: number) => {
    if (rate >= 90) return 'danger' as const;
    if (rate >= 75) return 'warning' as const;
    return 'success' as const;
  };

  const getBadgeVariant = (rate: number) => {
    if (rate >= 90) return 'destructive' as const;
    if (rate >= 75) return 'warning' as const;
    return 'success' as const;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Allocated */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Allocated
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalAllocated, true)}
          </div>
          <p className="text-xs text-muted-foreground">
            Fiscal Year {data.fiscalYear}
          </p>
        </CardContent>
      </Card>

      {/* Total Spent */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spent
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(data.totalSpent, true)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(data.utilizationRate)} of allocated
          </p>
        </CardContent>
      </Card>

      {/* Available Budget */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Available
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(data.available, true)}
          </div>
          <p className="text-xs text-muted-foreground">
            Ready for commitment
          </p>
        </CardContent>
      </Card>

      {/* Utilization Rate */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Utilization Rate
          </CardTitle>
          <div className="h-4 w-4 rounded-full bg-primary/20" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={getUtilizationColor(data.utilizationRate)}>
              {formatPercentage(data.utilizationRate)}
            </span>
          </div>
          <div className="mt-2">
            <Progress 
              value={data.utilizationRate} 
              className="h-2"
              variant={getProgressVariant(data.utilizationRate)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Departments
          </CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.totalDepartments}
          </div>
          <p className="text-xs text-muted-foreground">
            Active departments
          </p>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Projects
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.activeProjects}
          </div>
          <p className="text-xs text-muted-foreground">
            Currently running
          </p>
        </CardContent>
      </Card>

      {/* Fiscal Year */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Fiscal Year
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.fiscalYear}
          </div>
          <p className="text-xs text-muted-foreground">
            Current period
          </p>
        </CardContent>
      </Card>

      {/* Status Badge */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge variant={getBadgeVariant(data.utilizationRate)}>
              {data.utilizationRate >= 90 ? 'Critical' : 
               data.utilizationRate >= 75 ? 'Warning' : 'Healthy'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Budget health indicator
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
