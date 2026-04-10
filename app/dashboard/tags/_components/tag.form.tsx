"use client";

import { withForm } from "@/components/form/form.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

type FormProps = {
  title?: string;
};

const CategoryForm = withForm({
  defaultValues: {
    name: "",
    slug: "",
    description: "",
  },
  props: {
    title: undefined,
  } as FormProps,
  render: function Render({ form, title }) {

    return (
      <form
        id="tag-form"
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
