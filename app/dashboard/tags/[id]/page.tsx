"use client";

import { use, useEffect, useState, useMemo } from "react";
import CategoryForm from "../_components/tag.form";
import { toast } from "sonner";
import { z } from "zod";
// import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useAppForm } from "@/components/form/form.hook";
import { useRouter } from "next/navigation";
import { ZodTagSchema } from "@/lib/validations";

type CategoryData = z.infer<typeof ZodTagSchema> & { _id: string };

const EditCategoryPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tags/${id}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Gagal mengambil data");
        setData(result.data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="animate-pulse text-muted-foreground font-medium">Memuat data tag...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Tag tidak ditemukan</h3>
          <p className="text-muted-foreground">ID tag mungkin salah atau telah dihapus.</p>
        </div>
      </div>
    );
  }

  return <EditCategoryFormWrapper initialData={data} id={id} />;
};

function EditCategoryFormWrapper({ initialData, id }: { initialData: CategoryData; id: string }) {
  const router = useRouter();

  const formValues = useMemo(() => {
    return {
      name: initialData.name || "",
      slug: initialData.slug || "",
      description: initialData.description || "",
    };
  }, [initialData]);

  const form = useAppForm({
    defaultValues: formValues as z.input<typeof ZodTagSchema>,
    // validationLogic: revalidateLogic(),
    validators: {
      onChange: ZodTagSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          ...value,
          // Handle empty strings for backend
          description: value.description === "" ? undefined : value.description,
        };

        const response = await fetch(`/api/tags/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || result.error?.message || "Terjadi kesalahan saat menyimpan tag");
        }

        toast.success("Tag berhasil diperbarui", {
          description: `Tag "${value.name}" telah diperbarui.`,
        });

        router.push("/dashboard/tags");
        router.refresh();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal memperbarui tag";
        console.error("Update tag error:", error);
        toast.error(message);
      }
    },
  });

  const categoryName = form.getFieldValue("name")

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div>
          <h2 className="font-semibold text-xl mb-1">Edit Tag</h2>
          <p className="font-normal text-sm text-muted-foreground">
            Ubah rincian tag: <span className="font-medium text-foreground">{categoryName || initialData.name}</span>
          </p>
        </div>
        <CategoryForm form={form} title="Informasi Tag" />
      </div>
    </div>
  );
}

export default EditCategoryPage;