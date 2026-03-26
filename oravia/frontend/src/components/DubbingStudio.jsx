import React, { useState, useEffect } from 'react'
import { Upload, Play, Download, Languages, Clock, CheckCircle, Video, Volume2, Settings, Sparkles, Zap, DownloadCloud } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

// Animation variants
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
  hidden: { opacity: 0, y: 20 },
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
    y: -2,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
}

const progressVariants = {
  initial: { width: '0%' },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  })
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

// Animated Upload Zone Component
const AnimatedUploadZone = ({ onFileUpload, uploadProgress, selectedFile }) => {
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
        accept="video/*,.mp4,.mov,.avi,.mkv,.webm"
        onChange={onFileUpload}
        className="hidden"
        id="video-upload"
      />
      <motion.label
        htmlFor="video-upload"
        className={`
          block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-primary-500 bg-primary-500/10 scale-105' 
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
          animate={!selectedFile ? { y: [0, -5, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4"
        >
          {selectedFile ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Upload className="h-16 w-16 text-gray-400 mx-auto" />
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="text-xl font-semibold mb-2"
          animate={{ color: selectedFile ? '#10B981' : '#F9FAFB' }}
        >
          {selectedFile ? 'Video Ready!' : 'Choose Video File'}
        </motion.div>
        
        <div className="text-gray-400 text-sm mb-4">
          {selectedFile ? selectedFile.name : 'MP4, MOV, AVI up to 500MB'}
        </div>

        {!selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-gray-500 mt-2"
          >
            or drag and drop your file here
          </motion.div>
        )}

        {/* Upload Progress */}
        <AnimatePresence>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Uploading...</span>
                <span className="text-primary-400 font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={uploadProgress}
                  className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.label>
    </motion.div>
  )
}

// Animated Processing Component
const ProcessingAnimation = ({ currentJob }) => {
  const stages = [
    { id: 'analyzing', label: 'Analyzing Video', icon: Video },
    { id: 'transcribing', label: 'Transcribing Audio', icon: Volume2 },
    { id: 'translating', label: 'Translating Text', icon: Languages },
    { id: 'synthesizing', label: 'Synthesizing Voice', icon: Settings },
    { id: 'syncing', label: 'Syncing Audio', icon: Play }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Processing Your Video</h3>
        <p className="text-gray-400">This may take a few minutes...</p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center p-4 rounded-xl border border-gray-700 bg-gray-800/50"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              index < 2 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
            }`}>
              <stage.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{stage.label}</div>
              <div className="text-sm text-gray-400">
                {index < 2 ? 'Completed' : 'Processing...'}
              </div>
            </div>
            {index < 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Overall Progress</span>
          <span className="text-primary-400 font-semibold">40%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '40%' }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

const DubbingStudio = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [projectId, setProjectId] = useState(null)
  const [dubbingResult, setDubbingResult] = useState(null)
  const [currentJob, setCurrentJob] = useState(null)
  const [dubbingOptions, setDubbingOptions] = useState({
    sourceLanguage: 'en',
    targetLanguage: 'es',
    voice: 'es_male_1'
  })

  // Fallback language list
  const fallbackLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ]

  const [languages, setLanguages] = useState(fallbackLanguages)
  const [voicesMap, setVoicesMap] = useState({})

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/upload-video', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(progress)
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      clearInterval(interval)
      setUploadProgress(100)

      if (response.data.success) {
        setProjectId(response.data.project_id)
        
        // Success animation delay
        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      } else {
        throw new Error(response.data.message || 'Upload failed')
      }
    } catch (error) {
      clearInterval(interval)
      console.error('Upload failed:', error)
      setSelectedFile(null)
      setUploadProgress(0)
    }
  }

  const startDubbing = async () => {
    if (!projectId) {
      alert('Please upload a video file first!')
      return
    }

    setIsProcessing(true)
    setDubbingResult(null)

    // Simulate processing
    setTimeout(() => {
      setDubbingResult({
        download_url: '#',
        audio_url: '#',
        result_url: '#'
      })
      setIsProcessing(false)
    }, 5000)
  }

  const downloadDubbedVideo = () => {
    if (dubbingResult && dubbingResult.download_url) {
      window.open(dubbingResult.download_url, '_blank')
    } else {
      alert('Download URL not available yet.')
    }
  }

  const downloadDubbedAudio = () => {
    if (dubbingResult && dubbingResult.audio_url) {
      window.open(dubbingResult.audio_url, '_blank')
    } else {
      alert('Audio URL not available yet.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Dubbing Studio
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Transform your videos with AI-powered dubbing in multiple languages
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Upload Video</h2>
            </div>
            
            <AnimatedUploadZone 
              onFileUpload={handleFileUpload}
              uploadProgress={uploadProgress}
              selectedFile={selectedFile}
            />

            {/* Project Info */}
            <AnimatePresence>
              {projectId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-primary-500/10 rounded-xl border border-primary-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-primary-300 font-semibold">Project Ready</div>
                      <div className="text-xs text-primary-400 font-mono truncate">{projectId}</div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Sparkles className="h-5 w-5 text-primary-400" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Dubbing Options */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Dubbing Settings</h2>
            </div>
            
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-3 text-gray-300">Source Language</label>
                <select 
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  value={dubbingOptions.sourceLanguage}
                  onChange={(e) => setDubbingOptions({...dubbingOptions, sourceLanguage: e.target.value})}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-3 text-gray-300">Target Language</label>
                <select 
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  value={dubbingOptions.targetLanguage}
                  onChange={(e) => setDubbingOptions({...dubbingOptions, targetLanguage: e.target.value})}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-3 text-gray-300">Voice Selection</label>
                <select 
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  value={dubbingOptions.voice}
                  onChange={(e) => setDubbingOptions({...dubbingOptions, voice: e.target.value})}
                >
                  <option value="es_male_1">Spanish Male Voice 1</option>
                  <option value="es_female_1">Spanish Female Voice 1</option>
                  <option value="en_male_1">English Male Voice 1</option>
                  <option value="en_female_1">English Female Voice 1</option>
                </select>
              </motion.div>

              {/* Info Card */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/50"
              >
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-300">Estimated time: 2-5 minutes</span>
                </div>
                <Languages className="h-5 w-5 text-primary-500" />
              </motion.div>

              <motion.button 
                onClick={startDubbing}
                disabled={!projectId || isProcessing}
                variants={itemVariants}
                className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
                whileHover={{ scale: projectId && !isProcessing ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      />
                      Processing Dubbing...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-3" />
                      Start Dubbing
                    </>
                  )}
                </span>
                
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Processing Section */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mb-8"
            >
              <ProcessingAnimation currentJob={currentJob} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {dubbingResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                  <h2 className="text-2xl font-semibold text-white">Dubbing Complete!</h2>
                  <p className="text-gray-400">Your video has been successfully dubbed</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Video Download Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Dubbed Video</h3>
                    <p className="text-gray-400 text-sm mb-6">Full video with dubbed audio track</p>
                    <motion.button
                      onClick={downloadDubbedVideo}
                      className="w-full bg-primary-500/20 text-primary-400 py-3 rounded-xl font-semibold border border-primary-500/30 hover:bg-primary-500/30 transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <DownloadCloud className="h-5 w-5 mr-2" />
                      Download Video
                    </motion.button>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                </motion.div>

                {/* Audio Download Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                      <Volume2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Dubbed Audio</h3>
                    <p className="text-gray-400 text-sm mb-6">Separate audio track only</p>
                    <motion.button
                      onClick={downloadDubbedAudio}
                      className="w-full bg-green-500/20 text-green-400 py-3 rounded-xl font-semibold border border-green-500/30 hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Audio
                    </motion.button>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                </motion.div>
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <div className="text-green-400 font-semibold">Success!</div>
                    <div className="text-green-300 text-sm">
                      Your video has been dubbed from {dubbingOptions.sourceLanguage} to {dubbingOptions.targetLanguage}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DubbingStudio