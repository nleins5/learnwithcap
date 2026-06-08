"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TABLES } from '@/lib/constants';

export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState<any>(null);

    useEffect(() => {
        const fetchContactInfo = async () => {
            // Reusing the same table as Footer to ensure consistency
            const { data, error } = await supabase
                .from(TABLES.HOMEPAGE_FOOTER)
                .select('*')
                .single();

            if (data) {
                setContactInfo(data);
            }
        };
        fetchContactInfo();
    }, []);


    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow">
                <div className="bg-[#f0f4f8] py-12 md:py-20">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16 hero-content">
                            <span className="text-[#59B4E9] font-bold tracking-wider text-xs uppercase bg-[#59B4E9]/10 px-3 py-1 rounded-full">Liên Hệ</span>
                            <h1 className="text-[40px] font-bold text-[#0b2b4d] mt-4 mb-4">Chúng tôi luôn sẵn sàng hỗ trợ bạn</h1>
                            <p className="text-gray-500">
                                Để lại thông tin hoặc liên hệ trực tiếp với chúng tôi qua các kênh dưới đây. Đội ngũ tư vấn sẽ phản hồi trong thời gian sớm nhất.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Info Cards */}
                            <div className="lg:col-span-1 space-y-6 info-cards-grid">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 info-card">
                                    <div className="bg-[#eaf6ff] p-3 rounded-xl text-[#59B4E9]">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0b2b4d] text-lg">Điện thoại</h3>
                                        <p className="text-gray-500 text-sm mb-2">Thứ 2 - Thứ 7, 8:00 - 17:00</p>
                                        <a href={`tel:${contactInfo?.contact_phone}`} className="text-[#59B4E9] font-bold text-lg hover:underline">
                                            {contactInfo?.contact_phone || "0328 859 540"}
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 info-card">
                                    <div className="bg-[#eaf6ff] p-3 rounded-xl text-[#59B4E9]">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0b2b4d] text-lg">Email</h3>
                                        <p className="text-gray-500 text-sm mb-2">Gửi thắc mắc cho chúng tôi</p>
                                        <a href={`mailto:${contactInfo?.contact_email}`} className="text-[#59B4E9] font-bold text-lg hover:underline">
                                            {contactInfo?.contact_email || "info@learnwithcap.com"}
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 info-card">
                                    <div className="bg-[#eaf6ff] p-3 rounded-xl text-[#59B4E9]">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0b2b4d] text-lg">Văn phòng</h3>
                                        <p className="text-gray-500 text-sm mb-2">Trụ sở chính</p>
                                        <p className="text-[#0b2b4d] font-medium">
                                            {contactInfo?.contact_address || "Hà Nội, Việt Nam"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 contact-form-container">
                                <h2 className="text-2xl font-bold text-[#0b2b4d] mb-8">Gửi tin nhắn</h2>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0b2b4d]">Họ và tên</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#59B4E9] focus:ring-1 focus:ring-[#59B4E9] transition-all" placeholder="Nguyễn Văn A" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0b2b4d]">Email</label>
                                            <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#59B4E9] focus:ring-1 focus:ring-[#59B4E9] transition-all" placeholder="example@gmail.com" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0b2b4d]">Số điện thoại</label>
                                            <input type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#59B4E9] focus:ring-1 focus:ring-[#59B4E9] transition-all" placeholder="0912..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0b2b4d]">Vấn đề quan tâm</label>
                                            <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#59B4E9] focus:ring-1 focus:ring-[#59B4E9] transition-all text-gray-600">
                                                <option>Tư vấn khóa học</option>
                                                <option>Hợp tác doanh nghiệp</option>
                                                <option>Hỗ trợ kỹ thuật</option>
                                                <option>Khác</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#0b2b4d]">Nội dung tin nhắn</label>
                                        <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#59B4E9] focus:ring-1 focus:ring-[#59B4E9] transition-all" placeholder="Tôi muốn tìm hiểu thêm về..."></textarea>
                                    </div>

                                    <button type="button" className="w-full md:w-auto px-8 py-3 bg-[#0b2b4d] text-white font-bold rounded-xl hover:bg-[#671D9D] transition-all flex items-center justify-center gap-2">
                                        <Send size={18} />
                                        Gửi Tin Nhắn
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
