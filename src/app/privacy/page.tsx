"use client";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen">
            <Header />

            <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
                <h1 className="text-[40px] font-bold text-[#0b2b4d] mb-8 pb-4 border-b border-gray-100">Chính Sách Bảo Mật</h1>

                <div className="prose prose-lg text-gray-600">
                    <p className="mb-4">
                        Chính sách bảo mật này mô tả cách CAP (&quot;chúng tôi&quot;) thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng website learnwithcap.com.
                    </p>

                    <h3 className="text-xl font-bold text-[#0b2b4d] mt-8 mb-4">1. Thu thập thông tin</h3>
                    <p className="mb-4">
                        Chúng tôi thu thập thông tin khi bạn đăng ký khóa học, đăng ký nhận bản tin hoặc điền vào biểu mẫu. Thông tin thu thập bao gồm tên, địa chỉ email, số điện thoại và các thông tin liên quan khác.
                    </p>

                    <h3 className="text-xl font-bold text-[#0b2b4d] mt-8 mb-4">2. Sử dụng thông tin</h3>
                    <p className="mb-4">
                        Bất kỳ thông tin nào chúng tôi thu thập từ bạn có thể được sử dụng để:
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-2">
                        <li>Cá nhân hóa trải nghiệm của bạn và đáp ứng nhu cầu cá nhân.</li>
                        <li>Cải thiện website và dịch vụ khách hàng.</li>
                        <li>Xử lý giao dịch và gửi thông tin liên quan đến khóa học.</li>
                        <li>Gửi email định kỳ về cập nhật, tin tức hoặc thông tin dịch vụ liên quan.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-[#0b2b4d] mt-8 mb-4">3. Bảo mật thông tin</h3>
                    <p className="mb-4">
                        Chúng tôi thực hiện nhiều biện pháp bảo mật để duy trì sự an toàn của thông tin cá nhân của bạn. Dữ liệu của bạn được lưu trữ trên các mạng an toàn và chỉ có thể truy cập bởi một số người có quyền truy cập đặc biệt, những người này được yêu cầu bảo mật thông tin.
                    </p>

                    <h3 className="text-xl font-bold text-[#0b2b4d] mt-8 mb-4">4. Cookies</h3>
                    <p className="mb-4">
                        Chúng tôi sử dụng cookies để hiểu và lưu các tùy chọn của bạn cho các lần truy cập trong tương lai. Bạn có thể chọn tắt cookies thông qua cài đặt trình duyệt của mình, tuy nhiên điều này có thể ảnh hưởng đến trải nghiệm sử dụng website.
                    </p>

                    <h3 className="text-xl font-bold text-[#0b2b4d] mt-8 mb-4">5. Thay đổi chính sách</h3>
                    <p className="mb-4">
                        Nếu chúng tôi quyết định thay đổi chính sách bảo mật, chúng tôi sẽ đăng những thay đổi đó trên trang này. Chính sách này được cập nhật lần cuối vào ngày 01/01/2024.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
