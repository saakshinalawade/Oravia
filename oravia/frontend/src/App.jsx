import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import DubbingStudio from './components/DubbingStudio'
import TTSGenerator from './components/TTSGenerator'
import STTTranscriber from './components/STTTranscriber'
import NoiseRemover from './components/NoiseRemover'
import Navigation from './components/Navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  )
}

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 flex items-center justify-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-white text-2xl font-bold"
        >
          D
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Page Transition Wrapper
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

// Route-specific background variations
const getRouteBackground = (pathname) => {
  const backgrounds = {
    '/': 'from-gray-900 via-gray-800 to-gray-900',
    '/dubbing': 'from-blue-900/20 via-gray-800 to-purple-900/20',
    '/tts': 'from-green-900/20 via-gray-800 to-cyan-900/20',
    '/stt': 'from-orange-900/20 via-gray-800 to-red-900/20',
    '/noise-removal': 'from-purple-900/20 via-gray-800 to-pink-900/20'
  }
  return backgrounds[pathname] || backgrounds['/']
}

// Main App Content with routing
const AppContent = () => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getRouteBackground(location.pathname)} transition-all duration-500`}>
      <AnimatedBackground />
      <Navigation />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              } 
            />
            <Route 
              path="/dubbing" 
              element={
                <PageTransition>
                  <DubbingStudio />
                </PageTransition>
              } 
            />
            <Route 
              path="/tts" 
              element={
                <PageTransition>
                  <TTSGenerator />
                </PageTransition>
              } 
            />
            <Route 
              path="/stt" 
              element={
                <PageTransition>
                  <STTTranscriber />
                </PageTransition>
              } 
            />
            <Route 
              path="/noise-removal" 
              element={
                <PageTransition>
                  <NoiseRemover />
                </PageTransition>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}

// Enhanced Footer Component
const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="relative z-10 border-t border-white/10 bg-gray-900/50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                Oravia
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered audio processing platform for professional content creation.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1"
          >
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Audio Dubbing</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Text-to-Speech</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Speech-to-Text</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Noise Removal</li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1"
          >
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">API Reference</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1"
          >
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-primary-400 transition-colors cursor-pointer">About</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">Privacy</li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Oravia. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
            >
              Twitter
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
            >
              LinkedIn
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
            >
              GitHub
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

// Error Boundary Component (for production)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-red-400">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-4">We're working on fixing the issue. Please try refreshing the page.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Refresh Page
            </motion.button>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App