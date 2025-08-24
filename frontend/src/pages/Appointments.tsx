import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  Wrench,
  MessageSquare,
  Settings,
  Building2
} from 'lucide-react'

interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  serviceType: 'repair' | 'consultation' | 'custom_build' | 'warranty_service'
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes: string
  bookedVia: 'voice_ai' | 'manual' | 'website'
  estimatedDuration: number
}

const Appointments: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock appointment data
  const appointments: Appointment[] = [
    {
      id: 'apt-001',
      customerName: 'Nikos Papadopoulos',
      customerPhone: '+357 99 123 456',
      serviceType: 'repair',
      date: '2024-01-25',
      time: '10:00',
      status: 'confirmed',
      notes: 'GPU not displaying - needs diagnostic',
      bookedVia: 'voice_ai',
      estimatedDuration: 60
    },
    {
      id: 'apt-002',
      customerName: 'Maria Christou',
      customerPhone: '+357 96 789 123',
      serviceType: 'custom_build',
      date: '2024-01-25',
      time: '14:30',
      status: 'confirmed',
      notes: 'Gaming PC build - RTX 4080, i7-13700K',
      bookedVia: 'voice_ai',
      estimatedDuration: 120
    },
    {
      id: 'apt-003',
      customerName: 'Andreas Georgiou',
      customerPhone: '+357 97 456 789',
      serviceType: 'warranty_service',
      date: '2024-01-26',
      time: '09:30',
      status: 'pending',
      notes: 'RAM module replacement under warranty',
      bookedVia: 'voice_ai',
      estimatedDuration: 30
    },
    {
      id: 'apt-004',
      customerName: 'Elena Dimitriou',
      customerPhone: '+357 95 321 654',
      serviceType: 'consultation',
      date: '2024-01-26',
      time: '16:00',
      status: 'confirmed',
      notes: 'Business workstation requirements discussion',
      bookedVia: 'voice_ai',
      estimatedDuration: 45
    },
    {
      id: 'apt-005',
      customerName: 'Costas Ioannou',
      customerPhone: '+357 94 567 890',
      serviceType: 'repair',
      date: '2024-01-24',
      time: '11:00',
      status: 'completed',
      notes: 'Laptop screen replacement - completed successfully',
      bookedVia: 'voice_ai',
      estimatedDuration: 90
    }
  ]

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'repair': return <Wrench className="h-4 w-4 text-orange-500" />
      case 'consultation': return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'custom_build': return <Building2 className="h-4 w-4 text-purple-500" />
      case 'warranty_service': return <Settings className="h-4 w-4 text-green-500" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-primary" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'completed': return 'bg-primary/10 text-primary border-primary/20'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const formatServiceType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus
    const matchesSearch = apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.customerPhone.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    viaAI: appointments.filter(a => a.bookedVia === 'voice_ai').length
  }

  const todayAppointments = appointments.filter(apt => apt.date === '2024-01-25').length
  const avgDuration = appointments.reduce((sum, apt) => sum + apt.estimatedDuration, 0) / appointments.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Appointment Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer appointments booked through your voice AI assistant
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              Total Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.confirmed}</div>
            <div className="text-xs text-primary mt-1">Ready to serve</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-primary" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.pending}</div>
            <div className="text-xs text-yellow-600 mt-1">Need confirmation</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{todayAppointments}</div>
            <div className="text-xs text-muted-foreground mt-1">Scheduled</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-primary" />
              Via AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.viaAI}</div>
            <div className="text-xs text-primary mt-1">{Math.round((stats.viaAI / stats.total) * 100)}% automated</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary">
            Appointments ({filteredAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex flex-col items-center space-y-1">
                      {getServiceIcon(appointment.serviceType)}
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-secondary">{appointment.customerName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3" />
                              {appointment.customerPhone}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(appointment.date).toLocaleDateString('en-GB')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {appointment.time} ({appointment.estimatedDuration}min)
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-secondary">
                            {formatServiceType(appointment.serviceType)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Booked via: {appointment.bookedVia.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm text-secondary">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      {getStatusIcon(appointment.status)}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No appointments found matching your criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['repair', 'consultation', 'custom_build', 'warranty_service'].map((type) => {
                const count = appointments.filter(a => a.serviceType === type).length
                const percentage = Math.round((count / appointments.length) * 100)
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getServiceIcon(type)}
                      <span className="text-sm font-medium">{formatServiceType(type)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-secondary">{count}</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">AI Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round((stats.viaAI / stats.total) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                Appointments booked via Voice AI
              </div>
              <div className="bg-muted rounded-full h-2 w-full">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(stats.viaAI / stats.total) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {stats.viaAI} of {stats.total} appointments
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Efficiency Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {Math.round(avgDuration)} min
                </div>
                <div className="text-xs text-muted-foreground">Average Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {Math.round((stats.completed / stats.total) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {todayAppointments}
                </div>
                <div className="text-xs text-muted-foreground">Today's Schedule</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Appointments