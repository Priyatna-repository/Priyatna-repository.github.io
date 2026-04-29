"use client"
import React from 'react';
import { TICKER_ITEMS } from '@/data/ticker';
import { cn } from '@/lib/utils';

const Ticker = () => {
  const displayItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div 
      className="ticker-wrap"
      onMouseEnter={(e) => {
        const track = e.currentTarget.querySelector('.ticker-track') as HTMLElement;
        if (track) track.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        const track = e.currentTarget.querySelector('.ticker-track') as HTMLElement;
        if (track) track.style.animationPlayState = 'running';
      }}
    >
      <div className="ticker-track">
        {displayItems.map((item, index) => (
          <div key={`${item.text}-${index}`} className="ticker-item">
            <span className={cn("ticker-dot", item.dotClass)}></span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;