import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Settings as SettingsIcon, 
  Database,
  Shield,
  Bell,
  Users,
  Globe,
  Phone,
  Key,
  Server,
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Clock
} from 'lucide-react'

const Settings: React.FC = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Mock settings data
  const [settings, setSettings] = useState({
    // General Settings
    businessName: 'Armenius Store Cyprus',
    businessPhone: '+357 77-111-104',
    businessAddress: '171 Makarios Avenue, Nicosia, Cyprus',
    businessHours: 'Monday-Friday 9am-7pm, Saturday 9am-2pm, Sunday closed',
    
    // API Keys
    vapiKey: 'vapi_key_xxxxxxxxxxxxxxxxx',
    openaiKey: 'sk-xxxxxxxxxxxxxxxxx',
    elevenLabsKey: 'el_xxxxxxxxxxxxxxxxx',
    deepgramKey: 'dg_xxxxxxxxxxxxxxxxx',
    supabaseUrl: 'https://zcmkwavcgcwondlgphzf.supabase.co',
    supabaseKey: 'sb_xxxxxxxxxxxxxxxxx',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    callFailureAlerts: true,
    budgetAlerts: true,
    dailyReports: true,
    weeklyReports: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    allowedIPs: ['192.168.1.0/24'],
    
    // Voice Assistant
    defaultLanguage: 'multi',
    fallbackLanguage: 'en',
    maxCallDuration: 15,
    silenceTimeout: 30,
    recordCalls: true,
    
    // Performance
    cacheDuration: 300,
    rateLimitPerMinute: 60,
    autoScaling: true,
    
    // Integrations
    webhookUrl: 'https://armenius-voice.vercel.app/api/webhooks',
    crmIntegration: false,
    analytics: true,
    backup: 'daily'
  })

  const handleSettingChange = (_category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Here you would save the settings
    setHasUnsavedChanges(false)
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    // Reset to default settings
    setHasUnsavedChanges(false)
    alert('Settings reset to defaults')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'voice', label: 'Voice Assistant', icon: Phone },
    { id: 'performance', label: 'Performance', icon: Server },
    { id: 'integrations', label: 'Integrations', icon: Database }
  ]

  const systemHealth = {
    apiStatus: 'healthy',
    databaseStatus: 'healthy',
    voiceServiceStatus: 'healthy',
    lastBackup: '2024-01-24 23:00:00',
    uptime: '99.8%',
    responseTime: '145ms'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">Business Name</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => handleSettingChange('general', 'businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">Business Phone</label>
                <input
                  type="text"
                  value={settings.businessPhone}
                  onChange={(e) => handleSettingChange('general', 'businessPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary mb-2 block">Business Address</label>
              <input
                type="text"
                value={settings.businessAddress}
                onChange={(e) => handleSettingChange('general', 'businessAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary mb-2 block">Business Hours</label>
              <textarea
                value={settings.businessHours}
                onChange={(e) => handleSettingChange('general', 'businessHours', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-amber-800">Sensitive Information</span>
              </div>
              <div className="text-sm text-amber-700 mt-1">
                API keys are encrypted and stored securely. Only show them when necessary.
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary">API Configuration</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeys(!showApiKeys)}
              >
                {showApiKeys ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showApiKeys ? 'Hide' : 'Show'} Keys
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { key: 'vapiKey', label: 'Vapi API Key', service: 'Vapi Platform' },
                { key: 'openaiKey', label: 'OpenAI API Key', service: 'GPT Models' },
                { key: 'elevenLabsKey', label: 'ElevenLabs API Key', service: 'Text-to-Speech' },
                { key: 'deepgramKey', label: 'Deepgram API Key', service: 'Speech-to-Text' },
                { key: 'supabaseUrl', label: 'Supabase URL', service: 'Database' },
                { key: 'supabaseKey', label: 'Supabase Key', service: 'Database Auth' }
              ].map(({ key, label, service }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-secondary">{label}</div>
                      <div className="text-xs text-muted-foreground">{service}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <input
                    type={showApiKeys ? "text" : "password"}
                    value={settings[key as keyof typeof settings] as string}
                    onChange={(e) => handleSettingChange('api', key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                  { key: 'callFailureAlerts', label: 'Call Failure Alerts', desc: 'Alert when calls fail or escalate' },
                  { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Alert when costs exceed thresholds' },
                  { key: 'dailyReports', label: 'Daily Reports', desc: 'Daily performance summary emails' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly analytics and insights' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-secondary">{label}</div>
                      <div className="text-sm text-muted-foreground">{desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[key as keyof typeof settings] as boolean}
                        onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value="admin@armenius.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">SMS Phone Number</label>
                  <input
                    type="tel"
                    value="+357 99 123 456"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Authentication & Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-secondary">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-secondary">Session Timeout</div>
                      <div className="text-sm text-muted-foreground">Automatic logout after inactivity</div>
                    </div>
                    <div className="text-sm font-medium text-secondary">{settings.sessionTimeout} minutes</div>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Access Control</h3>
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">Allowed IP Ranges</label>
                <textarea
                  value={settings.allowedIPs.join('\n')}
                  onChange={(e) => handleSettingChange('security', 'allowedIPs', e.target.value.split('\n'))}
                  rows={3}
                  placeholder="Enter IP addresses or ranges, one per line"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Example: 192.168.1.0/24, 10.0.0.1
                </div>
              </div>
            </div>
          </div>
        )

      case 'voice':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Voice Assistant Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">Default Language</label>
                  <select 
                    value={settings.defaultLanguage}
                    onChange={(e) => handleSettingChange('voice', 'defaultLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="multi">Multi-language (Auto-detect)</option>
                    <option value="en">English</option>
                    <option value="el">Greek</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">Fallback Language</label>
                  <select 
                    value={settings.fallbackLanguage}
                    onChange={(e) => handleSettingChange('voice', 'fallbackLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="el">Greek</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">
                    Max Call Duration ({settings.maxCallDuration} minutes)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={settings.maxCallDuration}
                    onChange={(e) => handleSettingChange('voice', 'maxCallDuration', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">
                    Silence Timeout ({settings.silenceTimeout} seconds)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="10"
                    value={settings.silenceTimeout}
                    onChange={(e) => handleSettingChange('voice', 'silenceTimeout', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-secondary">Record Calls</div>
                  <div className="text-sm text-muted-foreground">Save call recordings for quality and training</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.recordCalls}
                    onChange={(e) => handleSettingChange('voice', 'recordCalls', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        )

      case 'performance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Performance Optimization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">
                    Cache Duration ({settings.cacheDuration} seconds)
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="3600"
                    step="60"
                    value={settings.cacheDuration}
                    onChange={(e) => handleSettingChange('performance', 'cacheDuration', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    How long to cache responses for common queries
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary mb-2 block">
                    Rate Limit ({settings.rateLimitPerMinute}/min)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={settings.rateLimitPerMinute}
                    onChange={(e) => handleSettingChange('performance', 'rateLimitPerMinute', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Maximum API calls per minute
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-secondary">Auto Scaling</div>
                  <div className="text-sm text-muted-foreground">Automatically adjust resources based on demand</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoScaling}
                    onChange={(e) => handleSettingChange('performance', 'autoScaling', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* System Health */}
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Status</span>
                    {getStatusIcon(systemHealth.apiStatus)}
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    {getStatusIcon(systemHealth.databaseStatus)}
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Voice Services</span>
                    {getStatusIcon(systemHealth.voiceServiceStatus)}
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Uptime</div>
                    <div className="text-lg font-bold text-primary">{systemHealth.uptime}</div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Response Time</div>
                    <div className="text-lg font-bold text-primary">{systemHealth.responseTime}</div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Last Backup</div>
                    <div className="text-xs text-muted-foreground">{systemHealth.lastBackup}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Webhook Configuration</h3>
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">Webhook URL</label>
                <input
                  type="url"
                  value={settings.webhookUrl}
                  onChange={(e) => handleSettingChange('integrations', 'webhookUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  URL to receive call events and notifications
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">External Services</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-secondary">CRM Integration</div>
                    <div className="text-sm text-muted-foreground">Sync customer data with your CRM system</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.crmIntegration}
                      onChange={(e) => handleSettingChange('integrations', 'crmIntegration', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-secondary">Analytics Tracking</div>
                    <div className="text-sm text-muted-foreground">Send data to external analytics platforms</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.analytics}
                      onChange={(e) => handleSettingChange('integrations', 'analytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Data Management</h3>
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">Backup Frequency</label>
                <select 
                  value={settings.backup}
                  onChange={(e) => handleSettingChange('integrations', 'backup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">System Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform settings, API keys, and system preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Database className="mr-2 h-4 w-4" />
            Backup Settings
          </Button>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* Settings Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Settings Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'hover:bg-muted/50 text-secondary'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-secondary flex items-center">
                {tabs.find(tab => tab.id === activeTab)?.icon && 
                  React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, { className: "mr-2 h-5 w-5 text-primary" })
                }
                {tabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save/Reset Actions */}
      {hasUnsavedChanges && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SettingsIcon className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-amber-800 font-medium">You have unsaved changes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Settings