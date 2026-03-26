import React, { useState } from 'react'
import { Upload, Download, Mic, FileAudio, X, Sparkles, Zap, Play, Pause, Clock, Languages, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

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

// Animated Upload Zone
const AnimatedUploadZone = ({ onFileUpload, selectedFile, error }) => {
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
        accept="audio/*,.mp3,.wav,.m4a,.flac,.aac,.ogg,.webm"
        onChange={onFileUpload}
        className="hidden"
        id="audio-upload"
      />
      <motion.label
        htmlFor="audio-upload"
        className={`
          block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500
          ${isDragging 
            ? 'border-primary-500 bg-primary-500/10 scale-105 shadow-2xl' 
            : selectedFile 
              ? 'border-green-500 bg-green-500/5' 
              : error
                ? 'border-red-500 bg-red-500/5'
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
          animate={!selectedFile && !error ? { y: [0, -8, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-4"
        >
          {selectedFile ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </motion.div>
          ) : error ? (
            <motion.div
              animate={{ shake: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <X className="h-16 w-16 text-red-500 mx-auto" />
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
          animate={{ 
            color: selectedFile ? '#10B981' : error ? '#EF4444' : '#F9FAFB' 
          }}
        >
          {selectedFile ? 'Audio Ready!' : error ? 'Upload Error' : 'Drop Audio File Here'}
        </motion.div>
        
        <div className="text-gray-400 text-sm">
          {selectedFile ? selectedFile.name : 'MP3, WAV, M4A, FLAC, AAC, OGG, WEBM up to 50MB'}
        </div>

        {!selectedFile && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-xs mt-2"
          >
            or click to browse files
          </motion.div>
        )}

        {/* Floating particles */}
        {!selectedFile && !error && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -15, 0],
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
        )}
      </motion.label>
    </motion.div>
  )
}

// Animated Processing Component
const ProcessingAnimation = ({ currentStage }) => {
  const stages = [
    { id: 'uploading', label: 'Uploading Audio', icon: Upload },
    { id: 'analyzing', label: 'Analyzing Speech', icon: Mic },
    { id: 'processing', label: 'Processing Audio', icon: Zap },
    { id: 'transcribing', label: 'Generating Text', icon: FileAudio }
  ]

  const currentStageIndex = stages.findIndex(stage => stage.id === currentStage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Mic className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-semibold mb-2">Transcribing Your Audio</h3>
        <p className="text-gray-400">AI is converting speech to text...</p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
            className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${
              index <= currentStageIndex 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-gray-700/30 border-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              index <= currentStageIndex ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
            }`}>
              <stage.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{stage.label}</div>
              <div className="text-sm">
                {index < currentStageIndex ? 'Completed' : 
                 index === currentStageIndex ? 'Processing...' : 'Pending'}
              </div>
            </div>
            {index < currentStageIndex && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
            {index === currentStageIndex && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Transcription Progress</span>
          <span className="text-primary-400 font-semibold">
            {Math.round(((currentStageIndex + 1) / stages.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full relative"
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

const STTTranscriber = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [language, setLanguage] = useState('en')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [error, setError] = useState('')
  const [transcriptionDetails, setTranscriptionDetails] = useState(null)
  const [currentStage, setCurrentStage] = useState('uploading')

  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'hi', name: 'Hindi' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ]

  const supportedFormats = ['WAV', 'MP3', 'M4A', 'FLAC', 'AAC', 'OGG', 'WEBM']

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/webm']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid audio file (WAV, MP3, M4A, FLAC, AAC, OGG, WEBM)')
      return
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB')
      return
    }

    setSelectedFile(file)
    setError('')
    setTranscription('')
    setTranscriptionDetails(null)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setTranscription('')
    setTranscriptionDetails(null)
    setError('')
  }

  const transcribeAudio = async () => {
    if (!selectedFile) return

    setIsTranscribing(true)
    setError('')
    setCurrentStage('uploading')

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('language', language)

    try {
      // Update stage
      setCurrentStage('analyzing')
      
      const response = await axios.post('http://localhost:8000/api/stt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds timeout
      })

      if (response.data.success) {
        setCurrentStage('processing')
        
        // Simulate processing stages for better UX
        setTimeout(() => {
          setCurrentStage('transcribing')
          setTimeout(() => {
            setTranscription(response.data.transcription)
            setTranscriptionDetails({
              language: response.data.language,
              wordCount: response.data.word_count,
              engine: response.data.engine,
              confidence: response.data.confidence,
              processingTime: response.data.processing_time
            })
            setIsTranscribing(false)
          }, 1000)
        }, 1000)
      } else {
        setError(response.data.detail || response.data.message || 'Transcription failed')
        setIsTranscribing(false)
      }
    } catch (error) {
      console.error('Transcription failed:', error)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message ||
                          'Transcription failed. Please try again.'
      setError(errorMessage)
      setIsTranscribing(false)
    }
  }

  const downloadTranscription = () => {
    const element = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `transcription_${timestamp}_${language}.txt`
    
    const content = `Transcription Results\n` +
                   `=====================\n` +
                   `Date: ${new Date().toLocaleString()}\n` +
                   `Language: ${language}\n` +
                   `File: ${selectedFile?.name || 'Unknown'}\n` +
                   `Word Count: ${transcriptionDetails?.wordCount || 'N/A'}\n` +
                   `Engine: ${transcriptionDetails?.engine || 'N/A'}\n` +
                   `Confidence: ${transcriptionDetails?.confidence || 'N/A'}\n` +
                   `Processing Time: ${transcriptionDetails?.processingTime || 'N/A'}\n\n` +
                   `TRANSCRIPTION:\n` +
                   `${transcription}`

    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <Mic className="h-10 w-10 text-white" />
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
            Speech-to-Text
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Convert spoken audio into accurate text transcripts using AI-powered speech recognition
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="mt-4 text-sm text-gray-400"
          >
            Supported formats: {supportedFormats.join(', ')}
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
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
              <h2 className="text-2xl font-semibold">Upload Audio</h2>
            </div>

            <AnimatedUploadZone 
              onFileUpload={handleFileUpload}
              selectedFile={selectedFile}
              error={error}
            />

            {/* Language Selection */}
            <motion.div variants={itemVariants} className="mt-6">
              <label className="block text-sm font-medium mb-3 text-gray-300">
                <Languages className="h-4 w-4 inline mr-2" />
                Language
              </label>
              <select 
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                Select the language spoken in the audio for better accuracy
              </p>
            </motion.div>

            {/* File Info */}
            <AnimatePresence>
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl border border-primary-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileAudio className="h-8 w-8 text-primary-400 mr-3" />
                      <div>
                        <div className="font-semibold text-white text-sm">{selectedFile.name}</div>
                        <div className="text-gray-400 text-xs">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-green-500 text-sm font-medium">Ready</div>
                      <motion.button 
                        onClick={removeFile}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transcribe Button */}
            <motion.button 
              onClick={transcribeAudio}
              disabled={!selectedFile || isTranscribing}
              variants={itemVariants}
              className="w-full mt-6 bg-gradient-to-r from-primary-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
              whileHover={{ scale: selectedFile && !isTranscribing ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center">
                {isTranscribing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6 mr-3" />
                    Transcribe Audio
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
            </motion.button>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                >
                  <div className="flex items-center">
                    <X className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Tips for Better Results</h2>
            </div>

            <div className="space-y-4">
              {[
                "Use clear, high-quality audio files",
                "Minimize background noise",
                "Select the correct language",
                "Speak clearly and at a moderate pace",
                "Files should be under 50MB",
                `Supported formats: ${supportedFormats.join(', ')}`
              ].map((tip, index) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    className="w-2 h-2 bg-primary-500 rounded-full mr-3"
                  />
                  <span className="text-gray-300 text-sm">{tip}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-xl border border-primary-500/20"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-400">99%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">50+</div>
                  <div className="text-xs text-gray-400">Languages</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Processing Animation */}
        <AnimatePresence>
          {isTranscribing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mb-8"
            >
              <ProcessingAnimation currentStage={currentStage} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {transcription && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="flex items-center mb-4 lg:mb-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4"
                  >
                    <CheckCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Transcription Complete</h2>
                    <p className="text-gray-400">Your audio has been converted to text</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {transcriptionDetails && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm text-gray-300 bg-gray-700/50 px-4 py-2 rounded-full flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {transcriptionDetails.wordCount} words • {transcriptionDetails.engine}
                    </motion.div>
                  )}
                  <motion.button 
                    onClick={downloadTranscription}
                    className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-400 px-6 py-2 rounded-xl font-semibold border border-primary-500/30 hover:bg-primary-500/30 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </motion.button>
                </div>
              </div>

              {/* Transcription Details */}
              {transcriptionDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                  {[
                    { label: 'Language', value: transcriptionDetails.language, icon: Languages },
                    { label: 'Confidence', value: transcriptionDetails.confidence, icon: Zap },
                    { label: 'Processing Time', value: transcriptionDetails.processingTime, icon: Clock },
                    { label: 'Word Count', value: transcriptionDetails.wordCount, icon: FileAudio }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/50 text-center"
                    >
                      <stat.icon className="h-5 w-5 text-primary-400 mx-auto mb-2" />
                      <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                      <div className="font-semibold text-white">{stat.value}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Transcription Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/50 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full translate-x-16 translate-y-16" />
                
                <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed text-lg relative z-10">
                  {transcription}
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-center text-xs text-gray-500"
              >
                Powered by AI Speech Recognition • Transcription accuracy may vary based on audio quality
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default STTTranscriber