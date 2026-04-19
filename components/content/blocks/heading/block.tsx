import React from 'react';
import { Block, Content, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";
import RenderBlock from "../render-block";
import { cn } from "@/lib/utils";

type HeadingProps = {
  content?: Content[];
  properties?: Properties;
  children?: Block[];
}

const Heading = ({ content = [], properties = {}, children }: HeadingProps) => {

  const customStyle: React.CSSProperties = {};
  if (properties.textColor && properties.textColor !== "default") {
    customStyle.color = properties.textColor;
  }
  if (properties.backgroundColor && properties.backgroundColor !== "default") {
    customStyle.backgroundColor = properties.backgroundColor;
  }

  const level = properties.level || 1;
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const alignClass = properties.textAlignment 
    ? `text-${properties.textAlignment}` 
    : "text-left";

  let sizeClass = "";
  switch(level) {
    case 1: sizeClass = "text-4xl lg:text-5xl font-extrabold tracking-tight mt-10 mb-4"; break;
    case 2: sizeClass = "text-3xl font-bold tracking-tight mt-8 mb-4 border-b pb-2"; break;
    case 3: sizeClass = "text-2xl font-semibold tracking-tight mt-8 mb-3"; break;
    case 4: sizeClass = "text-xl font-semibold tracking-tight mt-6 mb-2"; break;
    case 5: sizeClass = "text-lg font-semibold tracking-tight mt-6 mb-2"; break;
    case 6: sizeClass = "text-base font-semibold tracking-tight mt-6 mb-2"; break;
    default: sizeClass = "text-4xl font-extrabold mt-10 mb-4";
  }

  return (
    <>
      <Tag className={cn(sizeClass, alignClass, "text-slate-900 dark:text-slate-50")} style={customStyle}>
        {content.length > 0 ? RenderInlineContent(content) : <br />}
      </Tag>

      {/* Render nested blocks if any */}
      {children && children.length > 0 && (
        <div className="pl-6 space-y-2">
          {children.map((child: Block) => (
            <RenderBlock key={child.id} block={child} />
          ))}
        </div>
      )}
    </>
  )
}

export default Heading;