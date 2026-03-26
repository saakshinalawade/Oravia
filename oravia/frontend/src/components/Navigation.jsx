import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Video, Volume2, Mic, Headphones, Home, Sparkles, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navigation = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/dubbing', icon: Video, label: 'Dubbing Studio' },
    { path: '/tts', icon: Volume2, label: 'Text-to-Speech' },
    { path: '/stt', icon: Mic, label: 'Speech-to-Text' },
    { path: '/noise-removal', icon: Headphones, label: 'Noise Removal' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const hoverVariants = {
    rest: {
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  const iconVariants = {
    rest: { 
      scale: 1,
      rotate: 0
    },
    hover: { 
      scale: 1.2,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-effect border-b border-white/20 backdrop-blur-xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatDelay: 5
                }}
                className="flex-shrink-0 flex items-center"
              >
                <div className="relative">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center"
                  >
                    <Volume2 className="h-5 w-5 text-white" />
                  </motion.div>
                  
                  {/* Floating sparkle */}
                  <motion.div
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      y: [0, -10, 0],
                      x: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                  </motion.div>
                </div>
                
                <motion.span 
                  className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
                  whileHover={{ 
                    backgroundPosition: ['0%', '100%'],
                  }}
                  transition={{ duration: 1 }}
                >
                  Oravia
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex space-x-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <motion.div
                    key={item.path}
                    variants={itemVariants}
                    custom={index}
                    className="relative"
                    onHoverStart={() => setHoveredItem(item.path)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <Link to={item.path}>
                      <motion.div
                        variants={hoverVariants}
                        initial="rest"
                        whileHover="hover"
                        className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-500 border border-primary-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {/* Background glow effect */}
                        <motion.div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                            isActive ? 'opacity-20' : ''
                          }`}
                        />
                        
                        <div className="flex items-center relative z-10">
                          <motion.div
                            variants={iconVariants}
                            initial="rest"
                            whileHover="hover"
                          >
                            <Icon className="h-4 w-4 mr-2" />
                          </motion.div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          />
                        )}

                        {/* Hover effect line */}
                        <motion.div
                          className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 group-hover:w-full transition-all duration-300"
                          initial={false}
                          animate={{ width: hoveredItem === item.path ? '100%' : '0%' }}
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Mobile menu button */}
            <motion.div 
              className="md:hidden flex items-center"
              whileTap={{ scale: 0.9 }}
            >
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Mobile menu */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 border-l border-white/10 z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="ml-3 text-lg font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                        Oravia
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Mobile navigation items */}
                <motion.div 
                  className="flex-1 p-6 space-y-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    
                    return (
                      <motion.div
                        key={item.path}
                        variants={itemVariants}
                        custom={index}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-500 border border-primary-500/30'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <motion.div
                              animate={{ 
                                rotate: isActive ? [0, 5, -5, 0] : 0,
                                scale: isActive ? 1.1 : 1
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <Icon className="h-5 w-5 mr-3" />
                            </motion.div>
                            <span className="font-medium">{item.label}</span>
                            
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                              />
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.div>

                {/* Mobile footer */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 border-t border-white/10"
                >
                  <div className="text-center text-gray-400 text-sm">
                    AI-Powered Dubbing Platform
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  )
}

export default Navigation