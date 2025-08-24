import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Lock, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginScreenProps {
  onLogin: () => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Check if code matches "armenius"
    if (code.toLowerCase() === 'armenius') {
      setIsSuccess(true)
      
      // Wait for animation then call onLogin
      setTimeout(() => {
        onLogin()
      }, 2000)
    } else {
      setError('Invalid access code. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary/80 p-4">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Armenius Voice AI
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enterprise Platform Access
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="access-code" className="text-sm font-medium text-gray-700">
                      Access Code
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="access-code"
                        type="password"
                        placeholder="Enter access code"
                        value={code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold transition-all duration-200"
                    disabled={isLoading || !code.trim()}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Access Platform'
                    )}
                  </Button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Powered by <span className="font-semibold text-primary">Qualia Solutions</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success-animation"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="mx-auto mb-6"
            >
              <div className="bg-green-500 rounded-full p-6 shadow-2xl">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
              <p className="text-white/80 text-lg">Access granted. Redirecting to platform...</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8"
            >
              <div className="bg-white/20 rounded-full h-2 w-64 mx-auto overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LoginScreen