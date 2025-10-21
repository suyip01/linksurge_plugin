import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, Key, Database, Bell, Palette } from 'lucide-react';
import { UserSettings } from '../types';

const SettingsApp: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    apiKey: '',
    cacheExpiration: 3600000, // 1 hour in milliseconds
    autoRefresh: true,
    notifications: true,
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'getSettings'
      });
      
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      showMessage('error', '加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'updateSettings',
        data: settings
      });
      
      if (response.success) {
        showMessage('success', '设置已保存');
      } else {
        showMessage('error', response.error || '保存设置失败');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showMessage('error', '保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      apiKey: '',
      cacheExpiration: 3600000,
      autoRefresh: true,
      notifications: true,
      theme: 'light'
    });
    showMessage('success', '设置已重置');
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInputChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载设置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">LinkSurge 设置</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {/* API Configuration */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">API 配置</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Data API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="输入您的 YouTube Data API Key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  用于获取 YouTube 频道详细信息。请在 Google Cloud Console 中获取 API Key。
                </p>
              </div>
            </div>
          </div>

          {/* Cache Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">缓存设置</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  缓存过期时间
                </label>
                <select
                  value={settings.cacheExpiration}
                  onChange={(e) => handleInputChange('cacheExpiration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1800000}>30 分钟</option>
                  <option value={3600000}>1 小时</option>
                  <option value={7200000}>2 小时</option>
                  <option value={21600000}>6 小时</option>
                  <option value={86400000}>24 小时</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  频道信息缓存的有效期，过期后会重新获取最新数据。
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleInputChange('autoRefresh', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-700">
                  自动刷新过期缓存
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">通知设置</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notifications}
                  onChange={(e) => handleInputChange('notifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
                  启用通知
                </label>
              </div>
              <p className="text-sm text-gray-500">
                启用后会在获取频道信息时显示通知。
              </p>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">主题设置</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  界面主题
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value as 'light' | 'dark' | 'auto')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">浅色主题</option>
                  <option value="dark">深色主题</option>
                  <option value="auto">跟随系统</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={resetSettings}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>重置设置</span>
          </button>
          
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? '保存中...' : '保存设置'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;