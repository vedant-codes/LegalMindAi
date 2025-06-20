"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { Brain, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { ErrorPopup } from "../components/error-popup"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate validation
      if (formData.email === "test@example.com" && formData.password === "password") {
        navigate("/dashboard")
      } else {
        throw new Error("Invalid email or password. Please check your credentials and try again.")
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    try {
      // Simulate Google sign in
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Simulate random error for demo
      if (Math.random() > 0.7) {
        throw new Error("Google sign-in failed. Please try again or use email sign-in.")
      }
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
  }

  const handleMicrosoftSignIn = async () => {
    setError("")
    try {
      // Simulate Microsoft sign in
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Simulate random error for demo
      if (Math.random() > 0.7) {
        throw new Error("Microsoft sign-in is temporarily unavailable. Please try email sign-in.")
      }
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Error Popup */}
      <ErrorPopup error={error} onClose={() => setError("")} duration={6000} />

      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-50"></div>
      <div className="absolute inset-0 hero-grid opacity-30"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 float-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-20 float-medium"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-green-200 rounded-full opacity-20 float-fast"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-orange-200 rounded-full opacity-20 float-slow"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back to Home */}
        <motion.div className="mb-6" whileHover={{ x: -5 }}>
          <Link to="/" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">
              Sign in to your LegalMind.AI account to continue analyzing legal documents
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Sign In */}
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full h-12 border-slate-300 hover:bg-slate-50"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full h-12 border-slate-300 hover:bg-slate-50"
                  onClick={handleMicrosoftSignIn}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z" />
                    <path fill="#00A4EF" d="M13 1h10v10H13z" />
                    <path fill="#7FBA00" d="M1 13h10v10H1z" />
                    <path fill="#FFB900" d="M13 13h10v10H13z" />
                  </svg>
                  Continue with Microsoft
                </Button>
              </motion.div>
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-sm text-slate-500">or continue with email</span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-slate-300" disabled={isLoading} />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </motion.div>
            </form>

            <div className="text-center">
              <span className="text-slate-600">Don't have an account? </span>
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-sm text-slate-500 mb-4">Trusted by 5,000+ legal professionals</p>
          <div className="flex justify-center space-x-6 opacity-60">
            <div className="text-xs text-slate-400">🔒 Bank-level Security</div>
            <div className="text-xs text-slate-400">⚡ 99.9% Uptime</div>
            <div className="text-xs text-slate-400">🛡️ SOC 2 Compliant</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
