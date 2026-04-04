// Reference: AGENTS.md § 3.2 - Login page with email/password + magic link
'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isMagicLink, setIsMagicLink] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        const response = await fetch('/api/auth/sign-in/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Sign in failed');
        }

        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    },
  });

  const handleMagicLink = async () => {
    const state = form.getFieldValue('email');
    if (!state) {
      setError('Please enter your email first');
      return;
    }

    setError(null);
    try {
      const response = await fetch('/api/auth/sign-in/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state }),
      });

      if (!response.ok) {
        throw new Error('Failed to send magic link');
      }

      setIsMagicLink(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    }
  };

  if (isMagicLink) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <p className="text-green-800">
            Check your email for a magic link to sign in. The link expires in 1 hour.
          </p>
        </Alert>
        <Button
          variant="outline"
          onClick={() => setIsMagicLink(false)}
          className="w-full"
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <p className="text-red-800 text-sm">{error}</p>
        </Alert>
      )}

      <form.Field
        name="email"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@clinic.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={!!field.state.meta.errors.length}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={!!field.state.meta.errors.length}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      />

      <Button type="submit" disabled={form.state.isSubmitting} className="w-full">
        {form.state.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-600">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleMagicLink}
        disabled={form.state.isSubmitting || !form.getFieldValue('email')}
        className="w-full"
      >
        {form.state.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Magic Link
      </Button>

      <div className="flex items-center justify-between text-sm">
        <Link href="/signup" className="text-indigo-600 hover:underline">
          Create account
        </Link>
        <Link href="/forgot-password" className="text-indigo-600 hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}