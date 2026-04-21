import React from 'react';
import { Block, Content, Properties } from "../../../types";
import RenderInlineContent from "../../../render-inline-content";
import RenderBlock from "../../render-block";
import { cn } from "@/lib/utils";

type CheckListItemProps = {
  content?: Content[];
  properties?: Properties;
  children?: Block[];
}

const CheckListItem = ({ content = [], properties = {}, children }: CheckListItemProps) => {
  const customStyle: React.CSSProperties = {};
  if (properties.textColor && properties.textColor !== "default") {
    customStyle.color = properties.textColor;
  }
  if (properties.backgroundColor && properties.backgroundColor !== "default") {
    customStyle.backgroundColor = properties.backgroundColor;
  }

  const alignClass = properties.textAlignment 
    ? `text-${properties.textAlignment}` 
    : "text-left";

  // checkListItem logic from BlockNote
  const isChecked = properties.checked === true;

  return (
    <li className={cn("mb-2 text-slate-800 dark:text-slate-200 flex flex-row items-baseline gap-2", alignClass)} style={customStyle}>
      <input 
        type="checkbox" 
        checked={isChecked} 
        disabled 
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-75 disabled:cursor-auto"
      />
      <div className="flex-1">
        <span className={cn("inline-block leading-relaxed", isChecked && "line-through text-slate-500 dark:text-slate-400")}>
          {content.length > 0 ? RenderInlineContent(content) : <br />}
        </span>
        {children && children.length > 0 && (
          <div className="mt-2 pl-2">
            {children.map((child: Block) => (
              <RenderBlock key={child.id} block={child} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
};

export default CheckListItem;
