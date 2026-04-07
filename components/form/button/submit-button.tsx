import { useFormContext } from '../form.hook'
import { Button } from "@/components/ui/button"

type Props = {
  text: string;
}

export const SubmitButton = ({ text }: Props) => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {
        (isSubmitting) => (
          <Button disabled={isSubmitting}>
            {text}
          </Button>
        )
      }
    </form.Subscribe>
  )
}