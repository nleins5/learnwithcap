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
    <div className="flex min-h-screen bg-[#f8fafc] text-gray-900 font-sans">
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-72`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 shrink-0">
          <a href="/admin" className="flex items-center gap-2 text-lg font-bold text-gray-800 tracking-tight">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black">
              C
            </div>
            CAP Admin
          </a>
          <button
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
          {/* Main Business Tabs */}
          <div>
            <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Quản lý
            </h3>
            <div className="space-y-1">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <span className="flex-1">{tab.label}</span>
                    {tab.countSuffix ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                        {tab.countSuffix}
                      </span>
                    ) : tab.count !== null ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
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
            <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              CMS Giao diện
            </h3>
            <div className="space-y-1">
              {CMS_PAGES.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-gray-300" : "text-gray-400"}`} />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
                AD
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500 font-medium">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb / Page Title */}
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500">
              <span className="text-gray-400">Admin</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-800">
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xem Website</span>
            </a>

            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            <button
              title="Tìm kiếm"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              title="Thông báo"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

