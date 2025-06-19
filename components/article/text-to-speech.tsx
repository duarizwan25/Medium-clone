"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Square, Settings } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TextToSpeechProps {
  content: string
  title?: string
}

export function TextToSpeech({ content, title }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [rate, setRate] = useState([1])
  const [pitch, setPitch] = useState([1])
  const [volume, setVolume] = useState([0.8])
  const [progress, setProgress] = useState(0)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const textRef = useRef<string>("")

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name)
      }
    }

    loadVoices()
    speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      if (utteranceRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [selectedVoice])

  // Extract text content from HTML
  const extractTextFromHTML = (html: string): string => {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || div.innerText || ""
  }

  const speak = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPaused(true)
      return
    }

    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPaused(false)
      return
    }

    // Prepare text content
    const textToSpeak = title ? `${title}. ${extractTextFromHTML(content)}` : extractTextFromHTML(content)

    textRef.current = textToSpeak

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utteranceRef.current = utterance

    // Set voice
    const voice = voices.find((v) => v.name === selectedVoice)
    if (voice) {
      utterance.voice = voice
    }

    // Set speech parameters
    utterance.rate = rate[0]
    utterance.pitch = pitch[0]
    utterance.volume = volume[0]

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(0)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(0)
    }

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const progressPercent = (event.charIndex / textRef.current.length) * 100
        setProgress(progressPercent)
      }
    }

    speechSynthesis.speak(utterance)
  }

  const stop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
      <Button variant="outline" size="sm" onClick={speak} disabled={!content}>
        {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <Button variant="outline" size="sm" onClick={stop} disabled={!isPlaying && !isPaused}>
        <Square className="h-4 w-4" />
      </Button>

      {/* Progress bar */}
      <div className="flex-1 mx-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <Label htmlFor="voice">Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Speed: {rate[0]}</Label>
              <Slider value={rate} onValueChange={setRate} max={2} min={0.5} step={0.1} className="mt-2" />
            </div>

            <div>
              <Label>Pitch: {pitch[0]}</Label>
              <Slider value={pitch} onValueChange={setPitch} max={2} min={0.5} step={0.1} className="mt-2" />
            </div>

            <div>
              <Label>Volume: {Math.round(volume[0] * 100)}%</Label>
              <Slider value={volume} onValueChange={setVolume} max={1} min={0} step={0.1} className="mt-2" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
