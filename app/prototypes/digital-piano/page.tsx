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

// Intervals for different chord types (in semitones)
const CHORD_INTERVALS: { [key in ChordType]: number[] } = {
  major: [0, 4, 7], // Root, Major Third, Perfect Fifth
  minor: [0, 3, 7], // Root, Minor Third, Perfect Fifth
  diminished: [0, 3, 6], // Root, Minor Third, Diminished Fifth
  sus: [0, 5, 7], // Root, Perfect Fourth, Perfect Fifth
};

export default function DigitalPiano() {
  const [selectedChordType, setSelectedChordType] = useState<ChordType>('major');
  const [selectedKey, setSelectedKey] = useState<Note>('C');
  const [volume, setVolume] = useState(0.5);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<OscillatorNode[]>([]);

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

  const stopChord = useCallback(() => {
    activeOscillators.forEach(osc => {
      osc.stop();
      osc.disconnect();
    });
    setActiveOscillators([]);
  }, [activeOscillators]);

  const getNoteFrequency = (note: string, semitones: number): number => {
    const baseFreq = BASE_FREQUENCIES[selectedKey];
    const noteIndex = NOTES.indexOf(note as Note);
    const keyIndex = NOTES.indexOf(selectedKey);
    const interval = ((noteIndex - keyIndex + 7) % 7) * 2 - (note.includes('#') ? 1 : 0);
    return baseFreq * Math.pow(2, (interval + semitones) / 12);
  };

  const playChord = useCallback((rootNote: string) => {
    if (!audioContext) return;

    stopChord();

    const intervals = CHORD_INTERVALS[selectedChordType];
    const newOscillators: OscillatorNode[] = [];

    intervals.forEach(interval => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(
        getNoteFrequency(rootNote, interval),
        audioContext.currentTime
      );

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      newOscillators.push(oscillator);
    });

    setActiveOscillators(newOscillators);
  }, [audioContext, volume, selectedChordType, selectedKey, stopChord]);

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
                  onMouseDown={() => playChord(note)}
                  onMouseUp={stopChord}
                  onMouseLeave={stopChord}
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
                  onMouseDown={() => playChord(note.replace('#', ''))}
                  onMouseUp={stopChord}
                  onMouseLeave={stopChord}
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