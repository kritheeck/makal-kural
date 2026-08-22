'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Search, 
  PlusCircle, 
  Building2, 
  Globe, 
  Menu, 
  X, 
  User, 
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { language, setLanguage, t, isTamil } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const navLinks = [
    { href: '/', label: t.nav.home, icon: null },
    { href: '/raise-complaint', label: t.nav.raiseComplaint, icon: PlusCircle, highlight: true },
    { href: '/track', label: t.nav.track, icon: Search },
    { href: '/representatives', label: t.nav.representatives, icon: Building2 },
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center text-white shadow-md shadow-navy-950/20 group-hover:bg-emerald-700 transition-colors">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-navy-950 font-tamil tracking-tight">
                  {t.brand.tamilName}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-navy-100 text-navy-700 font-mono font-medium">
                  TN-CIVIC
                </span>
              </div>
              <p className="text-[11px] text-navy-500 font-medium hidden sm:block">
                {t.brand.name} &bull; Official Public Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (item.highlight) {
                return (
                  <Link key={item.href} href={item.href} className="ml-1">
                    <Button variant="civic" size="sm" className="font-medium shadow-emerald-600/20">
                      {Icon && <Icon className="w-4 h-4 mr-1" />}
                      {item.label}
                    </Button>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-navy-100 text-navy-950 font-semibold'
                      : 'text-navy-700 hover:bg-navy-50 hover:text-navy-950'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4 text-navy-500" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Bilingual Language Switcher Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-navy-300/80 bg-navy-50 text-xs font-semibold text-navy-800 hover:bg-navy-100 transition-all shadow-2xs"
              title="Switch Language / மொழியை மாற்றுக"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTamil ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Admin Console Direct Link */}
            <Link href="/admin">
              <Button
                variant={pathname.startsWith('/admin') ? 'primary' : 'outline'}
                size="sm"
                className="hidden lg:flex items-center gap-1.5 text-xs py-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.nav.admin}</span>
              </Button>
            </Link>

            {/* User Login/Logout */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-navy-700 hidden sm:inline-block">
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout} className="text-xs">
                  {t.nav.logout}
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-xs">
                  <User className="w-3.5 h-3.5 mr-1" />
                  {t.nav.login}
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-navy-700 hover:bg-navy-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  isActive ? 'bg-navy-100 text-navy-950 font-bold' : 'text-navy-700 hover:bg-navy-50'
                )}
              >
                {Icon && <Icon className="w-4 h-4 text-emerald-600" />}
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-navy-100 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-navy-800 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-navy-500" />
              {t.nav.admin}
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-emerald-700"
            >
              {user ? t.nav.logout : t.nav.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
