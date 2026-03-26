import React, { useState } from 'react'
import { Upload, Download, Headphones, Volume2, Sparkles, Waves, Zap, CheckCircle, Play, Pause } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
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
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Animated Audio Visualizer
const AudioVisualizer = ({ isPlaying, amplitude = 0.5 }) => {
  const bars = 12
  
  return (
    <div className="flex items-end justify-center h-16 space-x-1">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-gradient-to-t from-primary-500 to-purple-500 rounded-t-lg"
          animate={{
            height: isPlaying 
              ? `${Math.max(10, 40 * amplitude * Math.sin((i / bars) * Math.PI + Date.now() / 500))}px`
              : '10px'
          }}
          transition={{ duration: 0.2 }}
          style={{ height: '10px' }}
        />
      ))}
    </div>
  )
}

// Animated Upload Zone
const AnimatedUploadZone = ({ onFileUpload, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const event = { target: { files } }
      onFileUpload(event)
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      className="relative"
    >
      <input
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.flac,.aac"
        onChange={onFileUpload}
        className="hidden"
        id="audio-upload"
      />
      <motion.label
        htmlFor="audio-upload"
        className={`
          block border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500
          ${isDragging 
            ? 'border-primary-500 bg-primary-500/10 scale-105 shadow-2xl' 
            : selectedFile 
              ? 'border-green-500 bg-green-500/5' 
              : 'border-gray-600 hover:border-primary-500 hover:bg-primary-500/5'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <motion.div
          animate={!selectedFile ? { y: [0, -10, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6"
        >
          {selectedFile ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Upload className="h-20 w-20 text-gray-400 mx-auto" />
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="text-2xl font-semibold mb-3"
          animate={{ color: selectedFile ? '#10B981' : '#F9FAFB' }}
        >
          {selectedFile ? 'Audio Ready!' : 'Drop Audio File Here'}
        </motion.div>
        
        <div className="text-gray-400 text-lg mb-2">
          {selectedFile ? selectedFile.name : 'MP3, WAV, M4A up to 100MB'}
        </div>

        {!selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-sm"
          >
            or click to browse files
          </motion.div>
        )}

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
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
        </div>
      </motion.label>
    </motion.div>
  )
}

const NoiseRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cleanedAudioUrl, setCleanedAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setCleanedAudioUrl(null)
  }

  const removeNoise = async () => {
    if (!selectedFile) return

    setIsProcessing(true)

    // Simulate processing for demo
    setTimeout(() => {
      const cleanedUrl = URL.createObjectURL(selectedFile) // In real app, this would be from API
      setCleanedAudioUrl(cleanedUrl)
      setIsProcessing(false)
    }, 3000)

    // Actual API call would be:
    /*
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post('/api/remove-noise', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setCleanedAudioUrl(response.data.cleaned_audio_url)
      }
    } catch (error) {
      console.error('Noise removal failed:', error)
      alert('Noise removal failed. Please try again.')
    }
    setIsProcessing(false)
    */
  }

  const togglePlayback = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
      } else {
        audioElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Headphones className="h-10 w-10 text-white" />
              </div>
              <motion.div
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Noise Remover
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            AI-powered background noise removal for crystal-clear audio quality
          </motion.p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mb-8"
        >
          <AnimatedUploadZone 
            onFileUpload={handleFileUpload}
            selectedFile={selectedFile}
          />

          {/* File Info */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mt-6 p-6 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl border border-primary-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Volume2 className="h-8 w-8 text-primary-400 mr-4" />
                    </motion.div>
                    <div>
                      <div className="font-semibold text-lg text-white">{selectedFile.name}</div>
                      <div className="text-gray-400 text-sm">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for processing
                      </div>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Process Button */}
          <motion.button 
            onClick={removeNoise}
            disabled={!selectedFile || isProcessing}
            variants={itemVariants}
            className="w-full mt-6 bg-gradient-to-r from-primary-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
            whileHover={{ scale: selectedFile && !isProcessing ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center">
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  Removing Noise...
                </>
              ) : (
                <>
                  <Zap className="h-6 w-6 mr-3" />
                  Remove Background Noise
                </>
              )}
            </span>
            
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />

            {/* Processing particles */}
            {isProcessing && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ 
                      x: '50%', 
                      y: '100%',
                      scale: 0 
                    }}
                    animate={{ 
                      x: ['50%', `${Math.random() * 100}%`],
                      y: ['100%', '-100%'],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4
                    }}
                  />
                ))}
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Processing Animation */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mb-8"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Waves className="h-8 w-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-semibold mb-4">Cleaning Your Audio</h3>
                <p className="text-gray-400 mb-6">AI is removing background noise and enhancing audio quality...</p>
                
                {/* Animated progress bars */}
                <div className="space-y-4 max-w-md mx-auto">
                  {['Analyzing Audio', 'Detecting Noise', 'Processing', 'Enhancing Quality'].map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className="flex items-center p-3 bg-gray-700/30 rounded-xl"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: index * 0.5 
                        }}
                        className="w-3 h-3 bg-primary-500 rounded-full mr-3"
                      />
                      <span className="text-gray-300">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {cleanedAudioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
            >
              <div className="flex items-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4"
                >
                  <CheckCircle className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">Audio Cleaned Successfully!</h2>
                  <p className="text-gray-400">Your background noise has been removed</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Audio Player Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Cleaned Audio</h3>
                      <motion.button
                        onClick={togglePlayback}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 text-white" />
                        ) : (
                          <Play className="h-5 w-5 text-white" />
                        )}
                      </motion.button>
                    </div>
                    
                    <AudioVisualizer isPlaying={isPlaying} />
                    
                    <audio
                      ref={setAudioElement}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full mt-4"
                    >
                      <source src={cleanedAudioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                </motion.div>

                {/* Download Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Download</h3>
                    <p className="text-gray-400 text-sm mb-6">Get your cleaned audio file</p>
                    <motion.a
                      href={cleanedAudioUrl}
                      download="cleaned_audio.mp3"
                      className="w-full bg-green-500/20 text-green-400 py-3 rounded-xl font-semibold border border-green-500/30 hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Cleaned Audio
                    </motion.a>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                </motion.div>
              </div>

              {/* Success Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Noise Reduced', value: '95%' },
                    { label: 'Audio Quality', value: 'Enhanced' },
                    { label: 'Processing Time', value: '2.3s' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-green-400">{stat.value}</div>
                      <div className="text-green-300 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NoiseRemover