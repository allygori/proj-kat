import { Block } from "../../types";

export type ListType = "bulletListItem" | "numberedListItem" | "checkListItem";

export type ListGroupType = {
  isListGroup: true;
  type: ListType;
  items: Block[];
  id: string; // generating a unique ID based on the first item
};

export type GroupedBlock = Block | ListGroupType;

/**
 * Group contiguous list items together natively mapping into ul/ol.
 * Note: ToggleListItem does not need sibling grouping since it's fundamentally
 * a standalone `<details>` item in BlockNote rather than a strict <ul> item.
 */
export const groupBlocks = (blocks: Block[]): GroupedBlock[] => {
  const grouped: GroupedBlock[] = [];
  let currentList: ListGroupType | null = null;

  for (const block of blocks) {
    if (
      block.type === 'bulletListItem' ||
      block.type === 'numberedListItem' ||
      block.type === 'checkListItem'
    ) {
      if (currentList && currentList.type === block.type) {
        currentList.items.push(block);
      } else {
        if (currentList) grouped.push(currentList);
        currentList = {
          isListGroup: true,
          type: block.type as ListType,
          items: [block],
          id: `list-group-${block.id}`
        };
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
