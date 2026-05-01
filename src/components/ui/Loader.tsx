"use client"
import '@/styles/components/loader.css'
import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [isOut, setIsOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const brand = "PRIYATNA";

  useEffect(() => {
    let currentPct = 0;
    
    const timer = setInterval(() => {
      // Logika penambahan random seperti di HTML asli
      currentPct += Math.random() * 8 + 2;
      
      if (currentPct >= 100) {
        currentPct = 100;
        setPercent(100);
        clearInterval(timer);

        // Delay sedikit sebelum fade out
        setTimeout(() => {
          setIsOut(true);
          if (onComplete) onComplete();
          
          // Hapus dari DOM setelah animasi fade out selesai (800ms sesuai CSS)
          setTimeout(() => setShouldRender(false), 800);
        }, 300);
      } else {
        setPercent(Math.floor(currentPct));
      }
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div id="loader" className={isOut ? 'out' : ''}>
      <div className="loader-logo">
        {brand.split("").map((char, index) => (
          <span 
            key={index} 
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            {char}
          </span>
        ))}
      </div>

      <div className="loader-counter">
        LOADING &nbsp;
        <span id="pct">{percent.toString().padStart(3, '0')}</span>%
      </div>

      <div className="loader-bar">
        <div 
          className="loader-fill" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <div className="loader-tag">
        DESIGN SEARCH ENGINE · EST. 2026
      </div>
    </div>
  );
};

export default Loader;