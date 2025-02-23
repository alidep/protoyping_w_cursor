'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import styles from './styles/home.module.css';

interface OrbPosition {
  x: number;
  y: number;
}

export default function Home() {
  // State for tracking each orb's position and active drag state
  const [orbPositions, setOrbPositions] = useState<OrbPosition[]>(Array(5).fill({ x: 0, y: 0 }));
  const [activeOrb, setActiveOrb] = useState<number | null>(null);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbStart = useRef<OrbPosition>({ x: 0, y: 0 });

  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Getting started',
      description: 'How to create a prototype',
      path: '/prototypes/example'
    },
    {
      title: 'Design library',
      description: 'Reusable components that you can use in your prototypes',
      path: '/prototypes/design-library'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  const handleOrbMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveOrb(index);
    dragStart.current = { x: e.clientX, y: e.clientY };
    orbStart.current = orbPositions[index];
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeOrb === null) return;
    
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    setOrbPositions(prev => prev.map((pos, idx) => 
      idx === activeOrb 
        ? { 
            x: orbStart.current.x + dx,
            y: orbStart.current.y + dy
          }
        : pos
    ));
  };

  const handleMouseUp = () => {
    setActiveOrb(null);
  };

  return (
    <div className={styles.container}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`${styles.floatingOrb} ${styles[`orb${i + 1}`]}`}
          style={{
            transform: `translate(${orbPositions[i].x}px, ${orbPositions[i].y}px)`,
            cursor: activeOrb === i ? 'grabbing' : 'grab',
            pointerEvents: 'auto'
          }}
          onMouseDown={(e) => handleOrbMouseDown(e, i)}
        ></div>
      ))}

      {/* Add iridescent shell elements */}
      <div className={styles.shell1}></div>
      <div className={styles.shell2}></div>
      <div className={styles.shell3}></div>

      <div role="banner" className={styles.header}>
        <div className={styles.windowControls}>
          <span className={styles.closeButton}></span>
          <span className={styles.minimizeButton}></span>
          <span className={styles.zoomButton}></span>
        </div>
        <h1>Welcome to Ali's Prototypes</h1>
      </div>

      <main className={styles.mainContent}>
        <section className={styles.grid}>
          {/* Goes through the prototypes list (array) to create cards */}
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.path} 
              className={styles.card}
            >
              <h3>📁 {prototype.title}</h3>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} • Made with Classic Mac OS style</p>
      </footer>
    </div>
  );
}
