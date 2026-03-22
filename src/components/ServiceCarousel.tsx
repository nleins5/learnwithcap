"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ServiceCard from './ServiceCard';
import SectionBadge from '@/components/ui/SectionBadge';
import AnimatedHeading from '@/components/ui/AnimatedHeading';

interface ServiceItem {
    title: string;
    image: string;
    href?: string;
}

interface ServiceCarouselProps {
    items: ServiceItem[];
    subtitle?: string;
    titlePrefix?: string;
    titleSuffix?: string;
    description?: string;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
    items,
    subtitle = "Bạn là",
    titlePrefix = "Cá nhân",
    titleSuffix = "Doanh nghiệp",
    description = "Hoạt động trong lĩnh vực"
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Debounced scroll handler for better performance
    const handleScroll = useCallback(() => {
        if (!scrollRef.current || isScrollingRef.current) return;
        const container = scrollRef.current;
        const { scrollLeft } = container;

        const cards = container.querySelectorAll('.snap-start');
        if (cards.length === 0) return;

        // Calculate card width from actual DOM positions for maximum accuracy
        const firstCard = cards[0] as HTMLElement;
        const secondCard = cards[1] as HTMLElement;
        const cardWidth = secondCard
            ? secondCard.offsetLeft - firstCard.offsetLeft
            : firstCard.offsetWidth + 12;

        // Calculate index based on how many card widths we have scrolled
        // We use Math.round to switch to the next index when we've scrolled 50% of the way to it
        const index = Math.round(scrollLeft / cardWidth);
        const cappedIndex = Math.max(0, Math.min(index, items.length - 1));

        if (cappedIndex !== currentIndex) {
            setCurrentIndex(cappedIndex);
        }
    }, [currentIndex, items.length]);

    // Add useEffect to handle initial state and resize
    useEffect(() => {
        const timer = setTimeout(() => handleScroll(), 100);
        window.addEventListener('resize', handleScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleScroll);
        };
    }, [handleScroll]);

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;

        const cards = container.querySelectorAll('.snap-start');
        if (cards.length === 0) return;

        const firstCard = cards[0] as HTMLElement;
        const secondCard = cards[1] as HTMLElement;
        const cardWidth = secondCard
            ? secondCard.offsetLeft - firstCard.offsetLeft
            : firstCard.offsetWidth + 12;

        let newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

        // Loop behavior
        if (newIndex < 0) newIndex = items.length - 1;
        if (newIndex >= items.length) newIndex = 0;

        // Update state immediately for snapier UI
        setCurrentIndex(newIndex);
        isScrollingRef.current = true;

        container.scrollTo({
            left: newIndex * cardWidth,
            behavior: 'smooth'
        });

        // Reset the scroll flag after the transition is roughly finished
        setTimeout(() => {
            isScrollingRef.current = false;
        }, 600);
    }, [currentIndex, items.length]);

    return (
        <section className="bg-white py-4 min-h-screen flex flex-col justify-center overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="section-header mb-12">
                    <SectionBadge className="mb-3">
                        {subtitle}
                    </SectionBadge>
                    <AnimatedHeading
                        text={`${titlePrefix} | ${titleSuffix}`}
                        tag="h2"
                        fillColor="#002A4C"
                        ghostColor="rgba(0, 42, 76, 0.2)"
                        className="font-bold text-[#002A4C] text-sub-h2 mb-3"
                    />
                    <p className="!text-[19px] text-[#002A4C]/80 leading-relaxed max-w-4xl">
                        {description}
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
                    >
                        <div className="flex gap-3 w-full">
                            {Array.isArray(items) && items.map((item, index) => (
                                <ServiceCard
                                    key={index}
                                    title={item.title}
                                    image={item.image}
                                    href={item.href}
                                    className="snap-start"
                                />
                            ))}
                            {/* Universal Spacer: Ensures the last card can always reach the left edge for accurate counter */}
                            <div className="flex-none w-[calc(100vw-120px)] md:w-[calc(100%-320px)] lg:w-[66.666%]" />
                        </div>
                    </div>

                    {/* Numeric Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        {/* Tracking Counter */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-[#7E4FD3]">
                                {(currentIndex + 1).toString()}
                            </span>
                            <div className="w-8 h-[1.5px] bg-[#7E4FD3]"></div>
                            <span className="text-2xl font-bold text-[#7E4FD3]">
                                {items.length.toString()}
                            </span>
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-full border border-[#7E4FD3] flex items-center justify-center text-[#7E4FD3] hover:bg-[#7E4FD3] hover:text-white transition-all duration-300"
                            >
                                <ArrowLeft size={24} strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-full border border-[#7E4FD3] flex items-center justify-center text-[#7E4FD3] hover:bg-[#7E4FD3] hover:text-white transition-all duration-300"
                            >
                                <ArrowRight size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceCarousel;
