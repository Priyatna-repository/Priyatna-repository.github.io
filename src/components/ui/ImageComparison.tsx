"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react';

export const ImageComparison = ({ beforeImage, afterImage }: { beforeImage: string, afterImage: string }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newPosition = ((clientX - rect.left) / rect.width) * 100;
        newPosition = Math.max(0, Math.min(100, newPosition));
        setSliderPosition(newPosition);
    }, [isDragging]);

    return (
        <div 
            ref={containerRef}
            className="img-comp-container"
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
        >
            {/* After Image */}
            <div
                className="img-comp-overlay"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={afterImage} alt="After" draggable="false" />
            </div>

            {/* Before Image */}
            <img src={beforeImage} alt="Before" className="img-comp-base" draggable="false" />

            {/* Slider Handle */}
            <div
                className="img-comp-handle"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className={`img-comp-button ${isDragging ? 'active' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M18 8L22 12L18 16M6 8L2 12L6 16" />
                    </svg>
                </div>
            </div>
        </div>
    );
};