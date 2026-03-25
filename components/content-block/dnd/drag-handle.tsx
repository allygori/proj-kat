import { Button } from "@/components/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { GripVertical } from "lucide-react"

const DragHandle = ({ id }: { id: string }) => {
  const { attributes, listeners } = useSortable({ id })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent cursor-grab"
    >
      <GripVertical className="size-4 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export default DragHandle;