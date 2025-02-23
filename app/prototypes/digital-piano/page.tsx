"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import Link from 'next/link';
import styles from './styles.module.css';
import { useState, useEffect, useCallback, useRef } from 'react';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const octaves = [3, 4, 5];

export default function DigitalPiano() {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [volume, setVolume] = useState(0.5);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillators, setOscillators] = useState<Record<string, OscillatorNode>>({});
  const [bubbles, setBubbles] = useState<Array<{ id: number; freq: number; x: number; isActive: boolean }>>([]);
  const bubbleIdRef = useRef(0);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);

  // Create continuous bubbles
  useEffect(() => {
    const createBackgroundBubble = () => {
      const size = Math.random() * 200 + 100; // Bubbles between 100px and 300px
      const newBubble = {
        id: bubbleIdRef.current++,
        freq: 0,
        x: Math.random() * window.innerWidth,
        isActive: false,
      };
      setBubbles(prev => [...prev, newBubble]);
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
      }, 8000); // Match animation duration
    };

    // Create initial bubbles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createBackgroundBubble(), i * 1000);
    }

    // Create new bubbles periodically
    const interval = setInterval(createBackgroundBubble, 2000);
    return () => clearInterval(interval);
  }, []);

  const activateBubbles = useCallback((note: string) => {
    const freq = getNoteFrequency(note);
    setBubbles(prev => 
      prev.map(bubble => ({
        ...bubble,
        isActive: true,
        freq: freq
      }))
    );
    setTimeout(() => {
      setBubbles(prev => 
        prev.map(bubble => ({
          ...bubble,
          isActive: false
        }))
      );
    }, 300);
  }, []);

  const stopNote = useCallback((note: string) => {
    const oscillator = oscillators[note];
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      setOscillators(prev => {
        const newOsc = { ...prev };
        delete newOsc[note];
        return newOsc;
      });
      setActiveKeys(prev => prev.filter(key => key !== note));
    }
  }, [oscillators]);

  const playNote = useCallback((note: string) => {
    if (!audioContext) return;

    const freq = getNoteFrequency(note);
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    setOscillators(prev => ({ ...prev, [note]: oscillator }));
    setActiveKeys(prev => [...prev, note]);
    activateBubbles(note);
  }, [audioContext, volume, activateBubbles]);

  const handleMouseDown = (note: string, event: React.MouseEvent) => {
    playNote(note);
  };

  const handleMouseUp = (note: string) => {
    stopNote(note);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>, knob: HTMLDivElement) => {
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const rotation = ((angle * 180) / Math.PI + 180) / 360;
    setVolume(Math.max(0, Math.min(1, rotation)));
  };

  return (
    <div className={styles.container}>
      <div className={styles.pianoWindow}>
        <div className={styles.titleBar}>
          <div className={styles.windowControls}>
            <div className={styles.closeButton} />
            <div className={styles.minimizeButton} />
            <div className={styles.zoomButton} />
          </div>
          <span className={styles.titleText}>Digital Piano</span>
        </div>
        
        <div className={styles.controls}>
          <div 
            className={styles.knob} 
            style={{ transform: `rotate(${volume * 270}deg)` }}
            onMouseDown={(e) => {
              const knob = e.currentTarget;
              const handleMouseMove = (e: MouseEvent) => handleVolumeChange(e as any, knob);
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleMouseMove);
              }, { once: true });
            }}
          />
        </div>

        <div className={styles.piano}>
          {bubbles.map(bubble => {
            const size = Math.max(100, Math.min(300, bubble.freq ? (bubble.freq / 100) * 20 : 200));
            const freqColor = bubble.freq ? (bubble.freq / 1000) * 360 : 0; // Convert frequency to hue rotation
            return (
              <div
                key={bubble.id}
                className={`${styles.bubble} ${bubble.isActive ? styles.active : ''}`}
                style={{
                  left: `${bubble.x}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  '--freq': freqColor,
                } as React.CSSProperties}
              />
            );
          })}
          {octaves.map(octave => (
            notes.map(note => {
              const fullNote = `${note}${octave}`;
              const isBlackKey = note.includes('#');
              
              return (
                <div
                  key={fullNote}
                  className={`${styles.key} ${activeKeys.includes(fullNote) ? styles.active : ''}`}
                  onMouseDown={(e) => handleMouseDown(fullNote, e)}
                  onMouseUp={() => handleMouseUp(fullNote)}
                  onMouseLeave={() => handleMouseUp(fullNote)}
                >
                  {isBlackKey && (
                    <div
                      className={`${styles.blackKey} ${activeKeys.includes(fullNote) ? styles.active : ''}`}
                    />
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate frequency for a given note
function getNoteFrequency(note: string): number {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = parseInt(note.slice(-1));
  const noteIndex = notes.indexOf(note.slice(0, -1));
  
  // A4 is 440Hz
  const a4 = 440;
  const a4Index = notes.indexOf('A') + (4 * 12);
  const noteAbsoluteIndex = noteIndex + (octave * 12);
  const halfStepsFromA4 = noteAbsoluteIndex - a4Index;
  
  return a4 * Math.pow(2, halfStepsFromA4 / 12);
} 