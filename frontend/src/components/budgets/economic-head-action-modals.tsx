'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Eye,
    Edit,
    Download,
    Trash2,
    Save,
    X,
    AlertTriangle,
    BarChart3,
    DollarSign,
    Copy,
} from 'lucide-react';

// View Details Modal
export function ViewDetailsModal({
    isOpen,
    onClose,
    economicHead,
}: {
    isOpen: boolean;
    onClose: () => void;
    economicHead: any;
}) {
    if (!economicHead) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Economic Head Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information about the selected economic head.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                                    <p className="text-lg font-semibold">{economicHead.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">MDA</Label>
                                    <p className="text-sm">{economicHead.mda}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                                    <p className="text-sm">{economicHead.category}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Budget Cycle</Label>
                                    <p className="text-sm">{economicHead.budgetCycle}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Allocated Amount</Label>
                                    <p className="text-lg font-semibold text-green-600">₦{economicHead.allocatedAmount?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Utilized Amount</Label>
                                    <p className="text-sm">₦{economicHead.utilizedAmount?.toLocaleString() || '0'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {economicHead.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{economicHead.description}</p>
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

// Edit Economic Head Modal
export function EditEconomicHeadModal({
    isOpen,
    onClose,
    economicHead,
    onSave,
    mdas,
    categories,
    budgetCycles,
}: {
    isOpen: boolean;
    onClose: () => void;
    economicHead: any;
    onSave: (updatedData: any) => void;
    mdas: string[];
    categories: string[];
    budgetCycles: string[];
}) {
    const [formData, setFormData] = useState({
        name: economicHead?.name || '',
        mda: economicHead?.mda || '',
        category: economicHead?.category || '',
        budgetCycle: economicHead?.budgetCycle || '',
        allocatedAmount: economicHead?.allocatedAmount || 0,
        description: economicHead?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...economicHead, ...formData });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Economic Head
                    </DialogTitle>
                    <DialogDescription>
                        Update the economic head information below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Economic Head Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter economic head name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mda">MDA</Label>
                            <Select value={formData.mda} onValueChange={(value) => setFormData({ ...formData, mda: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select MDA" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mdas.map((mda) => (
                                        <SelectItem key={mda} value={mda}>
                                            {mda}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budgetCycle">Budget Cycle</Label>
                            <Select value={formData.budgetCycle} onValueChange={(value) => setFormData({ ...formData, budgetCycle: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select budget cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budgetCycles.map((cycle) => (
                                        <SelectItem key={cycle} value={cycle}>
                                            {cycle}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allocatedAmount">Allocated Amount (₦)</Label>
                        <Input
                            id="allocatedAmount"
                            type="number"
                            value={formData.allocatedAmount}
                            onChange={(e) => setFormData({ ...formData, allocatedAmount: Number(e.target.value) })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description"
                            rows={3}
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

// Edit Economic Head Modal
export function EditModal({
    isOpen,
    onClose,
    economicHead,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    economicHead: any;
    onSubmit: (data: any) => void;
}) {
    const [formData, setFormData] = useState({
        name: economicHead?.name || '',
        mda: economicHead?.mda || '',
        category: economicHead?.category || '',
        budgetCycle: economicHead?.budgetCycle || '',
        allocatedAmount: economicHead?.allocatedAmount || 0,
        description: economicHead?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    // Mock data - replace with actual API calls
    const mdas = ['Ministry of Health', 'Ministry of Works', 'Ministry of Education', 'Ministry of Finance'];
    const categories = ['Recurrent', 'Capital', 'Personnel', 'Overhead'];
    const budgetCycles = ['2024', '2025', '2026'];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Economic Head
                    </DialogTitle>
                    <DialogDescription>
                        Update the economic head information and budget allocation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Economic Head Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter economic head name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mda">MDA</Label>
                            <Select value={formData.mda} onValueChange={(value) => setFormData({ ...formData, mda: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select MDA" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mdas.map((mda) => (
                                        <SelectItem key={mda} value={mda}>
                                            {mda}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budgetCycle">Budget Cycle</Label>
                            <Select value={formData.budgetCycle} onValueChange={(value) => setFormData({ ...formData, budgetCycle: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select budget cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budgetCycles.map((cycle) => (
                                        <SelectItem key={cycle} value={cycle}>
                                            {cycle}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allocatedAmount">Allocated Amount (₦)</Label>
                        <Input
                            id="allocatedAmount"
                            type="number"
                            value={formData.allocatedAmount}
                            onChange={(e) => setFormData({ ...formData, allocatedAmount: Number(e.target.value) })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description"
                            rows={3}
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

// Delete Economic Head Modal
export function DeleteEconomicHeadModal({
    isOpen,
    onClose,
    economicHead,
    onDelete,
}: {
    isOpen: boolean;
    onClose: () => void;
    economicHead: any;
    onDelete: (id: string) => void;
}) {
    const handleDelete = () => {
        onDelete(economicHead.id);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Economic Head
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{economicHead?.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Warning</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                        Deleting this economic head will remove all associated data and cannot be recovered.
                    </p>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Economic Head
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Adjust Budget Modal
export function AdjustBudgetModal({
    isOpen,
    onClose,
    economicHead,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    economicHead: any;
    onSubmit: (data: any) => void;
}) {
    const [formData, setFormData] = useState({
        allocatedAmount: economicHead?.allocatedAmount || 0,
        reason: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Adjust Budget Allocation
                    </DialogTitle>
                    <DialogDescription>
                        Adjust the budget allocation for {economicHead?.name}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="allocatedAmount">New Allocated Amount (₦)</Label>
                        <Input
                            id="allocatedAmount"
                            type="number"
                            value={formData.allocatedAmount}
                            onChange={(e) => setFormData({ ...formData, allocatedAmount: Number(e.target.value) })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Adjustment</Label>
                        <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="budget_reallocation">Budget Reallocation</SelectItem>
                                <SelectItem value="emergency_funding">Emergency Funding</SelectItem>
                                <SelectItem value="performance_adjustment">Performance Adjustment</SelectItem>
                                <SelectItem value="policy_change">Policy Change</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Provide detailed explanation for the budget adjustment"
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Adjust Budget
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Duplicate Economic Head Modal
export function DuplicateModal({
    isOpen,
    onClose,
    economicHead,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    economicHead: any;
    onSubmit: (data: any) => void;
}) {
    const [formData, setFormData] = useState({
        name: `${economicHead?.name} (Copy)`,
        mda: economicHead?.mda || '',
        category: economicHead?.category || '',
        budgetCycle: economicHead?.budgetCycle || '',
        allocatedAmount: economicHead?.allocatedAmount || 0,
        description: economicHead?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    // Mock data - replace with actual API calls
    const mdas = ['Ministry of Health', 'Ministry of Works', 'Ministry of Education', 'Ministry of Finance'];
    const categories = ['Recurrent', 'Capital', 'Personnel', 'Overhead'];
    const budgetCycles = ['2024', '2025', '2026'];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Copy className="h-5 w-5" />
                        Duplicate Economic Head
                    </DialogTitle>
                    <DialogDescription>
                        Create a copy of {economicHead?.name} with new settings.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Economic Head Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter economic head name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mda">MDA</Label>
                            <Select value={formData.mda} onValueChange={(value) => setFormData({ ...formData, mda: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select MDA" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mdas.map((mda) => (
                                        <SelectItem key={mda} value={mda}>
                                            {mda}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budgetCycle">Budget Cycle</Label>
                            <Select value={formData.budgetCycle} onValueChange={(value) => setFormData({ ...formData, budgetCycle: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select budget cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budgetCycles.map((cycle) => (
                                        <SelectItem key={cycle} value={cycle}>
                                            {cycle}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allocatedAmount">Allocated Amount (₦)</Label>
                        <Input
                            id="allocatedAmount"
                            type="number"
                            value={formData.allocatedAmount}
                            onChange={(e) => setFormData({ ...formData, allocatedAmount: Number(e.target.value) })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter economic head description"
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="h-4 w-5 mr-2" />
                            Duplicate Economic Head
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Generate Report Modal
export function GenerateReportModal({
    isOpen,
    onClose,
    economicHead,
}: {
    isOpen: boolean;
    onClose: () => void;
    economicHead: any;
}) {
    const [reportType, setReportType] = useState('utilization');
    const [dateRange, setDateRange] = useState('current');

    const generateReport = () => {
        console.log(`Generating ${reportType} report for ${economicHead?.name} in ${dateRange} period`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Generate Report
                    </DialogTitle>
                    <DialogDescription>
                        Generate detailed reports for the selected economic head.
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
                                    <SelectItem value="utilization">Utilization Report</SelectItem>
                                    <SelectItem value="variance">Variance Analysis</SelectItem>
                                    <SelectItem value="performance">Performance Report</SelectItem>
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
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-800">
                            <BarChart3 className="h-4 w-4" />
                            <span className="text-sm font-medium">Report Preview</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                            {reportType === 'utilization' && 'Utilization report will show budget allocation vs. actual spending.'}
                            {reportType === 'variance' && 'Variance analysis will highlight budget deviations and trends.'}
                            {reportType === 'performance' && 'Performance report will include key metrics and KPIs.'}
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
