import { ComponentProps, useMemo } from 'react'
import { useFieldContext } from '../form.hook'
import { FieldInfo } from '../partials/field-info'
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/components/ui/combobox'

type SelectValueType = {
  label: string;
  value: string | number | boolean | object | null;
}

type SelectFieldProps = Omit<ComponentProps<typeof Combobox>, 'value' | 'onValueChange'> & {
  label?: string;
  description?: string;
  placeholder?: string;
  items: SelectValueType[];
};

export function SelectField({
  label,
  description,
  placeholder = "Select an option...",
  items,
  ...props
}: SelectFieldProps) {
  const field = useFieldContext<string | number | boolean | object | null>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  // Map primitive value in form state to object for Combobox
  const selectedItem = useMemo(() => {
    return items.find(item => item.value === field.state.value) ?? null
  }, [items, field.state.value])

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={field.name}>
          {label}
        </FieldLabel>
      )}
      <Combobox
        items={items}
        value={selectedItem}
        onValueChange={(item: unknown) => {
          const typedItem = item as SelectValueType | null
          field.handleChange(typedItem?.value ?? null)
        }}
        {...props}
      >
        <ComboboxInput placeholder={placeholder} />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: SelectValueType) => (
              <ComboboxItem key={item.value?.toString() || JSON.stringify(item.value)} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {description && (
        <FieldDescription>
          {description}
        </FieldDescription>
      )}
      <FieldInfo field={field} />
    </Field>
  )
}
