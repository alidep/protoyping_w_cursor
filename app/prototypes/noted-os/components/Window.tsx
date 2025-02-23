"use client";

import { useState, useRef, useEffect } from 'react';
import styles from '../styles.module.css';

interface WindowProps {
  note: {
    id: string;
    title: string;
    position: { x: number; y: number };
    isMinimized: boolean;
  };
  children: React.ReactNode;
  isActive: boolean;
  onActivate: () => void;
  onMove: (id: string, x: number, y: number) => void;
  onMinimize: () => void;
  onClose: () => void;
}

export default function Window({
  note,
  children,
  isActive,
  onActivate,
  onMove,
  onMinimize,
  onClose,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!windowRef.current) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Optional: Add grid snapping here
      const gridSize = 10;
      const snappedX = Math.round(newX / gridSize) * gridSize;
      const snappedY = Math.round(newY / gridSize) * gridSize;
      
      onMove(note.id, snappedX, snappedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, note.id, onMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setIsDragging(true);
    onActivate();
  };

  if (note.isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        transform: `translate(${note.position.x}px, ${note.position.y}px)`,
        zIndex: isActive ? 10 : 1,
      }}
      onClick={onActivate}
    >
      <div className={styles.windowHeader} onMouseDown={handleMouseDown}>
        <h3 className={styles.windowTitle}>{note.title}</h3>
        <div className={styles.windowControls}>
          <button
            className={styles.windowControl}
            style={{ backgroundColor: '#ffbd44' }}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          />
          <button
            className={styles.windowControl}
            style={{ backgroundColor: '#ff605c' }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        </div>
      </div>
      <div className={styles.windowContent}>
        {children}
      </div>
    </div>
  );
} 