import React, { useState } from 'react';
import { 
  Save, Settings, User, Lock, Bell, Globe, Palette, Database, 
  Shield, Mail, Zap, CreditCard, Users, FileText, Activity,
  Smartphone, Cloud, Server, HardDrive, Eye, EyeOff, Upload,
  Download, Trash2, RefreshCw, Plus, Minus, Check, X
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: 'BookStore Pro',
    siteDescription: 'Your premium book marketplace',
    adminEmail: 'admin@bookstore.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    maintenanceMode: false,
    enableRegistration: true,
    defaultCurrency: 'USD'
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableRecaptcha: false,
    ipWhitelist: [],
    auditLogEnabled: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newUserAlerts: true,
    orderAlerts: true,
    reviewAlerts: true,
    newsletterEnabled: true,
    lowStockAlerts: true,
    systemAlerts: true
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    fontFamily: 'Inter',
    borderRadius: '0.375rem',
    enableAnimations: true,
    showWelcomeBanner: true,
    adminLogo: 'BookStore Admin',
    favicon: '/favicon.ico'
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    enableApi: true,
    apiVersion: 'v1',
    rateLimit: 100,
    enableSwagger: true,
    apiKeys: [
      { id: 1, name: 'Mobile App', key: 'sk_***456', lastUsed: '2024-03-15' },
      { id: 2, name: 'Webhooks', key: 'sk_***789', lastUsed: '2024-03-10' }
    ]
  });

  // Backup Settings
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    keepBackups: 30,
    backupLocation: 'cloud',
    encryptBackups: true,
    lastBackup: '2024-03-16 02:00:00'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API', icon: Database },
    { id: 'backup', label: 'Backup', icon: HardDrive },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset all settings
      setGeneralSettings({
        siteTitle: 'BookStore Pro',
        siteDescription: 'Your premium book marketplace',
        adminEmail: 'admin@bookstore.com',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        maintenanceMode: false,
        enableRegistration: true,
        defaultCurrency: 'USD'
      });
      alert('Settings reset to defaults!');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings size={20} className="mr-2" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={generalSettings.siteTitle}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={generalSettings.adminEmail}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Currency
            </label>
            <select
              value={generalSettings.defaultCurrency}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe size={20} className="mr-2" />
          Site Configuration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Maintenance Mode</label>
              <p className="text-sm text-gray-500">Disable public access to the site</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={generalSettings.maintenanceMode}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">User Registration</label>
              <p className="text-sm text-gray-500">Allow new users to register</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={generalSettings.enableRegistration}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, enableRegistration: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield size={20} className="mr-2" />
          Authentication & Access
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Require 2FA for admin access</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Audit Logging</label>
              <p className="text-sm text-gray-500">Log all admin activities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.auditLogEnabled}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, auditLogEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock size={20} className="mr-2" />
          Password Policy
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={securitySettings.passwordMinLength}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Require Strong Password</label>
              <p className="text-sm text-gray-500">Must include uppercase, lowercase, number, and special character</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.requireStrongPassword}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, requireStrongPassword: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell size={20} className="mr-2" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">New User Alerts</label>
              <p className="text-sm text-gray-500">Get notified when new users register</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.newUserAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, newUserAlerts: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Order Alerts</label>
              <p className="text-sm text-gray-500">Get notified for new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.orderAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, orderAlerts: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Review Alerts</label>
              <p className="text-sm text-gray-500">Get notified for new reviews</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.reviewAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, reviewAlerts: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette size={20} className="mr-2" />
          Theme & Colors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={appearanceSettings.theme}
              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={appearanceSettings.fontFamily}
              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={appearanceSettings.primaryColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-10 h-10 cursor-pointer"
              />
              <input
                type="text"
                value={appearanceSettings.primaryColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Radius
            </label>
            <select
              value={appearanceSettings.borderRadius}
              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, borderRadius: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="0">None</option>
              <option value="0.25rem">Small (0.25rem)</option>
              <option value="0.375rem">Medium (0.375rem)</option>
              <option value="0.5rem">Large (0.5rem)</option>
              <option value="1rem">Extra Large (1rem)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone size={20} className="mr-2" />
          Interface Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Enable Animations</label>
              <p className="text-sm text-gray-500">Smooth transitions and animations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.enableAnimations}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Show Welcome Banner</label>
              <p className="text-sm text-gray-500">Display welcome message on dashboard</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appearanceSettings.showWelcomeBanner}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, showWelcomeBanner: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database size={20} className="mr-2" />
          API Configuration
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Enable API</label>
              <p className="text-sm text-gray-500">Enable REST API access</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={apiSettings.enableApi}
                onChange={(e) => setApiSettings(prev => ({ ...prev, enableApi: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Version
            </label>
            <select
              value={apiSettings.apiVersion}
              onChange={(e) => setApiSettings(prev => ({ ...prev, apiVersion: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="v1">v1 (Current)</option>
              <option value="v2">v2 (Beta)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Limit (requests/minute)
            </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={apiSettings.rateLimit}
              onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Enable Swagger UI</label>
              <p className="text-sm text-gray-500">API documentation interface</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={apiSettings.enableSwagger}
                onChange={(e) => setApiSettings(prev => ({ ...prev, enableSwagger: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Key size={20} className="mr-2" />
          API Keys
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Active API Keys</h4>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center">
              <Plus size={16} className="mr-1" />
              New Key
            </button>
          </div>
          
          <div className="space-y-3">
            {apiSettings.apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{key.name}</div>
                  <div className="text-sm text-gray-500 font-mono">{key.key}</div>
                  <div className="text-xs text-gray-400">Last used: {key.lastUsed}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-blue-600 hover:text-blue-700">
                    <Eye size={18} />
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HardDrive size={20} className="mr-2" />
          Backup Configuration
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Automatic Backups</label>
              <p className="text-sm text-gray-500">Schedule automatic backups</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={backupSettings.autoBackup}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Frequency
              </label>
              <select
                value={backupSettings.backupFrequency}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Time
              </label>
              <input
                type="time"
                value={backupSettings.backupTime}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, backupTime: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keep Backups (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={backupSettings.keepBackups}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, keepBackups: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Location
              </label>
              <select
                value={backupSettings.backupLocation}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, backupLocation: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="cloud">Cloud Storage</option>
                <option value="local">Local Server</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Encrypt Backups</label>
              <p className="text-sm text-gray-500">Secure backups with encryption</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={backupSettings.encryptBackups}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, encryptBackups: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Last Backup</span>
              <span className="text-sm text-gray-600">{backupSettings.lastBackup}</span>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <RefreshCw size={16} className="mr-2" />
                Backup Now
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center">
                <Download size={16} className="mr-2" />
                Download Last Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'api':
        return renderApiSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3" size={28} />
            Admin Settings
          </h1>
          <p className="text-gray-600">Configure and manage your application settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <RefreshCw size={20} className="mr-2" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg transition flex items-center ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Icon size={20} className="mr-3" />
                {tab.label}
                {tab.id === 'security' && (
                  <span className="ml-auto text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    Important
                  </span>
                )}
              </button>
            );
          })}

          {/* System Info Card */}
          <div className="mt-8 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white">
            <h3 className="font-medium mb-2">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Version</span>
                <span className="font-mono">2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Last Updated</span>
                <span>2024-03-15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Uptime</span>
                <span className="text-green-400">99.8%</span>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span>Storage</span>
                  <span className="text-xs">1.2GB/5GB</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">
              {activeTab.replace('-', ' ')} Settings
            </h2>
            <p className="text-gray-600">
              {activeTab === 'general' && 'Configure basic application settings and preferences'}
              {activeTab === 'security' && 'Manage security policies and access controls'}
              {activeTab === 'notifications' && 'Configure notification preferences and alerts'}
              {activeTab === 'appearance' && 'Customize the look and feel of the admin interface'}
              {activeTab === 'api' && 'Manage API access and configuration'}
              {activeTab === 'backup' && 'Configure backup schedules and storage settings'}
              {activeTab === 'users' && 'Manage user roles and permissions'}
              {activeTab === 'billing' && 'View and manage subscription details'}
            </p>
          </div>

          {renderContent()}

          {/* Danger Zone (always visible) */}
          {activeTab !== 'security' && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center">
                  <Trash2 size={16} className="mr-2" />
                  Clear All Caches
                </button>
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center">
                  <RefreshCw size={16} className="mr-2" />
                  Re-index Database
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center">
                  <Trash2 size={16} className="mr-2" />
                  Delete All Data
                </button>
              </div>
              <p className="mt-4 text-sm text-red-600">
                Warning: These actions are irreversible and may affect system performance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg lg:relative lg:rounded-lg lg:border">
        <div className="text-sm text-gray-600">
          Make sure to save your changes before leaving this page.
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg transition flex items-center ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;