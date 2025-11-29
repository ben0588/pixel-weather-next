'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function Typewriter({ text, speed = 50, onComplete }: Readonly<TypewriterProps>) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const currentIndexRef = useRef(0);
  const prevTextRef = useRef(text);

  useEffect(() => {
    // 當 text 改變時，重置狀態
    if (prevTextRef.current !== text) {
      setDisplayedText('');
      setIsTyping(true);
      currentIndexRef.current = 0;
      prevTextRef.current = text;
    }

    const interval = setInterval(() => {
      if (currentIndexRef.current < text.length) {
        setDisplayedText(text.slice(0, currentIndexRef.current + 1));
        currentIndexRef.current += 1;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className="font-pixel">
      {displayedText}
      {isTyping && (
        <span className="animate-pulse">▊</span>
      )}
    </span>
  );
}
