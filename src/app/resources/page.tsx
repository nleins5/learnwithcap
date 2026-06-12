"use client";
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ResourcesContent from "@/components/ResourcesContent";
import { usePageData } from "@/hooks/usePageData";

const ResourcesPage = () => {
    const {
        navbar,
        footer,
        resources,
        resourcesHero
    } = usePageData();

    const heroTitle = resourcesHero?.title || "Tài Nguyên";
    const heroDesc = resourcesHero?.description || "Opt for us and experience the highest standard of dedication and quality. Our specialized team is committed to excellence, ensuring your specific needs are met with exceptional results.";
    const heroImg = resourcesHero?.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80";

    return (
        <div className="text-[#0b2b4d] bg-white text-base">
            <Header navbar={navbar} />

            <main>
                {/* Hero Section Specific to Resources */}
                <div className="w-full bg-[#002855] min-h-[500px] flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left Content */}
                    <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{heroTitle}</h1>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                            {heroDesc}
                        </p>
                    </div>

                    {/* Right Image */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                        <img
                            src={heroImg}
                            alt="Resources Hero"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Diagonal overlay/clip-path effect could go here if needed, keeping it simple for now */}
                    </div>
                </div>

                <ResourcesContent resources={resources || []} />
            </main>

            <ScrollToTop />
            <Footer footerData={footer} />
        </div>
    );
};

export default ResourcesPage;
