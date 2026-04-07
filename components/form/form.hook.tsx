import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'
// import { fieldContext, formContext, useFormContext } from './form-context.tsx'
import { createFormHookContexts } from '@tanstack/react-form'



export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()


const TextField = lazy(() => import('../form/fields/input').then(m => ({ default: m.InputField })))
const TextareaField = lazy(() => import('../form/fields/textarea').then(m => ({ default: m.TextareaField })))
const SelectField = lazy(() => import('../form/fields/select').then(m => ({ default: m.SelectField })))

const SubmitButton = lazy(() => import('../form/button/submit-button').then(m => ({ default: m.SubmitButton })))

// function SubscribeButton({ text }: { text: string }) {
//   const form = useFormContext()
//   return (
//     <form.Subscribe selector={(state) => state.isSubmitting}>
//       {(isSubmitting) => <button disabled={isSubmitting}>{text}</button>}
//     </form.Subscribe>
//   )
// }

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField
  },
  formComponents: {
    // SubscribeButton,
    SubmitButton,
  },
  fieldContext,
  formContext,
})