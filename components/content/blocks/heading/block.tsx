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

// Split heading styles into spacing (margin) and typography (font, tracking)
// so toggleable headings can move the margin to the <details> wrapper
const HEADING_STYLES: Record<number, { spacing: string; typography: string }> = {
  1: { spacing: "mt-10 mb-4", typography: "text-4xl lg:text-5xl font-extrabold tracking-tight" },
  2: { spacing: "mt-8 mb-4", typography: "text-3xl font-bold tracking-tight border-b pb-2" },
  3: { spacing: "mt-8 mb-3", typography: "text-2xl font-semibold tracking-tight" },
  4: { spacing: "mt-6 mb-2", typography: "text-xl font-semibold tracking-tight" },
  5: { spacing: "mt-6 mb-2", typography: "text-lg font-semibold tracking-tight" },
  6: { spacing: "mt-6 mb-2", typography: "text-base font-semibold tracking-tight" },
};

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

  const styles = HEADING_STYLES[level] || HEADING_STYLES[1];

  // When isToggleable is true, wrap in a native <details>/<summary> element
  // This mirrors BlockNote's ToggleWrapper behavior
  if (properties.isToggleable) {
    return (
      // Spacing (margin) lives on the outer <details> so the chevron aligns with text
      <details className={cn("group", styles.spacing)} open>
        <summary className="cursor-pointer list-none flex gap-2 items-center [&::-webkit-details-marker]:hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-transform duration-200 group-open:rotate-90 text-slate-400 shrink-0"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          {/* Typography only — no margin on the heading tag itself */}
          <Tag className={cn(styles.typography, alignClass, "text-slate-900 dark:text-slate-50")} style={customStyle}>
            {content.length > 0 ? RenderInlineContent(content) : <br />}
          </Tag>
        </summary>
        {children && children.length > 0 && (
          <div className="pl-7 space-y-2 mt-2">
            {children.map((child: Block) => (
              <RenderBlock key={child.id} block={child} />
            ))}
          </div>
        )}
      </details>
    );
  }

  // Non-toggleable: both spacing and typography on the heading tag
  return (
    <Tag className={cn(styles.spacing, styles.typography, alignClass, "text-slate-900 dark:text-slate-50")} style={customStyle}>
      {content.length > 0 ? RenderInlineContent(content) : <br />}
    </Tag>
  );
}

export default Heading;