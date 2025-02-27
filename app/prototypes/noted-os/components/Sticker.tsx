"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './Sticker.module.css';

interface StickerProps {
  text: string;
  initialPosition: { x: number; y: number };
  onDelete: () => void;
  isImage?: boolean;
}

export default function Sticker({ text, initialPosition, onDelete, isImage = false }: StickerProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const stickerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
    if (!ctx) return;

    if (isImage) {
      // Handle image content
      canvas.width = 200;
      canvas.height = 200;

      const img = new Image();
      img.onload = () => {
        // Calculate scaling to fit the canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        // Clear the canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Enable high-quality image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the image
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
      img.src = text; // text contains the image data URL
    } else {
      // Handle text content
      canvas.width = 200;
      canvas.height = 100;

      // Clear the canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = '24px "Comic Sans MS"';
      ctx.fillStyle = '#ff69b4';
      
      // Center the text
      const textMetrics = ctx.measureText(text);
      const x = (canvas.width - textMetrics.width) / 2;
      const y = canvas.height / 2;

      // Draw text
      ctx.save();
      ctx.fillText(text, x, y);
      ctx.restore();
    }
  }, [text, isImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!stickerRef.current) return;

    const rect = stickerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={stickerRef}
      className={styles.sticker}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <button className={styles.deleteButton} onClick={onDelete}>×</button>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
} 