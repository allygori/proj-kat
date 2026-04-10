"use client";

import CategoryForm from "../_components/tag.form";

import { toast } from "sonner";
import { z } from "zod";
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/components/form/form.hook";

const ZodCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string(),
});

const defaultValues: z.input<typeof ZodCategorySchema> = {
  name: "",
  slug: "",
  description: "",
};

const CreateCategoryPage = () => {
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ZodCategorySchema,
    },
    // validators: {
    //   onSubmit: CategorySchema,
    // },
    onSubmit: async ({ value }) => {
      // Merge form values and React blocks state
      const payload = { ...value };

      toast("Draft Saved Successfully", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-zinc-950 p-4 font-mono text-xs text-zinc-50 border border-zinc-800 dark:bg-zinc-900">
            <code>{JSON.stringify(payload, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
      });
    },
  });

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div>
          <h2 className="font-semibold mb-0">Tambah Tag</h2>
          <p className="font-normal text-sm">Tambahkan tag baru yang belum ada sebelumnya.</p>
        </div>
        <CategoryForm form={form} />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
