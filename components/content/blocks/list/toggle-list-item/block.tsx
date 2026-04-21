import React from 'react';
import { Block, Content, Properties } from "../../../types";
import RenderInlineContent from "../../../render-inline-content";
import RenderBlock from "../../render-block";
import { cn } from "@/lib/utils";

type ToggleListItemProps = {
  content?: Content[];
  properties?: Properties;
  children?: Block[];
}

const ToggleListItem = ({ content = [], properties = {}, children }: ToggleListItemProps) => {
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

  return (
    <details className="my-2 group" style={customStyle}>
      <summary className={cn("cursor-pointer list-none flex gap-2 items-center text-slate-800 dark:text-slate-200 font-medium", alignClass)}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="transition-transform duration-200 group-open:rotate-90 text-slate-500 shrink-0"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span className="inline-block leading-relaxed">
          {content.length > 0 ? RenderInlineContent(content) : <br />}
        </span>
      </summary>
      
      {/* Render nested blocks natively inside the dropdown body */}
      {children && children.length > 0 && (
        <div className="mt-2 pl-6 space-y-2">
          {children.map((child: Block) => (
            <RenderBlock key={child.id} block={child} />
          ))}
        </div>
      )}
    </details>
  );
};

export default ToggleListItem;
