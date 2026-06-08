"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, User, LogOut, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { NavbarData, NavbarLink } from '@/lib/types';

interface HeaderProps {
    navbar?: NavbarData | null;
}

export default function Header({ navbar }: HeaderProps) {
  const { token, user, logout } = useAuthStore();
  const isAuthenticated = !!token;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = React.useState<number | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = (index: number) => setOpenDropdownIndex(openDropdownIndex === index ? null : index);

  const handleLogout = () => {
    logout();
    toast.success("Bạn đã đăng xuất thành công.");
  };

  const displayName = user?.name || user?.username || 'Học viên';

  const links = navbar?.links || [
        {
            label: "Khóa Học",
            href: "#",
            dropdown: [
                { label: "Trực tiếp tại Doanh Nghiệp", href: "/courses/enterprise" },
                { label: "Online 1:1", href: "/courses/online-1-1" },
                { label: "E-Learning", href: "/courses/e-learning" }
            ]
        },
        { label: "Tài Nguyên", href: "/resources" },
        { label: "Về Chúng Tôi", href: "/about" }
  ];

  const getHref = (href: string) => href === "#" ? "/#courses" : href;

  return (
    <>
    <header className="relative z-50 w-full bg-white pt-1 pb-0 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://course.learnwithcap.com/wp-content/uploads/2025/10/cap-logo-1.webp"
            alt="CAP Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav - Matching cap-new styling style but with hover dropdowns from learnwithcap */}
        <nav className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-full group/nav">
             {links.map((link: NavbarLink, lIdx: number) => {
                 const hasDropdown = link.dropdown && link.dropdown.length > 0;
                 return (
                     <div key={lIdx} className="relative group/item">
                         <Link
                             href={getHref(link.href)}
                             className="rounded-full px-4 py-1.5 text-base font-medium transition-colors text-gray-900 group-hover/nav:text-gray-400 hover:!text-gray-900 group-hover/item:!text-gray-900 block"
                         >
                             {link.label}
                         </Link>

                         {hasDropdown && (
                             <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible translate-y-2 group-hover/item:translate-y-0 transition-all duration-200 z-[60] py-2 border border-gray-100 overflow-hidden">
                                 {link.dropdown?.map((dropLink: NavbarLink, dIdx: number) => (
                                     <Link
                                         key={dIdx}
                                         href={getHref(dropLink.href)}
                                         className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                                     >
                                         {dropLink.label}
                                     </Link>
                                 ))}
                             </div>
                         )}
                     </div>
                 );
             })}
        </nav>

        <div className="flex items-center space-x-2">
          {/* User actions */}
          <div className="hidden md:flex items-center relative">
            {isAuthenticated && user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                  <Button className="bg-[#002A4C] hover:bg-purple-600 text-white rounded-md transition-colors text-base px-4 py-1.5 h-auto">
                    {displayName}&apos;s HUB
                  </Button>
                  
                  {isUserMenuOpen && (
                      <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-md border border-gray-100 py-1 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                             <p className="text-sm font-bold text-gray-900">{displayName}</p>
                             <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                          </div>
                          <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors">
                             <User className="mr-2 h-4 w-4" /> Tài khoản
                          </Link>
                          <button onClick={handleLogout} className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-500 text-left transition-colors">
                             <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                          </button>
                      </div>
                  )}
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-[#002A4C] hover:bg-purple-600 text-white rounded-md transition-colors text-base px-4 py-1.5 h-auto font-medium">
                  {navbar?.cta_label || "Đăng nhập"}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Button variant="outline" size="icon" onClick={toggleMobileMenu} className="border-gray-200">
              <Menu className="h-6 w-6 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile sidebar mimicking Shadcn Sheet style */}
    <div className={`fixed inset-0 z-[100] transform transition-transform duration-300 md:hidden flex justify-end ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
       <div className={`absolute inset-0 bg-black/40 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={toggleMobileMenu}></div>
       <div className={`relative bg-white w-4/5 max-w-sm h-full shadow-2xl flex flex-col transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-4 border-b border-gray-100 flex justify-between items-center">
               <span className="font-bold text-gray-800">Menu</span>
               <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" onClick={toggleMobileMenu}>
                   <X className="h-5 w-5"/>
               </button>
           </div>
           
           <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col space-y-4">
              {links.map((link: NavbarLink, i: number) => {
                  const hasDropdown = link.dropdown && link.dropdown.length > 0;
                  return (
                      <div key={i} className="flex flex-col">
                          <div className="flex justify-between items-center py-2 border-b border-gray-50">
                             <Link href={getHref(link.href)} className="text-lg font-medium text-gray-800 hover:text-purple-600" onClick={() => !hasDropdown && setIsMobileMenuOpen(false)}>
                                 {link.label}
                             </Link>
                             {hasDropdown && (
                                 <button onClick={() => toggleDropdown(i)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                     <ChevronDown className={`w-5 h-5 transition-transform ${openDropdownIndex === i ? 'rotate-180' : ''}`} />
                                 </button>
                             )}
                          </div>
                          {hasDropdown && openDropdownIndex === i && (
                               <div className="flex flex-col pl-4 mt-2 space-y-3 bg-gray-50 p-4 rounded-xl">
                                  {link.dropdown?.map((dropLink: NavbarLink, dIdx: number) => (
                                      <Link key={dIdx} href={getHref(dropLink.href)} className="text-gray-600 font-medium hover:text-purple-600" onClick={() => setIsMobileMenuOpen(false)}>
                                          {dropLink.label}
                                      </Link>
                                  ))}
                               </div>
                          )}
                      </div>
                  );
              })}
              
              <div className="bg-gray-100 h-px w-full my-2"></div>
              
              {isAuthenticated && user ? (
                 <div className="flex flex-col space-y-2">
                   <div className="font-bold text-gray-900 px-1 py-1">{displayName}&apos;s HUB</div>
                   <Link href="/profile" className="flex items-center text-gray-700 font-medium text-sm py-3 px-2 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-3 h-5 w-5" /> Tài khoản quản lý
                   </Link>
                   <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex w-full items-center font-medium text-red-500 text-sm py-3 px-2 hover:bg-red-50 rounded-xl text-left transition-colors">
                      <LogOut className="mr-3 h-5 w-5" /> Đăng xuất phiên
                   </button>
                 </div>
              ) : (
                 <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 block">
                   <Button className="w-full bg-[#002A4C] hover:bg-purple-600 text-white transition-colors h-12 text-base font-bold shadow-md">
                       {navbar?.cta_label || "Đăng nhập ngay"}
                   </Button>
                 </Link>
              )}
           </div>
       </div>
    </div>
    </>
  );
}
