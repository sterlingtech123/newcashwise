'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    User,
    Mail,
    Phone,
    Building2,
    Shield,
    Calendar,
    Clock,
    Edit,
    Save,
    X,
    Camera,
    Key,
    Bell,
    Globe,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Settings,
    Activity,
    History,
    LogOut,
    Upload,
    Trash2,
    CheckCircle2,
    Image as ImageIcon,
    Download,
    Eye as EyeIcon,
    Shield as ShieldIcon,
    Smartphone,
    Monitor,
    Tablet
} from 'lucide-react';

export default function ProfilePage() {
    const { user, updateUser, logout } = useAuthStore();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [showPhotoDialog, setShowPhotoDialog] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showSecurityDialog, setShowSecurityDialog] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: '+234 801 234 5678',
        department: 'Finance Department',
        position: 'Senior Accountant',
        bio: 'Experienced financial professional with expertise in government accounting and budget management.',
        timezone: 'Africa/Lagos',
        language: 'English',
        notifications: {
            email: true,
            push: true,
            sms: false,
            desktop: true
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [securityData, setSecurityData] = useState({
        twoFactorEnabled: true,
        sessionTimeout: 30,
        loginNotifications: true,
        suspiciousActivityAlerts: true
    });

    // Set default roles if user doesn't have any
    useEffect(() => {
        if (user && (!user.roles || user.roles.length === 0)) {
            updateUser({ ...user, roles: ['finance'] });
        }
    }, [user, updateUser]);

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
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, GIF)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setAvatarFile(file);

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
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Avatar uploaded successfully:', avatarFile);

            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);

            updateUser({
                ...user,
                avatar: avatarPreview || undefined
            });

            handlePhotoDialogClose();

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNotificationToggle = (type: string) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    const handleSave = () => {
        updateUser({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.name?.split(' ')[0] || '',
            lastName: user?.name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            phone: '+234 801 234 5678',
            department: 'Finance Department',
            position: 'Senior Accountant',
            bio: 'Experienced financial professional with expertise in government accounting and budget management.',
            timezone: 'Africa/Lagos',
            language: 'English',
            notifications: {
                email: true,
                push: true,
                sms: false,
                desktop: true
            }
        });
        setIsEditing(false);
    };

    const handlePasswordChange = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        // In a real app, this would make an API call
        console.log('Password changed successfully');
        setShowPasswordDialog(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleSecuritySave = () => {
        // In a real app, this would make an API call
        console.log('Security settings updated:', securityData);
        setShowSecurityDialog(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="py-8">
                <div className="mx-auto max-w-7xl pr-4 sm:pr-6 lg:pr-8 pl-0">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                        <p className="mt-2 text-gray-600">
                            Manage your personal information, security settings, and account preferences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Left Sidebar - Profile Overview */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        {/* Profile Picture */}
                                        <div className="relative inline-block mb-4">
                                            <Avatar className="h-24 w-24">
                                                {avatarPreview ? (
                                                    <AvatarImage src={avatarPreview} alt="Profile avatar" />
                                                ) : user.avatar ? (
                                                    <AvatarImage src={user.avatar} alt="Profile avatar" />
                                                ) : (
                                                    <AvatarFallback className="text-2xl font-semibold bg-blue-600 text-white">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>

                                            {/* Upload Button */}
                                            <button
                                                onClick={handlePhotoDialogOpen}
                                                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                <Camera className="h-4 w-4 text-blue-600" />
                                            </button>
                                        </div>

                                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                            {user.name}
                                        </h2>
                                        <p className="text-gray-600 mb-3">{formData.position}</p>

                                        {/* Current Role Display */}
                                        <div className="mb-3">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {user.roles?.map((role, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                                                    >
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center justify-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                {formData.department}
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {formData.phone}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Stats */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-lg">Account Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Member since</span>
                                            <span className="font-medium">January 2024</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Last login</span>
                                            <span className="font-medium">Today, 10:30 AM</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Login count</span>
                                            <span className="font-medium">156</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start"
                                            onClick={() => setShowPasswordDialog(true)}
                                        >
                                            <Key className="h-4 w-4 mr-2" />
                                            Change Password
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start"
                                            onClick={() => setActiveTab('notifications')}
                                        >
                                            <Bell className="h-4 w-4 mr-2" />
                                            Notification Settings
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start"
                                            onClick={() => setActiveTab('security')}
                                        >
                                            <Shield className="h-4 w-4 mr-2" />
                                            Security Settings
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start"
                                            onClick={() => setActiveTab('activity')}
                                        >
                                            <Activity className="h-4 w-4 mr-2" />
                                            Activity Log
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => {
                                                logout();
                                                // Fallback redirect if needed
                                                setTimeout(() => {
                                                    if (typeof window !== 'undefined') {
                                                        window.location.href = '/auth/login';
                                                    }
                                                }, 100);
                                            }}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Profile Details */}
                        <div className="lg:col-span-3">
                            <Tabs defaultValue={activeTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                                    <TabsTrigger value="security">Security</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-6">
                                    {/* Personal Information */}
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Personal Information</CardTitle>
                                                {!isEditing ? (
                                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={handleSave}>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Save
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={handleCancel}>
                                                            <X className="h-4 w-4 mr-2" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        First Name
                                                    </label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={formData.firstName}
                                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                            placeholder="First Name"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{formData.firstName}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Last Name
                                                    </label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={formData.lastName}
                                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                            placeholder="Last Name"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{formData.lastName}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                            type="email"
                                                            placeholder="Email"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{formData.email}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone
                                                    </label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={formData.phone}
                                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                                            placeholder="Phone"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{formData.phone}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Department
                                                    </label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={formData.department}
                                                            onChange={(e) => handleInputChange('department', e.target.value)}
                                                            placeholder="Department"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{formData.department}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Position
                                                    </label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={formData.position}
                                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                                            placeholder="Position"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{formData.position}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Bio
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        value={formData.bio}
                                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                                        rows={3}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                                        placeholder="Tell us about yourself..."
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{formData.bio}</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Roles and Permissions */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Roles and Permissions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Current Roles</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {user.roles?.map((role) => (
                                                            <Badge key={role} variant="secondary" className="bg-blue-100 text-blue-800">
                                                                {role}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        {user.permissions?.map((permission) => (
                                                            <div key={permission} className="flex items-center gap-2">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                <span className="text-gray-700">{permission}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Personal Tab */}
                                <TabsContent value="personal" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Additional Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Timezone
                                                            </label>
                                                            {isEditing ? (
                                                                <select
                                                                    value={formData.timezone}
                                                                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                                                >
                                                                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                                                                    <option value="UTC">UTC (GMT+0)</option>
                                                                    <option value="America/New_York">America/New_York (GMT-5)</option>
                                                                </select>
                                                            ) : (
                                                                <p className="text-gray-900">{formData.timezone}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Language
                                                            </label>
                                                            {isEditing ? (
                                                                <select
                                                                    value={formData.language}
                                                                    onChange={(e) => handleInputChange('language', e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                                                >
                                                                    <option value="English">English</option>
                                                                    <option value="Yoruba">Yoruba</option>
                                                                    <option value="Hausa">Hausa</option>
                                                                    <option value="Igbo">Igbo</option>
                                                                </select>
                                                            ) : (
                                                                <p className="text-gray-900">{formData.language}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail className="h-4 w-4" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone className="h-4 w-4" />
                                                            <span>{formData.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Building2 className="h-4 w-4" />
                                                            <span>{formData.department}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Notifications Tab */}
                                <TabsContent value="notifications" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Notification Preferences</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-3">Notification Channels</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Mail className="h-5 w-5 text-gray-400" />
                                                                <span className="text-sm text-gray-700">Email Notifications</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleNotificationToggle('email')}
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications.email ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications.email ? 'translate-x-6' : 'translate-x-1'}`}
                                                                />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Bell className="h-5 w-5 text-gray-400" />
                                                                <span className="text-sm text-gray-700">Push Notifications</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleNotificationToggle('push')}
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications.push ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications.push ? 'translate-x-6' : 'translate-x-1'}`}
                                                                />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Smartphone className="h-5 w-5 text-gray-400" />
                                                                <span className="text-sm text-gray-700">SMS Notifications</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleNotificationToggle('sms')}
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications.sms ? 'translate-x-6' : 'translate-x-1'}`}
                                                                />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Monitor className="h-5 w-5 text-gray-400" />
                                                                <span className="text-sm text-gray-700">Desktop Notifications</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleNotificationToggle('desktop')}
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications.desktop ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications.desktop ? 'translate-x-6' : 'translate-x-1'}`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Security Tab */}
                                <TabsContent value="security" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Security Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <ShieldIcon className="h-5 w-5 text-green-600" />
                                                        <div>
                                                            <h4 className="font-medium text-green-900">Two-Factor Authentication</h4>
                                                            <p className="text-sm text-green-700">Enabled for enhanced security</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        Manage
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="h-5 w-5 text-blue-600" />
                                                        <div>
                                                            <h4 className="font-medium text-blue-900">Session Management</h4>
                                                            <p className="text-sm text-blue-700">2 active sessions</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        View All
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                                                        <div>
                                                            <h4 className="font-medium text-yellow-900">Password</h4>
                                                            <p className="text-sm text-yellow-700">Last changed 30 days ago</p>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => setShowPasswordDialog(true)}
                                                    >
                                                        Change
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Activity Tab */}
                                <TabsContent value="activity" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Login successful</p>
                                                        <p className="text-xs text-gray-500">Today, 10:30 AM • Chrome on Windows</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Profile updated</p>
                                                        <p className="text-xs text-gray-500">Yesterday, 3:45 PM • Profile settings</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Password changed</p>
                                                        <p className="text-xs text-gray-500">5 days ago • Security settings</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>

            {/* Photo Upload Dialog */}
            {showPhotoDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Change Profile Photo</h3>
                            <button
                                onClick={handlePhotoDialogClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-3">Current Photo</p>
                                <Avatar className="h-20 w-20 mx-auto">
                                    {avatarPreview ? (
                                        <AvatarImage src={avatarPreview} alt="Profile avatar" />
                                    ) : (
                                        <AvatarFallback className="text-xl font-semibold">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </div>

                            <div className="space-y-4">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
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
                                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
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

            {/* Password Change Dialog */}
            {showPasswordDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordDialog(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPasswordDialog(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePasswordChange}
                                    className="flex-1"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
