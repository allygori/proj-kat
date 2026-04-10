"use client";

import CategoryForm from "../_components/category.form";

import { toast } from "sonner";
import { z } from "zod";
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/components/form/form.hook";

import { useRouter } from "next/navigation";
import { ZodCategorySchema } from "@/lib/validations";

const defaultValues: z.input<typeof ZodCategorySchema> = {
  name: "",
  slug: "",
  description: "",
  parent: "",
};

const CreateCategoryPage = () => {
  const router = useRouter();
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ZodCategorySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          ...value,
          // Convert empty strings to undefined for the API/Mongoose
          parent: value.parent === "" ? undefined : value.parent,
          description: value.description === "" ? undefined : value.description,
        };

        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || result.error?.message || "Terjadi kesalahan saat menyimpan kategori");
        }

        toast.success("Kategori berhasil dibuat", {
          description: `Kategori "${value.name}" telah ditambahkan ke sistem.`,
        });

        router.push("/dashboard/categories");
        router.refresh();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal membuat kategori";
        console.error("Create category error:", error);
        toast.error(message);
      }

    },
  });

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div>
          <h2 className="font-semibold mb-1">Tambah Kategori</h2>
          <p className="font-normal text-sm">Tambahkan kategori baru yang belum ada sebelumnya.</p>
        </div>
        <CategoryForm form={form} />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
