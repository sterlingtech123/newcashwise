'use client';

import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CashFlowData {
  date: string;
  openingBalance: number;
  inflows: number;
  outflows: number;
  closingBalance: number;
  projectedInflows: number;
  projectedOutflows: number;
  projectedBalance: number;
  confidenceLevel: number;
  scenario: 'baseline' | 'optimistic' | 'pessimistic';
}

interface CashFlowForecastProps {
  data: CashFlowData[];
  period: 'daily' | 'weekly' | 'monthly';
  forecastHorizon: number; // days
}

const SCENARIO_COLORS = {
  baseline: '#3b82f6',
  optimistic: '#10b981',
  pessimistic: '#f59e0b',
  actual: '#6366f1',
};

const CRITICAL_BALANCE_THRESHOLD = 50000000; // 50M NGN

export function CashFlowForecast({
  data,
  period,
  forecastHorizon,
}: CashFlowForecastProps) {
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true);

  const filteredData = useMemo(() => {
    return data.filter(item => item.scenario === selectedScenario);
  }, [data, selectedScenario]);

  const currentDate = new Date();
  const futureData = useMemo(() => {
    return filteredData.filter(item => new Date(item.date) > currentDate);
  }, [filteredData, currentDate]);

  const historicalData = useMemo(() => {
    return filteredData.filter(item => new Date(item.date) <= currentDate);
  }, [filteredData, currentDate]);

  const cashFlowSummary = useMemo(() => {
    const totalInflows = filteredData.reduce((sum, item) => sum + (item.inflows || 0), 0);
    const totalOutflows = filteredData.reduce((sum, item) => sum + (item.outflows || 0), 0);
    const projectedInflows = futureData.reduce((sum, item) => sum + (item.projectedInflows || 0), 0);
    const projectedOutflows = futureData.reduce((sum, item) => sum + (item.projectedOutflows || 0), 0);
    
    const currentBalance = historicalData.length > 0 
      ? historicalData[historicalData.length - 1].closingBalance 
      : 0;
    
    const projectedBalance = futureData.length > 0 
      ? futureData[futureData.length - 1].projectedBalance 
      : currentBalance;

    return {
      currentBalance,
      projectedBalance,
      totalInflows,
      totalOutflows,
      projectedInflows,
      projectedOutflows,
      netCashFlow: totalInflows - totalOutflows,
      projectedNetFlow: projectedInflows - projectedOutflows,
    };
  }, [filteredData, futureData, historicalData]);

  const criticalPeriods = useMemo(() => {
    return futureData.filter(item => 
      item.projectedBalance < CRITICAL_BALANCE_THRESHOLD
    );
  }, [futureData]);

  const scenarioComparison = useMemo(() => {
    const scenarios = ['baseline', 'optimistic', 'pessimistic'] as const;
    const endDate = futureData.length > 0 ? futureData[futureData.length - 1].date : null;
    
    if (!endDate) return [];

    return scenarios.map(scenario => {
      const scenarioData = data.filter(item => 
        item.scenario === scenario && item.date === endDate
      );
      
      return {
        scenario,
        balance: scenarioData[0]?.projectedBalance || 0,
        inflows: scenarioData[0]?.projectedInflows || 0,
        outflows: scenarioData[0]?.projectedOutflows || 0,
      };
    });
  }, [data, futureData]);

  const combinedData = useMemo(() => {
    return filteredData.map(item => ({
      ...item,
      actualBalance: new Date(item.date) <= currentDate ? item.closingBalance : null,
      forecastBalance: new Date(item.date) > currentDate ? item.projectedBalance : null,
      confidenceUpper: item.projectedBalance * (1 + (1 - item.confidenceLevel) * 0.5),
      confidenceLower: item.projectedBalance * (1 - (1 - item.confidenceLevel) * 0.5),
    }));
  }, [filteredData, currentDate]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedScenario} onValueChange={setSelectedScenario}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baseline">Baseline Scenario</SelectItem>
              <SelectItem value="optimistic">Optimistic Scenario</SelectItem>
              <SelectItem value="pessimistic">Pessimistic Scenario</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showConfidenceInterval ? 'default' : 'outline'}
            onClick={() => setShowConfidenceInterval(!showConfidenceInterval)}
          >
            Confidence Interval
          </Button>
        </div>
        
        {criticalPeriods.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {criticalPeriods.length} Critical Period{criticalPeriods.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(cashFlowSummary.currentBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              As of {formatDate(new Date())}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Balance</CardTitle>
            {cashFlowSummary.projectedBalance > cashFlowSummary.currentBalance ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(cashFlowSummary.projectedBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {forecastHorizon} days forecast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Inflows</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(cashFlowSummary.projectedInflows)}
            </div>
            <p className="text-xs text-muted-foreground">
              Next {forecastHorizon} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Outflows</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(cashFlowSummary.projectedOutflows)}
            </div>
            <p className="text-xs text-muted-foreground">
              Next {forecastHorizon} days
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecast">Cash Flow Forecast</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Comparison</TabsTrigger>
          <TabsTrigger value="analysis">Flow Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Critical Periods</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Forecast - {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario</CardTitle>
              <CardDescription>
                Historical and projected cash balances with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => formatDate(new Date(value))}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name.replace(/([A-Z])/g, ' $1').trim()
                    ]}
                    labelFormatter={(value) => formatDate(new Date(value))}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  
                  {/* Confidence interval */}
                  {showConfidenceInterval && (
                    <Area
                      dataKey="confidenceUpper"
                      fill={SCENARIO_COLORS[selectedScenario]}
                      fillOpacity={0.1}
                      stroke="none"
                      connectNulls={false}
                    />
                  )}
                  
                  {/* Historical balance */}
                  <Line
                    type="monotone"
                    dataKey="actualBalance"
                    stroke={SCENARIO_COLORS.actual}
                    strokeWidth={3}
                    name="Actual Balance"
                    connectNulls={false}
                    dot={{ r: 4 }}
                  />
                  
                  {/* Projected balance */}
                  <Line
                    type="monotone"
                    dataKey="forecastBalance"
                    stroke={SCENARIO_COLORS[selectedScenario]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Projected Balance"
                    connectNulls={false}
                    dot={{ r: 3 }}
                  />
                  
                  {/* Critical threshold line */}
                  <ReferenceLine 
                    y={CRITICAL_BALANCE_THRESHOLD} 
                    stroke="#dc2626" 
                    strokeDasharray="3 3"
                    label="Critical Level"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
              <CardDescription>
                Compare projected outcomes across different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {scenarioComparison.map((scenario) => (
                  <Card key={scenario.scenario} className={`border-2 ${
                    scenario.scenario === selectedScenario ? 'border-primary' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base capitalize">
                        {scenario.scenario} Scenario
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Projected Balance</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(scenario.balance)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Inflows</p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(scenario.inflows, true)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Outflows</p>
                          <p className="font-medium text-red-600">
                            {formatCurrency(scenario.outflows, true)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={scenario.balance < CRITICAL_BALANCE_THRESHOLD ? 'destructive' : 'default'}
                        className="w-full justify-center"
                      >
                        {scenario.balance < CRITICAL_BALANCE_THRESHOLD ? 'Critical' : 'Healthy'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of inflows and outflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => formatDate(new Date(value))}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(value) => formatDate(new Date(value))}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  
                  <Bar dataKey="inflows" fill="#10b981" name="Inflows" />
                  <Bar dataKey="outflows" fill="#f59e0b" name="Outflows" />
                  <Bar dataKey="projectedInflows" fill="#6ee7b7" name="Projected Inflows" />
                  <Bar dataKey="projectedOutflows" fill="#fcd34d" name="Projected Outflows" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Cash Flow Periods</CardTitle>
              <CardDescription>
                Periods where cash balance falls below critical threshold
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalPeriods.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No critical periods identified in the current forecast
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {criticalPeriods.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">
                            {formatDate(new Date(period.date))}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Projected balance: {formatCurrency(period.projectedBalance)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        Critical
                      </Badge>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Recommended Actions:
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Consider delaying non-essential payments</li>
                      <li>• Accelerate collection of outstanding receivables</li>
                      <li>• Review and prioritize payment schedules</li>
                      <li>• Explore short-term financing options if needed</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}