import { createFormHook } from '@tanstack/react-form'
import { lazy } from 'react'
// import { fieldContext, formContext, useFormContext } from './form-context.tsx'
import { createFormHookContexts } from '@tanstack/react-form'



export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()


const TextField = lazy(() => import('../form/fields/input').then(m => ({ default: m.InputField })))
const TextareaField = lazy(() => import('../form/fields/textarea').then(m => ({ default: m.TextareaField })))
const SelectField = lazy(() => import('../form/fields/select').then(m => ({ default: m.SelectField })))
const MultiselectField = lazy(() => import('../form/fields/multiselect').then(m => ({ default: m.MultiselectField })))
const DateTimeField = lazy(() => import('../form/fields/input-date-time').then(m => ({ default: m.InputDateTimeField })))
const TextEditorField = lazy(() => import('../form/fields/text-editor').then(m => ({ default: m.TextEditorField })))

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
    SelectField,
    MultiselectField,
    DateTimeField,
    TextEditorField
  },
  formComponents: {
    // SubscribeButton,
    SubmitButton,
  },
  fieldContext,
  formContext,
})