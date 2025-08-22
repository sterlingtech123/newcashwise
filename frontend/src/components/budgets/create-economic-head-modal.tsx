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
    Calculator,
    Building2,
    DollarSign,
    Calendar,
    Save,
    X,
} from 'lucide-react';

interface EconomicHeadData {
    name: string;
    mda: string;
    category: string;
    budgetCycle: string;
    allocatedAmount: number;
    description: string;
}

interface CreateEconomicHeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EconomicHeadData) => void;
    cycleId?: string;
    cycleName?: string;
    mdas?: string[];
    categories?: string[];
    budgetCycles?: string[];
}

export function CreateEconomicHeadModal({
    isOpen,
    onClose,
    onSubmit,
    cycleId = '',
    cycleName = '',
    mdas = [],
    categories = [],
    budgetCycles = [],
}: CreateEconomicHeadModalProps) {
    const [formData, setFormData] = useState<EconomicHeadData>({
        name: '',
        mda: '',
        category: '',
        budgetCycle: '',
        allocatedAmount: 0,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof formData.allocatedAmount === 'number') {
            onSubmit(formData);
            onClose();
        }
    };

    const handleInputChange = (field: keyof EconomicHeadData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'allocatedAmount' ? Number(value) : value
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Create Economic Head
                    </DialogTitle>
                    <DialogDescription>
                        Create a new economic head for budget allocation and management.
                        {cycleName && ` (${cycleName})`}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Economic Head Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter economic head name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mda">MDA</Label>
                            <Select value={formData.mda} onValueChange={(value) => handleInputChange('mda', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select MDA" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mdas.length > 0 ? (
                                        mdas.map((mda) => (
                                            <SelectItem key={mda} value={mda}>
                                                {mda}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-mdas" disabled>
                                            No MDAs available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-categories" disabled>
                                            No categories available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budgetCycle">Budget Cycle</Label>
                            <Select value={formData.budgetCycle} onValueChange={(value) => handleInputChange('budgetCycle', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select budget cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budgetCycles.length > 0 ? (
                                        budgetCycles.map((cycle) => (
                                            <SelectItem key={cycle} value={cycle}>
                                                {cycle}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-cycles" disabled>
                                            No budget cycles available
                                        </SelectItem>
                                    )}
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
                            onChange={(e) => handleInputChange('allocatedAmount', e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
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
                            <Save className="h-4 w-4 mr-2" />
                            Create Economic Head
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
