"use client";

import styles from './Toolbar.module.css';

interface ToolbarProps {
  onNewNote: (type: 'text' | 'drawing') => void;
}

export default function Toolbar({ onNewNote }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.logo}>
        Noted OS
      </div>
      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={() => onNewNote('text')}
          title="New Text Note"
        >
          <span className={styles.icon}>📝</span>
          New Note
        </button>
        <button
          className={styles.button}
          onClick={() => onNewNote('drawing')}
          title="New Drawing"
        >
          <span className={styles.icon}>🎨</span>
          New Drawing
        </button>
      </div>
    </div>
  );
} 