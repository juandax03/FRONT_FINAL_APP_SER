import { useState, useEffect } from 'react';

function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  
  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };
    
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);
  
  return (
    <>
      <div 
        className="cursor" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      />
      <div 
        className={`cursor-ring ${clicked ? 'expand' : ''}`} 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      />
    </>
  );
}

export default Cursor;