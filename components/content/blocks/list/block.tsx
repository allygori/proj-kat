import React from 'react';
import { Block, Content, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";
import RenderBlock from "../render-block";
import { cn } from "@/lib/utils";

type ListItemProps = {
  content?: Content[];
  properties?: Properties;
  children?: Block[];
}

export const ListItem = ({ content = [], properties = {}, children }: ListItemProps) => {
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
        <div className="mt-2 space-y-2">
          {children.map((child: Block) => (
            <RenderBlock key={child.id} block={child} />
          ))}
        </div>
      )}
    </li>
  );
};

type ListGroupProps = {
  type: "bulletListItem" | "numberedListItem";
  items: Block[];
}

export const ListGroup = ({ type, items }: ListGroupProps) => {
  const Tag = type === "numberedListItem" ? "ol" : "ul";
  const listClass = type === "numberedListItem" ? "list-decimal marker:text-slate-500" : "list-disc marker:text-slate-400";

  return (
    <Tag className={cn("my-4 pl-6 space-y-2", listClass)}>
      {items.map((item) => (
        <ListItem 
          key={item.id} 
          content={item.content as Content[]} 
          properties={item.props} 
          children={item.children} 
        />
      ))}
    </Tag>
  );
}
