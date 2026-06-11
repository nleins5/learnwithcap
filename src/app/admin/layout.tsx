"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Users,
  BookOpen,
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  LayoutDashboard,
  Image,
  Menu as MenuIcon,
  MessageSquare,
  FileText,
  Megaphone,
  Eye,
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
  { label: "Hero Section", href: "/admin/hero", icon: Image },
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
  { label: "Main Footer", href: "/admin/main-footer", icon: Settings },
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
      <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-400 text-sm mt-1">
                Access your control panel
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm"
                    placeholder="johndoe"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#4a9fd5] text-white font-semibold rounded-xl hover:bg-[#3d8fc2] active:scale-[0.98] transition-all text-sm shadow-sm"
              >
                Login to Dashboard
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-gray-400 uppercase tracking-wider">
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
