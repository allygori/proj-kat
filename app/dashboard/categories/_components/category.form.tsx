"use client";
import { withForm } from "@/components/form/form.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

// import { toast } from "sonner";
// import { z } from "zod"
// import { revalidateLogic } from '@tanstack/react-form'
// import { useAppForm } from "@/components/form/form.hook"
// // import { ZodCategorySchema } from "@/lib/validations"
// import { FieldGroup } from "@/components/ui/field"
// // type CategoryType = zodInfer<typeof ZodCategorySchema>
// // import { zodValidator } from "@tanstack/zod-form-adapter"

// // const CategorySchema = ZodCategorySchema.omit({
// //   parent: true,
// //   level: true
// // }).partial({
// //   description: true,
// // })

// // const CategoryType = z.input<typeof ZodCategorySchema>;

// const ZodCategorySchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   slug: z.string().min(1, "Slug is required"),
//   description: z.string().optional(),
//   parent: z.string().optional(),
//   level: z.number().min(1).max(3).optional(),
// });

// const defaultValues: z.input<typeof ZodCategorySchema> = {
//   name: "",
//   slug: "",
//   description: "",
// }

// const CategoryForm = (form) => {
//   // const form = useAppForm({
//   //   // Supports all useForm options
//   //   // defaultValues: {
//   //   //   name: "",
//   //   //   slug: "",
//   //   //   description: "",
//   //   //   // parent: "",
//   //   //   // level: 0,
//   //   // },
//   //   defaultValues,
//   //   validationLogic: revalidateLogic(),
//   //   validators: {
//   //     onDynamic: ZodCategorySchema
//   //   },
//   //   // validators: {
//   //   //   onSubmit: CategorySchema,
//   //   // },
//   //   onSubmit: async ({ value }) => {
//   //     // Merge form values and React blocks state
//   //     const payload = { ...value };

//   //     toast("Draft Saved Successfully", {
//   //       description: (
//   //         <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-zinc-950 p-4 font-mono text-xs text-zinc-50 border border-zinc-800 dark:bg-zinc-900">
//   //           <code>{JSON.stringify(payload, null, 2)}</code>
//   //         </pre>
//   //       ),
//   //       position: "bottom-right",
//   //     });
//   //   },
//   // });

//   return (
//     <form
//       id="create-post-form"
//       onSubmit={(e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         form.handleSubmit();
//       }}
//       className="flex flex-col items-start gap-6 lg:flex-row"
//     >
//       {/* side:left */}
//       <div className="flex w-full flex-1 flex-col gap-6">
//         <FieldGroup>
//           {/* field:name */}
//           <form.AppField
//             name="name"
//             children={(field) => {
//               <field.TextField label="Name" />;
//             }}
//           />

//           {/* field:slug */}
//           <form.AppField
//             name="slug"
//             children={(field) => {
//               <field.TextField label="Slug" />;
//             }}
//           />

//           {/* field:description */}
//           <form.AppField
//             name="description"
//             children={(field) => {
//               <field.TextareaField label="Description" />;
//             }}
//           />
//         </FieldGroup>
//       </div>
//       {/* side:right */}
//       <div className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:w-80">
//         <form.SubscribeButton text="Submit" />
//       </div>
//     </form>
//   );
// };

type FormProps = {
  title?: string;
};

const CategoryForm = withForm({
  defaultValues: {
    name: "",
    slug: "",
    description: "",
    parent: "",
  },
  props: {
    title: undefined,
  } as FormProps,
  render: function Render({ form, title }) {
    const parents = [
      { label: "Test 1", value: "test 1" },
      { label: "Test 2", value: "test 2" },
      { label: "Test 3", value: "test 3" },
    ]



    return (
      <form
        id="category-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col items-start gap-6 lg:flex-row"
      >
        {/* side:left */}
        <div className="flex w-full flex-1 flex-col gap-6">
          <Card>
            {title && (
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
            )}
            <CardContent className="space-y-6">
              <FieldGroup>
                {/* field:name */}
                <form.AppField
                  name="name"
                  children={(field) => {
                    return <field.TextField label="Name" />;
                  }}
                />

                {/* field:slug */}
                <form.AppField
                  name="slug"
                  children={(field) => {
                    return <field.TextField label="Slug" />;
                  }}
                />

                {/* field:description */}
                <form.AppField
                  name="description"
                  children={(field) => {
                    return (
                      <field.TextareaField
                        label="Short Description"
                        className="min-h-24"
                      />
                    );
                  }}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
        {/* side:right */}
        <div className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:w-80">
          <Card>
            <CardContent className="space-y-6">
              {/* field:parent */}
              <form.AppField
                name="parent"
                children={(field) => {
                  return <field.SelectField label="Parent Category" items={parents} />;
                }}
              />

              <form.AppForm>
                <form.SubmitButton text="Submit" />
              </form.AppForm>
            </CardContent>
          </Card>
        </div>
      </form>
    );
  },
});

export default CategoryForm;
