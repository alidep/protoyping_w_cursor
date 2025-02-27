'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from './styles/home.module.css';

interface Position {
  x: number;
  y: number;
}

interface WindowState {
  position: Position;
  isDragging: boolean;
  dragStart: Position;
}

export default function Home() {
  const [browserWindow, setBrowserWindow] = useState<WindowState>({
    position: { x: 40, y: 40 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  const [aimWindow, setAimWindow] = useState<WindowState>({
    position: { x: 40, y: 40 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserWindow(prev => ({
        ...prev,
        position: {
          x: window.innerWidth - 840,
          y: window.innerHeight - 640
        }
      }));

      setAimWindow(prev => ({
        ...prev,
        position: {
          x: (window.innerWidth - 550) / 2,
          y: (window.innerHeight - 400) / 2
        }
      }));
    }
  }, []);

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
    {
      title: 'Digital Piano',
      description: 'A monochromatic pink Mac OS-style synthesizer',
      path: '/prototypes/digital-piano'
    },
    {
      title: 'Typography Experiments',
      description: 'Interactive CSS typography effects with 3D, wavy, circular, and variable fonts',
      path: '/prototypes/typography-experiments'
    },
    {
      title: 'Noted OS',
      description: 'A classic OS-style note-taking app with rich text editing and drawing capabilities',
      path: '/prototypes/noted-os'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  const handleMouseDown = (e: React.MouseEvent, window: 'browser' | 'aim') => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') return;
    
    const state = window === 'browser' ? browserWindow : aimWindow;
    const setState = window === 'browser' ? setBrowserWindow : setAimWindow;
    
    setState({
      ...state,
      isDragging: true,
      dragStart: {
        x: e.clientX - state.position.x,
        y: e.clientY - state.position.y
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (browserWindow.isDragging) {
      setBrowserWindow({
        ...browserWindow,
        position: {
          x: e.clientX - browserWindow.dragStart.x,
          y: e.clientY - browserWindow.dragStart.y
        }
      });
    }
    if (aimWindow.isDragging) {
      setAimWindow({
        ...aimWindow,
        position: {
          x: e.clientX - aimWindow.dragStart.x,
          y: e.clientY - aimWindow.dragStart.y
        }
      });
    }
  };

  const handleMouseUp = () => {
    setBrowserWindow({ ...browserWindow, isDragging: false });
    setAimWindow({ ...aimWindow, isDragging: false });
  };

  return (
    <div className={styles.container}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}>
      <div className={styles.browserFrame}
           style={{
             left: browserWindow.position.x,
             top: browserWindow.position.y,
             bottom: 'auto',
             right: 'auto'
           }}>
        <div className={styles.browserToolbar}
             onMouseDown={(e) => handleMouseDown(e, 'browser')}>
          <div className={styles.browserButtons}>
            <button className={styles.browserButton}>←</button>
            <button className={styles.browserButton}>→</button>
            <button className={styles.browserButton}>⟳</button>
            <button className={styles.browserButton}>⌂</button>
          </div>
        </div>
        <div className={styles.browserAddressBar}>
          <span>Location:</span>
          <div className={styles.browserLocation}>http://www.geocities.com/dancinghamsters/</div>
        </div>
        <div className={styles.browserContent}>
          <div className={styles.geocitiesBackground}>
            <div className={styles.geocitiesContent}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                ✨ Welcome to Dancing Hamsters Paradise! ✨
              </div>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>
                💃 🐹 Dance Dance Hamster Revolution 🐹 💃
              </div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                Watch these adorable hamsters groove to the beat!
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <img 
                  src="/dancing-hamster.gif" 
                  alt="Dancing Hamster" 
                  style={{ width: '80%', maxWidth: '500px', marginTop: '10px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                🚧 More hamsters coming soon! 🚧
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <img 
                  src="/construction.gif" 
                  alt="Under Construction" 
                  style={{ width: '100px', height: '100px', marginTop: '10px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.window}
           style={{
             left: aimWindow.position.x,
             top: aimWindow.position.y,
             width: '550px',
             height: '400px'
           }}>
        <div className={styles.titleBar}
             onMouseDown={(e) => handleMouseDown(e, 'aim')}>
          <div className={styles.windowTitle}>
            <img src="/AIM.png" alt="AIM" className={styles.titleIcon} style={{ width: '35px', height: '35px' }} />
            Ali's Prototypes Online (1.0)
          </div>
          <div className={styles.windowControls}>
            <button className={styles.minimizeButton}>_</button>
            <button className={styles.maximizeButton}>□</button>
            <button className={styles.closeButton}>×</button>
          </div>
        </div>

        <div className={styles.toolbar}>
          <button className={styles.toolbarButton}>File</button>
          <button className={styles.toolbarButton}>Edit</button>
          <button className={styles.toolbarButton}>View</button>
          <button className={styles.toolbarButton}>Help</button>
        </div>

        <main className={styles.mainContent}>
          <div className={styles.buddyList}>
            <div className={styles.buddyListHeader}>
              My Prototypes (5/5 online)
            </div>
            <div className={styles.grid}>
              {prototypes.map((prototype, index) => (
                <Link 
                  key={index}
                  href={prototype.path} 
                  className={styles.buddyItem}
                >
                  <span className={styles.onlineIcon}>●</span>
                  <span className={styles.buddyName}>
                    {prototype.title === 'Typography Experiments' ? (
                      <>
                        Typography
                        <br />
                        Experiments
                      </>
                    ) : prototype.title}
                  </span>
                  <span className={styles.awayMessage}>{prototype.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      <div className={styles.taskbar}>
        <button className={styles.startButton}>
          <span className={styles.startIcon}>🪟</span>
          Start
        </button>
        <div className={styles.taskbarTime}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
