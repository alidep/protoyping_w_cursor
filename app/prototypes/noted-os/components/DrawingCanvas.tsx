"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './DrawingCanvas.module.css';

interface DrawingCanvasProps {
  content: string;
  onChange: (content: string) => void;
  onCreateSticker?: (content: string) => void;
}

interface Point {
  x: number;
  y: number;
}

type Tool = 'pencil' | 'brush' | 'eraser' | 'line' | 'rectangle' | 'ellipse';

export default function DrawingCanvas({ content, onChange, onCreateSticker }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(1);
  const lastPoint = useRef<Point | null>(null);
  const startPoint = useRef<Point | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth - 4; // Account for borders
      canvas.height = container.clientHeight - 4;
      
      // Create temporary canvas for shape preview
      if (!tempCanvasRef.current) {
        tempCanvasRef.current = document.createElement('canvas');
      }
      tempCanvasRef.current.width = canvas.width;
      tempCanvasRef.current.height = canvas.height;
      
      // Restore content after resize
      if (content) {
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0);
        };
        img.src = content;
      } else {
        // Fill with white background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [content]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setIsDrawing(true);
    lastPoint.current = point;
    startPoint.current = point;

    if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
      const context = canvas.getContext('2d');
      if (!context) return;

      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(point.x, point.y);
      context.strokeStyle = currentTool === 'eraser' ? '#ffffff' : color;
      context.lineWidth = currentTool === 'brush' ? lineWidth * 2 : lineWidth;
      context.lineCap = 'round';
      context.stroke();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint.current || !startPoint.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
      context.beginPath();
      context.moveTo(lastPoint.current.x, lastPoint.current.y);
      context.lineTo(currentPoint.x, currentPoint.y);
      context.strokeStyle = currentTool === 'eraser' ? '#ffffff' : color;
      context.lineWidth = currentTool === 'brush' ? lineWidth * 2 : lineWidth;
      context.lineCap = 'round';
      context.stroke();
      lastPoint.current = currentPoint;
    } else {
      // For shape tools, draw on temporary canvas for preview
      const tempContext = tempCanvasRef.current?.getContext('2d');
      if (!tempContext) return;

      // Clear temp canvas and copy main canvas content
      tempContext.clearRect(0, 0, canvas.width, canvas.height);
      tempContext.drawImage(canvas, 0, 0);

      // Draw shape preview
      tempContext.beginPath();
      tempContext.strokeStyle = color;
      tempContext.lineWidth = lineWidth;

      if (currentTool === 'line') {
        tempContext.moveTo(startPoint.current.x, startPoint.current.y);
        tempContext.lineTo(currentPoint.x, currentPoint.y);
      } else if (currentTool === 'rectangle') {
        const width = currentPoint.x - startPoint.current.x;
        const height = currentPoint.y - startPoint.current.y;
        tempContext.strokeRect(startPoint.current.x, startPoint.current.y, width, height);
      } else if (currentTool === 'ellipse') {
        const radiusX = Math.abs(currentPoint.x - startPoint.current.x) / 2;
        const radiusY = Math.abs(currentPoint.y - startPoint.current.y) / 2;
        const centerX = startPoint.current.x + (currentPoint.x - startPoint.current.x) / 2;
        const centerY = startPoint.current.y + (currentPoint.y - startPoint.current.y) / 2;
        tempContext.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      }
      tempContext.stroke();

      // Copy temp canvas to main canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(tempCanvasRef.current, 0, 0);
    }
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      lastPoint.current = null;
      startPoint.current = null;
      onChange(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    onChange(canvas.toDataURL());
  };

  const handleCreateSticker = () => {
    if (!canvasRef.current || !onCreateSticker) return;
    onCreateSticker(canvasRef.current.toDataURL());
  };

  return (
    <div className={styles.drawingContainer}>
      <div className={styles.toolbar}>
        <button
          className={`${styles.toolButton} ${currentTool === 'pencil' ? styles.active : ''}`}
          onClick={() => setCurrentTool('pencil')}
          title="Pencil"
        >
          ✏️
        </button>
        <button
          className={`${styles.toolButton} ${currentTool === 'brush' ? styles.active : ''}`}
          onClick={() => setCurrentTool('brush')}
          title="Brush"
        >
          🖌️
        </button>
        <button
          className={`${styles.toolButton} ${currentTool === 'eraser' ? styles.active : ''}`}
          onClick={() => setCurrentTool('eraser')}
          title="Eraser"
        >
          🧹
        </button>
        <div className={styles.separator} />
        <button
          className={`${styles.toolButton} ${currentTool === 'line' ? styles.active : ''}`}
          onClick={() => setCurrentTool('line')}
          title="Line"
        >
          /
        </button>
        <button
          className={`${styles.toolButton} ${currentTool === 'rectangle' ? styles.active : ''}`}
          onClick={() => setCurrentTool('rectangle')}
          title="Rectangle"
        >
          □
        </button>
        <button
          className={`${styles.toolButton} ${currentTool === 'ellipse' ? styles.active : ''}`}
          onClick={() => setCurrentTool('ellipse')}
          title="Ellipse"
        >
          ○
        </button>
        <div className={styles.separator} />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className={styles.colorPicker}
          title="Color"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className={styles.lineWidth}
          title="Line Width"
        />
        <div className={styles.separator} />
        <button
          className={styles.toolButton}
          onClick={clearCanvas}
          title="Clear Canvas"
        >
          🗑️
        </button>
        {onCreateSticker && (
          <>
            <div className={styles.separator} />
            <button
              onClick={handleCreateSticker}
              className={styles.stickerButton}
              title="Create Sticker from Drawing"
            >
              ✨ Make Sticker
            </button>
          </>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
} 