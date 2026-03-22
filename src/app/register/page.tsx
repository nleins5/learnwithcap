import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Đăng ký - CAP English",
};

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                <div className="hidden sm:flex flex-col items-center justify-center">
                    <Link href="/">
                        <Image
                            src="https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp"
                            alt="CAP English Logo"
                            width={180}
                            height={60}
                            priority
                            className="h-auto w-auto"
                        />
                    </Link>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
