'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    X,
    Plus,
    Upload,
    FileText,
    Calendar,
    DollarSign,
    Building2,
    User,
    CreditCard,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

interface CreatePaymentRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PaymentRequestFormData) => void;
    requestTypes: PaymentRequestType[];
    priorities: PaymentRequestPriority[];
}

interface PaymentRequestFormData {
    requestType: string;
    priority: string;
    projectTitle: string;
    description: string;
    justification: string;
    amount: number;
    beneficiaryName: string;
    beneficiaryBank: string;
    beneficiaryAccount: string;
    beneficiaryPhone: string;
    beneficiaryEmail: string;
    dueDate: string;
    expectedCompletionDate: string;
    departmentName: string;
    isEmergency: boolean;
    isBudgeted: boolean;
    budgetLine: string;
    accountCode: string;
    attachments: File[];
}

interface PaymentRequestType {
    id: string;
    name: string;
    category: string;
    description: string;
    requiresApproval: boolean;
    approvalLevel: string;
    maxAmount: number;
}

interface PaymentRequestPriority {
    id: string;
    name: string;
    description: string;
    color: string;
    slaHours: number;
}

export default function CreatePaymentRequestModal({
    isOpen,
    onClose,
    onSubmit,
    requestTypes,
    priorities
}: CreatePaymentRequestModalProps) {
    const [formData, setFormData] = useState<PaymentRequestFormData>({
        requestType: '',
        priority: 'normal',
        projectTitle: '',
        description: '',
        justification: '',
        amount: 0,
        beneficiaryName: '',
        beneficiaryBank: '',
        beneficiaryAccount: '',
        beneficiaryPhone: '',
        beneficiaryEmail: '',
        dueDate: '',
        expectedCompletionDate: '',
        departmentName: '',
        isEmergency: false,
        isBudgeted: true,
        budgetLine: '',
        accountCode: '',
        attachments: []
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const totalSteps = 4;

    const handleInputChange = (field: keyof PaymentRequestFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        switch (step) {
            case 1:
                if (!formData.requestType) newErrors.requestType = 'Request type is required';
                if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Project title is required';
                if (!formData.description.trim()) newErrors.description = 'Description is required';
                if (!formData.justification.trim()) newErrors.justification = 'Justification is required';
                if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
                break;
            case 2:
                if (!formData.beneficiaryName.trim()) newErrors.beneficiaryName = 'Beneficiary name is required';
                if (!formData.beneficiaryBank.trim()) newErrors.beneficiaryBank = 'Bank name is required';
                if (!formData.beneficiaryAccount.trim()) newErrors.beneficiaryAccount = 'Account number is required';
                if (!formData.beneficiaryPhone.trim()) newErrors.beneficiaryPhone = 'Phone number is required';
                if (!formData.beneficiaryEmail.trim()) newErrors.beneficiaryEmail = 'Email is required';
                break;
            case 3:
                if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
                if (!formData.expectedCompletionDate) newErrors.expectedCompletionDate = 'Expected completion date is required';
                if (!formData.departmentName.trim()) newErrors.departmentName = 'Department is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = () => {
        if (validateStep(currentStep)) {
            onSubmit(formData);
        }
    };

    const getStepStatus = (step: number) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        return 'pending';
    };

    const getStepIcon = (step: number) => {
        const status = getStepStatus(step);
        if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-600" />;
        if (status === 'current') return <Clock className="w-5 h-5 text-blue-600" />;
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create Payment Request</h2>
                        <p className="text-gray-600 mt-1">Fill in the details to create a new payment request</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className="flex items-center">
                                    {getStepIcon(step)}
                                    <span className={`ml-2 text-sm font-medium ${getStepStatus(step) === 'current' ? 'text-blue-600' :
                                        getStepStatus(step) === 'completed' ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                        {step === 1 && 'Basic Info'}
                                        {step === 2 && 'Beneficiary'}
                                        {step === 3 && 'Timeline'}
                                        {step === 4 && 'Review'}
                                    </span>
                                </div>
                                {step < 4 && (
                                    <div className={`w-16 h-0.5 mx-4 ${getStepStatus(step + 1) === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="requestType">Request Type *</Label>
                                    <Select value={formData.requestType} onValueChange={(value) => handleInputChange('requestType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select request type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {requestTypes.map(type => (
                                                <SelectItem key={type.id} value={type.name}>
                                                    <div>
                                                        <div className="font-medium">{type.name}</div>
                                                        <div className="text-sm text-gray-500">{type.description}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.requestType && <p className="text-sm text-red-600">{errors.requestType}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority *</Label>
                                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorities.map(priority => (
                                                <SelectItem key={priority.id} value={priority.name.toLowerCase()}>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`bg-${priority.color}-100 text-${priority.color}-800 border-${priority.color}-200`}
                                                        >
                                                            {priority.name}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">({priority.slaHours}h SLA)</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectTitle">Project Title *</Label>
                                <Input
                                    id="projectTitle"
                                    placeholder="Enter project title"
                                    value={formData.projectTitle}
                                    onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                                />
                                {errors.projectTitle && <p className="text-sm text-red-600">{errors.projectTitle}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the project or service"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="justification">Justification *</Label>
                                <Textarea
                                    id="justification"
                                    placeholder="Explain why this payment is necessary"
                                    value={formData.justification}
                                    onChange={(e) => handleInputChange('justification', e.target.value)}
                                    rows={3}
                                />
                                {errors.justification && <p className="text-sm text-red-600">{errors.justification}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (NGN) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                                    className="text-lg font-semibold"
                                />
                                {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isEmergency"
                                        checked={formData.isEmergency}
                                        onCheckedChange={(checked) => handleInputChange('isEmergency', checked)}
                                    />
                                    <Label htmlFor="isEmergency">Emergency Request</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isBudgeted"
                                        checked={formData.isBudgeted}
                                        onCheckedChange={(checked) => handleInputChange('isBudgeted', checked)}
                                    />
                                    <Label htmlFor="isBudgeted">Budgeted Item</Label>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Beneficiary Information</h3>

                            <div className="space-y-2">
                                <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
                                <Input
                                    id="beneficiaryName"
                                    placeholder="Enter beneficiary name"
                                    value={formData.beneficiaryName}
                                    onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                                />
                                {errors.beneficiaryName && <p className="text-sm text-red-600">{errors.beneficiaryName}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryBank">Bank Name *</Label>
                                    <Input
                                        id="beneficiaryBank"
                                        placeholder="Enter bank name"
                                        value={formData.beneficiaryBank}
                                        onChange={(e) => handleInputChange('beneficiaryBank', e.target.value)}
                                    />
                                    {errors.beneficiaryBank && <p className="text-sm text-red-600">{errors.beneficiaryBank}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryAccount">Account Number *</Label>
                                    <Input
                                        id="beneficiaryAccount"
                                        placeholder="Enter account number"
                                        value={formData.beneficiaryAccount}
                                        onChange={(e) => handleInputChange('beneficiaryAccount', e.target.value)}
                                    />
                                    {errors.beneficiaryAccount && <p className="text-sm text-red-600">{errors.beneficiaryAccount}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryPhone">Phone Number *</Label>
                                    <Input
                                        id="beneficiaryPhone"
                                        placeholder="Enter phone number"
                                        value={formData.beneficiaryPhone}
                                        onChange={(e) => handleInputChange('beneficiaryPhone', e.target.value)}
                                    />
                                    {errors.beneficiaryPhone && <p className="text-sm text-red-600">{errors.beneficiaryPhone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryEmail">Email Address *</Label>
                                    <Input
                                        id="beneficiaryEmail"
                                        type="email"
                                        placeholder="Enter email address"
                                        value={formData.beneficiaryEmail}
                                        onChange={(e) => handleInputChange('beneficiaryEmail', e.target.value)}
                                    />
                                    {errors.beneficiaryEmail && <p className="text-sm text-red-600">{errors.beneficiaryEmail}</p>}
                                </div>
                            </div>

                            {formData.isBudgeted && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="budgetLine">Budget Line</Label>
                                        <Input
                                            id="budgetLine"
                                            placeholder="Enter budget line"
                                            value={formData.budgetLine}
                                            onChange={(e) => handleInputChange('budgetLine', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="accountCode">Account Code</Label>
                                        <Input
                                            id="accountCode"
                                            placeholder="Enter account code"
                                            value={formData.accountCode}
                                            onChange={(e) => handleInputChange('accountCode', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Timeline & Department</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date *</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                    />
                                    {errors.dueDate && <p className="text-sm text-red-600">{errors.dueDate}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expectedCompletionDate">Expected Completion Date *</Label>
                                    <Input
                                        id="expectedCompletionDate"
                                        type="date"
                                        value={formData.expectedCompletionDate}
                                        onChange={(e) => handleInputChange('expectedCompletionDate', e.target.value)}
                                    />
                                    {errors.expectedCompletionDate && <p className="text-sm text-red-600">{errors.expectedCompletionDate}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="departmentName">Department *</Label>
                                <Select value={formData.departmentName} onValueChange={(value) => handleInputChange('departmentName', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ministry of Health">Ministry of Health</SelectItem>
                                        <SelectItem value="Ministry of Works">Ministry of Works</SelectItem>
                                        <SelectItem value="Ministry of Finance">Ministry of Finance</SelectItem>
                                        <SelectItem value="Ministry of Education">Ministry of Education</SelectItem>
                                        <SelectItem value="Ministry of Agriculture">Ministry of Agriculture</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.departmentName && <p className="text-sm text-red-600">{errors.departmentName}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Attachments</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        Drag and drop files here, or click to select
                                    </p>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <Label htmlFor="file-upload" className="cursor-pointer">
                                        <Button variant="outline" size="sm">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Upload Files
                                        </Button>
                                    </Label>
                                </div>

                                {formData.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Uploaded Files:</Label>
                                        <div className="space-y-2">
                                            {formData.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm">{file.name}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeAttachment(index)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Request Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Request Type</Label>
                                            <p className="text-sm">{formData.requestType}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Priority</Label>
                                            <Badge variant="secondary">{formData.priority}</Badge>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Project Title</Label>
                                            <p className="text-sm">{formData.projectTitle}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Amount</Label>
                                            <p className="text-lg font-semibold text-blue-600">
                                                ₦{formData.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Beneficiary Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Name</Label>
                                            <p className="text-sm">{formData.beneficiaryName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Bank</Label>
                                            <p className="text-sm">{formData.beneficiaryBank}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Account</Label>
                                            <p className="text-sm">{formData.beneficiaryAccount}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Department</Label>
                                            <p className="text-sm">{formData.departmentName}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-900">Ready to Submit</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Please review all information carefully. Once submitted, this request will be sent for approval and cannot be edited.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                    <div className="text-sm text-gray-600">
                        Step {currentStep} of {totalSteps}
                    </div>

                    <div className="flex items-center gap-2">
                        {currentStep > 1 && (
                            <Button variant="outline" onClick={prevStep}>
                                Previous
                            </Button>
                        )}

                        {currentStep < totalSteps ? (
                            <Button onClick={nextStep}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Submit Request
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
