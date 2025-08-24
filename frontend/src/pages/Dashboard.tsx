import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Phone, 
  Users, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Euro
} from 'lucide-react'

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const kpis = {
    totalCalls: 1247,
    activeConversations: 8,
    customerSatisfaction: 94,
    averageCallDuration: '2:34',
    costPerCall: 0.32,
    automationRate: 78
  }

  const recentActivities = [
    { id: 1, type: 'call_completed', customer: 'Nikos Papadopoulos', time: '2 mins ago', status: 'success' },
    { id: 2, type: 'appointment_booked', customer: 'Maria Christou', time: '5 mins ago', status: 'success' },
    { id: 3, type: 'escalation', customer: 'Andreas Georgiou', time: '8 mins ago', status: 'warning' },
    { id: 4, type: 'product_inquiry', customer: 'Elena Dimitriou', time: '12 mins ago', status: 'success' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of your voice AI assistant performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Phone className="mr-2 h-4 w-4 text-primary" />
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{kpis.totalCalls.toLocaleString()}</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              Live Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{kpis.activeConversations}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Currently active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
              Satisfaction Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{kpis.customerSatisfaction}%</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              Excellent rating
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Avg Call Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{kpis.averageCallDuration}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Per conversation
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Euro className="mr-2 h-4 w-4 text-primary" />
              Cost per Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">€{kpis.costPerCall}</div>
            <div className="text-xs text-primary flex items-center mt-1">
              Within budget target
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              Automation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{kpis.automationRate}%</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              Above target
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-secondary">
              <AlertCircle className="mr-2 h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-primary' : 
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-secondary">{activity.customer}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {activity.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center space-y-2">
                <Phone className="h-6 w-6" />
                <span className="text-sm">Monitor Live Calls</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Customer Insights</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">System Status</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary">Today's Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">152</div>
              <div className="text-sm text-muted-foreground">Calls Handled</div>
              <div className="text-xs text-secondary mt-1">+23% vs yesterday</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">€48.64</div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="text-xs text-secondary mt-1">Within budget</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-sm text-muted-foreground">Appointments Booked</div>
              <div className="text-xs text-secondary mt-1">High conversion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard