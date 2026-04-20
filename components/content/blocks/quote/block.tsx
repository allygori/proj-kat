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
        className={cn("mt-4 mb-2 mx-4 md:mx-6 text-lg font-bold text-slate-800 dark:text-primary-foreground", alignClass)}
        style={customStyle}
      >
        {content.length > 0 ? RenderInlineContent(content) : <br />}
      </blockquote>

      <div className="mt-0 mb-4 mx-4 md:mx-6 border-b-6 border-slate-800 dark:border-primary-foreground w-1/5 md:w-1/6" />

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
