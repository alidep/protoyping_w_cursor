"use client";

import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Window from './components/Window';
import TextNote from './components/TextNote';
import DrawingCanvas from './components/DrawingCanvas';
import Toolbar from './components/Toolbar';
import Sticker from './components/Sticker';

interface Note {
  id: string;
  type: 'text' | 'drawing';
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

interface StickerData {
  id: string;
  text: string;
  position: { x: number; y: number };
  isImage: boolean;
}

export default function NotedOS() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  useEffect(() => {
    // Load saved notes from localStorage
    const savedNotes = localStorage.getItem('notedos-notes');
    const savedStickers = localStorage.getItem('notedos-stickers');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedStickers) {
      setStickers(JSON.parse(savedStickers));
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage whenever they change
    localStorage.setItem('notedos-notes', JSON.stringify(notes));
    localStorage.setItem('notedos-stickers', JSON.stringify(stickers));
  }, [notes, stickers]);

  const createNewNote = (type: 'text' | 'drawing') => {
    const newNote: Note = {
      id: Date.now().toString(),
      type,
      title: type === 'text' ? 'New Note' : 'New Drawing',
      content: '',
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      size: { width: 400, height: 300 },
      isMinimized: false,
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const updateNotePosition = (id: string, x: number, y: number) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, position: { x, y } } : note
    ));
  };

  const updateNoteContent = (id: string, content: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, content } : note
    ));
  };

  const toggleMinimize = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isMinimized: !note.isMinimized } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  const createSticker = (content: string, isImage: boolean = false) => {
    const newSticker: StickerData = {
      id: Date.now().toString(),
      text: content,
      position: {
        x: Math.random() * (window.innerWidth / 2),
        y: Math.random() * (window.innerHeight / 2)
      },
      isImage
    };
    setStickers([...stickers, newSticker]);
  };

  const deleteSticker = (id: string) => {
    setStickers(stickers.filter(sticker => sticker.id !== id));
  };

  return (
    <div className={styles.container}>
      <Toolbar onNewNote={createNewNote} />
      <main className={styles.workspace}>
        {notes.map((note) => (
          <Window
            key={note.id}
            note={note}
            isActive={activeNoteId === note.id}
            onActivate={() => setActiveNoteId(note.id)}
            onMove={updateNotePosition}
            onMinimize={() => toggleMinimize(note.id)}
            onClose={() => deleteNote(note.id)}
          >
            {note.type === 'text' ? (
              <TextNote
                content={note.content}
                onChange={(content) => updateNoteContent(note.id, content)}
                onCreateSticker={(text) => createSticker(text)}
              />
            ) : (
              <DrawingCanvas
                content={note.content}
                onChange={(content) => updateNoteContent(note.id, content)}
                onCreateSticker={(content) => createSticker(content, true)}
              />
            )}
          </Window>
        ))}
        <div className={styles.stickerLayer}>
          {stickers.map((sticker) => (
            <Sticker
              key={sticker.id}
              text={sticker.text}
              initialPosition={sticker.position}
              onDelete={() => deleteSticker(sticker.id)}
              isImage={sticker.isImage}
            />
          ))}
        </div>
      </main>
    </div>
  );
} 