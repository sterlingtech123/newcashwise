'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { MainNavigation } from '@/components/layout/main-navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Plus,
  Save,
  X,
  Calendar,
  Building2,
  DollarSign,
  Target,
  FileText,
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export default function CreateBudgetPage() {
  const { user } = useAuthStore();
  const [activeStep, setActiveStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Form state
  const [budgetData, setBudgetData] = useState({
    name: '',
    description: '',
    fiscalYear: '2025',
    budgetType: 'recurrent',
    totalAmount: '',
    organization: '',
    fund: '',
    function: '',
    economicHead: '',
    program: '',
    project: '',
    startDate: '',
    endDate: ''
  });

  // Mock data for dropdowns
  const organizations = [
    { id: '1', code: 'HEALTH', name: 'Health Department' },
    { id: '2', code: 'EDUCATION', name: 'Education Department' },
    { id: '3', code: 'INFRASTRUCTURE', name: 'Infrastructure Department' },
    { id: '4', code: 'FINANCE', name: 'Finance Department' }
  ];

  const funds = [
    { id: '1', code: 'GF', name: 'General Fund' },
    { id: '2', code: 'SF', name: 'Special Fund' },
    { id: '3', code: 'TF', name: 'Trust Fund' },
    { id: '4', code: 'EF', name: 'Enterprise Fund' }
  ];

  const functions = [
    { id: '1', code: 'HEALTH', name: 'Healthcare Services' },
    { id: '2', code: 'EDUCATION', name: 'Educational Services' },
    { id: '3', code: 'INFRASTRUCTURE', name: 'Infrastructure Development' },
    { id: '4', code: 'ADMINISTRATION', name: 'Administrative Services' }
  ];

  const economicHeads = [
    { id: '1', code: 'PERSONNEL', name: 'Personnel', category: 'personnel' },
    { id: '2', code: 'OVERHEAD', name: 'Overhead', category: 'overhead' },
    { id: '3', code: 'CAPITAL', name: 'Capital', category: 'capital' }
  ];

  const programs = [
    { id: '1', code: 'PHC', name: 'Primary Healthcare' },
    { id: '2', code: 'SEC', name: 'Secondary Education' },
    { id: '3', code: 'ROADS', name: 'Road Construction' }
  ];

  const projects = [
    { id: '1', code: 'HOSPITAL', name: 'New Hospital Building' },
    { id: '2', code: 'SCHOOL', name: 'School Renovation' },
    { id: '3', code: 'BRIDGE', name: 'Bridge Construction' }
  ];

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleInputChange = (field: string, value: string) => {
    setBudgetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Budget data:', budgetData);
    // Here you would typically send the data to your API
  };

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const steps = [
    { id: 1, name: 'Basic Information', description: 'Budget name and description' },
    { id: 2, name: 'Budget Structure', description: 'Organization and fund details' },
    { id: 3, name: 'Budget Lines', description: 'Detailed budget line items' },
    { id: 4, name: 'Review & Submit', description: 'Final review and submission' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <div className="lg:pl-64">
        <main className="py-8">
                          <div className="mx-auto max-w-4xl pr-4 sm:pr-6 lg:pr-8 pl-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Create New Budget
                  </h1>
                  <p className="text-gray-600">
                    Set up a new budget with proper structure and allocation
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= step.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                        }`}>
                        {step.id}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${activeStep >= step.id ? 'text-purple-600' : 'text-gray-500'
                          }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-400">{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${activeStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                          }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {activeStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Budget Name *</Label>
                        <Input
                          id="name"
                          value={budgetData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter budget name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="fiscalYear">Fiscal Year *</Label>
                        <select
                          id="fiscalYear"
                          value={budgetData.fiscalYear}
                          onChange={(e) => handleInputChange('fiscalYear', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        value={budgetData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter budget description"
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="budgetType">Budget Type *</Label>
                        <select
                          id="budgetType"
                          value={budgetData.budgetType}
                          onChange={(e) => handleInputChange('budgetType', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="recurrent">Recurrent</option>
                          <option value="capital">Capital</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="totalAmount">Total Amount (NGN) *</Label>
                        <Input
                          id="totalAmount"
                          type="number"
                          value={budgetData.totalAmount}
                          onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={budgetData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={budgetData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Budget Structure */}
              {activeStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Budget Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="organization">Organization *</Label>
                        <select
                          id="organization"
                          value={budgetData.organization}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Organization</option>
                          {organizations.map(org => (
                            <option key={org.id} value={org.id}>
                              {org.code} - {org.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="fund">Fund *</Label>
                        <select
                          id="fund"
                          value={budgetData.fund}
                          onChange={(e) => handleInputChange('fund', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Fund</option>
                          {funds.map(fund => (
                            <option key={fund.id} value={fund.id}>
                              {fund.code} - {fund.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="function">Function *</Label>
                        <select
                          id="function"
                          value={budgetData.function}
                          onChange={(e) => handleInputChange('function', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Function</option>
                          {functions.map(func => (
                            <option key={func.id} value={func.id}>
                              {func.code} - {func.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="economicHead">Economic Head *</Label>
                        <select
                          id="economicHead"
                          value={budgetData.economicHead}
                          onChange={(e) => handleInputChange('economicHead', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Economic Head</option>
                          {economicHeads.map(head => (
                            <option key={head.id} value={head.id}>
                              {head.code} - {head.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="program">Program</Label>
                        <select
                          id="program"
                          value={budgetData.program}
                          onChange={(e) => handleInputChange('program', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Program</option>
                          {programs.map(program => (
                            <option key={program.id} value={program.id}>
                              {program.code} - {program.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="project">Project</Label>
                        <select
                          id="project"
                          value={budgetData.project}
                          onChange={(e) => handleInputChange('project', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Project</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.code} - {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Budget Lines */}
              {activeStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Budget Line Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Budget Line Items
                      </h3>
                      <p className="text-gray-600 mb-6">
                        This step will allow you to create detailed budget line items.
                      </p>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Budget Line
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Review & Submit */}
              {activeStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Review & Submit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Budget Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span>
                            <span className="ml-2 font-medium">{budgetData.name || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Fiscal Year:</span>
                            <span className="ml-2 font-medium">{budgetData.fiscalYear}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Type:</span>
                            <span className="ml-2 font-medium capitalize">{budgetData.budgetType}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Amount:</span>
                            <span className="ml-2 font-medium">
                              {budgetData.totalAmount ? `₦${budgetData.totalAmount}` : 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">
                          Please review your budget details before submitting.
                        </p>
                        <Button type="submit" className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Create Budget
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={activeStep === 1}
                >
                  Previous
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => console.log('Save as draft')}
                  >
                    Save as Draft
                  </Button>
                  {activeStep < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}