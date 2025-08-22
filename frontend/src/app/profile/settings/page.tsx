'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { MainNavigation } from '@/components/layout/main-navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    User,
    Mail,
    Phone,
    Globe,
    Clock,
    Bell,
    Shield,
    Key,
    Eye,
    EyeOff,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Settings,
    Lock,
    Smartphone,
    Monitor,
    Database,
    Activity,
    Calendar,
    MapPin,
    Building2,
    CreditCard,
    FileText,
    BarChart3,
    Zap,
    Camera,
    Upload,
    Trash2,
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';

export default function AccountSettingsPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showPhotoDialog, setShowPhotoDialog] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form states
    const [personalInfo, setPersonalInfo] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: '+234 801 234 5678',
        timezone: 'Africa/Lagos',
        language: 'English',
        dateFormat: 'DD/MM/YYYY',
        currency: 'NGN (₦)',
        country: 'Nigeria',
        city: 'Lagos',
        organization: 'CashWise Platform',
        jobTitle: 'Financial Manager',
        department: 'Finance'
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorEnabled: true,
        biometricEnabled: false,
        sessionTimeout: 30,
        passwordExpiryDays: 90,
        failedLoginAttempts: 5,
        accountLockoutDuration: 15
    });

    const [notificationPreferences, setNotificationPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        budgetAlerts: true,
        paymentReminders: true,
        approvalRequests: true,
        systemUpdates: false,
        marketingEmails: false,
        weeklyReports: true,
        monthlyReports: true
    });

    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'team',
        activityLogging: true,
        dataAnalytics: true,
        thirdPartySharing: false,
        locationTracking: false
    });

    const [passwordChange, setPasswordChange] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [sessions, setSessions] = useState([
        {
            id: '1',
            device: 'MacBook Pro',
            browser: 'Chrome 120.0',
            location: 'Lagos, Nigeria',
            ipAddress: '192.168.1.100',
            lastActive: '2 minutes ago',
            isCurrent: true,
            status: 'active'
        },
        {
            id: '2',
            device: 'iPhone 15',
            browser: 'Safari 17.0',
            location: 'Lagos, Nigeria',
            ipAddress: '192.168.1.101',
            lastActive: '1 hour ago',
            isCurrent: false,
            status: 'active'
        },
        {
            id: '3',
            device: 'Windows PC',
            browser: 'Edge 120.0',
            location: 'Abuja, Nigeria',
            ipAddress: '10.0.0.50',
            lastActive: '2 days ago',
            isCurrent: false,
            status: 'inactive'
        }
    ]);

    const handlePhotoDialogOpen = () => {
        setShowPhotoDialog(true);
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handlePhotoDialogClose = () => {
        setShowPhotoDialog(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, GIF)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setAvatarFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSaveAvatar = async () => {
        if (!avatarFile) return;

        setIsUploading(true);
        try {
            // Simulate API call for avatar upload
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real app, you would upload to your server/cloud storage
            console.log('Avatar uploaded successfully:', avatarFile);

            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);

            // Close the dialog after successful upload
            handlePhotoDialogClose();

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSavePersonalInfo = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Personal info saved:', personalInfo);
            console.log('Avatar file:', avatarFile);
            // Show success message
        } catch (error) {
            console.error('Error saving personal info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordChange.newPassword !== passwordChange.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Password changed successfully');
            setPasswordChange({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            // Show success message
        } catch (error) {
            console.error('Error changing password:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTerminateSession = (sessionId: string) => {
        setSessions(sessions.filter(session => session.id !== sessionId));
    };

    const handleTerminateAllSessions = () => {
        setSessions(sessions.filter(session => session.isCurrent));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <MainNavigation />

            <div className="lg:pl-64">
                <main className="py-8">
                    <div className="mx-auto max-w-7xl pr-4 sm:pr-6 lg:pr-8 pl-0">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Settings className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Account Settings
                                    </h1>
                                    <p className="text-gray-600">
                                        Manage your account preferences, security, and privacy settings
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Personal Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-primary" />
                                            Personal Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Avatar Section */}
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center gap-4">
                                                <Avatar className="h-24 w-24">
                                                    {avatarPreview ? (
                                                        <AvatarImage src={avatarPreview} alt="Profile avatar" />
                                                    ) : (
                                                        <AvatarFallback className="text-2xl font-semibold">
                                                            {user?.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handlePhotoDialogOpen}
                                                        className="cursor-pointer"
                                                    >
                                                        <Camera className="h-4 w-4 mr-2" />
                                                        Change Photo
                                                    </Button>
                                                    {avatarPreview && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleRemoveAvatar}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="text-sm text-gray-600 mb-4">
                                                    <p>Upload a profile photo to personalize your account.</p>
                                                    <p className="mt-1">Supported formats: JPG, PNG, GIF (max 5MB)</p>
                                                </div>

                                                {/* Upload Success Message */}
                                                {uploadSuccess && (
                                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            <span className="text-sm text-green-700">Photo uploaded successfully!</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={personalInfo.firstName}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                                                    placeholder="Enter first name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={personalInfo.lastName}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                                                    placeholder="Enter last name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={personalInfo.email}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={personalInfo.phone}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="jobTitle">Job Title</Label>
                                                <Input
                                                    id="jobTitle"
                                                    value={personalInfo.jobTitle}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, jobTitle: e.target.value })}
                                                    placeholder="Enter job title"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="department">Department</Label>
                                                <Input
                                                    id="department"
                                                    value={personalInfo.department}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, department: e.target.value })}
                                                    placeholder="Enter department"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="timezone">Timezone</Label>
                                                <select
                                                    id="timezone"
                                                    value={personalInfo.timezone}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, timezone: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                                                    <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                                                    <option value="Europe/London">Europe/London (GMT+0)</option>
                                                    <option value="America/New_York">America/New_York (GMT-5)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label htmlFor="language">Language</Label>
                                                <select
                                                    id="language"
                                                    value={personalInfo.language}
                                                    onChange={(e) => setPersonalInfo({ ...personalInfo, language: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    <option value="English">English</option>
                                                    <option value="French">French</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="Arabic">Arabic</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                onClick={handleSavePersonalInfo}
                                                disabled={isLoading}
                                                className="flex items-center gap-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Security Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            Security Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Two-Factor Authentication */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Key className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                                </div>
                                            </div>
                                            <Switch
                                                variant="success"
                                                checked={securitySettings.twoFactorEnabled}
                                                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
                                            />
                                        </div>

                                        {/* Biometric Authentication */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Smartphone className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
                                                    <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
                                                </div>
                                            </div>
                                            <Switch
                                                variant="info"
                                                checked={securitySettings.biometricEnabled}
                                                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, biometricEnabled: checked })}
                                            />
                                        </div>

                                        {/* Session Timeout */}
                                        <div className="space-y-2">
                                            <Label>Session Timeout (minutes)</Label>
                                            <select
                                                value={securitySettings.sessionTimeout}
                                                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            >
                                                <option value={15}>15 minutes</option>
                                                <option value={30}>30 minutes</option>
                                                <option value={60}>1 hour</option>
                                                <option value={120}>2 hours</option>
                                                <option value={480}>8 hours</option>
                                            </select>
                                        </div>

                                        {/* Password Change */}
                                        <Separator />
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900">Change Password</h4>

                                            <div className="relative">
                                                <Label htmlFor="currentPassword">Current Password</Label>
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={passwordChange.currentPassword}
                                                    onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })}
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>

                                            <div className="relative">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwordChange.newPassword}
                                                    onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>

                                            <div className="relative">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={passwordChange.confirmPassword}
                                                    onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handlePasswordChange}
                                                    disabled={isLoading}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Key className="h-4 w-4" />
                                                    Change Password
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notification Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5 text-primary" />
                                            Notification Preferences
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm font-medium">Email Notifications</span>
                                                </div>
                                                <Switch
                                                    variant="success"
                                                    checked={notificationPreferences.emailNotifications}
                                                    onCheckedChange={(checked) => setNotificationPreferences({ ...notificationPreferences, emailNotifications: checked })}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm font-medium">SMS Notifications</span>
                                                </div>
                                                <Switch
                                                    checked={notificationPreferences.smsNotifications}
                                                    onCheckedChange={(checked) => setNotificationPreferences({ ...notificationPreferences, smsNotifications: checked })}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm font-medium">Push Notifications</span>
                                                </div>
                                                <Switch
                                                    checked={notificationPreferences.pushNotifications}
                                                    onCheckedChange={(checked) => setNotificationPreferences({ ...notificationPreferences, pushNotifications: checked })}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4 text-orange-600" />
                                                    <span className="text-sm font-medium">Budget Alerts</span>
                                                </div>
                                                <Switch
                                                    variant="warning"
                                                    checked={notificationPreferences.budgetAlerts}
                                                    onCheckedChange={(checked) => setNotificationPreferences({ ...notificationPreferences, budgetAlerts: checked })}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-indigo-600" />
                                                    <span className="text-sm font-medium">Payment Reminders</span>
                                                </div>
                                                <Switch
                                                    checked={notificationPreferences.paymentReminders}
                                                    onCheckedChange={(checked) => setNotificationPreferences({ ...notificationPreferences, paymentReminders: checked })}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-red-600" />
                                                    <span className="text-sm font-medium">Approval Requests</span>
                                                </div>
                                                <Switch
                                                    checked={notificationPreferences.approvalRequests}
                                                    onCheckedChange={(checked) => setNotificationPreferences({ ...notificationPreferences, approvalRequests: checked })}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Active Sessions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Monitor className="h-5 w-5 text-primary" />
                                            Active Sessions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {sessions.map((session) => (
                                                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Monitor className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium text-gray-900">{session.device}</h4>
                                                                {session.isCurrent && (
                                                                    <Badge variant="secondary" className="text-xs">Current</Badge>
                                                                )}
                                                                <Badge variant="secondary" className={getStatusColor(session.status)}>
                                                                    {session.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{session.browser}</p>
                                                            <p className="text-sm text-gray-500">{session.location} • {session.ipAddress}</p>
                                                            <p className="text-xs text-gray-400">Last active: {session.lastActive}</p>
                                                        </div>
                                                    </div>
                                                    {!session.isCurrent && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleTerminateSession(session.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}

                                            {sessions.filter(s => !s.isCurrent).length > 0 && (
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleTerminateAllSessions}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        Terminate All Other Sessions
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Account Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Account Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12">
                                                {avatarPreview ? (
                                                    <AvatarImage src={avatarPreview} alt="Profile avatar" />
                                                ) : (
                                                    <AvatarFallback className="text-lg font-semibold">
                                                        {user?.name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">{user?.name}</p>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Member Since</span>
                                                <span className="font-medium">January 2024</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Last Login</span>
                                                <span className="font-medium">2 minutes ago</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Account Status</span>
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    Active
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Database className="h-4 w-4 mr-2" />
                                            Export Data
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Activity className="h-4 w-4 mr-2" />
                                            View Activity Log
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Zap className="h-4 w-4 mr-2" />
                                            API Keys
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Privacy Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Privacy Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                                                <p className="text-xs text-gray-500">Who can see your profile</p>
                                            </div>
                                            <select
                                                value={privacySettings.profileVisibility}
                                                onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            >
                                                <option value="public">Public</option>
                                                <option value="team">Team Only</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Activity Logging</p>
                                                <p className="text-xs text-gray-500">Track your account activity</p>
                                            </div>
                                            <Switch
                                                checked={privacySettings.activityLogging}
                                                onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, activityLogging: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Data Analytics</p>
                                                <p className="text-xs text-gray-500">Help improve our services</p>
                                            </div>
                                            <Switch
                                                checked={privacySettings.dataAnalytics}
                                                onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, dataAnalytics: checked })}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Photo Upload Dialog */}
            {showPhotoDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Dialog Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Change Profile Photo</h3>
                            <button
                                onClick={handlePhotoDialogClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Dialog Content */}
                        <div className="p-6 space-y-6">
                            {/* Current Photo */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-3">Current Photo</p>
                                <Avatar className="h-20 w-20 mx-auto">
                                    {avatarPreview ? (
                                        <AvatarImage src={avatarPreview} alt="Profile avatar" />
                                    ) : (
                                        <AvatarFallback className="text-xl font-semibold">
                                            {user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </div>

                            {/* Upload Area */}
                            <div className="space-y-4">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                        id="photo-upload"
                                    />

                                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium text-primary">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        JPG, PNG, GIF up to 5MB
                                    </p>

                                    <label htmlFor="photo-upload">
                                        <Button variant="outline" className="cursor-pointer">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Choose Photo
                                        </Button>
                                    </label>
                                </div>

                                {/* File Info */}
                                {avatarFile && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-green-700">Photo selected</span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            {avatarFile.name} ({(avatarFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={handlePhotoDialogClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>

                                {avatarFile && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={handleRemoveAvatar}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove
                                        </Button>

                                        <Button
                                            onClick={handleSaveAvatar}
                                            disabled={isUploading}
                                            className="flex-1"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Save Photo
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
