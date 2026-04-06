// Reference: AGENTS.md § 3.1 — /blog now redirects to / (homepage = blog index)

import { redirect } from 'next/navigation';

export default function BlogPage() {
  redirect('/');
}
