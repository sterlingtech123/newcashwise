'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Calendar, DollarSign, FileText } from 'lucide-react';

interface CreateEconomicCycleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EconomicCycleData) => void;
}

interface EconomicCycleData {
    name: string;
    fiscalYear: string;
    startDate: string;
    endDate: string;
    description: string;
    totalBudget: number;
}

export function CreateEconomicCycleModal({ isOpen, onClose, onSubmit }: CreateEconomicCycleModalProps) {
    const [formData, setFormData] = useState<EconomicCycleData>({
        name: '',
        fiscalYear: '',
        startDate: '',
        endDate: '',
        description: '',
        totalBudget: 0
    } satisfies EconomicCycleData);

    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.fiscalYear) newErrors.fiscalYear = 'Fiscal Year is required';
        if (!formData.startDate) newErrors.startDate = 'Start Date is required';
        if (!formData.endDate) newErrors.endDate = 'End Date is required';
        if (formData.totalBudget <= 0) newErrors.totalBudget = 'Total Budget must be greater than 0';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
        onClose();
    };

    const handleInputChange = (field: keyof EconomicCycleData, value: string | number) => {
        if (field === 'totalBudget') {
            const numValue = Number(value);
            setFormData(prev => ({ ...prev, [field]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value as string }));
        }
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            Create New Economic Cycle
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Cycle Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., 2024 Recurrent Budget Cycle"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="fiscalYear">Fiscal Year *</Label>
                                    <Select value={formData.fiscalYear} onValueChange={(value) => handleInputChange('fiscalYear', value)}>
                                        <SelectTrigger className={errors.fiscalYear ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select Fiscal Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2026">2026</SelectItem>
                                            <SelectItem value="2027">2027</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.fiscalYear && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fiscalYear}</p>
                                    )}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate">Start Date *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className={errors.startDate ? 'border-red-500' : ''}
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="endDate">End Date *</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        className={errors.endDate ? 'border-red-500' : ''}
                                    />
                                    {errors.endDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                                    )}
                                </div>
                            </div>

                            {/* Budget Information */}
                            <div>
                                <Label htmlFor="totalBudget">Total Budget (NGN) *</Label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="totalBudget"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.totalBudget}
                                        onChange={(e) => handleInputChange('totalBudget', parseFloat(e.target.value) || 0)}
                                        className={`pl-10 ${errors.totalBudget ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.totalBudget && (
                                    <p className="text-red-500 text-sm mt-1">{errors.totalBudget}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the purpose and scope of this economic cycle..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Create Economic Cycle
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
