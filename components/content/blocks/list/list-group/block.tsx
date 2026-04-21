import React from 'react';
import { ListGroupType } from "../group-blocks";
import BulletListItem from "../bullet-list-item/block";
import NumberedListItem from "../numbered-list-item/block";
import CheckListItem from "../check-list-item/block";
import { Content } from "../../../types";
import { cn } from "@/lib/utils";

type ListGroupBlockProps = {
  group: ListGroupType;
}

const ListGroupBlock = ({ group }: ListGroupBlockProps) => {
  const { type, items } = group;

  if (type === "numberedListItem") {
    return (
      <ol className="my-4 pl-6 space-y-2 list-decimal marker:text-slate-500">
        {items.map((item) => (
          <NumberedListItem 
            key={item.id} 
            content={item.content as Content[]} 
            properties={item.props} 
            children={item.children} 
          />
        ))}
      </ol>
    );
  }

  if (type === "checkListItem") {
    return (
      <ul className="my-4 pl-2 space-y-2 list-none">
        {items.map((item) => (
          <CheckListItem 
            key={item.id} 
            content={item.content as Content[]} 
            properties={item.props} 
            children={item.children} 
          />
        ))}
      </ul>
    );
  }

  // bulletListItem fallback
  return (
    <ul className="my-4 pl-6 space-y-2 list-disc marker:text-slate-400">
      {items.map((item) => (
        <BulletListItem 
          key={item.id} 
          content={item.content as Content[]} 
          properties={item.props} 
          children={item.children} 
        />
      ))}
    </ul>
  );
}

export default ListGroupBlock;
