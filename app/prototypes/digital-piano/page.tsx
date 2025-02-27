"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import Link from 'next/link';
import styles from './styles.module.css';
import { useState, useEffect, useCallback } from 'react';

type ChordType = 'major' | 'minor' | 'diminished' | 'sus';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
type Note = typeof NOTES[number];

// Base frequencies for each note in the chromatic scale starting from C4
const BASE_FREQUENCIES: { [key: string]: number } = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
  'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
  'A#': 466.16, 'B': 493.88
};

// Chromatic scale for mapping note positions
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scale intervals for different types (in semitones)
const SCALE_INTERVALS: { [key in ChordType]: number[] } = {
  major: [0, 2, 4, 5, 7, 9, 11], // Major scale: whole, whole, half, whole, whole, whole, half
  minor: [0, 2, 3, 5, 7, 8, 10], // Natural minor scale: whole, half, whole, whole, half, whole, whole
  diminished: [0, 2, 3, 5, 6, 8, 9, 11], // Diminished scale: whole, half, whole, half, whole, half, whole, half
  sus: [0, 2, 5, 7, 9], // Pentatonic scale: whole, whole+half, whole, whole
};

export default function DigitalPiano() {
  const [selectedChordType, setSelectedChordType] = useState<ChordType>('major');
  const [selectedKey, setSelectedKey] = useState<Note>('C');
  const [volume, setVolume] = useState(0.5);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeOscillator, setActiveOscillator] = useState<OscillatorNode | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }
      document.removeEventListener('mousedown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('mousedown', initAudio);
    document.addEventListener('touchstart', initAudio);

    return () => {
      document.removeEventListener('mousedown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, [audioContext]);

  const stopNote = useCallback(() => {
    if (activeOscillator) {
      activeOscillator.stop();
      activeOscillator.disconnect();
      setActiveOscillator(null);
    }
  }, [activeOscillator]);

  const getNoteFrequency = (note: string): number => {
    const keyPosition = CHROMATIC_SCALE.indexOf(selectedKey);
    const notePosition = CHROMATIC_SCALE.indexOf(note);
    
    let semitones = notePosition - keyPosition;
    if (semitones < 0) semitones += 12;
    
    const scaleIntervals = SCALE_INTERVALS[selectedChordType];
    const baseFreq = BASE_FREQUENCIES[selectedKey];
    
    // Calculate the chromatic frequency first
    const chromaticFreq = baseFreq * Math.pow(2, semitones / 12);
    
    // If the note is in our scale, return its frequency
    if (scaleIntervals.includes(semitones)) {
      return chromaticFreq;
    }
    
    // For non-scale notes, return the chromatic frequency
    return chromaticFreq;
  };

  const playNote = useCallback((note: string) => {
    if (!audioContext) return;

    stopNote();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(
      getNoteFrequency(note),
      audioContext.currentTime
    );

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setActiveOscillator(oscillator);
  }, [audioContext, volume, selectedKey, selectedChordType, stopNote]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const cycleKey = () => {
    const currentIndex = NOTES.indexOf(selectedKey);
    const nextIndex = (currentIndex + 1) % NOTES.length;
    setSelectedKey(NOTES[nextIndex]);
  };

  // Define black keys with their offsets (percentage of white key width)
  const blackKeys = [
    { note: 'C#', offset: '14.285%' },  // Between C and D
    { note: 'D#', offset: '28.571%' },  // Between D and E
    { note: 'F#', offset: '57.142%' },  // Between F and G
    { note: 'G#', offset: '71.428%' },  // Between G and A
    { note: 'A#', offset: '85.714%' }   // Between A and B
  ];

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
          <div className={styles.topControls}>
            <div className={styles.chordTypeControls}>
              {(['major', 'minor', 'diminished', 'sus'] as ChordType[]).map(type => (
                <button
                  key={type}
                  className={`${styles.chordTypeButton} ${selectedChordType === type ? styles.selected : ''}`}
                  onClick={() => setSelectedChordType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className={styles.keySelector}>
              <div className={styles.keySelectorDisplay}>
                <div className={styles.displayScreen}>
                  <span className={styles.displayText}>{selectedKey}</span>
                </div>
                <button onClick={cycleKey} className={styles.keySelectorButton}>
                  Change Key
                </button>
              </div>
            </div>
          </div>

          <div className={styles.piano}>
            <div className={styles.whiteKeys}>
              {NOTES.map(note => (
                <div
                  key={note}
                  className={styles.key}
                  onMouseDown={() => playNote(note)}
                  onMouseUp={stopNote}
                  onMouseLeave={stopNote}
                >
                  <span className={styles.noteLabel}>{note}</span>
                </div>
              ))}
            </div>
            <div className={styles.blackKeys}>
              {blackKeys.map(({ note, offset }) => (
                <div
                  key={note}
                  className={styles.blackKey}
                  style={{ left: offset }}
                  onMouseDown={() => playNote(note)}
                  onMouseUp={stopNote}
                  onMouseLeave={stopNote}
                >
                  <span className={styles.noteLabel}>{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.volumeControl}>
            <label>Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
            />
            <span className={styles.volumeValue}>{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 