"use client";
import { createContext, useContext, useRef, useState, ReactNode } from "react";

interface AudioState {
  isPlaying: boolean;
  currentUrl: string | null;
  currentLabel: string | null;
  progress: number;
  duration: number;
  play: (url: string, label: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (pct: number) => void;
}

const AudioContext = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.ontimeupdate = () => {
        const a = audioRef.current!;
        setProgress(a.currentTime);
        setDuration(a.duration || 0);
      };
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return audioRef.current;
  };

  const play = (url: string, label: string) => {
    const a = getAudio();
    if (currentUrl !== url) {
      a.src = url;
      setCurrentUrl(url);
    }
    setCurrentLabel(label);
    a.play().catch(() => {});
    setIsPlaying(true);
  };

  const pause = () => { audioRef.current?.pause(); setIsPlaying(false); };
  const resume = () => { audioRef.current?.play().catch(() => {}); setIsPlaying(true); };
  const stop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentUrl(null);
    setCurrentLabel(null);
    setProgress(0);
  };
  const seek = (pct: number) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, currentUrl, currentLabel, progress, duration, play, pause, resume, stop, seek }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
}