import React from 'react';
import { Block, Content, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";
import RenderBlock from "../render-block";
import { cn } from "@/lib/utils";

type QuoteProps = {
  content?: Content[];
  properties?: Properties;
  children?: Block[];
}

const Quote = ({ content = [], properties = {}, children }: QuoteProps) => {

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
    <>
      <blockquote 
        className={cn("my-6 border-l-4 border-slate-300 pl-4 py-1 text-lg italic text-slate-600 bg-slate-50 rounded-r-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400", alignClass)} 
        style={customStyle}
      >
        {content.length > 0 ? RenderInlineContent(content) : <br />}
      </blockquote>

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

export default Quote;
