"use client";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageData } from '@/hooks/usePageData';

export default function PrivacyPage() {
    const { navbar, footer, privacyPolicy } = usePageData();

    const pageTitle = privacyPolicy?.title || "Chính Sách Bảo Mật";
    const pageIntro = privacyPolicy?.introduction || 'Chính sách bảo mật này mô tả cách CAP ("chúng tôi") thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng website learnwithcap.com.';
    const policySections = privacyPolicy?.sections || [
        {
            title: "1. Thu thập thông tin",
            content: "Chúng tôi thu thập thông tin khi bạn đăng ký khóa học, đăng ký nhận bản tin hoặc điền vào biểu mẫu. Thông tin thu thập bao gồm tên, địa chỉ email, số điện thoại và các thông tin liên quan khác."
        },
        {
            title: "2. Sử dụng thông tin",
            content: "Bất kỳ thông tin nào chúng tôi thu thập từ bạn có thể được sử dụng để:\n- Cá nhân hóa trải nghiệm của bạn và đáp ứng nhu cầu cá nhân.\n- Cải thiện website và dịch vụ khách hàng.\n- Xử lý giao dịch và gửi thông tin liên quan đến khóa học.\n- Gửi email định kỳ về cập nhật, tin tức hoặc thông tin dịch vụ liên quan."
        },
        {
            title: "3. Bảo mật thông tin",
            content: "Chúng tôi thực hiện nhiều biện pháp bảo mật để duy trì sự an toàn của thông tin cá nhân của bạn. Dữ liệu của bạn được lưu trữ trên các mạng an toàn và chỉ có thể truy cập bởi một số người có quyền truy cập đặc biệt, những người này được yêu cầu bảo mật thông tin."
        },
        {
            title: "4. Cookies",
            content: "Chúng tôi sử dụng cookies để hiểu và lưu các tùy chọn của bạn cho các lần truy cập trong tương lai. Bạn có thể chọn tắt cookies thông qua cài đặt trình duyệt của mình, tuy nhiên điều này có thể ảnh hưởng đến trải nghiệm sử dụng website."
        },
        {
            title: "5. Thay đổi chính sách",
            content: "Nếu chúng tôi quyết định thay đổi chính sách bảo mật, chúng tôi sẽ đăng những thay đổi đó trên trang này. Chính sách này được cập nhật lần cuối vào ngày 01/01/2024."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <Header navbar={navbar} />

            <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
                <h1 className="text-[40px] font-bold text-[#0b2b4d] mb-8 pb-4 border-b border-gray-100">{pageTitle}</h1>

                <div className="prose prose-lg text-gray-600">
                    <p className="mb-4">
                        {pageIntro}
                    </p>

                    {policySections.map((section: any, index: number) => (
                        <div key={index}>
                            <h3 className="text-xl font-bold text-[#0b2b4d] mt-8 mb-4">{section.title}</h3>
                            <div className="mb-4 whitespace-pre-line leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer footerData={footer} />
        </div>
    );
}
