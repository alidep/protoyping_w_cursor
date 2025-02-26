import React, { useEffect, useRef } from 'react';

interface PixelArtProps {
  type: string;
  size?: number;
  scale?: number;
  className?: string;
}

const PixelArt: React.FC<PixelArtProps> = ({ type, size = 32, scale = 4, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set pixel size
    const pixelSize = scale;
    
    // Drawing functions
    const drawPixel = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    };

    const drawHouse = () => {
      // Roof
      const roofColor = '#8B4513';
      for (let y = 0; y < 8; y++) {
        for (let x = y; x < 16 - y; x++) {
          drawPixel(x + 8, y + 2, roofColor);
        }
      }

      // Walls
      const wallColor = '#DEB887';
      for (let y = 10; y < 24; y++) {
        for (let x = 8; x < 24; x++) {
          drawPixel(x, y, wallColor);
        }
      }

      // Door
      const doorColor = '#8B4513';
      for (let y = 16; y < 24; y++) {
        for (let x = 14; x < 18; x++) {
          drawPixel(x, y, doorColor);
        }
      }

      // Windows
      const windowColor = '#87CEEB';
      for (let y = 14; y < 18; y++) {
        for (let x = 10; x < 13; x++) {
          drawPixel(x, y, windowColor);
        }
        for (let x = 19; x < 22; x++) {
          drawPixel(x, y, windowColor);
        }
      }
    };

    const drawTree = () => {
      // Trunk
      const trunkColor = '#8B4513';
      for (let y = 20; y < 28; y++) {
        for (let x = 14; x < 18; x++) {
          drawPixel(x, y, trunkColor);
        }
      }

      // Leaves
      const leafColors = ['#228B22', '#32CD32', '#90EE90'];
      for (let layer = 0; layer < 4; layer++) {
        const width = 14 - layer * 2;
        const yStart = 4 + layer * 4;
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < width; x++) {
            const colorIndex = (x + y + layer) % leafColors.length;
            drawPixel(x + 9 + layer, y + yStart, leafColors[colorIndex]);
          }
        }
      }
    };

    const drawSun = () => {
      // Core
      const sunColors = ['#FFD700', '#FFA500', '#FF8C00'];
      for (let y = 8; y < 24; y++) {
        for (let x = 8; x < 24; x++) {
          const dist = Math.sqrt(Math.pow(x - 16, 2) + Math.pow(y - 16, 2));
          if (dist < 8) {
            const colorIndex = Math.floor(dist) % sunColors.length;
            drawPixel(x, y, sunColors[colorIndex]);
          }
        }
      }

      // Rays
      const rayColor = '#FFD700';
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x = 16 + Math.cos(angle) * 12;
        const y = 16 + Math.sin(angle) * 12;
        drawPixel(Math.floor(x), Math.floor(y), rayColor);
      }
    };

    const drawMoon = () => {
      // Main moon shape
      const moonColors = ['#F5F5F5', '#E0E0E0', '#BDBDBD'];
      for (let y = 8; y < 24; y++) {
        for (let x = 8; x < 24; x++) {
          const dist = Math.sqrt(Math.pow(x - 16, 2) + Math.pow(y - 16, 2));
          if (dist < 8) {
            const colorIndex = Math.floor(dist) % moonColors.length;
            drawPixel(x, y, moonColors[colorIndex]);
          }
        }
      }

      // Craters
      const craterColor = '#9E9E9E';
      const craters = [
        { x: 14, y: 12, size: 2 },
        { x: 18, y: 15, size: 1 },
        { x: 16, y: 18, size: 2 }
      ];

      craters.forEach(crater => {
        for (let y = 0; y < crater.size; y++) {
          for (let x = 0; x < crater.size; x++) {
            drawPixel(crater.x + x, crater.y + y, craterColor);
          }
        }
      });
    };

    const drawCat = () => {
      // Body
      const bodyColor = '#808080';
      for (let y = 14; y < 24; y++) {
        for (let x = 10; x < 22; x++) {
          drawPixel(x, y, bodyColor);
        }
      }

      // Head
      for (let y = 8; y < 14; y++) {
        for (let x = 12; x < 20; x++) {
          drawPixel(x, y, bodyColor);
        }
      }

      // Ears
      drawPixel(12, 7, bodyColor);
      drawPixel(19, 7, bodyColor);
      drawPixel(11, 8, bodyColor);
      drawPixel(20, 8, bodyColor);

      // Eyes
      const eyeColor = '#FFD700';
      drawPixel(14, 10, eyeColor);
      drawPixel(17, 10, eyeColor);

      // Tail
      for (let i = 0; i < 4; i++) {
        drawPixel(22 + i, 20 - i, bodyColor);
      }
    };

    const drawDog = () => {
      // Body
      const bodyColor = '#8B4513';
      for (let y = 14; y < 24; y++) {
        for (let x = 10; x < 22; x++) {
          drawPixel(x, y, bodyColor);
        }
      }

      // Head
      for (let y = 10; y < 16; y++) {
        for (let x = 8; x < 16; x++) {
          drawPixel(x, y, bodyColor);
        }
      }

      // Snout
      const snoutColor = '#DEB887';
      for (let y = 12; y < 15; y++) {
        for (let x = 6; x < 9; x++) {
          drawPixel(x, y, snoutColor);
        }
      }

      // Eyes
      const eyeColor = '#000000';
      drawPixel(10, 12, eyeColor);
      drawPixel(13, 12, eyeColor);

      // Ears
      for (let i = 0; i < 3; i++) {
        drawPixel(9 + i, 9, bodyColor);
        drawPixel(13 + i, 9, bodyColor);
      }

      // Tail
      for (let i = 0; i < 4; i++) {
        drawPixel(22 + i, 16 + i, bodyColor);
      }
    };

    const drawStar = () => {
      const starColor = '#FFD700';  // Gold
      const glowColor = '#FFFFE0';  // Light yellow

      // Draw the star points
      const points = [
        [16, 8],  // Top
        [20, 14], // Upper right
        [24, 14], // Far right
        [21, 18], // Lower right
        [22, 24], // Bottom right
        [16, 20], // Bottom center
        [10, 24], // Bottom left
        [11, 18], // Lower left
        [8, 14],  // Far left
        [12, 14]  // Upper left
      ];

      // Draw the star shape
      for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % points.length];
        
        // Draw lines between points
        const dx = x2 - x1;
        const dy = y2 - y1;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        for (let j = 0; j <= steps; j++) {
          const x = Math.round(x1 + (dx * j) / steps);
          const y = Math.round(y1 + (dy * j) / steps);
          drawPixel(x, y, starColor);
        }
      }

      // Add some glow effects
      const glowPoints = [
        [16, 9], [16, 7],  // Top
        [19, 14], [21, 14], // Right
        [16, 19], [16, 21], // Bottom
        [13, 14], [11, 14]  // Left
      ];

      glowPoints.forEach(([x, y]) => {
        drawPixel(x, y, glowColor);
      });
    };

    const drawHeart = () => {
      const heartColor = '#FF69B4';  // Hot pink
      const shadowColor = '#FF1493'; // Deep pink

      // Draw the main heart shape
      const heartShape = (x: number, y: number, size: number) => {
        for (let i = 0; i <= size; i++) {
          for (let j = 0; j <= size; j++) {
            const dx = i - size/2;
            const dy = j - size/2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < size/2) {
              // Create heart shape using mathematical formula
              const heartX = x + i;
              const heartY = y + j;
              
              if ((Math.pow((heartX-16), 2) + Math.pow((heartY-16), 2) - 100) < 0) {
                drawPixel(heartX, heartY, heartColor);
              }
            }
          }
        }
      };

      // Draw main heart
      heartShape(8, 8, 16);

      // Add some shading/highlights
      const highlights = [
        [14, 12], [15, 11], [16, 11],
        [17, 12], [18, 13], [19, 14]
      ];

      highlights.forEach(([x, y]) => {
        drawPixel(x, y, shadowColor);
      });
    };

    // Draw based on type
    switch (type.toLowerCase()) {
      case 'house':
        drawHouse();
        break;
      case 'tree':
        drawTree();
        break;
      case 'sun':
        drawSun();
        break;
      case 'moon':
        drawMoon();
        break;
      case 'cat':
        drawCat();
        break;
      case 'dog':
        drawDog();
        break;
      case 'star':
        drawStar();
        break;
      case 'heart':
        drawHeart();
        break;
    }
  }, [type, size, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={size * scale}
      height={size * scale}
      className={className}
      style={{
        width: size * scale,
        height: size * scale,
        imageRendering: 'pixelated'
      }}
    />
  );
};

export default PixelArt; 