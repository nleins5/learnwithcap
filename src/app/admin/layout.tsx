"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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

const CMS_PAGES = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Main Hero", href: "/admin/main-hero", icon: Image },
  { label: "Navbar", href: "/admin/navbar", icon: MenuIcon },
  { label: "Services", href: "/admin/services", icon: Building2 },
  { label: "Insights", href: "/admin/insights", icon: Lightbulb },
  { label: "Wants Header", href: "/admin/wants-header", icon: Lightbulb },
  { label: "Difficulties Header", href: "/admin/difficulties-header", icon: Lightbulb },
  { label: "Solutions", href: "/admin/solutions", icon: Target },
  { label: "Solutions Header", href: "/admin/solutions-header", icon: Target },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Course Pages", href: "/admin/course-pages", icon: FileText },
  { label: "Clients", href: "/admin/clients", icon: Building2 },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "CTA Section", href: "/admin/cta", icon: Megaphone },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Vision & Mission", href: "/admin/vision-mission", icon: Eye },
  { label: "Resources Hero", href: "/admin/resources-hero", icon: Image },
  { label: "Resources Items", href: "/admin/resources", icon: FileText },
  { label: "Contact Hero", href: "/admin/contact-hero", icon: Megaphone },
  { label: "Privacy Policy", href: "/admin/privacy-policy", icon: Lock },
  { label: "Footer", href: "/admin/footer", icon: Settings },
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
    <div className="flex min-h-screen bg-[#f0f0f1] text-[#3c434a] font-sans">
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1d2327] flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-48 xl:w-64`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-12 shrink-0 bg-[#1d2327]">
          <a href="/admin" className="flex items-center gap-2 text-[14px] font-semibold text-white tracking-tight">
            <div className="w-7 h-7 bg-[#2271b1] text-white rounded flex items-center justify-center font-black">
              C
            </div>
            CAP Admin
          </a>
          <button
            className="lg:hidden p-1.5 -mr-1.5 text-[#a7aaad] hover:text-white rounded"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#2c3338]">
          {/* Main Business Tabs */}
          <div>
            <h3 className="px-4 text-[11px] font-semibold text-[#a7aaad] uppercase tracking-wide mb-2">
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
                  <a
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all ${
                      isActive
                        ? "bg-[#2271b1] text-white font-medium"
                        : "text-[#a7aaad] hover:text-white hover:bg-[#2c3338]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#a7aaad]"}`} />
                    <span className="flex-1">{tab.label}</span>
                    {tab.countSuffix ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isActive ? "bg-[#135e96] text-white" : "bg-[#2c3338] text-[#a7aaad]"}`}>
                        {tab.countSuffix}
                      </span>
                    ) : tab.count !== null ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isActive ? "bg-[#135e96] text-white" : "bg-[#2c3338] text-[#a7aaad]"}`}>
                        {tab.count}
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </div>
          </div>

          {/* CMS Pages */}
          <div>
            <h3 className="px-4 text-[11px] font-semibold text-[#a7aaad] uppercase tracking-wide mb-2">
              CMS Giao diện
            </h3>
            <div className="space-y-0.5">
              {CMS_PAGES.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all ${
                      isActive
                        ? "bg-[#2271b1] text-white font-medium"
                        : "text-[#a7aaad] hover:text-white hover:bg-[#2c3338]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#a7aaad]"}`} />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto">
          <div className="flex items-center justify-between p-3 bg-[#2c3338]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-[#1d2327] flex items-center justify-center text-white text-[11px] font-bold">
                AD
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#a7aaad] hover:text-white hover:bg-[#1d2327] rounded transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
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
        <header className="h-12 bg-white border-b border-[#c3c4c7] flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-[#2271b1] hover:bg-gray-100 rounded transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb / Page Title */}
            <div className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-[#50575e]">
              <span className="text-[#50575e]">Admin</span>
              <span className="text-gray-300">/</span>
              <span className="text-[#1d2327]">
                {MAIN_TABS.find((t) => t.href === pathname)?.label || 
                 CMS_PAGES.find((t) => t.href === pathname)?.label || 
                 "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium text-[#2271b1] hover:text-[#135e96] bg-white border border-[#2271b1] rounded-[3px] hover:bg-[#f6f7f7] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xem Website</span>
            </a>

            <div className="w-px h-5 bg-[#c3c4c7] mx-1"></div>

            <button
              title="Tìm kiếm"
              className="p-1.5 text-[#50575e] hover:text-[#2271b1] rounded transition-colors"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              title="Thông báo"
              className="p-1.5 text-[#50575e] hover:text-[#2271b1] rounded transition-colors relative"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#d63638] rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

