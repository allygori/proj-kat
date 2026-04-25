import React, { useMemo } from "react";
import { Block } from "./types";
import RenderBlock from "./blocks/render-block";
import { groupBlocks } from "./blocks/list/group-blocks";
import ListGroupBlock from "./blocks/list/list-group/block";

type ContentBlocksProps = {
  blocks: Block[];
}

const ContentBlocks = ({ blocks = [] }: ContentBlocksProps) => {
  const groupedBlocks = useMemo(() => groupBlocks(blocks), [blocks]);

  return (
    <article className="max-w-3xl mx-auto px-6 py-0 whitespace-pre-wrap break-words">
      <div className="prose prose-lg dark:prose-invert font-sans text-[#41474f] dark:text-slate-300 leading-relaxed space-y-8 max-w-none">
        {
          groupedBlocks.map((group) => {
            if ('isListGroup' in group) {
              return (
                <ListGroupBlock
                  key={group.id}
                  group={group}
                />
              );
            }

            return <RenderBlock key={group.id} block={group} />
          })
        }
      </div>
    </article>
  )
}

export default ContentBlocks;