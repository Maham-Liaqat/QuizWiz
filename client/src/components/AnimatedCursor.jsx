// components/AnimatedCursor.jsx - Advanced Version
import React, { useEffect, useState, useCallback } from 'react';
 
const AnimatedCursor = ({ 
  color = 'primary',
  outerSize = 40,
  innerSize = 8,
  outerScale = 1.5,
  innerScale = 1.2,
  clickScale = 0.7,
  trailingDots = 3,
  dotDelay = 100 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Color mappings
  const colorMap = {
     primary: {
    outer: 'border-primary-400 dark:border-primary-500',
    inner: 'bg-primary-400 dark:bg-primary-500',
    hover: 'border-primary-300 dark:border-primary-400 bg-primary-300 dark:bg-primary-400',
    click: 'border-primary-500 dark:border-primary-600 bg-primary-500 dark:bg-primary-600'
  },
      secondary: {
    outer: 'border-secondary-400 dark:border-secondary-500',
    inner: 'bg-secondary-400 dark:bg-secondary-500',
    hover: 'border-secondary-300 dark:border-secondary-400 bg-secondary-300 dark:bg-secondary-400',
    click: 'border-secondary-500 dark:border-secondary-600 bg-secondary-500 dark:bg-secondary-600'
  },
    accent: {
    outer: 'border-accent-400 dark:border-accent-500',
    inner: 'bg-accent-400 dark:bg-accent-500',
    hover: 'border-accent-300 dark:border-accent-400 bg-accent-300 dark:bg-accent-400',
    click: 'border-accent-500 dark:border-accent-600 bg-accent-500 dark:bg-accent-600'
  }
  };

  const colors = colorMap[color] || colorMap.primary;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const onMouseDown = useCallback(() => {
    setClicked(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setClicked(false);
  }, []);

  const onMouseEnter = useCallback(() => {
    setHidden(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHidden(true);
  }, []);

  const addEventListeners = useCallback(() => {
    if (isMobile) return;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    // Detect hover states on interactive elements
    const links = document.querySelectorAll('a, [href]');
    const buttons = document.querySelectorAll('button, [role="button"], .btn');
    const inputs = document.querySelectorAll('input, textarea, select, .input-field');

    const handleLinkEnter = () => setLinkHovered(true);
    const handleLinkLeave = () => setLinkHovered(false);
    const handleButtonEnter = () => setButtonHovered(true);
    const handleButtonLeave = () => setButtonHovered(false);
    const handleInputEnter = () => setInputHovered(true);
    const handleInputLeave = () => setInputHovered(false);

    links.forEach(el => {
      el.addEventListener('mouseenter', handleLinkEnter);
      el.addEventListener('mouseleave', handleLinkLeave);
    });

    buttons.forEach(el => {
      el.addEventListener('mouseenter', handleButtonEnter);
      el.addEventListener('mouseleave', handleButtonLeave);
    });

    inputs.forEach(el => {
      el.addEventListener('mouseenter', handleInputEnter);
      el.addEventListener('mouseleave', handleInputLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);

      links.forEach(el => {
        el.removeEventListener('mouseenter', handleLinkEnter);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });

      buttons.forEach(el => {
        el.removeEventListener('mouseenter', handleButtonEnter);
        el.removeEventListener('mouseleave', handleButtonLeave);
      });

      inputs.forEach(el => {
        el.removeEventListener('mouseenter', handleInputEnter);
        el.removeEventListener('mouseleave', handleInputLeave);
      });
    };
  }, [isMobile, onMouseMove, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp]);

  useEffect(() => {
    const cleanup = addEventListeners();
    return cleanup;
  }, [addEventListeners]);

  // Don't render on mobile devices
  if (isMobile) {
    return null;
  }

  const cursorClasses = `
    fixed pointer-events-none z-50 transition-transform duration-150 ease-out
    ${hidden ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
  `;

  const ringScale = clicked ? clickScale : 
                   linkHovered ? outerScale : 
                   buttonHovered ? outerScale * 0.9 : 
                   inputHovered ? outerScale * 0.8 : 1;

  const dotScale = clicked ? clickScale : 
                  linkHovered ? innerScale : 
                  buttonHovered ? innerScale * 0.9 : 
                  inputHovered ? innerScale * 0.8 : 1;

  const ringColor = clicked ? colors.click : 
                   linkHovered || buttonHovered || inputHovered ? colors.hover : colors.outer;

  const dotColor = clicked ? colors.click : 
                  linkHovered || buttonHovered || inputHovered ? colors.hover : colors.inner;

  return (
    <>
      {/* Main cursor */}
      <div
        className={cursorClasses}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Outer ring */}
        <div
          className={`absolute rounded-full border-2 transition-all duration-300 ease-out ${ringColor}`}
          style={{
            width: `${outerSize}px`,
            height: `${outerSize}px`,
            transform: `scale(${ringScale})`,
          }}
        />
        
        {/* Inner dot */}
        <div
          className={`absolute rounded-full transition-all duration-300 ease-out ${dotColor}`}
          style={{
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            transform: `scale(${dotScale})`,
          }}
        />
        
        {/* Click effect */}
        {clicked && (
          <div
            className="absolute rounded-full bg-primary-200/50 animate-ping"
            style={{
              width: `${outerSize * 1.5}px`,
              height: `${outerSize * 1.5}px`,
              left: `-${outerSize * 0.25}px`,
              top: `-${outerSize * 0.25}px`,
            }}
          />
        )}
      </div>
      
      {/* Trailing dots */}
      <TrailingDots 
        position={position} 
        hidden={hidden} 
        count={trailingDots}
        delay={dotDelay}
        color={colors.inner}
      />
    </>
  );
};

const TrailingDots = ({ position, hidden, count = 3, delay = 100, color }) => {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    if (hidden) return;

    const newDot = {
      id: Date.now(),
      x: position.x,
      y: position.y,
      scale: 1,
    };

    setDots(prev => [...prev.slice(-count), newDot]);

    const timer = setTimeout(() => {
      setDots(prev => prev.filter(dot => dot.id !== newDot.id));
    }, delay * count);

    return () => clearTimeout(timer);
  }, [position, hidden, count, delay]);

  return (
    <>
      {dots.map((dot, index) => (
        <div
          key={dot.id}
          className="fixed pointer-events-none z-40 rounded-full transition-all duration-500 ease-out"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${8 - index * 2}px`,
            height: `${8 - index * 2}px`,
            transform: `translate(-50%, -50%) scale(${1 - index * 0.3})`,
            opacity: 1 - index * 0.3,
            backgroundColor: color.replace('bg-', '').replace('-600', '-400') + '/30',
          }}
        />
      ))}
    </>
  );
};

export default React.memo(AnimatedCursor);