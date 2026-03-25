"use client"

import { useId, useMemo, useState } from 'react'

import {
  DndContext, useSensors, KeyboardSensor,
  PointerSensor,
  useSensor,
  closestCenter,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableBlockProps, BlockData, BlockType } from './types'
import SortableBlock from './dnd/sortable-block'
import CollapsiblePanel from './dnd/collapsible-panel'


type BlockFormProps = {
  blocks: SortableBlockProps[];
}

const ContentBlock = ({ blocks }: BlockFormProps) => {
  const initialData: SortableBlockProps[] = [] /** @todo fix */
  const [data, setData] = useState(() => blocks)
  const sortableId = useId()

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ block }) => block.id) || [],
    [data]
  )


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }


  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      id={sortableId}
    >
      <SortableContext
        items={data.map(({ block }) => block.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {data.map(({ block, onUpdate, onRemove }) => (
            <SortableBlock
              key={block.id}
              id={block.id}
              block={block}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default ContentBlock