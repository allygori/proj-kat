import React from "react";
import { InlineContent, StyledText, Link as LinkType } from "./types";

const RenderInlineContent = (contents: InlineContent[] = []) => {
  return contents.map((content: InlineContent, idx: number) => {
    if (content.type === "text") {
      const textContent = content as StyledText;
      let element: React.ReactNode = textContent.text;

      // Handle basic formatting tags
      if (textContent.styles?.bold) element = <strong key={`b-${idx}`}>{element}</strong>;
      if (textContent.styles?.italic) element = <em key={`i-${idx}`}>{element}</em>;
      if (textContent.styles?.underline) element = <u key={`u-${idx}`}>{element}</u>;
      if (textContent.styles?.strike) element = <s key={`s-${idx}`}>{element}</s>;
      if (textContent.styles?.code) element = <code key={`c-${idx}`} className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm">{element}</code>;

      // Handle dynamic colors (BlockNote frequently uses specific words like "red" or "blueBackground", 
      // but inline style allows raw mapping if custom hex is provided, else standard CSS applies).
      const customStyle: React.CSSProperties = {};
      if (textContent.styles?.textColor && textContent.styles.textColor !== "default") {
        customStyle.color = textContent.styles.textColor;
      }
      if (textContent.styles?.backgroundColor && textContent.styles.backgroundColor !== "default") {
        customStyle.backgroundColor = textContent.styles.backgroundColor;
      }

      if (Object.keys(customStyle).length > 0) {
        return (
          <span key={idx} style={customStyle}>
            {element}
          </span>
        );
      }

      return <React.Fragment key={idx}>{element}</React.Fragment>;
    }

    if (content.type === "link") {
      const linkContent = content as LinkType;
      return (
        <a key={idx} href={linkContent.href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80 font-medium">
          {RenderInlineContent(linkContent.content)}
        </a>
      );
    }

    return null;
  });
};

export default RenderInlineContent;