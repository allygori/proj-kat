import { FieldError } from "@/components/ui/field"
import { AnyFieldApi } from "@tanstack/react-form"

export const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {
        field.state.meta.isTouched && !field.state.meta.isValid
          ? field.state.meta.errors.map((err) => (
              <FieldError key={err.message} errors={err.message} />
              // <em key={err.message}>{err.message}</em>
            ))
          : null
      }
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

