import React from 'react';
import { Block, Content, Properties } from "../../../types";
import RenderInlineContent from "../../../render-inline-content";
import RenderBlock from "../../render-block";
import { cn } from "@/lib/utils";

type BulletListItemProps = {
  content?: Content[];
  properties?: Properties;
  children?: Block[];
}

const BulletListItem = ({ content = [], properties = {}, children }: BulletListItemProps) => {
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
    <li className={cn("mb-2 text-slate-800 dark:text-slate-200", alignClass)} style={customStyle}>
      <span className="inline-block leading-relaxed">
        {content.length > 0 ? RenderInlineContent(content) : <br />}
      </span>
      {children && children.length > 0 && (
        <div className="mt-2 pl-4">
          {children.map((child: Block) => (
            <RenderBlock key={child.id} block={child} />
          ))}
        </div>
      )}
    </li>
  );
};

export default BulletListItem;
