"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedHeadingProps {
    text: string;
    className?: string; // Class for the wrapper (position/margin)
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    fillColor?: string; // The color to fill with (e.g., brand-navy #002a4c)
    ghostColor?: string; // The initial "ghost" color (e.g., brand-navy with opacity)
    triggerStart?: string; // scrollTrigger start position
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = React.memo(({
    text,
    className,
    tag: Tag = 'h2', // Default to h2 as requested
    fillColor = '#002a4c', // Brand Navy
    ghostColor = 'rgba(0, 42, 76, 0.2)', // Brand Navy @ 20%
    triggerStart = "top 80%",
}) => {
    const containerRef = useRef<HTMLHeadingElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const el = containerRef.current;
            const fill = fillRef.current;
            if (!el || !fill) return;

            gsap.set(fill, { clipPath: 'inset(0 100% 0 0)' });
            gsap.to(fill, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: triggerStart,
                    toggleActions: 'play none none reverse',
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [triggerStart, text]);

    return (
        <Tag ref={containerRef} className={cn("relative block w-fit antialiased select-none", className)}>
            {/* Size Anchor (Invisible) */}
            <span className="block opacity-0 pointer-events-none" aria-hidden="true">
                {text}
            </span>

            {/* Ghost Text Layer */}
            <span className="absolute inset-0 block" style={{ color: ghostColor }}>
                {text}
            </span>

            {/* Fill Text Layer */}
            <span
                ref={fillRef}
                className="absolute inset-0 block"
                aria-hidden="true"
                style={{
                    color: fillColor,
                    clipPath: 'inset(0 100% 0 0)',
                    willChange: 'clip-path'
                }}
            >
                {text}
            </span>
        </Tag>
    );
});

export default AnimatedHeading;
