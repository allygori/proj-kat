'use client';

// Reference: AGENTS.md § 3.1 — Blog header with sticky + scroll animation
// Brand: "Katalis" per client decision

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import Logo from '../svgs/logo';

const navLinks = [
  // { label: 'Beranda', href: '/' },
  { label: 'Studi Kasus', href: '/blog/category/studi-kasus' },
  // { label: 'Ulasan Produk', href: '/blog/category/ulasan-produk' },
  { label: 'Opini', href: '/blog/category/opini' },
  // { label: 'Tentang', href: '/about' },
];

export function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-[#E2EDF2] bg-white/90 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90'
          // : 'border-b border-transparent bg-white dark:bg-slate-950',
          : 'border-b border-transparent bg-transparent dark:bg-slate-950',
      ].join(' ')}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            aria-label="Katalis — kembali ke beranda"
          >
            {/* Icon */}
            <div className="flex items-center justify-center">
              <Logo className="h-6 w-6" />
            </div>
            <span
              className="text-xl font-bold tracking-tight text-primary transition-opacity group-hover:opacity-75 dark:text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              Katalis
            </span>
          </Link>



          {/* Right — theme toggle + mobile menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-[#E8F4F8] hover:text-[#155E88] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#a9dbdc]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#E8F4F8] hover:text-[#155E88] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#a9dbdc]"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#E8F4F8] hover:text-[#155E88] md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className="border-t border-[#E2EDF2] pb-4 pt-2 dark:border-slate-800"
            aria-label="Navigasi mobile"
          >
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-[#E8F4F8] hover:text-[#155E88] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#a9dbdc]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
