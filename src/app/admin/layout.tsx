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
  LogOut,
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
  X,
  ChevronDown,
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
  { label: "Resources", href: "/admin/resources", icon: FileText },
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
  const [showCmsNav, setShowCmsNav] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const adminAuth = localStorage.getItem("cap_admin_auth");
    if (adminAuth === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setShowCmsNav(false);
    setMobileMenu(false);
  }, [pathname]);

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
          <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
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
                <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-[0.08em] mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    <User className="w-[18px] h-[18px]" />
                  </div>
                  <input
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
                <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-[0.08em] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    <Lock className="w-[18px] h-[18px]" />
                  </div>
                  <input
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ── Top Navbar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo */}
            <a href="/admin" className="text-base font-semibold text-gray-800">
              Admin
            </a>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* CMS Pages Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCmsNav(!showCmsNav)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">CMS</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCmsNav ? "rotate-180" : ""}`} />
                </button>

                {showCmsNav && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowCmsNav(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 max-h-96 overflow-y-auto">
                      {CMS_PAGES.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? "text-blue-600 bg-blue-50 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {item.label}
                          </a>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
              </button>
              <a
                href="/"
                target="_blank"
                className="hidden sm:block ml-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                Xem site ↗
              </a>

              {/* Avatar / Logout */}
              <button
                onClick={handleLogout}
                className="ml-1 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                title="Đăng xuất"
              >
                <span className="text-xs font-medium text-gray-600">A</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Tabs ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto -mb-px py-2">
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
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50 border border-blue-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.countSuffix ? (
                    <span className={`text-xs ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                      ({tab.countSuffix})
                    </span>
                  ) : tab.count !== null ? (
                    <span className={`text-xs ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                      ({tab.count})
                    </span>
                  ) : null}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Page Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
