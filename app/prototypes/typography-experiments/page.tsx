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

const effects = ['bounce', 'spin', 'shake', 'pulse', 'slide', 'flip'];
const pixelArtTypes = ['house', 'tree', 'sun', 'moon', 'cat', 'dog'];

export default function TypographyExperiments() {
  const [text, setText] = useState('Type something magical');
  const words = text.split(' ');

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.input}
        placeholder="Try typing: house, tree, sun, moon, cat, dog..."
      />
      <div className={styles.typographyContainer}>
        <div className={styles.wordContainer}>
          {words.map((word, index) => (
            <div key={index} className={styles.wordGroup}>
              <div className={styles[`effect${effects[index % effects.length]}`]}>
                {word}
              </div>
              <PixelArt 
                type={pixelArtTypes[index % pixelArtTypes.length]}
                size={32}
                scale={3}
                className={styles.pixelArtContainer}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 