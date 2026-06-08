"use client";

import Link from "next/link";
import { BookOpen, LogIn, Mail, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

export default function ProfilePage() {
    const { token, user } = useAuthStore();
    const displayName = user?.name || user?.display_name || user?.username || "Học viên";

    return (
        <div className="min-h-screen bg-[#f4faff] text-[#0b2b4d]">
            <Header />

            <main className="container mx-auto px-4 py-12 md:px-8 md:py-20">
                <div className="mx-auto max-w-4xl rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-12">
                    {token && user ? (
                        <>
                            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#59B4E9]">CAP Hub</p>
                                    <h1 className="text-3xl font-bold md:text-4xl">Xin chào, {displayName}</h1>
                                    <p className="mt-3 max-w-2xl text-gray-500">
                                        Đây là khu vực tài khoản học viên. Bạn có thể quay lại khóa học đang quan tâm hoặc liên hệ đội CAP để được tư vấn lộ trình phù hợp.
                                    </p>
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#59B4E9]">
                                    <User size={32} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                                    <div className="mb-3 flex items-center gap-3 font-bold">
                                        <Mail className="text-[#59B4E9]" size={20} />
                                        Email
                                    </div>
                                    <p className="text-gray-600">{user.email || "Chưa có thông tin email"}</p>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                                    <div className="mb-3 flex items-center gap-3 font-bold">
                                        <BookOpen className="text-[#59B4E9]" size={20} />
                                        Khóa học
                                    </div>
                                    <p className="text-gray-600">Danh sách khóa học sẽ được đồng bộ sau khi có dữ liệu enrollment.</p>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <Button asChild className="bg-[#0b2b4d] hover:bg-[#671D9D]">
                                    <Link href="/#courses">Xem các khóa học</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/contact">Liên hệ tư vấn</Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#59B4E9]">
                                <LogIn size={32} />
                            </div>
                            <h1 className="text-3xl font-bold md:text-4xl">Bạn cần đăng nhập để xem tài khoản</h1>
                            <p className="mx-auto mt-4 max-w-xl text-gray-500">
                                Sau khi đăng nhập, bạn sẽ được đưa về khu vực học viên để tiếp tục theo dõi khóa học và thông tin tư vấn.
                            </p>
                            <Button asChild className="mt-8 bg-[#0b2b4d] hover:bg-[#671D9D]">
                                <Link href="/login?redirect=/profile">Đăng nhập</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
