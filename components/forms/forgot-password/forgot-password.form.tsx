"use client";

import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { withForm } from "@/components/form/form.hook";
import { ZodForgotPasswordInput } from "./forgot-password.schema";



type FormProps = {
  error?: string | null;
  success?: boolean;
};

const ForgotPasswordForm = withForm({
  defaultValues: {
    email: "",
  } as ZodForgotPasswordInput,
  props: {
    error: null,
    success: false,
  } as FormProps,
  render: function Render({ form, error, success }) {
    if (success) {
      return (
        <div className="space-y-4">
          <Alert className="bg-emerald-50 border-emerald-200">
            <p className="text-emerald-800">
              Check your email for password reset instructions. The link expires in 1 hour.
            </p>
          </Alert>
          <Button variant="outline" className="w-full text-slate-700 hover:bg-slate-50" render={<Link href="/login-2" />}>
            Back to login
          </Button>
        </div>
      );
    }

    return (
      <form
        id="forgot-password-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <p className="text-slate-500 text-sm dark:text-slate-400">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>

        {error && (
          <Alert className="bg-destructive/10 text-destructive border-destructive/20 rounded-md">
            <p className="text-sm font-medium">{error}</p>
          </Alert>
        )}

        <FieldGroup className="gap-5">
          <form.AppField
            name="email"
            children={(field) => {
              return <field.TextField label="Email" placeholder="username@example.com" />;
            }}
          />
        </FieldGroup>

        <div className="flex flex-col gap-4 mt-2">
          <form.AppForm>
            <form.SubmitButton text="Send Reset Link" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" />
          </form.AppForm>
        </div>
      </form>
    );
  },
});

export default ForgotPasswordForm;
