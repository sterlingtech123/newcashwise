'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Plus, FileText, BarChart3 } from 'lucide-react';

export default function FinanceAccountsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Calculator className="h-6 w-6 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
                    </div>
                    <p className="text-gray-600">Manage your organization's chart of accounts and financial structure</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Calculator className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                                    <p className="text-sm text-gray-600">Total Accounts</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">89</p>
                                    <p className="text-sm text-gray-600">Active Accounts</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <BarChart3 className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">12</p>
                                    <p className="text-sm text-gray-600">Account Groups</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Calculator className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">₦2.4B</p>
                                    <p className="text-sm text-gray-600">Total Balance</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-3">
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 h-4 mr-2" />
                            New Account
                        </Button>
                        <Button variant="outline">
                            <FileText className="h-4 h-4 mr-2" />
                            Import Accounts
                        </Button>
                        <Button variant="outline">
                            <BarChart3 className="h-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Chart of Accounts Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chart of Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Account Code</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Account Name</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Balance</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-sm">1000</td>
                                        <td className="py-3 px-4">Cash and Cash Equivalents</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Asset</span>
                                        </td>
                                        <td className="py-3 px-4">Current Assets</td>
                                        <td className="py-3 px-4 font-mono">₦125,000,000</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-sm">1100</td>
                                        <td className="py-3 px-4">Accounts Receivable</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Asset</span>
                                        </td>
                                        <td className="py-3 px-4">Current Assets</td>
                                        <td className="py-3 px-4 font-mono">₦45,000,000</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-sm">2000</td>
                                        <td className="py-3 px-4">Accounts Payable</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Liability</span>
                                        </td>
                                        <td className="py-3 px-4">Current Liabilities</td>
                                        <td className="py-3 px-4 font-mono">₦78,000,000</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-sm">3000</td>
                                        <td className="py-3 px-4">Common Stock</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Equity</span>
                                        </td>
                                        <td className="py-3 px-4">Shareholders Equity</td>
                                        <td className="py-3 px-4 font-mono">₦500,000,000</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
