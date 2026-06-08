import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, PlayCircle, Layers, MessageSquare, Presentation, MonitorPlay, LucideIcon } from 'lucide-react';
import { fetchCoursePageData } from '@/lib/api';
import Counter from '@/components/ui/Counter';
import { CoursePageFeature, CoursePageStructureItem } from '@/lib/types';
import { notFound } from 'next/navigation';

const iconMap: Record<string, LucideIcon> = {
    PlayCircle: PlayCircle,
    CheckCircle2: CheckCircle2,
    Layers: Layers,
    MessageSquare: MessageSquare,
    Presentation: Presentation,
    MonitorPlay: MonitorPlay
};

export default async function OnlineCoursePage() {
    const pageData = await fetchCoursePageData('online-1-1');

    if (!pageData) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen">
            <Header />

            <section className="bg-[#0b2b4d] text-white overflow-hidden pt-[84px]">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center py-8 md:py-12 lg:py-20 gap-8 md:gap-12">
                        <div className="lg:w-1/2 space-y-6 md:space-y-8 hero-text order-2 lg:order-1">
                            {pageData.badge && (
                                <span className="bg-[#59B4E9] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {pageData.badge}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-[40px] font-bold leading-tight">
                                {pageData.title}
                            </h1>
                            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl whitespace-pre-line">
                                {pageData.description}
                            </p>

                            <div className="flex flex-wrap gap-6 md:gap-12 items-center">
                                {pageData.stats?.left && (
                                    <div>
                                        <Counter value={pageData.stats.left} className="text-3xl md:text-4xl font-bold block" />
                                        <span className="text-[10px] md:text-xs text-white/60 uppercase font-bold">{pageData.stats.leftLabel}</span>
                                    </div>
                                )}
                                {pageData.stats?.right && (
                                    <div>
                                        <Counter value={pageData.stats.right} className="text-3xl md:text-4xl font-bold block" />
                                        <span className="text-[10px] md:text-xs text-white/60 uppercase font-bold">{pageData.stats.rightLabel}</span>
                                    </div>
                                )}
                                <button className="bg-white text-[#0b2b4d] px-6 py-3 md:px-8 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm md:text-base">
                                    Chi tiết
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative hero-image order-1 lg:order-2 w-full">
                            <div className="rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10 relative aspect-video lg:aspect-[4/3] w-full">
                                <Image
                                    src={pageData.hero_image}
                                    alt={pageData.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {pageData.features && (
                <section className="py-12 md:py-20 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                            <div className="lg:w-1/2 w-full">
                                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square max-w-md mx-auto lg:mx-0">
                                    <Image
                                        src={pageData.features.image}
                                        alt="Learning Experience"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#59B4E9]/20 to-transparent"></div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 space-y-8 md:space-y-10 features-container w-full">
                                {pageData.features.quote && (
                                    <p className="text-[#0b2b4d]/70 italic leading-relaxed text-base md:text-lg border-l-4 border-[#59B4E9] pl-6">
                                        &ldquo;{pageData.features.quote}&rdquo;
                                    </p>
                                )}

                                <div className="space-y-6 md:space-y-8">
                                    {pageData.features.items?.map((feature: CoursePageFeature, i: number) => {
                                        const Icon = iconMap[feature.icon] || CheckCircle2;
                                        return (
                                            <div key={i} className="flex gap-4 md:gap-6 items-start group feature-item">
                                                <div className="bg-[#f0f9ff] p-3 md:p-4 rounded-2xl group-hover:bg-[#59B4E9] group-hover:text-white transition-all duration-300 flex-shrink-0">
                                                    <Icon className="text-[#59B4E9] group-hover:text-white transition-colors" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#0b2b4d] text-base md:text-lg mb-1">{feature.title}</h3>
                                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {pageData.structure && (
                <section className="py-12 md:py-24 bg-[#f4faff]">
                    <div className="container mx-auto px-4 md:px-8 text-center">
                        <h2 className="text-3xl md:text-[40px] font-bold text-[#0b2b4d] mb-8 md:mb-16">{pageData.structure.title}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 structure-grid">
                            {pageData.structure.items?.map((mod: CoursePageStructureItem, i: number) => (
                                <div key={i} className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center structure-card">
                                    <h4 className="font-bold text-[#0b2b4d] mb-2">{mod.title}</h4>
                                    <p className="text-[#59B4E9] font-medium text-xs md:text-sm mb-6 md:mb-8 uppercase">{mod.tag}</p>

                                    <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 text-left w-full text-gray-600 font-medium text-sm md:text-base">
                                        {mod.features?.map((feat: string, fIdx: number) => (
                                            <li key={fIdx} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="w-full py-3 md:py-4 bg-[#0b2b4d] text-white rounded-xl font-bold hover:bg-[#671D9D] transition-colors mt-auto">
                                        Tư Vấn
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 md:mt-12 flex justify-center items-center gap-6">
                            <div className="flex items-center gap-2 text-[#5c5c96] font-bold text-lg">
                                <span>0</span>
                                <div className="w-12 h-[2px] bg-gray-200 relative">
                                    <div className="absolute left-0 top-0 h-full w-1/2 bg-[#0b2b4d]"></div>
                                </div>
                                <span className="text-gray-300">{(pageData.structure.items?.length || 0) * 2}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0b2b4d] hover:text-white transition-all">
                                    <span className="text-xl">←</span>
                                </button>
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0b2b4d] hover:text-white transition-all">
                                    <span className="text-xl">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {pageData.evaluation && (
                <section className="relative min-h-[500px] lg:h-[600px] flex items-center overflow-hidden bg-[#001e3d] eval-section py-12 lg:py-0">
                    <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
                        <Image
                            src={pageData.evaluation.image}
                            alt="Methodology"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-12 bg-white/95 m-12 rounded-2xl shadow-xl">
                            {pageData.evaluation.highlight && (
                                <p className="text-[#0b2b4d] font-bold text-lg mb-4">
                                    {pageData.evaluation.highlight}
                                </p>
                            )}
                            {pageData.evaluation.subHighlight && (
                                <p className="text-gray-500 text-sm italic">
                                    {pageData.evaluation.subHighlight}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="container mx-auto px-4 md:px-8 relative z-10 eval-content">
                        <div className="lg:w-1/2 text-white">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">{pageData.evaluation.title}</h2>
                            <p className="text-white/60 text-base md:text-lg mb-8 md:mb-12 max-w-lg">
                                {pageData.evaluation.desc}
                            </p>

                            <ul className="space-y-4 md:space-y-6">
                                {pageData.evaluation.methods?.map((method: string, mIdx: number) => (
                                    <li key={mIdx} className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-[#59B4E9]"></div>
                                        <span className="text-base md:text-lg font-medium uppercase">{method}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {pageData.cta_banner && (
                <section className="bg-[#0b2b4d] py-12 md:py-20 text-center text-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-5xl font-bold mb-6 md:mb-8">{pageData.cta_banner.title}</h2>
                        <p className="text-white/60 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
                            {pageData.cta_banner.desc}
                        </p>
                        <button className="bg-[#59B4E9] text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-white hover:text-[#0b2b4d] transition-all w-full md:w-auto">
                            {pageData.cta_banner.buttonText}
                        </button>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
