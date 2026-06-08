"use client";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseMethodology from '@/components/ui/CourseMethodology';
import { Image as ImageIcon, BookOpen as BookIcon, Target as TargetIcon, MessageSquare as MessageIcon, Presentation } from 'lucide-react';
import CourseHero from '@/components/ui/CourseHero';

import AnimatedHeading from '@/components/ui/AnimatedHeading';

export default function OnlineCoursePage() {
    return (
        <div className="bg-white min-h-screen">
            <Header />

            {/* Hero Section */}
            <CourseHero
                title="Online 1:1"
                description="Khóa học Tiếng Anh Giao Tiếp Chuyên Ngành Xây Dựng, Kiến Trúc và Nội Thất với hình thức 1 giáo viên kèm 1 học viên đảm bảo sự hỗ trợ tối đa và thời gian tương tác trực tiếp với giảng viên. Linh động thời gian và địa điểm học với nền tảng học trực tuyến. Khóa học này sẽ giúp bạn bổ sung từ vựng chuyên ngành, mẫu câu giao tiếp phổ biến và các tình huống ứng dụng thực tế gặp trong công việc..."
                modules={3}
                lessons={12}
                image="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80"
            />

            {/* Methodology Section */}
            <CourseMethodology
                badge="XÂY DỰNG KHÓA HỌC"
                title="Sử dụng phương pháp đào tạo hiện đại"
                intro="Opt for us and experience the highest standard of dedication and quality. Our specialized team is committed to excellence, ensuring your specific needs are met with exceptional results."
                image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80"
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

            {/* Call to Action */}
            <section className="min-h-screen py-20 bg-[#f4faff] flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="bg-[#002A4C] rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7E4FD3] rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
                        <AnimatedHeading
                            text="Sẵn sàng để bứt phá tiếng Anh?"
                            tag="h2"
                            fillColor="#ffffff"
                            ghostColor="rgba(255, 255, 255, 0.2)"
                            className="font-bold text-white text-sub-h2 mb-6"
                        />
                        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
                            Nhận tư vấn lộ trình 1-1 miễn phí và bài test trình độ chuyên sâu ngay hôm nay.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-[#59B4E9] text-white font-bold rounded-xl hover:bg-[#3690F8] transition-all">
                                Tư vấn miễn phí
                            </button>
                            <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                                Xem các khóa học khác
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
