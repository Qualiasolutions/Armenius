import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Phone,
  MessageSquare,
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  Clock,
  Euro,
  Filter,
  Download,
  Search,
  User,
  Heart,
  ShoppingBag
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone: string
  location: string
  totalCalls: number
  lastCall: string
  avgDuration: number
  totalSpent: number
  satisfaction: number
  preferredLanguage: 'en' | 'el'
  favoriteProducts: string[]
  callHistory: Array<{
    date: string
    duration: number
    topic: string
    satisfaction: number
  }>
}

const Customers: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock customer data
  const customers: Customer[] = [
    {
      id: 'cust-001',
      name: 'Nikos Papadopoulos',
      phone: '+357 99 123 456',
      location: 'Nicosia, Cyprus',
      totalCalls: 8,
      lastCall: '2024-01-24',
      avgDuration: 185,
      totalSpent: 1250.00,
      satisfaction: 4.8,
      preferredLanguage: 'el',
      favoriteProducts: ['Graphics Cards', 'Gaming PCs'],
      callHistory: [
        { date: '2024-01-24', duration: 142, topic: 'RTX 4090 Inquiry', satisfaction: 5 },
        { date: '2024-01-20', duration: 201, topic: 'Price Check', satisfaction: 4 },
        { date: '2024-01-15', duration: 156, topic: 'Store Hours', satisfaction: 5 }
      ]
    },
    {
      id: 'cust-002',
      name: 'Maria Christou',
      phone: '+357 96 789 123',
      location: 'Limassol, Cyprus',
      totalCalls: 5,
      lastCall: '2024-01-23',
      avgDuration: 167,
      totalSpent: 850.00,
      satisfaction: 4.6,
      preferredLanguage: 'en',
      favoriteProducts: ['Laptops', 'Accessories'],
      callHistory: [
        { date: '2024-01-23', duration: 189, topic: 'Laptop Recommendation', satisfaction: 5 },
        { date: '2024-01-18', duration: 134, topic: 'Warranty Info', satisfaction: 4 },
        { date: '2024-01-12', duration: 178, topic: 'Gaming Setup', satisfaction: 5 }
      ]
    },
    {
      id: 'cust-003',
      name: 'Andreas Georgiou',
      phone: '+357 97 456 789',
      location: 'Paphos, Cyprus',
      totalCalls: 12,
      lastCall: '2024-01-22',
      avgDuration: 201,
      totalSpent: 2100.00,
      satisfaction: 3.8,
      preferredLanguage: 'el',
      favoriteProducts: ['Workstations', 'Professional Hardware'],
      callHistory: [
        { date: '2024-01-22', duration: 245, topic: 'Warranty Claim', satisfaction: 3 },
        { date: '2024-01-19', duration: 187, topic: 'Repair Status', satisfaction: 4 },
        { date: '2024-01-16', duration: 201, topic: 'Technical Support', satisfaction: 4 }
      ]
    },
    {
      id: 'cust-004',
      name: 'Elena Dimitriou',
      phone: '+357 95 321 654',
      location: 'Larnaca, Cyprus',
      totalCalls: 3,
      lastCall: '2024-01-21',
      avgDuration: 134,
      totalSpent: 450.00,
      satisfaction: 4.9,
      preferredLanguage: 'en',
      favoriteProducts: ['Memory', 'Storage'],
      callHistory: [
        { date: '2024-01-21', duration: 98, topic: 'RAM Upgrade', satisfaction: 5 },
        { date: '2024-01-17', duration: 156, topic: 'SSD Options', satisfaction: 5 },
        { date: '2024-01-14', duration: 148, topic: 'Price Inquiry', satisfaction: 5 }
      ]
    }
  ]

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-primary'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const stats = {
    totalCustomers: customers.length,
    avgSatisfaction: customers.reduce((sum, c) => sum + c.satisfaction, 0) / customers.length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    repeatCustomers: customers.filter(c => c.totalCalls > 1).length,
    avgCallsPerCustomer: customers.reduce((sum, c) => sum + c.totalCalls, 0) / customers.length,
    preferredLanguage: {
      greek: customers.filter(c => c.preferredLanguage === 'el').length,
      english: customers.filter(c => c.preferredLanguage === 'en').length
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Customer Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights and analytics for customers who interact with your voice AI assistant
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.totalCustomers}</div>
            <div className="text-xs text-muted-foreground mt-1">Active users</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Star className="mr-2 h-4 w-4 text-primary" />
              Avg Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSatisfactionColor(stats.avgSatisfaction)}`}>
              {stats.avgSatisfaction.toFixed(1)}/5
            </div>
            <div className="text-xs text-primary mt-1">Excellent rating</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Euro className="mr-2 h-4 w-4 text-primary" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">€{stats.totalSpent.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">All customers</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Heart className="mr-2 h-4 w-4 text-primary" />
              Repeat Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.repeatCustomers}</div>
            <div className="text-xs text-primary mt-1">
              {Math.round((stats.repeatCustomers / stats.totalCustomers) * 100)}% retention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Phone className="mr-2 h-4 w-4 text-primary" />
              Avg Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.avgCallsPerCustomer.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">Per customer</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-primary" />
              Top Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {stats.preferredLanguage.greek > stats.preferredLanguage.english ? 'Greek' : 'English'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.max(stats.preferredLanguage.greek, stats.preferredLanguage.english)} customers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center justify-between">
              <span className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Customer Directory
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div 
                  key={customer.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedCustomer === customer.id ? 'bg-primary/10 border-primary' : 'bg-background border-gray-200'
                  }`}
                  onClick={() => setSelectedCustomer(customer.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary">{customer.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {customer.location.split(',')[0]}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-xs bg-muted rounded-full px-2 py-1">
                          {customer.totalCalls} calls
                        </div>
                        <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                          €{customer.totalSpent.toLocaleString()}
                        </div>
                        <div className={`text-xs rounded-full px-2 py-1 flex items-center ${getSatisfactionColor(customer.satisfaction)} bg-current bg-opacity-10`}>
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          {customer.satisfaction}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">
              {selectedCustomerData ? 'Customer Profile' : 'Select a Customer'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCustomerData ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-secondary">{selectedCustomerData.name}</h2>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {selectedCustomerData.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {selectedCustomerData.location}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          {selectedCustomerData.preferredLanguage === 'el' ? 'Greek' : 'English'}
                        </div>
                      </div>
                    </div>
                    <div className={`text-right ${getSatisfactionColor(selectedCustomerData.satisfaction)}`}>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-current" />
                        <span className="text-lg font-bold">{selectedCustomerData.satisfaction}/5</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Customer Rating</div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedCustomerData.totalCalls}</div>
                    <div className="text-xs text-muted-foreground">Total Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">€{selectedCustomerData.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{formatDuration(selectedCustomerData.avgDuration)}</div>
                    <div className="text-xs text-muted-foreground">Avg Call Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {new Date(selectedCustomerData.lastCall).toLocaleDateString('en-GB')}
                    </div>
                    <div className="text-xs text-muted-foreground">Last Contact</div>
                  </div>
                </div>

                {/* Favorite Products */}
                <div>
                  <h3 className="text-sm font-medium text-secondary mb-3">Favorite Product Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomerData.favoriteProducts.map((product) => (
                      <div key={product} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <ShoppingBag className="mr-1 h-3 w-3" />
                        {product}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Call History */}
                <div>
                  <h3 className="text-sm font-medium text-secondary mb-3">Recent Call History</h3>
                  <div className="space-y-3">
                    {selectedCustomerData.callHistory.slice(0, 3).map((call, index) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-secondary text-sm">{call.topic}</div>
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(call.date).toLocaleDateString('en-GB')}
                              <Clock className="ml-2 mr-1 h-3 w-3" />
                              {formatDuration(call.duration)}
                            </div>
                          </div>
                          <div className={`flex items-center ${getSatisfactionColor(call.satisfaction)}`}>
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            <span className="text-sm font-medium">{call.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button size="sm" className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Customer
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <User className="mr-2 h-4 w-4" />
                    View Full Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a customer from the list to view detailed analytics and interaction history
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Top Spenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 4)
                .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-secondary w-4">#{index + 1}</div>
                    <div>
                      <div className="font-medium text-secondary text-sm">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.totalCalls} calls</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">€{customer.totalSpent.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Most Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers
                .sort((a, b) => b.totalCalls - a.totalCalls)
                .slice(0, 4)
                .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-secondary w-4">#{index + 1}</div>
                    <div>
                      <div className="font-medium text-secondary text-sm">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{formatDuration(customer.avgDuration)} avg</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{customer.totalCalls} calls</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Satisfaction Leaders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers
                .sort((a, b) => b.satisfaction - a.satisfaction)
                .slice(0, 4)
                .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-secondary w-4">#{index + 1}</div>
                    <div>
                      <div className="font-medium text-secondary text-sm">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.totalCalls} interactions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold flex items-center ${getSatisfactionColor(customer.satisfaction)}`}>
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      {customer.satisfaction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Customers