import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Video, Volume2, Mic, Headphones, ArrowRight, Star, Play, Zap, Globe, Users, Sparkles, Cloud, Shield, Zap as Lightning } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Custom useInView hook (no external dependencies needed)
const useInView = (options = {}) => {
  const [ref, setRef] = useState(null)
  const [inView, setInView] = useState(false)
  const [entry, setEntry] = useState(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
      setEntry(entry)
    }, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '0px',
      triggerOnce: options.triggerOnce || false
    })

    observer.observe(ref)

    return () => {
      observer.unobserve(ref)
    }
  }, [ref, options.threshold, options.rootMargin, options.triggerOnce])

  return [setRef, inView, entry]
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
}

const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Particle Background Component
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Feature Card with more animations
const AnimatedFeatureCard = ({ feature, index }) => {
  const [setRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [isHovered, setIsHovered] = useState(false)

  const Icon = feature.icon

  return (
    <motion.div
      ref={setRef}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      custom={index}
      className="relative overflow-hidden group cursor-pointer"
    >
      {/* Animated Gradient Border */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Main Card */}
      <div className="relative bg-gray-800/90 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 group-hover:border-transparent transition-all duration-500 h-full">
        {/* Animated Icon Container */}
        <motion.div 
          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 relative overflow-hidden`}
          whileHover={{ 
            rotate: [0, -5, 5, 0],
            scale: 1.1
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-6 w-6 text-white z-10" />
          
          {/* Particle effects on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: Math.cos(i * 120) * 30,
                      y: Math.sin(i * 120) * 30
                    }}
                    transition={{ 
                      duration: 0.8,
                      delay: i * 0.1 
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Shine effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: isHovered ? ["100%", "-100%"] : "100%" }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.h3 
          className="text-xl font-bold mb-3 text-white transition-colors duration-300"
          animate={{ color: isHovered ? "#ffffff" : "#f3f4f6" }}
        >
          {feature.title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-400 mb-4 leading-relaxed"
          animate={{ color: isHovered ? "#d1d5db" : "#9ca3af" }}
        >
          {feature.description}
        </motion.p>
        
        {/* Enhanced Animated CTA */}
        <motion.div 
          className="flex items-center text-primary-400 font-semibold text-sm"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.span
            animate={{ backgroundPosition: isHovered ? "100% 0" : "0 0" }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_100%] bg-left"
          >
            Try now
          </motion.span>
          <motion.div
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <ArrowRight className="h-4 w-4 ml-2" />
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div 
          className="absolute top-2 right-2"
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-primary-500/30 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Enhanced Animated Stat Component
const AnimatedStat = ({ icon: Icon, value, label, delay = 0 }) => {
  const [setRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  })

  const [count, setCount] = useState(0)

  useEffect(() => {
    if (inView) {
      const target = parseInt(value.replace(/[^0-9]/g, ''))
      const duration = 2000
      const steps = 60
      const step = target / steps
      let current = 0

      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <motion.div
      ref={setRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="text-center group"
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          background: ["linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))", "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))"]
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="h-8 w-8 text-primary-400" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-purple-500/30"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      <motion.div 
        className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent mb-2"
        initial={{ scale: 0.5 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {value.includes('+') || value.includes('%') ? `${count}${value.replace(/[0-9]/g, '')}` : value}
      </motion.div>
      
      <motion.div 
        className="text-gray-400 font-medium"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
      >
        {label}
      </motion.div>
    </motion.div>
  )
}

// New Component: Animated Testimonial
const AnimatedTestimonial = ({ text, author, role, delay = 0 }) => {
  const [setRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })

  return (
    <motion.div
      ref={setRef}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden"
    >
      {/* Quote marks */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
        className="text-6xl text-primary-500/20 absolute top-2 left-4 font-serif"
      >
        "
      </motion.div>
      
      <motion.p 
        className="text-gray-300 mb-4 relative z-10 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
      >
        {text}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.5 }}
      >
        <div className="font-semibold text-white">{author}</div>
        <div className="text-gray-400 text-sm">{role}</div>
      </motion.div>
    </motion.div>
  )
}

const Dashboard = () => {
  const features = [
    {
      icon: Video,
      title: 'Audio-Video Dubbing',
      description: 'Create high-quality dubbed audio tracks perfectly synchronized with video content',
      link: '/dubbing',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Generate natural, expressive synthetic voices from text in multiple languages',
      link: '/tts',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mic,
      title: 'Speech-to-Text',
      description: 'Convert spoken audio into accurate text transcripts with advanced AI',
      link: '/stt',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Headphones,
      title: 'Noise Removal',
      description: 'Automatically detect and reduce background noise for crystal clear audio',
      link: '/noise-removal',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { icon: Globe, value: '50+', label: 'Languages Supported' },
    { icon: Users, value: '100+', label: 'Voice Options' },
    { icon: Zap, value: '99%', label: 'Accuracy Rate' },
    { icon: Play, value: '10K+', label: 'Videos Processed' }
  ]

  const testimonials = [
    {
      text: "This platform revolutionized our content localization process. The AI dubbing is incredibly natural!",
      author: "Sarah Chen",
      role: "Content Director at MediaCorp"
    },
    {
      text: "The text-to-speech voices are so realistic, our audience can't tell they're AI-generated!",
      author: "Marcus Rodriguez",
      role: "Product Manager at TechFlow"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Enhanced Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-20 relative"
        >
          {/* Enhanced Background Animation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="w-full h-64 bg-gradient-to-r from-primary-500/15 to-purple-500/15 rounded-full blur-3xl"
            />
          </div>

          {/* Floating elements */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-10 text-primary-400/20"
          >
            <Cloud size={40} />
          </motion.div>
          <motion.div
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute top-32 right-20 text-purple-400/20"
          >
            <Sparkles size={35} />
          </motion.div>
          <motion.div
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 2 }}
            className="absolute bottom-20 left-20 text-cyan-400/20"
          >
            <Shield size={38} />
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-8 relative"
          >
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Professional
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Dubbing Platform
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Create stunning multilingual content with AI-powered dubbing, voice generation, 
            and professional audio enhancement tools that bring your stories to life.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/dubbing">
              <motion.button 
                className="relative bg-gradient-to-r from-primary-500 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl group overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Start Dubbing 
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </Link>
            
            <motion.button 
              className="px-10 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-600 text-gray-300 hover:border-primary-500 hover:text-primary-400 transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Watch Demo</span>
              <motion.div
                className="absolute inset-0 bg-primary-500/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Enhanced Features Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-24"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-center mb-12 text-lg max-w-2xl mx-auto"
          >
            Everything you need to create professional multilingual content in one platform
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <AnimatedFeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
              />
            ))}
          </div>
        </motion.section>

        {/* Enhanced Stats Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mb-24"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-3xl blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <AnimatedStat
                    key={index}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mb-24"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Trusted by Content Creators Worldwide
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedTestimonial
                key={index}
                text={testimonial.text}
                author={testimonial.author}
                role={testimonial.role}
                delay={index * 0.2}
              />
            ))}
          </div>
        </motion.section>

        {/* Enhanced CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
          className="text-center"
        >
          <div className="relative">
            {/* Enhanced animated background */}
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 rounded-3xl"
            />
            
            <div className="relative bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 overflow-hidden">
              {/* Floating particles in CTA */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-6"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl relative"
                >
                  <Star className="h-10 w-10 text-white" />
                  
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute -top-1 -right-1 text-yellow-200"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles size={16} />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              >
                Ready to Transform Your Content?
              </motion.h2>

              <motion.p 
                variants={itemVariants}
                className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
              >
                Join thousands of creators and businesses who use our platform to reach global audiences with professional multilingual content
              </motion.p>

              <motion.div variants={itemVariants}>
                <Link to="/dubbing">
                  <motion.button
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center relative z-10">
                      Get Started Free 
                      <Lightning className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
                    </span>
                    
                    {/* Button animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.button>
                </Link>
              </motion.div>

              <motion.p 
                variants={itemVariants}
                className="text-gray-400 text-sm mt-4"
              >
                No credit card required • Free trial included
              </motion.p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Add some global styles for smooth animations */}
      <style jsx>{`
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}

export default Dashboard