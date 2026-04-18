"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppForm } from "@/components/form/form.hook";
import { revalidateLogic } from "@tanstack/react-form";
import ForgotPasswordForm, { ZodForgotPasswordSchema, type ZodForgotPasswordInput } from "@/components/forms/forgot-password";
import { GalleryVerticalEnd } from "lucide-react";


export default function ForgotPassword2Page() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
    } as ZodForgotPasswordInput,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ZodForgotPasswordSchema,
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


  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Katalis Dental.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="mb-6 text-center">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-foreground">
                  Reset password
                </h2>
              </div>
            </div>

            <ForgotPasswordForm form={form} error={error} success={success} />

            {!success && (
              <div className="mt-8 text-center text-sm">
                <Link
                  href="/login"
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-accent-foreground font-medium transition-colors"
                >
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1612736777093-461fb48101d7?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Image"
          width={1024}
          height={1536}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
      </div>
    </div>
  )
}
