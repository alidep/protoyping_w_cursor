"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './TextNote.module.css';

interface TextNoteProps {
  content: string;
  onChange: (content: string) => void;
  onCreateSticker: (text: string) => void;
}

export default function TextNote({ content, onChange, onCreateSticker }: TextNoteProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const checkSelection = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const text = selection.toString().trim();
      if (text) {
        setSelectedText(text);
      }
    } else {
      setSelectedText('');
    }
  };

  const handleCreateSticker = () => {
    if (!selectedText) return;
    onCreateSticker(selectedText);
    setSelectedText('');
  };

  return (
    <div className={styles.textNoteContainer}>
      <div className={styles.toolbar}>
        <button onClick={() => execCommand('bold')} title="Bold">
          B
        </button>
        <button onClick={() => execCommand('italic')} title="Italic">
          I
        </button>
        <button onClick={() => execCommand('underline')} title="Underline">
          U
        </button>
        <div className={styles.separator} />
        <button onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          •
        </button>
        <button onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          1.
        </button>
        <div className={styles.separator} />
        <select 
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className={styles.formatSelect}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        {selectedText && (
          <>
            <div className={styles.separator} />
            <button
              onClick={handleCreateSticker}
              className={styles.stickerButton}
              title="Create Sticker"
            >
              ✨ Make Sticker
            </button>
          </>
        )}
      </div>
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        onInput={handleInput}
        onMouseUp={checkSelection}
        onKeyUp={checkSelection}
        suppressContentEditableWarning
      />
    </div>
  );
} 