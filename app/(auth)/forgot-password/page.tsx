// Reference: AGENTS.md § 3.2 - Password reset page
'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import z from 'zod';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: resetSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send reset email');
        }

        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    },
  });

  if (success) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <p className="text-green-800">
            Check your email for password reset instructions. The link expires in 1 hour.
          </p>
        </Alert>
        <Button variant="outline" className="w-full" render={<Link href="/login" />}>
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

      <p className="text-slate-600 text-sm">
        Enter your email address and we&apos;ll send you instructions to reset your password.
      </p>

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

      <Button type="submit" disabled={form.state.isSubmitting} className="w-full">
        {form.state.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Reset Link
      </Button>

      <div className="text-sm text-center">
        <Link href="/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
      </div>
    </form>
  );
}