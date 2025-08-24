import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Phone,
  Users,
  Calendar,
  Settings,
  Activity,
  Euro,
  PieChart,
  Headphones,
  Building2
} from 'lucide-react'

const menuItems = [
  { 
    title: 'Executive Dashboard', 
    icon: BarChart3, 
    path: '/dashboard',
    description: 'Business KPIs and overview'
  },
  { 
    title: 'Live Operations', 
    icon: Phone, 
    path: '/operations',
    description: 'Monitor active conversations'
  },
  { 
    title: 'Voice Assistant', 
    icon: Headphones, 
    path: '/assistant',
    description: 'Manage AI configuration'
  },
  { 
    title: 'Business Intelligence', 
    icon: PieChart, 
    path: '/analytics',
    description: 'Advanced analytics'
  },
  { 
    title: 'Appointments', 
    icon: Calendar, 
    path: '/appointments',
    description: 'Booking management'
  },
  { 
    title: 'Customer Analytics', 
    icon: Users, 
    path: '/customers',
    description: 'Customer insights'
  },
  { 
    title: 'Cost & ROI', 
    icon: Euro, 
    path: '/costs',
    description: 'Financial tracking'
  },
  { 
    title: 'Configuration', 
    icon: Settings, 
    path: '/settings',
    description: 'System settings'
  }
]

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  return (
    <div className="flex h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-gradient-to-b from-secondary to-secondary/80 flex flex-col border-r border-secondary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary border-b border-white/10 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Armenius Voice AI</h2>
              <p className="text-xs text-white/80">Enterprise Platform</p>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                  "text-white/90 hover:text-white hover:bg-white/10 hover:scale-[1.02]",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  currentPath === item.path 
                    ? "bg-primary/30 text-white shadow-lg scale-[1.02]" 
                    : ""
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{item.title}</span>
                  <span className="text-xs text-white/60">{item.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-secondary to-primary border-t border-white/10 p-4">
          <div className="text-center">
            <div className="text-xs text-white/70 mb-2">Powered by</div>
            <div className="text-sm font-bold text-white">Qualia Solutions</div>
            <div className="text-xs text-white/50 mt-1">v1.0.0</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="outline" className="shadow-sm">
              <Activity className="mr-2 h-4 w-4" />
              System Status
            </Button>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-muted/30">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout