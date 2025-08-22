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
import { Checkbox } from '@/components/ui/checkbox';
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
    Users,
    Target,
    PieChart,
    TrendingUp,
    Save,
    X,
    Plus,
    Trash2,
    Eye,
    Settings,
    Workflow,
} from 'lucide-react';

interface BudgetData {
    title: string;
    description: string;
    budgetType: string;
    fiscalYear: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    currency: string;
    organization: string;
    department: string;
    fundSource: string;
    priority: string;
    status: string;
    isRecurring: boolean;
    hasWorkflow: boolean;
    requiresApproval: boolean;
    budgetLines: BudgetLine[];
    notes: string;
}

interface BudgetLine {
    id: string;
    category: string;
    subcategory: string;
    description: string;
    amount: number;
    unit: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export function CreateBudgetModal({
    isOpen,
    onClose,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (budget: BudgetData) => void;
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<BudgetData>({
        title: '',
        description: '',
        budgetType: 'operational',
        fiscalYear: '2025',
        startDate: '',
        endDate: '',
        totalAmount: 0,
        currency: 'NGN',
        organization: 'Ministry of Finance',
        department: 'Administration',
        fundSource: 'general',
        priority: 'normal',
        status: 'draft',
        isRecurring: false,
        hasWorkflow: true,
        requiresApproval: true,
        budgetLines: [],
        notes: '',
    });

    const [budgetLine, setBudgetLine] = useState<Omit<BudgetLine, 'id' | 'total'>>({
        category: '',
        subcategory: '',
        description: '',
        amount: 0,
        unit: '',
        quantity: 1,
        unitPrice: 0,
    });

    const budgetTypes = [
        { value: 'operational', label: 'Operational Budget', description: 'Day-to-day operational expenses' },
        { value: 'capital', label: 'Capital Budget', description: 'Long-term investments and assets' },
        { value: 'project', label: 'Project Budget', description: 'Specific project-based budgets' },
        { value: 'recurrent', label: 'Recurrent Budget', description: 'Regular recurring expenses' },
    ];

    const organizations = [
        'Ministry of Finance',
        'Ministry of Health',
        'Ministry of Education',
        'Ministry of Works',
        'Ministry of Agriculture',
        'Ministry of Transport',
    ];

    const departments = [
        'Administration',
        'Finance',
        'Human Resources',
        'Information Technology',
        'Operations',
        'Procurement',
        'Legal',
        'Communications',
    ];

    const fundSources = [
        { value: 'general', label: 'General Fund', description: 'Main government revenue' },
        { value: 'special', label: 'Special Fund', description: 'Designated purpose funds' },
        { value: 'federal', label: 'Federal Allocation', description: 'Federal government transfers' },
        { value: 'donor', label: 'Donor Funding', description: 'International donor support' },
    ];

    const priorities = [
        { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
        { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
        { value: 'high', label: 'High', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800' },
        { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
    ];

    // Helper function to ensure values are never empty strings
    const getValidValue = (value: string) => value || 'default';

    const handleInputChange = (field: keyof BudgetData, value: any) => {
        // Ensure we never set empty strings for select fields
        if (field === 'budgetType' || field === 'fiscalYear' || field === 'currency' || 
            field === 'fundSource' || field === 'priority' || field === 'status') {
            value = value || 'default';
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addBudgetLine = () => {
        if (budgetLine.category && budgetLine.description && budgetLine.amount > 0) {
            const newLine: BudgetLine = {
                ...budgetLine,
                id: Date.now().toString(),
                total: budgetLine.quantity * budgetLine.unitPrice,
            };
            setFormData(prev => ({
                ...prev,
                budgetLines: [...prev.budgetLines, newLine],
                totalAmount: prev.totalAmount + newLine.total,
            }));
            setBudgetLine({
                category: '',
                subcategory: '',
                description: '',
                amount: 0,
                unit: '',
                quantity: 1,
                unitPrice: 0,
            });
        }
    };

    const removeBudgetLine = (id: string) => {
        const line = formData.budgetLines.find(l => l.id === id);
        if (line) {
            setFormData(prev => ({
                ...prev,
                budgetLines: prev.budgetLines.filter(l => l.id !== id),
                totalAmount: prev.totalAmount - line.total,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const getStepIcon = (step: number) => {
        if (step < currentStep) return CheckCircle;
        if (step === currentStep) return Eye;
        return Circle;
    };

    const getStepColor = (step: number) => {
        if (step < currentStep) return 'text-green-600';
        if (step === currentStep) return 'text-blue-600';
        return 'text-gray-400';
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Create New Budget
                    </DialogTitle>
                    <DialogDescription>
                        Create a comprehensive budget with detailed allocation and workflow settings.
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6">
                    {[1, 2, 3, 4].map((step) => {
                        const IconComponent = getStepIcon(step);
                        return (
                            <div key={step} className="flex items-center gap-2">
                                <div className={`p-2 rounded-full ${getStepColor(step)}`}>
                                    <IconComponent className="h-5 w-5" />
                                </div>
                                <span className={`text-sm font-medium ${getStepColor(step)}`}>
                                    {step === 1 && 'Basic Info'}
                                    {step === 2 && 'Allocation'}
                                    {step === 3 && 'Settings'}
                                    {step === 4 && 'Review'}
                                </span>
                                {step < 4 && <div className="w-16 h-0.5 bg-gray-300" />}
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Budget Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Enter budget title"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="budgetType">Budget Type *</Label>
                                    <Select value={formData.budgetType || 'operational'} onValueChange={(value) => handleInputChange('budgetType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select budget type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {budgetTypes.filter(type => type.value && type.value.trim() !== '').map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div>
                                                        <div className="font-medium">{type.label}</div>
                                                        <div className="text-sm text-gray-500">{type.description}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe the budget purpose and scope"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fiscalYear">Fiscal Year *</Label>
                                    <Select value={formData.fiscalYear || '2025'} onValueChange={(value) => handleInputChange('fiscalYear', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2026">2026</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date *</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="organization">Organization *</Label>
                                    <Select value={formData.organization || 'Ministry of Finance'} onValueChange={(value) => handleInputChange('organization', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {organizations.filter(org => org && org.trim() !== '').map((org) => (
                                                <SelectItem key={org} value={org}>{org}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department *</Label>
                                    <Select value={formData.department || 'Administration'} onValueChange={(value) => handleInputChange('department', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.filter(dept => dept && dept.trim() !== '').map((dept) => (
                                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Budget Allocation */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency *</Label>
                                    <Select value={formData.currency || 'NGN'} onValueChange={(value) => handleInputChange('currency', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                                            <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                            <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fundSource">Fund Source *</Label>
                                    <Select value={formData.fundSource || 'general'} onValueChange={(value) => handleInputChange('fundSource', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fund source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fundSources.filter(source => source.value && source.value.trim() !== '').map((source) => (
                                                <SelectItem key={source.value} value={source.value}>
                                                    <div>
                                                        <div className="font-medium">{source.label}</div>
                                                        <div className="text-sm text-gray-500">{source.description}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Budget Lines</Label>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Add Budget Line Items</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-4 gap-2">
                                            <Input
                                                placeholder="Category"
                                                value={budgetLine.category}
                                                onChange={(e) => setBudgetLine(prev => ({ ...prev, category: e.target.value }))}
                                            />
                                            <Input
                                                placeholder="Subcategory"
                                                value={budgetLine.subcategory}
                                                onChange={(e) => setBudgetLine(prev => ({ ...prev, subcategory: e.target.value }))}
                                            />
                                            <Input
                                                placeholder="Description"
                                                value={budgetLine.description}
                                                onChange={(e) => setBudgetLine(prev => ({ ...prev, description: e.target.value }))}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Amount"
                                                value={budgetLine.amount}
                                                onChange={(e) => setBudgetLine(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                            />
                                        </div>
                                        <Button type="button" onClick={addBudgetLine} className="w-full">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Budget Line
                                        </Button>
                                    </CardContent>
                                </Card>

                                {formData.budgetLines.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Budget Line Items</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {formData.budgetLines.map((line) => (
                                                    <div key={line.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="font-medium">{line.category} - {line.subcategory}</div>
                                                            <div className="text-sm text-gray-600">{line.description}</div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary">
                                                                {formData.currency} {line.amount.toLocaleString()}
                                                            </Badge>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeBudgetLine(line.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Total Budget:</span>
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {formData.currency} {formData.totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Settings */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority Level *</Label>
                                    <Select value={formData.priority || 'normal'} onValueChange={(value) => handleInputChange('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorities.filter(priority => priority.value && priority.value.trim() !== '').map((priority) => (
                                                <SelectItem key={priority.value} value={priority.value}>
                                                    <Badge className={priority.color}>{priority.label}</Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Initial Status</Label>
                                    <Select value={formData.status || 'draft'} onValueChange={(value) => handleInputChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="pending">Pending Review</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Budget Settings</Label>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isRecurring"
                                            checked={formData.isRecurring}
                                            onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
                                        />
                                        <Label htmlFor="isRecurring">This is a recurring budget</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="hasWorkflow"
                                            checked={formData.hasWorkflow}
                                            onCheckedChange={(checked) => handleInputChange('hasWorkflow', checked)}
                                        />
                                        <Label htmlFor="hasWorkflow">Enable workflow approval process</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="requiresApproval"
                                            checked={formData.requiresApproval}
                                            onCheckedChange={(checked) => handleInputChange('requiresApproval', checked)}
                                        />
                                        <Label htmlFor="requiresApproval">Requires management approval</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="Any additional notes or special requirements"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Budget Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Title</Label>
                                            <p className="font-medium">{formData.title}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Budget Type</Label>
                                            <p className="font-medium">{budgetTypes.find(t => t.value === formData.budgetType)?.label}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Fiscal Year</Label>
                                            <p className="font-medium">{formData.fiscalYear}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {formData.currency} {formData.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Organization</Label>
                                            <p className="font-medium">{formData.organization}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Department</Label>
                                            <p className="font-medium">{formData.department}</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Description</Label>
                                        <p className="text-gray-700">{formData.description}</p>
                                    </div>

                                    {formData.budgetLines.length > 0 && (
                                        <>
                                            <Separator />
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Budget Lines ({formData.budgetLines.length})</Label>
                                                <div className="mt-2 space-y-2">
                                                    {formData.budgetLines.map((line) => (
                                                        <div key={line.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                            <span className="text-sm">{line.category} - {line.subcategory}</span>
                                                            <Badge variant="secondary">
                                                                {formData.currency} {line.amount.toLocaleString()}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <DialogFooter className="flex justify-between">
                        <div className="flex gap-2">
                            {currentStep > 1 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Previous
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {currentStep < 4 ? (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit">
                                    <Save className="h-4 w-4 mr-2" />
                                    Create Budget
                                </Button>
                            )}
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Helper component for step icons
function Circle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
    );
}
