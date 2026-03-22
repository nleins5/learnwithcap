import React, { useEffect, useRef } from "react";
import { getIcon } from "@/components/ui/IconHelper";
import SectionBadge from "@/components/ui/SectionBadge";
import AnimatedHeading from "@/components/ui/AnimatedHeading";

interface SolutionsProps {
    solutions: any[];
    solutionsHeader: any;
}

const Solutions = ({ solutions, solutionsHeader }: SolutionsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="solutions" className="bg-[#002A4C] text-white py-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 items-center">
                    <div className="md:col-span-2 flex flex-col items-start text-left">
                        <SectionBadge className="mb-6">
                            {solutionsHeader?.badge || "GIẢI PHÁP"}
                        </SectionBadge>
                        <div className="font-bold leading-tight mb-3">
                            <AnimatedHeading
                                text={solutionsHeader?.title?.replace(/<[^>]*>?/gm, '') || "CAP thiết kế cho bạn"}
                                tag="h2"
                                className="text-sub-h2"
                                fillColor="#ffffff"
                                ghostColor="rgba(255, 255, 255, 0.2)"
                            />
                        </div>
                        <p className="!text-[19px] text-gray-400 max-w-lg leading-relaxed">
                            {solutionsHeader?.description ||
                                "Chúng tôi cung cấp lộ trình học tập được cá nhân hóa, giúp bạn làm chủ tiếng Anh và tự tin trong môi trường làm việc quốc tế."}
                        </p>
                    </div>
                    <div className="md:col-span-3 flex justify-center md:justify-end">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full aspect-[2/1]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#7E4FD3]/20 to-transparent z-10 mix-blend-overlay pointer-events-none"></div>
                            <img
                                src={
                                    solutionsHeader?.image ||
                                    "https://course.learnwithcap.com/wp-content/uploads/2025/10/danist-soh-8Gg2Ne_uTcM-unsplash-scaled-1.webp"
                                }
                                alt="Team collaboration"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 reveal-piano">
                    {solutions.map((item, idx) => (
                        <div
                            key={idx}
                            className="piano-item p-4 rounded-xl bg-[#001e3d] border border-white/10 hover:border-white/20 transition-colors duration-300 h-full flex flex-col items-start text-left group"
                        >
                            <div className="flex-shrink-0 mb-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors overflow-hidden text-white">
                                    {item.iconComponent || (typeof item.icon === 'string' ? getIcon(item.icon, { size: 18 }) : null)}
                                </div>
                            </div>
                            <p className="text-sm text-gray-200 flex-grow leading-relaxed font-light">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;
