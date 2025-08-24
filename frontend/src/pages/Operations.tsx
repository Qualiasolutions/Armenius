import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Phone, 
  PhoneCall,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Volume2,
  Activity,
  VolumeX,
  Headphones
} from 'lucide-react'

interface ActiveCall {
  id: string
  customerName: string
  customerPhone: string
  location: string
  duration: string
  status: 'active' | 'on-hold' | 'escalated'
  topic: string
  sentiment: 'positive' | 'neutral' | 'negative'
  lastMessage: string
  timestamp: string
  cost: number
}

const Operations: React.FC = () => {
  const [selectedCall, setSelectedCall] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [audioMonitorEnabled, setAudioMonitorEnabled] = useState(false)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Mock real-time conversation data
  const activeCalls: ActiveCall[] = [
    {
      id: 'call-001',
      customerName: 'Nikos Papadopoulos',
      customerPhone: '+357 99 123 456',
      location: 'Nicosia, Cyprus',
      duration: '3:42',
      status: 'active',
      topic: 'RTX 4090 Availability',
      sentiment: 'positive',
      lastMessage: 'Checking stock levels for RTX 4090...',
      timestamp: '2 seconds ago',
      cost: 0.18
    },
    {
      id: 'call-002',
      customerName: 'Maria Christou',
      customerPhone: '+357 96 789 123',
      location: 'Limassol, Cyprus',
      duration: '1:25',
      status: 'active',
      topic: 'Gaming PC Build',
      sentiment: 'neutral',
      lastMessage: 'Would you like AMD or Intel processor?',
      timestamp: '5 seconds ago',
      cost: 0.08
    },
    {
      id: 'call-003',
      customerName: 'Andreas Georgiou',
      customerPhone: '+357 97 456 789',
      location: 'Paphos, Cyprus',
      duration: '5:16',
      status: 'escalated',
      topic: 'Warranty Claim',
      sentiment: 'negative',
      lastMessage: 'Transferring to human support...',
      timestamp: '12 seconds ago',
      cost: 0.31
    },
    {
      id: 'call-004',
      customerName: 'Elena Dimitriou',
      customerPhone: '+357 95 321 654',
      location: 'Larnaca, Cyprus',
      duration: '2:08',
      status: 'on-hold',
      topic: 'Repair Status',
      sentiment: 'neutral',
      lastMessage: 'Please hold while I check...',
      timestamp: '18 seconds ago',
      cost: 0.12
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-primary animate-pulse" />
      case 'on-hold': return <Pause className="h-4 w-4 text-yellow-500" />
      case 'escalated': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Phone className="h-4 w-4" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-primary/10 text-primary'
      case 'negative': return 'bg-red-50 text-red-600'
      default: return 'bg-gray-50 text-gray-600'
    }
  }

  const totalCost = activeCalls.reduce((sum, call) => sum + call.cost, 0)

  // Audio functionality for live monitoring
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

  const startListening = async (callId: string) => {
    const call = activeCalls.find(c => c.id === callId)
    if (!call || !audioMonitorEnabled) return

    setIsListening(true)
    
    // Initialize audio context
    await initializeAudio()
    
    // Simulate live audio playback of the conversation
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(`Now listening to conversation with ${call.customerName}. Topic: ${call.topic}`)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.6
      synthRef.current.speak(utterance)
      
      // Simulate ongoing conversation
      setTimeout(() => {
        const customerMessage = new SpeechSynthesisUtterance("Customer: Do you have the RTX 4090 in stock?")
        customerMessage.rate = 1.1
        customerMessage.pitch = 1.2
        synthRef.current?.speak(customerMessage)
      }, 3000)
      
      setTimeout(() => {
        const assistantMessage = new SpeechSynthesisUtterance("Assistant: Let me check our current stock levels for the RTX 4090. Yes, we have 5 units available at €1,699.99. Would you like me to reserve one?")
        assistantMessage.rate = 0.9
        assistantMessage.pitch = 1.0
        synthRef.current?.speak(assistantMessage)
      }, 8000)
    }
  }

  const stopListening = () => {
    setIsListening(false)
    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }

  useEffect(() => {
    initializeAudio()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Live Operations Center</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of voice assistant conversations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant={audioMonitorEnabled ? "default" : "outline"} 
            size="sm"
            onClick={() => {
              setAudioMonitorEnabled(!audioMonitorEnabled)
              if (!audioMonitorEnabled) {
                initializeAudio()
              } else {
                stopListening()
              }
            }}
          >
            {audioMonitorEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
            Audio Monitor {audioMonitorEnabled ? 'On' : 'Off'}
          </Button>
          {isListening && (
            <Button variant="outline" size="sm" onClick={stopListening}>
              <Pause className="mr-2 h-4 w-4" />
              Stop Listening
            </Button>
          )}
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <PhoneCall className="mr-2 h-4 w-4 text-primary" />
              Active Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{activeCalls.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Currently live</div>
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
            <div className="text-2xl font-bold text-secondary">2:58</div>
            <div className="text-xs text-muted-foreground mt-1">Per conversation</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">85%</div>
            <div className="text-xs text-primary mt-1">No escalation needed</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" />
              Live Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">€{totalCost.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Current sessions</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <Phone className="mr-2 h-5 w-5 text-primary" />
              Live Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCalls.map((call) => (
                <div 
                  key={call.id} 
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedCall === call.id ? 'bg-primary/10 border-primary' : 'bg-background border-gray-200'
                  }`}
                  onClick={() => setSelectedCall(call.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(call.status)}
                      <div className="flex-1">
                        <div className="font-medium text-secondary">{call.customerName}</div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <MapPin className="mr-1 h-3 w-3" />
                          {call.location}
                        </div>
                        <div className="text-sm text-gray-600 mt-2 font-medium">{call.topic}</div>
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          "{call.lastMessage}"
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-secondary">{call.duration}</div>
                      <div className="text-xs text-muted-foreground mt-1">{call.timestamp}</div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getSentimentColor(call.sentiment)}`}>
                        {call.sentiment}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">
              {selectedCall ? 'Conversation Details' : 'Select a Conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCall ? (
              <div className="space-y-6">
                {(() => {
                  const call = activeCalls.find(c => c.id === selectedCall)!
                  return (
                    <>
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-secondary">{call.customerName}</h3>
                            <p className="text-sm text-muted-foreground">{call.customerPhone}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant={isListening && selectedCall === call.id ? "default" : "outline"}
                              onClick={() => {
                                if (isListening && selectedCall === call.id) {
                                  stopListening()
                                } else {
                                  startListening(call.id)
                                }
                              }}
                              disabled={!audioMonitorEnabled}
                            >
                              {isListening && selectedCall === call.id ? (
                                <><Pause className="mr-1 h-3 w-3" /> Stop</>
                              ) : (
                                <><Headphones className="mr-1 h-3 w-3" /> Listen</>
                              )}
                            </Button>
                            <Button size="sm" variant="outline">
                              <User className="mr-1 h-3 w-3" />
                              Escalate
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Duration</div>
                            <div className="font-mono text-lg text-secondary">{call.duration}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Cost</div>
                            <div className="font-mono text-lg text-secondary">€{call.cost.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Status</div>
                            <div className="flex items-center mt-1">
                              {getStatusIcon(call.status)}
                              <span className="ml-2 text-sm font-medium capitalize">{call.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Sentiment</div>
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSentimentColor(call.sentiment)}`}>
                              {call.sentiment}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground mb-2">Topic</div>
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-secondary">{call.topic}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground mb-2">Latest Exchange</div>
                          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                            <div className="text-xs text-primary">Assistant:</div>
                            <div className="text-sm italic">"{call.lastMessage}"</div>
                            <div className="text-xs text-muted-foreground">{call.timestamp}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Click on a conversation to view detailed monitoring information
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex flex-col items-center space-y-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">Escalate All</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
              <Volume2 className="h-5 w-5" />
              <span className="text-sm">Broadcast Message</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">Quality Check</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
              <Activity className="h-5 w-5" />
              <span className="text-sm">System Status</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Operations