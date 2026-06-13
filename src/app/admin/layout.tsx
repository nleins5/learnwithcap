"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  Users,
  User,
  BookOpen,
  TrendingUp,
  Shield,
  Lock,
  Settings,
  LayoutDashboard,
  Image,
  Menu as MenuIcon,
  MessageSquare,
  FileText,
  Megaphone,
  Eye,
  EyeOff,
  Building2,
  Lightbulb,
  Target,
  ChevronDown,
  LogOut,
  ExternalLink
} from "lucide-react";

/* ── Tab groups matching the original admin ── */

const MAIN_TABS = [
  {
    label: "Học viên",
    icon: Users,
    count: 4,
    href: "/admin",
  },
  {
    label: "Khóa học",
    icon: BookOpen,
    count: 17,
    href: "/admin/courses",
  },
  {
    label: "Doanh thu",
    icon: TrendingUp,
    count: null,
    countSuffix: "0 đ",
    href: "/admin/revenue",
  },
  {
    label: "Nhân sự",
    icon: Shield,
    count: 0,
    href: "/admin/team",
  },
];

const HOMEPAGE_CMS_PAGES = [
  { label: "Trang chủ - Hero", href: "/admin/main-hero", icon: Image },
  { label: "Trang chủ - Footer", href: "/admin/main-footer", icon: Settings },
  { label: "Dịch vụ (Carousel)", href: "/admin/services", icon: Building2 },
  { label: "Nhận thức (Insights)", href: "/admin/insights", icon: Lightbulb },
  { label: "Mong muốn (Wants Header)", href: "/admin/wants-header", icon: Lightbulb },
  { label: "Khó khăn (Difficulties Header)", href: "/admin/difficulties-header", icon: Lightbulb },
  { label: "Giải pháp (Solutions)", href: "/admin/solutions", icon: Target },
  { label: "Giải pháp Header", href: "/admin/solutions-header", icon: Target },
  { label: "Khóa học (Courses)", href: "/admin/courses", icon: BookOpen },
  { label: "Đối tác & Khách hàng", href: "/admin/clients", icon: Building2 },
  { label: "Ý kiến học viên (Testimonials)", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Kêu gọi hành động (CTA)", href: "/admin/cta", icon: Megaphone },
  { label: "Đội ngũ giảng viên (Team)", href: "/admin/team", icon: Users },
  { label: "Tầm nhìn & Sứ mệnh", href: "/admin/vision-mission", icon: Eye },
  { label: "Tài nguyên - Hero", href: "/admin/resources-hero", icon: Image },
  { label: "Tài nguyên - Bài viết", href: "/admin/resources", icon: FileText },
  { label: "Liên hệ - Hero", href: "/admin/contact-hero", icon: Megaphone },
  { label: "Chính sách bảo mật", href: "/admin/privacy-policy", icon: Lock },
];

const ELEARNING_CMS_PAGES = [
  { label: "Trang khóa học (Templates)", href: "/admin/course-pages", icon: FileText },
  { label: "E-learning - Hero", href: "/admin/hero", icon: Image },
  { label: "E-learning - Footer", href: "/admin/footer", icon: Settings },
  { label: "Thanh điều hướng (Navbar)", href: "/admin/navbar", icon: MenuIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const adminAuth = localStorage.getItem("cap_admin_auth");
    if (adminAuth === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "cap@admin2025") {
      localStorage.setItem("cap_admin_auth", "authenticated");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Mật khẩu không đúng");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cap_admin_auth");
    setIsAuthenticated(false);
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  /* ── Login Screen ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#eef2f7] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[380px]">
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
            {/* Header */}
            <div className="mb-7">
              <h1 className="text-[26px] font-bold text-[#1e293b]">Sign In</h1>
              <p className="text-[#94a3b8] text-[14px] mt-1">
                Access your control panel
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-[11px] font-bold text-[#334155] uppercase tracking-[0.08em] mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    <User className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#334155] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#4361ee]/30 focus:border-[#4361ee] transition-all text-sm"
                    placeholder="johndoe"
                    autoFocus
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[11px] font-bold text-[#334155] uppercase tracking-[0.08em] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    <Lock className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#334155] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#4361ee]/30 focus:border-[#4361ee] transition-all text-sm"
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                    title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-[#ef4444] text-sm text-center bg-[#fef2f2] py-2.5 rounded-xl font-medium">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#4361ee] text-white font-semibold rounded-xl hover:bg-[#3a56d4] active:scale-[0.98] transition-all text-[14px]"
              >
                Login to Dashboard
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-10 text-[11px] text-[#94a3b8] uppercase tracking-[0.15em] font-medium">
          © 2026 CAP EDUCATION
        </p>
      </div>
    );
  }

  /* ── Main Admin Layout ── */
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f1] text-[#2c3338] font-sans">
      {/* ── WordPress Top Admin Bar (Height: 32px) ── */}
      <div className="h-8 bg-[#1d2327] text-[#c3c4c7] flex items-center justify-between px-4 z-40 text-[13px] shrink-0 w-full select-none">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-1 text-[#a7aaad] hover:text-white rounded transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon className="w-4 h-4" />
          </button>
          
          <Link href="/admin" className="flex items-center gap-1.5 text-[#f0f0f1] hover:text-[#72aee6] font-semibold transition-colors">
            <span className="font-bold">CAP Admin</span>
          </Link>
          
          <a
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-[#c3c4c7] hover:text-[#72aee6] transition-colors text-[12px]"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Xem trang chủ</span>
          </a>
        </div>

        <div className="flex items-center gap-4 text-[12px]">
          <span className="text-[#a7aaad]">Chào, <strong>Admin</strong></span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[#c3c4c7] hover:text-[#72aee6] transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* ── Main Sidebar & Content Container ── */}
      <div className="flex flex-1 min-h-0 relative">
        {/* ── Sidebar (Desktop & Mobile) ── */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#1d2327] flex flex-col transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0 top-8" : "-translate-x-full"
          } lg:translate-x-0 lg:w-56 shrink-0 border-r border-[#101517]`}
        >
          {/* Mobile Sidebar Close Button */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-[#2c3338] bg-[#1d2327]">
            <span className="text-white text-xs font-bold uppercase tracking-wider">Danh mục</span>
            <button
              className="p-1 text-[#a7aaad] hover:text-white rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              <MenuIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Scrollable Area */}
          <div className="flex-1 overflow-y-auto py-2 space-y-4 custom-scrollbar">
            {/* Main Business Tabs */}
            <div>
              <h3 className="px-3 text-[10px] font-bold text-[#787c82] uppercase tracking-wider mb-1">
                Quản lý
              </h3>
              <div className="space-y-0.5">
                {MAIN_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive =
                    tab.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(tab.href);
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] border-l-[3px] transition-all ${
                        isActive
                          ? "bg-[#0f1416] text-[#72aee6] border-[#72aee6] font-medium"
                          : "text-[#c3c4c7] border-transparent hover:bg-[#1d2327] hover:text-[#72aee6]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{tab.label}</span>
                      {tab.countSuffix ? (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${isActive ? "bg-[#72aee6]/20 text-[#72aee6]" : "bg-[#2c3338] text-[#a7aaad]"}`}>
                          {tab.countSuffix}
                        </span>
                      ) : tab.count !== null ? (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${isActive ? "bg-[#72aee6]/20 text-[#72aee6]" : "bg-[#2c3338] text-[#a7aaad]"}`}>
                          {tab.count}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CMS Homepage Pages */}
            <div>
              <h3 className="px-3 text-[10px] font-bold text-[#787c82] uppercase tracking-wider mb-1">
                CMS Trang Chủ
              </h3>
              <div className="space-y-0.5 border-b border-[#2c3338]/40 pb-2">
                {HOMEPAGE_CMS_PAGES.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] border-l-[3px] transition-all ${
                        isActive
                          ? "bg-[#0f1416] text-[#72aee6] border-[#72aee6] font-medium"
                          : "text-[#c3c4c7] border-transparent hover:bg-[#1d2327] hover:text-[#72aee6]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CMS E-learning Pages */}
            <div className="pb-4">
              <h3 className="px-3 text-[10px] font-bold text-[#787c82] uppercase tracking-wider mb-1">
                CMS E-learning
              </h3>
              <div className="space-y-0.5">
                {ELEARNING_CMS_PAGES.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] border-l-[3px] transition-all ${
                        isActive
                          ? "bg-[#0f1416] text-[#72aee6] border-[#72aee6] font-medium"
                          : "text-[#c3c4c7] border-transparent hover:bg-[#1d2327] hover:text-[#72aee6]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Overlay for Mobile Sidebar ── */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Main Content Area ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-10 bg-white border-b border-[#c3c4c7] flex items-center justify-between px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-4">
              {/* Breadcrumb / Page Title */}
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#50575e]">
                <span className="text-[#50575e]">Bảng điều khiển</span>
                <span className="text-gray-300">/</span>
                <span className="text-[#1d2327] font-semibold">
                  {MAIN_TABS.find((t) => t.href === pathname)?.label || 
                   HOMEPAGE_CMS_PAGES.find((t) => t.href === pathname)?.label || 
                   ELEARNING_CMS_PAGES.find((t) => t.href === pathname)?.label || 
                   "Tổng quan"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[12px] text-[#50575e]">
              <span>Hệ thống: <strong className="text-green-600">Ổn định</strong></span>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f0f0f1]">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

