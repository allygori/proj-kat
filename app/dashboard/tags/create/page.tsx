"use client";

import CategoryForm from "../_components/tag.form";

import { toast } from "sonner";
import { z } from "zod";
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/components/form/form.hook";

import { useRouter } from "next/navigation";
import { ZodTagSchema } from "@/lib/validations";

const defaultValues: z.input<typeof ZodTagSchema> = {
  name: "",
  slug: "",
  description: "",
};

const CreateCategoryPage = () => {
  const router = useRouter();
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ZodTagSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          ...value,
          // Convert empty strings to undefined for the API/Mongoose
          description: value.description === "" ? undefined : value.description,
        };

        const response = await fetch("/api/tags", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || result.error?.message || "Terjadi kesalahan saat menyimpan tag");
        }

        toast.success("Tag berhasil dibuat", {
          description: `Tag "${value.name}" telah ditambahkan ke sistem.`,
        });

        router.push("/dashboard/tags");
        router.refresh();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal membuat tag";
        console.error("Create tag error:", error);
        toast.error(message);
      }

    },
  });

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div>
          <h2 className="font-semibold mb-1">Tambah Tag</h2>
          <p className="font-normal text-sm">Tambahkan tag baru yang belum ada sebelumnya.</p>
        </div>
        <CategoryForm form={form} />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
