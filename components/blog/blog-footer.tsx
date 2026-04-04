'use client';

import Link from 'next/link';
import { Mail, Linkedin, Twitter } from 'lucide-react';

/**
 * Blog Footer Component
 * Refined minimalist footer with links, copyright, and social media.
 * 
 * See AGENTS.md § 3.1 for blog design requirements.
 */

export function BlogFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Blog': [
      { label: 'All Posts', href: '/blog' },
      { label: 'Categories', href: '/blog' },
      { label: 'Archives', href: '/blog' },
    ],
    'Company': [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy', href: '#privacy' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@katalis.id', label: 'Email' },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-2 gap-8 py-16 sm:grid-cols-4 lg:grid-cols-5">
          {/* Branding */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Katalis Dental
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Premium dental insights and clinical expertise.
            </p>
          </div>

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="sm:col-span-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {section}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Follow
            </h4>
            <div className="mt-4 flex gap-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 py-8 dark:border-slate-800">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            © {currentYear} Katalis Dental. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
