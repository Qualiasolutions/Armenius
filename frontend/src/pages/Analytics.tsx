import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Users,
  Clock,
  Phone,
  Euro
} from 'lucide-react'
import { 
  Bar, 
  BarChart, 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const Analytics: React.FC = () => {
  // Mock analytics data
  const dailyCallsData = [
    { date: 'Mon', calls: 45, successful: 38, escalated: 7 },
    { date: 'Tue', calls: 52, successful: 46, escalated: 6 },
    { date: 'Wed', calls: 38, successful: 33, escalated: 5 },
    { date: 'Thu', calls: 61, successful: 54, escalated: 7 },
    { date: 'Fri', calls: 49, successful: 41, escalated: 8 },
    { date: 'Sat', calls: 28, successful: 25, escalated: 3 },
    { date: 'Sun', calls: 19, successful: 17, escalated: 2 }
  ]

  const topicsData = [
    { topic: 'Product Inquiries', count: 156, percentage: 42 },
    { topic: 'Store Information', count: 89, percentage: 24 },
    { topic: 'Appointments', count: 67, percentage: 18 },
    { topic: 'Technical Support', count: 34, percentage: 9 },
    { topic: 'Warranty Claims', count: 26, percentage: 7 }
  ]

  const satisfactionData = [
    { rating: 'Excellent', count: 234, color: '#2D9B87' },
    { rating: 'Good', count: 156, color: '#4CAF50' },
    { rating: 'Average', count: 45, color: '#FFC107' },
    { rating: 'Poor', count: 12, color: '#FF5722' }
  ]

  const hourlyData = [
    { hour: '09:00', calls: 12 },
    { hour: '10:00', calls: 18 },
    { hour: '11:00', calls: 25 },
    { hour: '12:00', calls: 31 },
    { hour: '13:00', calls: 28 },
    { hour: '14:00', calls: 35 },
    { hour: '15:00', calls: 42 },
    { hour: '16:00', calls: 38 },
    { hour: '17:00', calls: 29 },
    { hour: '18:00', calls: 15 }
  ]

  const chartConfig: ChartConfig = {
    calls: {
      label: "Total Calls",
      color: "#2D9B87",
    },
    successful: {
      label: "Successful",
      color: "#4CAF50",
    },
    escalated: {
      label: "Escalated",
      color: "#FF5722",
    }
  }

  const kpiData = {
    totalCalls: 1247,
    successRate: 87.3,
    avgDuration: 154, // seconds
    totalCost: 421.67,
    topLanguage: "Greek",
    peakHour: "15:00",
    customerSatisfaction: 4.2,
    automationRate: 78.4
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Business Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Advanced analytics and performance insights for your voice AI assistant
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <Phone className="mr-1 h-3 w-3 text-primary" />
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{kpiData.totalCalls.toLocaleString()}</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <BarChart3 className="mr-1 h-3 w-3 text-primary" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{kpiData.successRate}%</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              Above target
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <Clock className="mr-1 h-3 w-3 text-primary" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{formatDuration(kpiData.avgDuration)}</div>
            <div className="text-xs text-muted-foreground mt-1">Per call</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <Euro className="mr-1 h-3 w-3 text-primary" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">€{kpiData.totalCost}</div>
            <div className="text-xs text-primary flex items-center mt-1">
              Under budget
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <Users className="mr-1 h-3 w-3 text-primary" />
              Top Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{kpiData.topLanguage}</div>
            <div className="text-xs text-muted-foreground mt-1">62% of calls</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <Calendar className="mr-1 h-3 w-3 text-primary" />
              Peak Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{kpiData.peakHour}</div>
            <div className="text-xs text-muted-foreground mt-1">Highest volume</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{kpiData.customerSatisfaction}/5</div>
            <div className="text-xs text-primary flex items-center mt-1">
              Excellent rating
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <PieChart className="mr-1 h-3 w-3 text-primary" />
              Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{kpiData.automationRate}%</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              Above target
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Calls Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Daily Call Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={dailyCallsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="successful" fill="#4CAF50" name="Successful" />
                <Bar dataKey="escalated" fill="#FF5722" name="Escalated" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-primary" />
              Customer Satisfaction Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={satisfactionData} cx="50%" cy="50%" outerRadius={80}>
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <ChartTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {satisfactionData.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.rating} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Most Common Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topicsData.map((topic, index) => (
                <div key={topic.topic} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-secondary w-4">#{index + 1}</div>
                    <div>
                      <div className="font-medium text-secondary">{topic.topic}</div>
                      <div className="text-xs text-muted-foreground">{topic.percentage}% of calls</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-secondary">{topic.count}</div>
                    <div className="w-16 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${topic.percentage * 2}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Hourly Call Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#2D9B87" 
                    strokeWidth={2}
                    dot={{ fill: '#2D9B87', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">87.3%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-xs text-secondary mt-1 flex items-center justify-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +5.2% vs last month
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">2:34</div>
              <div className="text-sm text-muted-foreground">Avg Call Duration</div>
              <div className="text-xs text-secondary mt-1 flex items-center justify-center">
                <TrendingDown className="mr-1 h-3 w-3" />
                -15s vs target
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">€0.34</div>
              <div className="text-sm text-muted-foreground">Cost per Call</div>
              <div className="text-xs text-secondary mt-1">Within budget range</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">4.2/5</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
              <div className="text-xs text-secondary mt-1">Excellent satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics