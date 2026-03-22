"use client";

import Link from "next/link";
import { Facebook, Youtube, Send, Mail, Phone, Instagram } from "lucide-react";

interface FooterProps {
    footerData?: any;
}

const Footer: React.FC<FooterProps> = ({ footerData }) => {
    const settings = footerData;
    const columns = footerData?.links || [];

    return (
        <footer className="bg-[#002A4C] text-white pt-16 pb-8 border-t border-[#002A4C]">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="flex flex-col items-start gap-4 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src={settings?.logo_url || "https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp"}
                                alt="CAP English"
                                className="object-contain h-12 w-auto opacity-80 brightness-110"
                            />
                        </Link>
                        <p className="text-gray-300 leading-relaxed font-light">
                            {settings?.description || "Nền tảng học tiếng Anh trực tuyến hàng đầu dành cho người đi làm."}
                        </p>
                        <div className="flex gap-4 mt-2">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#59B4E9] hover:text-white transition-all">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.youtube_url && (
                                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#59B4E9] hover:text-white transition-all">
                                    <Youtube className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#59B4E9] hover:text-white transition-all">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Columns */}
                    {Array.isArray(columns) && columns.length > 0 ? (
                        columns.map((section: any, idx: number) => (
                            <div key={idx} className="footer-col flex flex-col gap-4">
                                <h4 className="font-bold text-white capitalize">{section.section_id?.replace('_', ' ')}</h4>
                                <ul className="flex flex-col gap-3">
                                    {Array.isArray(section.items) && section.items.map((item: any, itemIdx: number) => (
                                        <li key={itemIdx}>
                                            {item.link_url ? (
                                                <Link href={item.link_url} className="text-gray-300 hover:text-white transition-colors font-light">
                                                    {item.title}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-300 font-light">{item.title}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        // Fallback static columns if no data
                        <>
                            <div className="footer-col flex flex-col gap-4">
                                <h4 className="font-bold text-white">HỮU ÍCH</h4>
                                <ul className="flex flex-col gap-3">
                                    <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors font-light">Về Chúng Tôi</Link></li>
                                    <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-light">Liên Hệ</Link></li>
                                    <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors font-light">Điều Khoản Riêng Tư</Link></li>
                                </ul>
                            </div>
                            <div className="footer-col flex flex-col gap-4">
                                <h4 className="font-bold text-white">LIÊN KẾT</h4>
                                <ul className="flex flex-col gap-3">
                                    <li><Link href="/online-1-1" className="text-gray-300 hover:text-white transition-colors font-light">Khóa học</Link></li>
                                    <li><Link href="/#solutions" className="text-gray-300 hover:text-white transition-colors font-light">Giải pháp</Link></li>
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Newsletter Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-white uppercase tracking-wider">{settings?.newsletter_title || "LIÊN HỆ TƯ VẤN"}</h4>
                        <p className="text-gray-300 font-light text-sm mb-2">{settings?.newsletter_description || "Đăng ký để nhận tư vấn khóa học phù hợp và ưu đãi mới nhất từ CAP."}</p>
                        <div className="flex bg-[#001E3D] rounded-lg overflow-hidden p-1">
                            <input
                                type="email"
                                placeholder={settings?.newsletter_placeholder || "Vui lòng nhập email"}
                                className="bg-transparent text-white text-sm w-full px-3 py-2 focus:outline-none placeholder-gray-400"
                            />
                            <button type="button" className="p-2 bg-[#59B4E9] text-white rounded hover:bg-[#3690F8] transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            {settings?.contact_address && (
                                <li className="flex items-start gap-3 font-light">
                                    <span className="mt-1"><div className="w-4 h-4 bg-[#59B4E9] rounded-full flex items-center justify-center text-[10px] text-white">A</div></span>
                                    <span>{settings.contact_address}</span>
                                </li>
                            )}
                            <li className="flex items-center gap-3 font-light"><Mail size={16} className="text-[#59B4E9]" /> {settings?.contact_email || "info@learnwithcap.com"}</li>
                            <li className="flex items-center gap-3 font-light"><Phone size={16} className="text-[#59B4E9]" /> {settings?.contact_phone || "0328859540"}</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom border-t border-white/10 pt-8 text-center bg-[#002A4C]">
                    <p className="text-gray-400 font-light text-sm">
                        © {new Date().getFullYear()} {settings?.copyright_text || "CAP English Training. All rights reserved."}
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
