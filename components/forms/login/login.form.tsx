"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { withForm } from "@/components/form/form.hook";
import { type ZodLoginInput } from "./login.schema";


type FormProps = {
  error?: string | null;
  isMagicLink?: boolean;
  onResetMagicLink?: () => void;
  onMagicLink?: () => void;
};

const LoginForm = withForm({
  defaultValues: {
    email: "",
    password: "",
  } as ZodLoginInput,
  props: {
    error: null,
    isMagicLink: false,
    onResetMagicLink: () => { },
    onMagicLink: () => { },
  } as FormProps,
  render: function Render({ form, error, isMagicLink, onResetMagicLink, onMagicLink }) {
    if (isMagicLink) {
      return (
        <div className="space-y-4">
          <Alert className="bg-emerald-50 border-emerald-200">
            <p className="text-emerald-800">
              Check your email for a magic link to sign in. The link expires in 1 hour.
            </p>
          </Alert>
          <Button
            variant="outline"
            onClick={onResetMagicLink}
            className="w-full text-slate-700 hover:bg-slate-50"
          >
            Back to login
          </Button>
        </div>
      );
    }

    return (
      <form
        id="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
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

          <form.AppField
            name="password"
            children={(field) => {
              return <field.TextField type="password" label="Password" placeholder="••••••••" />;
            }}
          />
        </FieldGroup>

        <div className="flex flex-col gap-4 mt-2">
          <form.AppForm>
            <form.SubmitButton text="Sign In" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" />
          </form.AppForm>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-200">Or continue with</span>
            </div>
          </div>

          <form.Subscribe selector={(state) => [state.isSubmitting, state.values.email] as const}>
            {([isSubmitting, email]) => (
              <Button
                type="button"
                variant="outline"
                onClick={onMagicLink}
                disabled={isSubmitting || !email}
                className="w-full text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Magic Link
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    );
  },
});

export default LoginForm;
