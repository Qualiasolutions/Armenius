import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { 
  Euro, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calculator,
  Target,
  AlertTriangle,
  DollarSign,
  Phone,
  Clock,
  Calendar,
  Download
} from 'lucide-react'
import { 
  Bar, 
  BarChart, 
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

const Costs: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock cost data
  const dailyCosts = [
    { date: 'Mon', aiCosts: 12.45, voiceCosts: 8.30, totalCosts: 20.75, calls: 45 },
    { date: 'Tue', aiCosts: 14.20, voiceCosts: 9.80, totalCosts: 24.00, calls: 52 },
    { date: 'Wed', aiCosts: 10.15, voiceCosts: 7.25, totalCosts: 17.40, calls: 38 },
    { date: 'Thu', aiCosts: 16.80, voiceCosts: 11.50, totalCosts: 28.30, calls: 61 },
    { date: 'Fri', aiCosts: 13.25, voiceCosts: 9.10, totalCosts: 22.35, calls: 49 },
    { date: 'Sat', aiCosts: 8.90, voiceCosts: 5.60, totalCosts: 14.50, calls: 28 },
    { date: 'Sun', aiCosts: 6.75, voiceCosts: 4.20, totalCosts: 10.95, calls: 19 }
  ]

  const costBreakdown = [
    { category: 'OpenAI API', cost: 187.45, percentage: 45, color: '#2D9B87' },
    { category: 'ElevenLabs TTS', cost: 142.30, percentage: 34, color: '#4CAF50' },
    { category: 'Deepgram STT', cost: 62.15, percentage: 15, color: '#FF9800' },
    { category: 'Vapi Platform', cost: 25.10, percentage: 6, color: '#9C27B0' }
  ]

  const monthlyTrend = [
    { month: 'Aug', cost: 298.45, calls: 892, efficiency: 0.33 },
    { month: 'Sep', cost: 342.80, calls: 1024, efficiency: 0.33 },
    { month: 'Oct', cost: 389.20, calls: 1186, efficiency: 0.33 },
    { month: 'Nov', cost: 421.67, calls: 1247, efficiency: 0.34 },
    { month: 'Dec', cost: 456.30, calls: 1389, efficiency: 0.33 },
    { month: 'Jan', cost: 417.00, calls: 1312, efficiency: 0.32 }
  ]

  const budgetTargets = {
    monthly: 500.00,
    perCall: 0.40,
    aiModel: 200.00,
    voiceServices: 180.00
  }

  const currentPeriodStats = {
    totalCost: 421.67,
    totalCalls: 1247,
    costPerCall: 0.34,
    aiCosts: 187.45,
    voiceCosts: 234.22,
    savings: 78.33,
    efficiency: 87.3,
    budgetUsed: 84.3
  }

  const chartConfig: ChartConfig = {
    aiCosts: {
      label: "AI Costs",
      color: "#2D9B87",
    },
    voiceCosts: {
      label: "Voice Costs",
      color: "#4CAF50",
    },
    totalCosts: {
      label: "Total Costs",
      color: "#3B4A5C",
    }
  }

  const roiMetrics = {
    automationSavings: 2847.50,
    timeValueSaved: 45.6, // hours
    humanAgentCost: 25.00, // per hour
    totalROI: 178.4, // percentage
    paybackPeriod: 2.3 // months
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Cost & ROI Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Financial performance analysis and cost optimization for your voice AI assistant
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-primary">Qualia Solutions</span>
          </div>
        </div>
      </div>

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Euro className="mr-2 h-4 w-4 text-primary" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">€{currentPeriodStats.totalCost.toFixed(2)}</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingDown className="mr-1 h-3 w-3" />
              -€12.30 vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Calculator className="mr-2 h-4 w-4 text-primary" />
              Cost per Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">€{currentPeriodStats.costPerCall.toFixed(2)}</div>
            <div className="text-xs text-primary flex items-center mt-1">
              Under target (€{budgetTargets.perCall})
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Budget Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{currentPeriodStats.budgetUsed}%</div>
            <div className="text-xs text-green-600 flex items-center mt-1">
              €{(budgetTargets.monthly - currentPeriodStats.totalCost).toFixed(2)} remaining
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-primary" />
              Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{currentPeriodStats.efficiency}%</div>
            <div className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              Above benchmark
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-primary" />
              Monthly Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">€{currentPeriodStats.savings.toFixed(2)}</div>
            <div className="text-xs text-primary flex items-center mt-1">
              vs manual handling
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Cost Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Daily Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={dailyCosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="aiCosts" fill="#2D9B87" name="AI Costs" />
                <Bar dataKey="voiceCosts" fill="#4CAF50" name="Voice Costs" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cost Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-primary" />
              Cost Distribution by Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={costBreakdown} cx="50%" cy="50%" outerRadius={80}>
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <ChartTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {costBreakdown.map((item) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-xs">
                    <div className="font-medium text-secondary">{item.category}</div>
                    <div className="text-muted-foreground">€{item.cost.toFixed(2)} ({item.percentage}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Return on Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{roiMetrics.totalROI}%</div>
                <div className="text-sm text-muted-foreground">Total ROI</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">€{roiMetrics.automationSavings.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Automation Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{roiMetrics.timeValueSaved}h</div>
                  <div className="text-xs text-muted-foreground">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{roiMetrics.paybackPeriod}</div>
                  <div className="text-xs text-muted-foreground">Payback Period (months)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">€{roiMetrics.humanAgentCost}</div>
                  <div className="text-xs text-muted-foreground">Human Agent Cost/hr</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <div className="text-sm font-medium text-primary mb-2">Monthly Value Generated</div>
                <div className="text-xs text-muted-foreground">
                  AI handles {currentPeriodStats.totalCalls} calls at €{currentPeriodStats.costPerCall.toFixed(2)} each, 
                  saving €{(roiMetrics.automationSavings/12).toFixed(2)}/month vs human agents
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary flex items-center">
              <Target className="mr-2 h-5 w-5 text-primary" />
              Budget Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Monthly Budget */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary">Monthly Budget</span>
                  <span className="text-sm font-bold">€{currentPeriodStats.totalCost.toFixed(2)} / €{budgetTargets.monthly.toFixed(2)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${currentPeriodStats.budgetUsed}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {currentPeriodStats.budgetUsed}% used, €{(budgetTargets.monthly - currentPeriodStats.totalCost).toFixed(2)} remaining
                </div>
              </div>

              {/* Per Call Budget */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary">Per Call Target</span>
                  <span className="text-sm font-bold">€{currentPeriodStats.costPerCall.toFixed(2)} / €{budgetTargets.perCall.toFixed(2)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(currentPeriodStats.costPerCall / budgetTargets.perCall) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Under target by €{(budgetTargets.perCall - currentPeriodStats.costPerCall).toFixed(2)} per call
                </div>
              </div>

              {/* Service Budgets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Model Costs</span>
                  <span className="font-medium">€{currentPeriodStats.aiCosts.toFixed(2)} / €{budgetTargets.aiModel.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Voice Services</span>
                  <span className="font-medium">€{currentPeriodStats.voiceCosts.toFixed(2)} / €{budgetTargets.voiceServices.toFixed(2)}</span>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Budget Performance: Excellent</span>
                </div>
                <div className="text-xs text-green-700 mt-1">
                  All cost metrics are within target ranges
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            6-Month Cost & Efficiency Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="cost" orientation="left" />
                <YAxis yAxisId="efficiency" orientation="right" />
                <ChartTooltip />
                <Line 
                  yAxisId="cost"
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#2D9B87" 
                  strokeWidth={2}
                  dot={{ fill: '#2D9B87', strokeWidth: 2 }}
                  name="Total Cost (€)"
                />
                <Line 
                  yAxisId="efficiency"
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  dot={{ fill: '#4CAF50', strokeWidth: 2 }}
                  name="Cost per Call (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary">Cost Optimization Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Model Optimization</span>
              </div>
              <div className="text-sm text-blue-700 mb-2">
                Switch to GPT-4o-mini for simple queries
              </div>
              <div className="text-xs text-blue-600">
                Potential saving: €45/month
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Response Caching</span>
              </div>
              <div className="text-sm text-green-700 mb-2">
                Cache common responses for FAQ
              </div>
              <div className="text-xs text-green-600">
                Potential saving: €32/month
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Phone className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-medium text-purple-800">Call Routing</span>
              </div>
              <div className="text-sm text-purple-700 mb-2">
                Optimize call duration limits
              </div>
              <div className="text-xs text-purple-600">
                Potential saving: €28/month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Costs