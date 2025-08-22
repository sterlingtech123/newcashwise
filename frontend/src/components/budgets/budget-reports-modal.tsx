'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Download,
    FileText,
    BarChart3,
    PieChart,
    TrendingUp,
    Calendar,
    DollarSign,
    X,
    Eye,
    Filter,
    CheckCircle,
} from 'lucide-react';
import { Label } from '@/components/ui/label';

export function BudgetReportsModal({
    isOpen,
    onClose,
    budget,
}: {
    isOpen: boolean;
    onClose: () => void;
    budget: any;
}) {
    const [reportType, setReportType] = useState('summary');
    const [dateRange, setDateRange] = useState('current');
    const [format, setFormat] = useState('pdf');

    const generateReport = () => {
        // Mock report generation
        console.log(`Generating ${reportType} report for ${dateRange} period in ${format} format`);
        
        // Simulate report generation delay
        setTimeout(() => {
            if (format === 'csv') {
                generateCSVReport();
            } else if (format === 'excel') {
                generateExcelReport();
            } else {
                generatePDFReport();
            }
        }, 1000);
    };

    const generateCSVReport = () => {
        const headers = [
            'Report Type',
            'Date Range',
            'Generated Date',
            'Budget Module',
            'Status',
            'Amount',
            'Utilization'
        ];

        const rows = [
            [reportType, dateRange, new Date().toLocaleDateString(), 'Economic Heads', 'Active', '₦2.5B', '78%'],
            [reportType, dateRange, new Date().toLocaleDateString(), 'Budget Creation', 'Active', '₦1.8B', '65%'],
            [reportType, dateRange, new Date().toLocaleDateString(), 'Budget Cycles', 'Active', '₦4.2B', '82%'],
            [reportType, dateRange, new Date().toLocaleDateString(), 'Capital Projects', 'Planning', '₦3.1B', '45%'],
            [reportType, dateRange, new Date().toLocaleDateString(), 'Budget Reports', 'Active', '₦0.0B', '100%']
        ];

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        downloadFile(csvContent, `budget-${reportType}-report-${dateRange}.csv`, 'text/csv');
    };

    const generateExcelReport = () => {
        // Mock Excel generation - in a real app, you'd use a library like xlsx
        alert('Excel export would be generated here. In a real application, this would create an .xlsx file.');
    };

    const generatePDFReport = () => {
        // Mock PDF generation - in a real app, you'd use a library like jsPDF
        alert('PDF export would be generated here. In a real application, this would create a .pdf file.');
    };

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reportTypes = [
        { value: 'summary', label: 'Summary Report', icon: FileText, description: 'Budget overview and key metrics' },
        { value: 'detailed', label: 'Detailed Report', icon: BarChart3, description: 'Line-by-line budget analysis' },
        { value: 'variance', label: 'Variance Analysis', icon: TrendingUp, description: 'Budget vs. actual spending' },
        { value: 'forecast', label: 'Forecast Report', icon: PieChart, description: 'Future budget projections' },
    ];

    const dateRanges = [
        { value: 'current', label: 'Current Period' },
        { value: 'previous', label: 'Previous Period' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    const formats = [
        { value: 'pdf', label: 'PDF' },
        { value: 'excel', label: 'Excel' },
        { value: 'csv', label: 'CSV' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Generate Budget Report
                    </DialogTitle>
                    <DialogDescription>
                        Generate comprehensive reports for the selected budget with customizable options.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Report Type Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Report Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {reportTypes.map((type) => {
                                const IconComponent = type.icon;
                                return (
                                    <Card
                                        key={type.value}
                                        className={`cursor-pointer transition-all hover:shadow-md ${reportType === type.value
                                            ? 'ring-2 ring-blue-500 bg-blue-50'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => setReportType(type.value)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <IconComponent className="h-5 w-5 text-blue-600 mt-0.5" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{type.label}</h4>
                                                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Report Configuration */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Date Range</Label>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dateRanges.map((range) => (
                                        <SelectItem key={range.value} value={range.value}>
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Export Format</Label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    {formats.map((fmt) => (
                                        <SelectItem key={fmt.value} value={fmt.value}>
                                            {fmt.value.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Budget</Label>
                            <div className="p-3 bg-gray-50 rounded-md border">
                                <p className="text-sm font-medium">{budget?.title || 'Selected Budget'}</p>
                                <p className="text-xs text-gray-600">
                                    {budget?.amount ? `₦${budget.amount.toLocaleString()}` : 'Amount not specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Report Preview */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Report Preview</Label>
                        <Card>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Report Type:</span>
                                        <Badge variant="outline">
                                            {reportTypes.find(t => t.value === reportType)?.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Date Range:</span>
                                        <Badge variant="outline">
                                            {dateRanges.find(d => d.value === dateRange)?.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Export Format:</span>
                                        <Badge variant="outline">
                                            {format.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Budget:</span>
                                        <span className="text-sm text-gray-600">{budget?.title || 'N/A'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Report Features */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Report Features</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Executive summary with key insights
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Detailed budget breakdown
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Visual charts and graphs
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Exportable in multiple formats
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={generateReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
