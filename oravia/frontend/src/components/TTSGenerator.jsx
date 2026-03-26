import React, { useState, useRef } from 'react'
import { Play, Download, Volume2, StopCircle, AlertCircle, Sparkles, Zap, Pause, CheckCircle, Languages, User } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

// Animation variants (keep your existing variants)
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

// Animated Audio Visualizer (keep your existing component)
const AudioVisualizer = ({ isPlaying, isGenerating }) => {
  const bars = 12
  
  return (
    <div className="flex items-end justify-center h-20 space-x-1">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-gradient-to-t from-primary-500 to-purple-500 rounded-t-lg"
          animate={{
            height: isPlaying 
              ? `${Math.max(10, 50 * Math.sin((i / bars) * Math.PI + Date.now() / 400))}px`
              : isGenerating
              ? `${Math.max(10, 30 * Math.sin((i / bars) * Math.PI + Date.now() / 300))}px`
              : '10px'
          }}
          transition={{ duration: 0.2 }}
          style={{ height: '10px' }}
        />
      ))}
    </div>
  )
}

// Voice Preview Card (keep your existing component)
const VoicePreviewCard = ({ voice, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-primary-500 bg-primary-500/20'
          : 'border-gray-600 bg-gray-700/30 hover:border-primary-400'
      }`}
      onClick={() => onSelect(voice.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          animate={{ 
            scale: isSelected ? 1.1 : 1,
            backgroundColor: isSelected ? '#3B82F6' : '#4B5563'
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <User className="h-5 w-5 text-white" />
        </motion.div>
        <div className="flex-1">
          <div className="font-semibold text-white">{voice.name}</div>
          <div className="text-xs text-gray-400 capitalize">{voice.language}</div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="h-3 w-3 text-white" />
          </motion.div>
        )}
      </div>

      {/* Hover effect */}
      <AnimatePresence>
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary-500/10 rounded-xl"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Updated Processing Animation with real stages
const ProcessingAnimation = ({ currentStage }) => {
  const stages = [
    { id: 'analyzing', label: 'Analyzing Text', icon: Volume2 },
    { id: 'processing', label: 'Generating Speech', icon: Zap },
    { id: 'synthesizing', label: 'Synthesizing Audio', icon: Sparkles },
    { id: 'finalizing', label: 'Finalizing Output', icon: CheckCircle }
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
          <Volume2 className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-semibold mb-2">Generating Your Audio</h3>
        <p className="text-gray-400">AI is converting text to natural-sounding speech...</p>
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
          <span className="text-gray-400">Generation Progress</span>
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

const TTSGenerator = () => {
  const [text, setText] = useState('Hello, welcome to our dubbing platform! This text will be converted to high-quality speech using our advanced AI technology.')
  const [voice, setVoice] = useState('en_male_1')
  const [language, setLanguage] = useState('en')
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [generatedAudio, setGeneratedAudio] = useState(null)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStage, setCurrentStage] = useState('analyzing')
  const audioRef = useRef(null)

  const voices = [
    { id: 'en_male_1', name: 'English Male', language: 'en' },
    { id: 'en_female_1', name: 'English Female', language: 'en' },
    { id: 'es_male_1', name: 'Spanish Male', language: 'es' },
    { id: 'es_female_1', name: 'Spanish Female', language: 'es' },
    { id: 'fr_male_1', name: 'French Male', language: 'fr' },
    { id: 'fr_female_1', name: 'French Female', language: 'fr' },
    { id: 'de_male_1', name: 'German Male', language: 'de' },
    { id: 'de_female_1', name: 'German Female', language: 'de' },
    { id: 'it_male_1', name: 'Italian Male', language: 'it' },
    { id: 'it_female_1', name: 'Italian Female', language: 'it' }
  ]

  const generateSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech!')
      return
    }

    setIsGenerating(true)
    setError('')
    setAudioUrl(null)
    setGeneratedAudio(null)
    setIsPlaying(false)
    setCurrentStage('analyzing')

    try {
      // Update stage
      setCurrentStage('processing')
      
      const response = await axios.post('http://localhost:8000/api/tts', {
        text: text,
        voice_id: voice,
        language: language
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout for TTS generation
      })

      if (response.data.success) {
        setCurrentStage('synthesizing')
        
        // Simulate processing stages for better UX
        setTimeout(() => {
          setCurrentStage('finalizing')
          
          // Construct full URL for the audio file
          const fullAudioUrl = `http://localhost:8000${response.data.audio_url}`
          setAudioUrl(fullAudioUrl)
          setGeneratedAudio(response.data)
          
          // Preload the audio
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.load()
            }
            setIsGenerating(false)
          }, 1000)
        }, 1000)
      } else {
        throw new Error(response.data.detail || response.data.message || 'Audio generation failed')
      }
    } catch (error) {
      console.error('Audio generation failed:', error)
      let errorMessage = 'Audio generation failed. Please try again.'
      
      if (error.response) {
        errorMessage = error.response.data.detail || error.response.data.message || errorMessage
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000'
      } else {
        errorMessage = error.message || errorMessage
      }
      
      setError(errorMessage)
      setIsGenerating(false)
    }
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = generatedAudio?.filename || `tts_${Date.now()}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.error('Play failed:', e)
          setError('Failed to play audio. The file might be corrupted or missing.')
        })
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    const firstVoice = voices.find(v => v.language === newLanguage)
    if (firstVoice) setVoice(firstVoice.id)
  }

  const clearError = () => {
    setError('')
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
                <Volume2 className="h-10 w-10 text-white" />
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
            Text-to-Speech
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Convert text to high-quality, natural-sounding speech with AI
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Text Input Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <Volume2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Enter Your Text</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Text to Convert
                <span className="text-red-400 ml-1">*</span>
              </label>
              <motion.textarea
                variants={itemVariants}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 h-40 resize-none"
                placeholder="Enter the text you want to convert to speech..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  clearError()
                }}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <div>
                  {text.length} characters • {text.split(/\s+/).filter(word => word.length > 0).length} words
                </div>
                <div className={text.length > 5000 ? 'text-red-400' : 'text-primary-500'}>
                  Max: 5000 characters
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-300">
                <Languages className="h-4 w-4 inline mr-2" />
                Language
              </label>
              <select 
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Button */}
            <motion.button 
              onClick={generateSpeech}
              disabled={!text.trim() || isGenerating || text.length > 5000}
              variants={itemVariants}
              className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
              whileHover={{ scale: text.trim() && !isGenerating && text.length <= 5000 ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center">
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 mr-3" />
                    Generate Speech
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
          </motion.div>

          {/* Voice Selection Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Select Voice</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {voices
                .filter(v => v.language === language)
                .map(voiceOption => (
                  <VoicePreviewCard
                    key={voiceOption.id}
                    voice={voiceOption}
                    isSelected={voice === voiceOption.id}
                    onSelect={setVoice}
                  />
                ))
              }
            </div>

            {/* Audio Visualizer */}
            <div className="mt-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <AudioVisualizer isPlaying={isPlaying} isGenerating={isGenerating} />
              <div className="text-center mt-4">
                <div className="text-sm text-gray-400">
                  {isPlaying ? 'Audio Playing...' : isGenerating ? 'Generating Audio...' : 'Audio Preview'}
                </div>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-xl border border-primary-500/20"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-400">99%</div>
                  <div className="text-xs text-gray-400">Natural Sound</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">5+</div>
                  <div className="text-xs text-gray-400">Languages</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Processing Animation */}
        <AnimatePresence>
          {isGenerating && (
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
          {generatedAudio && (
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
                    <h2 className="text-2xl font-semibold text-white">Audio Generated</h2>
                    <p className="text-gray-400">Your text has been converted to speech</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {generatedAudio.quality && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm bg-green-500/20 text-green-400 px-4 py-2 rounded-full flex items-center"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {generatedAudio.quality} Quality
                    </motion.div>
                  )}
                  <motion.button 
                    onClick={downloadAudio}
                    className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-400 px-6 py-2 rounded-xl font-semibold border border-primary-500/30 hover:bg-primary-500/30 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </motion.button>
                </div>
              </div>

              {/* Audio Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 p-6 bg-gray-700/30 rounded-xl border border-gray-600/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {[
                    { label: 'Text Length', value: `${generatedAudio.text_length} characters`, icon: Volume2 },
                    { label: 'Voice Used', value: generatedAudio.voice_used, icon: User },
                    { label: 'Status', value: 'Success', icon: CheckCircle },
                    { label: 'Format', value: 'MP3', icon: Download }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-gray-600/30 p-4 rounded-xl text-center"
                    >
                      <stat.icon className="h-5 w-5 text-primary-400 mx-auto mb-2" />
                      <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                      <div className="font-semibold text-white">{stat.value}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Audio Player */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <div className="text-sm text-gray-400 mb-3">Audio Preview:</div>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                  <audio 
                    ref={audioRef}
                    controls 
                    className="flex-1 w-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.error('Audio error:', e)
                      setError('Failed to load audio file. Please try generating again.')
                    }}
                    preload="metadata"
                  >
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex gap-2">
                    <motion.button 
                      onClick={playAudio}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </motion.button>
                    <motion.button 
                      onClick={stopAudio}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <StopCircle className="h-4 w-4 mr-1" />
                      Stop
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-green-500 font-semibold border-t border-gray-700 pt-4"
              >
                ✓ Audio generated successfully and ready to use
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Tips for Better Results</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div className="space-y-3">
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-primary-500 rounded-full mr-3"
                />
                <span>Use proper punctuation for natural pauses</span>
              </div>
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="w-2 h-2 bg-primary-500 rounded-full mr-3"
                />
                <span>Keep sentences clear and concise</span>
              </div>
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-2 h-2 bg-primary-500 rounded-full mr-3"
                />
                <span>Avoid overly complex sentences</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  className="w-2 h-2 bg-primary-500 rounded-full mr-3"
                />
                <span>Check spelling and grammar</span>
              </div>
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                  className="w-2 h-2 bg-primary-500 rounded-full mr-3"
                />
                <span>Use appropriate voice for your content</span>
              </div>
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
                  className="w-2 h-2 bg-primary-500 rounded-full mr-3"
                />
                <span>Test with different voices for best match</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TTSGenerator