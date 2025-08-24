import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import LoginScreen from '@/components/LoginScreen'
import Dashboard from '@/pages/Dashboard'
import Operations from '@/pages/Operations'
import Assistant from '@/pages/Assistant'
import Analytics from '@/pages/Analytics'
import Appointments from '@/pages/Appointments'
import Customers from '@/pages/Customers'
import Costs from '@/pages/Costs'
import Settings from '@/pages/Settings'
import '@/globals.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already authenticated on app load
  useEffect(() => {
    const authStatus = localStorage.getItem('armenius-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('armenius-auth', 'true')
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />
        <Route 
          path="/operations" 
          element={
            <Layout>
              <Operations />
            </Layout>
          } 
        />
        <Route 
          path="/assistant" 
          element={
            <Layout>
              <Assistant />
            </Layout>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <Layout>
              <Analytics />
            </Layout>
          } 
        />
        <Route 
          path="/appointments" 
          element={
            <Layout>
              <Appointments />
            </Layout>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <Layout>
              <Customers />
            </Layout>
          } 
        />
        <Route 
          path="/costs" 
          element={
            <Layout>
              <Costs />
            </Layout>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <Layout>
              <Settings />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App