import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../form.hook'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { ComponentProps } from 'react'


type InputFieldProps = {
  label?: string;
  description?: string;
  props: ComponentProps<"input">;
}

export function InputField({ label, description, props }: InputFieldProps) {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label}
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        {...props}
      />
      {
        description && (
          <FieldDescription>
            {description}
          </FieldDescription>
        )
      }
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}