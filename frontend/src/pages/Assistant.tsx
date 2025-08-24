import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Headphones, 
  Settings,
  Mic,
  Volume2,
  Brain,
  Languages,
  Clock,
  Shield,
  TestTube,
  Save,
  RotateCcw,
  Play,
  Pause,
  Phone,
  PhoneCall,
  StopCircle,
  RadioIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface AssistantConfig {
  name: string
  voice: {
    provider: string
    voiceId: string
    stability: number
    similarityBoost: number
  }
  model: {
    provider: string
    model: string
    temperature: number
    maxTokens: number
  }
  languages: string[]
  responseDelay: number
  maxDuration: number
  silenceTimeout: number
}

const Assistant: React.FC = () => {
  const [isTestMode, setIsTestMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle')
  const [currentScenario, setCurrentScenario] = useState<string>('')
  const [testResults, setTestResults] = useState<any[]>([])
  const [isConnectedToVapi, setIsConnectedToVapi] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Current assistant configuration from the codebase
  const [config, setConfig] = useState<AssistantConfig>({
    name: "Armenius Store Assistant",
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
      stability: 0.5,
      similarityBoost: 0.75
    },
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 250
    },
    languages: ["English", "Greek"],
    responseDelay: 0.4,
    maxDuration: 15,
    silenceTimeout: 30
  })

  const voiceOptions = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", description: "Professional female voice" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni", description: "Mature male voice" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm female voice" },
    { id: "VR6AewLTigWG4xSOukaG", name: "Josh", description: "Friendly male voice" }
  ]

  const modelOptions = [
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Cost-optimized, fast responses" },
    { id: "gpt-4o", name: "GPT-4o", description: "Most capable model" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Balanced performance" }
  ]

  const handleConfigChange = (section: string, field: string, value: any) => {
    if (section === '') {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }))
    } else {
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof AssistantConfig] as object),
          [field]: value
        }
      }))
    }
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Here you would save the configuration
    setHasUnsavedChanges(false)
    alert('Configuration saved successfully!')
  }

  const handleReset = () => {
    // Reset to original configuration
    setHasUnsavedChanges(false)
    alert('Configuration reset to defaults')
  }

  // Voice Testing Functions
  const testVapiConnection = async () => {
    try {
      const response = await fetch('/api/vapi', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setIsConnectedToVapi(data.status === 'healthy')
      return data.status === 'healthy'
    } catch (error) {
      console.error('Failed to connect to Vapi:', error)
      setIsConnectedToVapi(false)
      return false
    }
  }

  const startVoiceTest = async (scenario: string = 'general') => {
    setCallStatus('connecting')
    setCurrentScenario(scenario)
    
    // Simulate connection process
    try {
      const connected = await testVapiConnection()
      if (!connected) {
        throw new Error('Unable to connect to voice assistant')
      }

      setCallStatus('active')
      setIsTestMode(true)
      
      // Play start notification
      playAudioNotification('start')

      // Simulate test scenario
      const testScenarios = {
        'product-inquiry': [
          { role: 'customer', message: 'Hello, I\'m looking for an RTX 4090 graphics card' },
          { role: 'assistant', message: 'Hello! I\'d be happy to help you with RTX 4090 availability. Let me check our current stock levels for you...' },
          { role: 'assistant', message: 'Great news! We have the NVIDIA GeForce RTX 4090 MSI Gaming X Trio available. We have 5 units in stock at €1,699.99. Would you like me to reserve one for you?' }
        ],
        'store-hours': [
          { role: 'customer', message: 'What are your store hours?' },
          { role: 'assistant', message: 'Our store hours are Monday through Friday 9 AM to 7 PM, Saturday 9 AM to 2 PM, and we\'re closed on Sundays. Is there anything specific you\'d like to know about visiting our store?' }
        ],
        'appointment': [
          { role: 'customer', message: 'I need to book a repair appointment for my laptop' },
          { role: 'assistant', message: 'I\'d be happy to help you schedule a repair appointment. What type of repair does your laptop need, and when would you prefer to come in?' }
        ],
        'greek-test': [
          { role: 'customer', message: 'Γεια σας, θέλω να αγοράσω έναν υπολογιστή' },
          { role: 'assistant', message: 'Γεια σας! Θα χαρώ να σας βοηθήσω να βρείτε τον κατάλληλο υπολογιστή. Τι είδους υπολογιστή ψάχνετε - για gaming, εργασία, ή γενική χρήση;' }
        ]
      }

      const messages = testScenarios[scenario as keyof typeof testScenarios] || testScenarios['product-inquiry']
      
      // Simulate real-time conversation with audio
      for (let i = 0; i < messages.length; i++) {
        setTimeout(() => {
          const message = messages[i]
          setTestResults(prev => [...prev, {
            ...message,
            timestamp: new Date().toISOString(),
            duration: Math.random() * 2 + 1 // Simulate response time
          }])
          
          // Play audio notification for new message
          playAudioNotification('message')
          
          // Play text-to-speech for assistant messages
          if (message.role === 'assistant' && audioEnabled) {
            setTimeout(() => {
              playTextToSpeech(message.message)
            }, 500) // Small delay before TTS
          }
        }, i * 4000) // 4 second delays between messages (increased for audio)
      }

      // End test after all messages
      setTimeout(() => {
        playAudioNotification('end')
        setCallStatus('ended')
        setTimeout(() => {
          setCallStatus('idle')
          setIsTestMode(false)
        }, 3000)
      }, messages.length * 4000 + 2000)

    } catch (error) {
      console.error('Voice test failed:', error)
      setCallStatus('idle')
      setIsTestMode(false)
      alert('Voice test failed: ' + error)
    }
  }

  const stopVoiceTest = () => {
    setCallStatus('ended')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTimeout(() => {
      setCallStatus('idle')
      setIsTestMode(false)
      setTestResults([])
    }, 2000)
  }

  // Audio functionality
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      if (!synthRef.current && 'speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis
      }
      return true
    } catch (error) {
      console.error('Failed to initialize audio:', error)
      return false
    }
  }

  const playTextToSpeech = (text: string, voice: string = 'Rachel') => {
    if (!audioEnabled || !synthRef.current) return
    
    // Cancel any ongoing speech
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    // Try to find a suitable voice
    const voices = synthRef.current.getVoices()
    const femaleVoice = voices.find(v => 
      v.name.includes('Female') || 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') ||
      v.name.includes('Microsoft Zira') ||
      v.name.includes('Google')
    )
    
    if (femaleVoice) {
      utterance.voice = femaleVoice
    }
    
    synthRef.current.speak(utterance)
  }

  const playAudioNotification = (type: 'start' | 'end' | 'message') => {
    if (!audioEnabled || !audioContextRef.current) return
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    switch (type) {
      case 'start':
        oscillator.frequency.setValueAtTime(800, ctx.currentTime)
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1)
        break
      case 'end':
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime)
        oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.2)
        break
      case 'message':
        oscillator.frequency.setValueAtTime(500, ctx.currentTime)
        break
    }
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }

  // Check Vapi connection on component mount
  useEffect(() => {
    testVapiConnection()
    initializeAudio()
  }, [])

  const currentStats = {
    totalCalls: 1247,
    successRate: 94,
    avgDuration: "2:34",
    costPerCall: 0.32
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Voice Assistant Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure your AI assistant's behavior, voice, and capabilities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${isConnectedToVapi ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-muted-foreground">
              {isConnectedToVapi ? 'Voice API Connected' : 'Voice API Offline'}
            </span>
          </div>
          <Button 
            variant={audioEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            <Volume2 className={`mr-2 h-4 w-4 ${audioEnabled ? '' : 'text-muted-foreground'}`} />
            {audioEnabled ? 'Audio On' : 'Audio Off'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => callStatus === 'idle' ? startVoiceTest('product-inquiry') : stopVoiceTest()}
            disabled={callStatus === 'connecting'}
          >
            {callStatus === 'active' ? (
              <><StopCircle className="mr-2 h-4 w-4" /> Stop Test</>
            ) : callStatus === 'connecting' ? (
              <><RadioIcon className="mr-2 h-4 w-4 animate-pulse" /> Connecting</>
            ) : (
              <><PhoneCall className="mr-2 h-4 w-4" /> Test Voice Call</>
            )}
          </Button>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* Current Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Headphones className="mr-2 h-4 w-4 text-primary" />
              Total Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{currentStats.totalCalls.toLocaleString()}</div>
            <div className="text-xs text-primary mt-1">Lifetime conversations</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{currentStats.successRate}%</div>
            <div className="text-xs text-primary mt-1">No escalation needed</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{currentStats.avgDuration}</div>
            <div className="text-xs text-muted-foreground mt-1">Per conversation</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Brain className="mr-2 h-4 w-4 text-primary" />
              Cost Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">€{currentStats.costPerCall}</div>
            <div className="text-xs text-primary mt-1">Per conversation</div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <Volume2 className="mr-2 h-5 w-5 text-primary" />
              Voice Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary mb-2 block">Voice Provider</label>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="font-medium text-secondary">{config.voice.provider}</div>
                <div className="text-xs text-muted-foreground">ElevenLabs - Premium TTS</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-secondary mb-2 block">Voice Selection</label>
              <div className="space-y-2">
                {voiceOptions.map((voice) => (
                  <div 
                    key={voice.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      config.voice.voiceId === voice.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-background border-gray-200 hover:bg-muted/30'
                    }`}
                    onClick={() => handleConfigChange('voice', 'voiceId', voice.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-secondary">{voice.name}</div>
                        <div className="text-xs text-muted-foreground">{voice.description}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Stability ({config.voice.stability})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.voice.stability}
                  onChange={(e) => handleConfigChange('voice', 'stability', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Similarity ({config.voice.similarityBoost})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.voice.similarityBoost}
                  onChange={(e) => handleConfigChange('voice', 'similarityBoost', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              AI Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary mb-2 block">Model Provider</label>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="font-medium text-secondary">{config.model.provider}</div>
                <div className="text-xs text-muted-foreground">OpenAI - Advanced Language Models</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-secondary mb-2 block">Model Selection</label>
              <div className="space-y-2">
                {modelOptions.map((model) => (
                  <div 
                    key={model.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      config.model.model === model.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-background border-gray-200 hover:bg-muted/30'
                    }`}
                    onClick={() => handleConfigChange('model', 'model', model.id)}
                  >
                    <div className="font-medium text-secondary">{model.name}</div>
                    <div className="text-xs text-muted-foreground">{model.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Temperature ({config.model.temperature})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.model.temperature}
                  onChange={(e) => handleConfigChange('model', 'temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Max Tokens ({config.model.maxTokens})
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="50"
                  value={config.model.maxTokens}
                  onChange={(e) => handleConfigChange('model', 'maxTokens', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavior & Language Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language & Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <Languages className="mr-2 h-5 w-5 text-primary" />
              Language & Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary mb-2 block">Supported Languages</label>
              <div className="flex gap-2">
                {config.languages.map((lang) => (
                  <div key={lang} className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Response Delay ({config.responseDelay}s)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={config.responseDelay}
                  onChange={(e) => handleConfigChange('', 'responseDelay', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Time before assistant responds
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Max Call Duration ({config.maxDuration} min)
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={config.maxDuration}
                  onChange={(e) => handleConfigChange('', 'maxDuration', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Silence Timeout ({config.silenceTimeout}s)
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="10"
                  value={config.silenceTimeout}
                  onChange={(e) => handleConfigChange('', 'silenceTimeout', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <TestTube className="mr-2 h-5 w-5 text-primary" />
              Assistant Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {callStatus === 'active' || callStatus === 'ended' ? (
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {callStatus === 'active' ? (
                      <><Mic className="h-5 w-5 text-primary mr-2 animate-pulse" />
                      <span className="font-medium text-secondary">Live Voice Test - {currentScenario.replace('-', ' ').toUpperCase()}</span></>
                    ) : (
                      <><CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-secondary">Test Completed</span></>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={stopVoiceTest}>
                    <StopCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div 
                      key={index}
                      className={`rounded-lg p-3 border ${
                        result.role === 'customer' 
                          ? 'bg-white border-gray-200' 
                          : 'bg-primary/5 border-primary/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className={`text-xs font-medium ${
                          result.role === 'customer' ? 'text-muted-foreground' : 'text-primary'
                        }`}>
                          {result.role === 'customer' ? 'Customer' : 'Assistant'}:
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.duration ? `${result.duration.toFixed(1)}s` : ''}
                        </div>
                      </div>
                      <div className="text-sm">{result.message}</div>
                    </div>
                  ))}
                  {callStatus === 'active' && testResults.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <RadioIcon className="h-6 w-6 animate-pulse mx-auto mb-2" />
                      Connecting to voice assistant...
                    </div>
                  )}
                </div>

                {callStatus === 'ended' && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Test completed successfully - Voice assistant is working properly
                    </div>
                  </div>
                )}
              </div>
            ) : callStatus === 'connecting' ? (
              <div className="text-center py-8">
                <RadioIcon className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                <p className="text-secondary font-medium mb-2">Connecting to Voice Assistant</p>
                <p className="text-muted-foreground text-sm">
                  Testing connection to Vapi.ai service...
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Test your assistant with live voice scenarios using Vapi.ai
                </p>
                <div className={`mb-4 p-3 rounded-lg ${isConnectedToVapi ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className={`flex items-center text-sm ${isConnectedToVapi ? 'text-green-700' : 'text-red-700'}`}>
                    {isConnectedToVapi ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
                    {isConnectedToVapi ? 'Voice API Connected - Ready for Testing' : 'Voice API Offline - Check Connection'}
                  </div>
                </div>
                <Button 
                  onClick={() => startVoiceTest('product-inquiry')} 
                  disabled={!isConnectedToVapi}
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Start Voice Test
                </Button>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="text-sm font-medium text-secondary mb-2">Test Scenarios</div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => startVoiceTest('product-inquiry')}
                  disabled={callStatus !== 'idle' || !isConnectedToVapi}
                >
                  Product Inquiry
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => startVoiceTest('store-hours')}
                  disabled={callStatus !== 'idle' || !isConnectedToVapi}
                >
                  Store Hours
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => startVoiceTest('appointment')}
                  disabled={callStatus !== 'idle' || !isConnectedToVapi}
                >
                  Book Appointment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => startVoiceTest('greek-test')}
                  disabled={callStatus !== 'idle' || !isConnectedToVapi}
                >
                  Greek Language
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save/Reset Actions */}
      {hasUnsavedChanges && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-amber-800 font-medium">You have unsaved changes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Assistant