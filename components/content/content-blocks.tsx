import React, { useMemo } from "react";
import { Block } from "./types";
import RenderBlock from "./blocks/render-block";
import { ListGroup } from "./blocks/list/block";

type ContentBlocksProps = {
  blocks: Block[];
}

// Group contiguous list items together
const groupBlocks = (blocks: Block[]) => {
  const grouped: (Block | { isListGroup: true; type: "bulletListItem" | "numberedListItem"; items: Block[] })[] = [];
  let currentList: { isListGroup: true; type: "bulletListItem" | "numberedListItem"; items: Block[] } | null = null;

  for (const block of blocks) {
    if (block.type === 'bulletListItem' || block.type === 'numberedListItem') {
      if (currentList && currentList.type === block.type) {
        currentList.items.push(block);
      } else {
        if (currentList) grouped.push(currentList);
        currentList = { isListGroup: true, type: block.type, items: [block] };
      }
    } else {
      if (currentList) {
        grouped.push(currentList);
        currentList = null;
      }
      grouped.push(block);
    }
  }

  if (currentList) grouped.push(currentList);
  return grouped;
}

const ContentBlocks = ({ blocks = [] }: ContentBlocksProps) => {
  const groupedBlocks = useMemo(() => groupBlocks(blocks), [blocks]);

  return (
    // <div className="blocknote-content whitespace-pre-wrap break-words">
    <article className="max-w-3xl mx-auto px-6 py-12 whitespace-pre-wrap break-words">
      <div className="prose prose-lg dark:prose-invert font-sans text-[#41474f] dark:text-slate-300 leading-relaxed space-y-8 max-w-none">
        {
          groupedBlocks.map((group, idx) => {
            if ('isListGroup' in group) {
              return (
                <ListGroup
                  key={`list-group-${idx}`}
                  type={group.type}
                  items={group.items}
                />
              );
            }

            return <RenderBlock key={group.id} block={group as Block} />
          })
        }
      </div>
    </article>
    // </div>
  )
}

export default ContentBlocks;