import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'
// import { fieldContext, formContext, useFormContext } from './form-context.tsx'
import { createFormHookContexts } from '@tanstack/react-form'



export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()


const TextField = lazy(() => import('../form/fields/input').then(m => ({ default: m.InputField })))

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  )
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})