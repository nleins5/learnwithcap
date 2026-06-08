"use client";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseMethodology from '@/components/ui/CourseMethodology';
import { CheckCircle2, Image as ImageIcon, BookOpen as BookIcon, Target as TargetIcon, MessageSquare as MessageIcon, Presentation } from 'lucide-react';
import CourseHero from '@/components/ui/CourseHero';

import AnimatedHeading from '@/components/ui/AnimatedHeading';

export default function ELearningPage() {
    return (
        <div className="bg-white min-h-screen">
            <Header />

            {/* Hero Section */}
            <CourseHero
                title="E-Learning"
                description="Nâng cao năng lực tiếng Anh chuyên ngành với hệ thống bài giảng video chất lượng cao, có thể học mọi lúc mọi nơi. Lộ trình được thiết kế bài bản, tập trung vào tính ứng dụng công việc thực tế, giúp bạn làm chủ từ vựng và mẫu câu giao tiếp chuyên sâu trực quan sinh động nhất..."
                modules={5}
                lessons={45}
                image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"
            />

            {/* Methodology Section */}
            <CourseMethodology
                badge="CÔNG NGHỆ ĐÀO TẠO"
                title="Xây dựng lộ trình học hiện đại"
                intro="Opt for us and experience the highest standard of dedication and quality. Our specialized team is committed to excellence, ensuring your specific needs are met with exceptional results."
                image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                items={[
                    {
                        icon: <ImageIcon size={24} />,
                        title: "SỬ DỤNG HÌNH ẢNH, ÂM THANH, GAME / QUIZ",
                        description: "CAP offers streamlined courses to improve your English skill."
                    },
                    {
                        icon: <BookIcon size={24} />,
                        title: "ÔN TẬP VÀ KIỂM TRA MỖI MODULE (2 MINI + 1 FINAL TEST)",
                        description: "CAP offers streamlined courses to improve your English skill."
                    },
                    {
                        icon: <TargetIcon size={24} />,
                        title: "CÁC TỪ VỰNG CŨ ĐƯỢC LẶP LẠI Ở CÁC BÀI HỌC",
                        description: "CAP offers streamlined courses to improve your English skill."
                    },
                    {
                        icon: <MessageIcon size={24} />,
                        title: "ROLE PLAY (ĐÓNG VAI TÌNH HUỐNG)",
                        description: "CAP offers streamlined courses to improve your English skill."
                    },
                    {
                        icon: <Presentation size={24} />,
                        title: "THUYẾT TRÌNH CHỦ ĐỀ YÊU THÍCH VÀ BÀI HỌC TRỌNG ĐIỂM",
                        description: "CAP offers streamlined courses to improve your English skill."
                    }
                ]}
            />

            {/* Platform Preview */}
            <section className="min-h-screen py-20 bg-[#002A4C] text-white overflow-hidden flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-2/5 flex flex-col items-start text-left">
                            <AnimatedHeading
                                text="Nền tảng trực quan"
                                tag="h2"
                                fillColor="#ffffff"
                                ghostColor="rgba(255, 255, 255, 0.2)"
                                className="font-bold text-white text-sub-h2 mb-8"
                            />
                            <div className="space-y-6">
                                {[
                                    "Theo dõi tiến độ học tập chi tiết",
                                    "Hệ thống bài tập trắc nghiệm đa dạng",
                                    "Ghi chú trực tiếp trên video bài giảng",
                                    "Thảo luận cùng cộng đồng học viên"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="bg-[#59B4E9] rounded-full p-1 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={16} className="text-white" />
                                        </div>
                                        <span className="text-white/80">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-3/5">
                            <div className="bg-[#001E3D] p-4 rounded-3xl shadow-2xl border border-white/5 transform hover:scale-[1.02] transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80"
                                    alt="Platform dashboard"
                                    className="rounded-2xl w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
