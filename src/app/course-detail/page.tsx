"use client";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, PlayCircle, Image as ImageIcon, BookOpen as BookIcon, Target as TargetIcon, MessageSquare as MessageIcon, Presentation } from 'lucide-react';
import CourseHero from '@/components/ui/CourseHero';
import SectionBadge from '@/components/ui/SectionBadge';
import CourseMethodology from '@/components/ui/CourseMethodology';
import AnimatedHeading from '@/components/ui/AnimatedHeading';

export default function CourseDetailPage() {
    return (
        <div className="bg-white min-h-screen">
            <Header />

            {/* Hero Section */}
            <CourseHero
                title={"Trực tiếp tại\nDoanh Nghiệp"}
                description="Giải pháp đào tạo tiếng Anh chuyên biệt cho đội ngũ nhân sự doanh nghiệp. Lộ trình được thiết kế cá nhân hóa theo từng lĩnh vực kinh doanh, giúp nhân viên tự tin giao tiếp và làm việc chuyên nghiệp trong môi trường quốc tế trực quan sinh động nhất..."
                modules={3}
                lessons={27}
                image="https://course.learnwithcap.com/wp-content/uploads/2025/10/danist-soh-8Gg2Ne_uTcM-unsplash-scaled-1.webp"
            />

            {/* Methodology Section */}
            <CourseMethodology
                badge="XÂY DỰNG KHÓA HỌC"
                title="Quy trình đào tạo doanh nghiệp"
                intro="Opt for us and experience the highest standard of dedication and quality. Our specialized team is committed to excellence, ensuring your specific needs are met with exceptional results."
                image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
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

            {/* Course Structure Section */}
            <section className="min-h-screen py-24 bg-[#f4faff] flex items-center">
                <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center">
                    <AnimatedHeading
                        text="Cấu trúc khóa học"
                        tag="h2"
                        className="font-bold text-[#002A4C] text-sub-h2 mb-16"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center">
                                <h3 className="text-2xl font-bold text-[#0b2b4d] mb-2">Module 0{num}</h3>
                                <p className="text-[#59B4E9] font-medium text-sm mb-8 uppercase">Tiếng anh xây dựng chuyên sâu</p>

                                <ul className="space-y-4 mb-10 text-left w-full text-gray-600">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        <span>Mẫu câu cơ bản</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        <span>Giao tiếp cơ bản</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        <span>Trao đổi quan hệ</span>
                                    </li>
                                </ul>

                                <button className="w-full py-4 bg-[#0b2b4d] text-white rounded-xl font-bold hover:bg-[#59B4E9] transition-colors">
                                    Tư Vấn
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Evaluation Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-[#001e3d]">
                <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
                    <img
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80"
                        alt="Presentation"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-12 bg-white/90 m-12 rounded-2xl shadow-xl">
                        <p className="text-[#0b2b4d] font-bold text-lg mb-4">Khảo sát học viên và công ty nhằm tìm hiểu đối tượng học, nhu cầu của học viên và công ty học viên đang công tác mong muốn.</p>
                        <p className="text-gray-500 text-sm">Khảo sát trình độ đầu vào của học viên theo chương trình tiếng Anh Chuyên Ngành thực tế.</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="lg:w-1/2 text-white py-20 lg:py-0 flex flex-col items-start">
                        <AnimatedHeading
                            text="Phương pháp đánh giá"
                            tag="h2"
                            fillColor="#ffffff"
                            ghostColor="rgba(255, 255, 255, 0.2)"
                            className="font-bold text-white text-sub-h2 mb-8"
                        />
                        <p className="text-white/60 text-lg mb-12 max-w-lg">
                            Quy trình đánh giá chuyên nghiệp đảm bảo đo lường chính xác hiệu quả đào tạo và sự tiến bộ của từng nhân sự trong suốt quá trình học tập.
                        </p>

                        <ul className="space-y-6">
                            <li className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-[#59B4E9]"></div>
                                <span className="text-lg font-medium uppercase">Đánh giá trình độ đầu vào</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-[#59B4E9]"></div>
                                <span className="text-lg font-medium uppercase">Đánh giá trong quá trình học tập</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-[#59B4E9]"></div>
                                <span className="text-lg font-medium uppercase">Đánh giá kết quả cuối khóa</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
