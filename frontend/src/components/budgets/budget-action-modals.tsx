'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
    Calendar,
    DollarSign,
    Building2,
    FileText,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Edit,
    Eye,
    Download,
    Trash2,
    Save,
    X,
} from 'lucide-react';

// Edit Budget Modal
export function EditBudgetModal({
    isOpen,
    onClose,
    budget,
    onSave,
}: {
    isOpen: boolean;
    onClose: () => void;
    budget: any;
    onSave: (updatedBudget: any) => void;
}) {
    const [formData, setFormData] = useState({
        title: budget?.title || '',
        description: budget?.description || '',
        amount: budget?.amount || '',
        startDate: budget?.startDate || '',
        endDate: budget?.endDate || '',
        status: budget?.status || 'draft',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...budget, ...formData });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Budget
                    </DialogTitle>
                    <DialogDescription>
                        Update the budget information below. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Budget Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter budget title"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₦)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter budget description"
                            rows={3}
                            required
                        />
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Budget Details Modal
export function BudgetDetailsModal({
    isOpen,
    onClose,
    budget,
}: {
    isOpen: boolean;
    onClose: () => void;
    budget: any;
}) {
    if (!budget) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Budget Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information about the selected budget.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Budget Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Budget Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Title</Label>
                                    <p className="text-lg font-semibold">{budget.title}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Amount</Label>
                                    <p className="text-lg font-semibold text-green-600">₦{budget.amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                                    <Badge variant={budget.status === 'approved' ? 'default' : 'secondary'}>
                                        {budget.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Created Date</Label>
                                    <p className="text-sm">{new Date(budget.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Budget Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="font-medium">Budget Created</p>
                                        <p className="text-sm text-gray-600">{new Date(budget.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {budget.submittedAt && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="font-medium">Submitted for Review</p>
                                            <p className="text-sm text-gray-600">{new Date(budget.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                                {budget.approvedAt && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="font-medium">Approved</p>
                                            <p className="text-sm text-gray-600">{new Date(budget.approvedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Description */}
                    {budget.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{budget.description}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>
                        <X className="h-4 w-4 mr-2" />
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Delete Budget Modal
export function DeleteBudgetModal({
    isOpen,
    onClose,
    budget,
    onDelete,
}: {
    isOpen: boolean;
    onClose: () => void;
    budget: any;
    onDelete: (budgetId: string) => void;
}) {
    const handleDelete = () => {
        onDelete(budget.id);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Budget
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{budget?.title}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Warning</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                        Deleting this budget will remove all associated data and cannot be recovered.
                    </p>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Budget
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Budget Reports Modal
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

    const generateReport = () => {
        // Mock report generation
        console.log(`Generating ${reportType} report for ${dateRange} period`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Generate Budget Report
                    </DialogTitle>
                    <DialogDescription>
                        Generate detailed reports for the selected budget.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reportType">Report Type</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="summary">Summary Report</SelectItem>
                                    <SelectItem value="detailed">Detailed Report</SelectItem>
                                    <SelectItem value="variance">Variance Analysis</SelectItem>
                                    <SelectItem value="forecast">Forecast Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateRange">Date Range</Label>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="current">Current Period</SelectItem>
                                    <SelectItem value="previous">Previous Period</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-800">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Report Preview</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                            {reportType === 'summary' && 'Summary report will include budget overview, key metrics, and highlights.'}
                            {reportType === 'detailed' && 'Detailed report will include line-by-line budget analysis and comparisons.'}
                            {reportType === 'variance' && 'Variance analysis will show budget vs. actual spending and deviations.'}
                            {reportType === 'forecast' && 'Forecast report will project future budget needs and trends.'}
                        </p>
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
