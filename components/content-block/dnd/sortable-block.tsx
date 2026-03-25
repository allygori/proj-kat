import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type SortableBlockProps } from "../types"
import CollapsiblePanel from "./collapsible-panel"

const SortableBlock = ({
  id,
  block,
  onRemove = () => {},
  onUpdate = () => {}
}: SortableBlockProps) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: block.id
  })

  return (
    <CollapsiblePanel
      // data-state={row.getIsSelected() && "selected"}
      key={id}
      block={block}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
    </CollapsiblePanel>
  )
}

export default SortableBlock