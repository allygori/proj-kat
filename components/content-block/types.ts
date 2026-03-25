export type BaseBlock = {
  id: string;
  version?: string;
};

export type BlockType = "heading" | "rich-text" | "banner"

export type BlockData = {
  id: string
  type: BlockType
  content: Record<string, any>
}

export type SortableBlockProps = {
  id: string
  block: BlockData
  onUpdate?: (id: string, content: string) => void
  onRemove?: (id: string) => void
}

