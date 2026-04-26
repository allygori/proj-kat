// Reference: AGENTS.md § 3.1 — Blog footer, Bahasa Indonesia

import Link from 'next/link';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../svgs/logo';

type BlogFooterProps = {
  className?: string;
}

export function BlogFooter({ className = "" }: BlogFooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Tulisan: [
      { label: 'Semua Tulisan', href: '/' },
      { label: 'Studi Kasus', href: '/blog/category/studi-kasus' },
      // { label: 'Ulasan Produk', href: '/blog/category/ulasan-produk' },
      { label: 'Opini', href: '/blog/category/opini' },
    ],
    Lainnya: [
      { label: 'Tentang', href: '/about' },
      // { label: 'Kontak', href: '#kontak' },
      { label: 'Kebijakan Privasi', href: '#privasi' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:katalis.dental@gmail.com', label: 'Email' },
  ];

  return (
    <footer className={cn("border-t border-[#E2EDF2] bg-white dark:border-slate-800 dark:bg-slate-950", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 lg:grid-cols-5">
          {/* Branding */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center">
                <Logo className="h-5 w-5" />
              </div>
              <span className="text-base font-bold tracking-normal text-primary dark:text-white">
                Katalis
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Tulisan dan catatan klinis dari dokter gigi yang suka berbagi.
            </p>
          </div>

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="sm:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-[#155E88] dark:text-slate-400 dark:hover:text-[#a9dbdc]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Ikuti
            </h4>
            <div className="mt-4 flex gap-2">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#E8F4F8] hover:text-[#155E88] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#a9dbdc]"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#E2EDF2] py-6 dark:border-slate-800">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            © {currentYear} Katalis. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
