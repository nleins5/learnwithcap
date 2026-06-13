import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "Tiếng Anh Giao Tiếp Chuyên Ngành Xây Dựng - CAP",
  description: "Khóa học Tiếng Anh giao tiếp chuyên ngành Xây dựng, Kiến trúc và Nội thất. Nâng cao kỹ năng giao tiếp, từ vựng và tư duy ngoại ngữ.",
  icons: {
    icon: 'https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp',
  },
  metadataBase: new URL('https://learnwithcap.com'),
  openGraph: {
    title: "Tiếng Anh Giao Tiếp Chuyên Ngành Xây Dựng - CAP",
    description: "Khóa học Tiếng Anh giao tiếp chuyên ngành Xây dựng, Kiến trúc và Nội thất",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${beVietnamPro.className} antialiased bg-white`} suppressHydrationWarning>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
