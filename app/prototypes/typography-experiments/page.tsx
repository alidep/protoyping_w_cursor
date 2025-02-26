"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import { useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';
import PixelArt from '@/app/components/PixelArt';

// Define typography effects
const effects = [
  'Bounce',
  'Spin',
  'Shake',
  'Pulse',
  'Slide',
  'Flip'
];

const fonts = [
  'Abril Fatface',
  'Press Start 2P',
  'Permanent Marker',
  'Roboto Flex'
];

const colors = [
  '#ff6b6b', // Red
  '#4ecdc4', // Teal
  '#ffd93d', // Yellow
  '#6c5ce7', // Purple
  '#0fa',    // Neon Green
  '#ff69b4', // Pink
  '#00bfff', // Deep Sky Blue
  '#ffa500'  // Orange
];

// Define pixel art types that correspond to common words
const pixelArtTypes = [
  'house',
  'tree',
  'sun',
  'moon',
  'cat',
  'dog',
  'star',
  'heart'
];

// Define word-to-image mapping with synonyms and categories
const wordToImageMap = {
  // Buildings
  house: ['house', 'home', 'building', 'shelter', 'residence'],
  // Nature
  tree: ['tree', 'plant', 'forest', 'woods', 'pine'],
  sun: ['sun', 'sunshine', 'sunny', 'solar', 'daylight'],
  moon: ['moon', 'lunar', 'night', 'crescent', 'moonlight'],
  // Animals
  cat: ['cat', 'kitty', 'kitten', 'feline', 'meow'],
  dog: ['dog', 'puppy', 'pup', 'canine', 'bark'],
  // Symbols
  star: ['star', 'sparkle', 'twinkle', 'starlight', 'celestial'],
  heart: ['heart', 'love', 'romance', 'valentine', 'caring']
};

// Helper function to find matching image type for a word
const findMatchingImageType = (word: string): string | undefined => {
  const lowercaseWord = word.toLowerCase();
  
  // Check if the word directly matches a key
  if (pixelArtTypes.includes(lowercaseWord)) {
    return lowercaseWord;
  }
  
  // Check if the word matches any synonym
  for (const [imageType, synonyms] of Object.entries(wordToImageMap)) {
    if (synonyms.includes(lowercaseWord)) {
      return imageType;
    }
  }
  
  // Return undefined for unmatched words
  return undefined;
};

export default function TypographyExperiments() {
  const [text, setText] = useState('Type something magical');
  const words = text.split(' ');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Typography Playground</h1>
      <p className={styles.description}>
        Type words like: house, tree, sun, moon, cat, dog to see them come alive!
      </p>
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.input}
        placeholder="Try typing: house, tree, sun, moon, cat, dog..."
      />

      <div className={styles.typographyContainer}>
        <div className={styles.wordContainer}>
          {words.map((word, index) => {
            const imageType = findMatchingImageType(word);
            return (
              <div key={`${word}-${index}`} className={styles.wordGroup}>
                <div 
                  className={`${styles.word} ${styles[`effect${effects[index % effects.length]}`]}`}
                  style={{
                    fontFamily: fonts[index % fonts.length],
                    color: colors[index % colors.length]
                  }}
                >
                  {word}
                </div>
                {imageType && (
                  <PixelArt 
                    type={imageType}
                    size={32}
                    scale={3}
                    className={styles.pixelArtContainer}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 