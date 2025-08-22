'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    FileText,
    Building2,
    DollarSign,
    Calculator,
    Save,
    X,
} from 'lucide-react';

interface EconomicLineItemData {
    budgetCycle: string;
    mda: string;
    organizationCode: string;
    economicHead: string;
    economicLineItem: string;
    category: string;
    allocationAmount: number;
    description: string;
    economicCode: string;
    functionCode: string;
    fundCode: string;
}

interface CreateEconomicLineItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EconomicLineItemData) => void;
    budgetCycles: string[];
    mdas: string[];
    organizationCodes: string[];
    economicHeads: string[];
    economicLineItems: string[];
    categories: string[];
    economicCodes: string[];
    functionCodes: string[];
    fundCodes: string[];
}

export function CreateEconomicLineItemModal({
    isOpen,
    onClose,
    onSave,
    budgetCycles,
    mdas,
    organizationCodes,
    economicHeads,
    economicLineItems,
    categories,
    economicCodes,
    functionCodes,
    fundCodes,
}: CreateEconomicLineItemModalProps) {
    const [formData, setFormData] = useState<EconomicLineItemData>({
        budgetCycle: '',
        mda: '',
        organizationCode: '',
        economicHead: '',
        economicLineItem: '',
        category: '',
        allocationAmount: 0,
        description: '',
        economicCode: '',
        functionCode: '',
        fundCode: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof formData.allocationAmount === 'number') {
            onSave(formData);
            onClose();
        }
    };

    const handleInputChange = (field: keyof EconomicLineItemData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'allocationAmount' ? Number(value) : value
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Create Economic Line Item
                    </DialogTitle>
                    <DialogDescription>
                        Create a new economic line item for detailed budget breakdown.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budgetCycle">Budget Cycle</Label>
                            <Select value={formData.budgetCycle} onValueChange={(value) => handleInputChange('budgetCycle', value)}>
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
                        <div className="space-y-2">
                            <Label htmlFor="mda">MDA</Label>
                            <Select value={formData.mda} onValueChange={(value) => handleInputChange('mda', value)}>
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
                            <Label htmlFor="organizationCode">Organization Code</Label>
                            <Select value={formData.organizationCode} onValueChange={(value) => handleInputChange('organizationCode', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select organization code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizationCodes.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="economicHead">Economic Head</Label>
                            <Select value={formData.economicHead} onValueChange={(value) => handleInputChange('economicHead', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select economic head" />
                                </SelectTrigger>
                                <SelectContent>
                                    {economicHeads.map((head) => (
                                        <SelectItem key={head} value={head}>
                                            {head}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="economicLineItem">Economic Line Item</Label>
                            <Select value={formData.economicLineItem} onValueChange={(value) => handleInputChange('economicLineItem', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select economic line item" />
                                </SelectTrigger>
                                <SelectContent>
                                    {economicLineItems.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allocationAmount">Allocation Amount (₦)</Label>
                        <Input
                            id="allocationAmount"
                            type="number"
                            value={formData.allocationAmount}
                            onChange={(e) => handleInputChange('allocationAmount', e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Economic Line Item Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter detailed description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="economicCode">Economic Code</Label>
                            <Select value={formData.economicCode} onValueChange={(value) => handleInputChange('economicCode', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select economic code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {economicCodes.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="functionCode">Function Code</Label>
                            <Select value={formData.functionCode} onValueChange={(value) => handleInputChange('functionCode', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select function code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {functionCodes.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fundCode">Fund Code</Label>
                            <Select value={formData.fundCode} onValueChange={(value) => handleInputChange('fundCode', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select fund code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fundCodes.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Create Economic Line Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
