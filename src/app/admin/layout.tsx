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
  const [password, setPassword] = useState("");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin</h1>
              <p className="text-gray-500 text-sm mt-1">
                Đăng nhập để quản lý nội dung
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="Nhập mật khẩu..."
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
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
