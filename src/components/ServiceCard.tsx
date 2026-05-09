"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
    title: string;
    image: string;
    href?: string;
    className?: string;
}

/**
 * ServiceCard: A specialized card for the service carousel with high-end visuals.
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    image,
    href = "#",
    className = ""
}) => {
    const [imgSrc, setImgSrc] = useState(image);

    useEffect(() => {
        setImgSrc(image);
    }, [image]);

    return (
        <Link
            href={href}
            className={`
                flex-none 
                w-[280px] sm:w-[320px] md:w-[calc(33.333%-12px)] 
                aspect-[4/3] 
                rounded-[32px] 
                overflow-hidden 
                relative 
                group 
                cursor-pointer 
                transition-all 
                duration-500 
                shadow-sm 
                hover:shadow-xl
                ${className}
            `.trim()}
        >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
                <Image
                    src={imgSrc || 'https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp'}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 33vw"
                    priority={false}
                    onError={() => setImgSrc('https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp')}
                />
            </div>

            {/* Layered Gradient Overlay for Depth - Updated to Blue */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2b4d]/95 via-[#0b2b4d]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

            {/* Title Content - Positioned Bottom Left */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-10">
                <div className="text-white !text-4xl font-bold leading-tight tracking-tight group-hover:translate-x-2 transition-transform duration-500 ease-out">
                    {title}
                </div>
            </div>

            {/* Subtle Inner Glow on Hover */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-500 rounded-[32px]" />
        </Link>
    );
};

export default ServiceCard;
