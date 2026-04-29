"use client"
import React from 'react';

const Ticker = () => {
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        <div className="ticker-item"><span className="ticker-dot td-r"></span> PRIYATNA DESIGN SYSTEM v4.2</div>
        <div className="ticker-item"><span className="ticker-dot td-b"></span> 247 PROJECTS · 34 COUNTRIES</div>
        <div className="ticker-item"><span className="ticker-dot td-g"></span> ADDON LABS NOW OPEN · 6 TOOLS ACTIVE</div>
        <div className="ticker-item"><span className="ticker-dot td-y"></span> MOTION STUDIO BETA → TRY IT NOW</div>
        <div className="ticker-item"><span className="ticker-dot td-r"></span> AWWWARDS SITE OF THE DAY 2024</div>
        <div className="ticker-item"><span className="ticker-dot td-b"></span> NEW: COLOR ORACLE AI PALETTE GEN</div>
        {/* Duplikasi untuk infinite scroll */}
        <div className="ticker-item"><span className="ticker-dot td-r"></span> PRIYATNA DESIGN SYSTEM v4.2</div>
        <div className="ticker-item"><span className="ticker-dot td-b"></span> 247 PROJECTS · 34 COUNTRIES</div>
      </div>
    </div>
  );
};

export default Ticker;