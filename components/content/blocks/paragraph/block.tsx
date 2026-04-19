import { Block, Content, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";
import RenderBlock from "../render-block";
import { cn } from "@/lib/utils";

type ParagraphProps = {
  content?: Content[];
  properties?: Properties;
  children?: Block[];
}

const Paragraph = ({ content = [], properties = {}, children }: ParagraphProps) => {

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
      <p
        className={cn("py-1 leading-relaxed text-slate-800 dark:text-slate-200", alignClass, content.length > 0 ? "my-2" : "my-0")}
        style={customStyle}
      >
        {content.length > 0 ? RenderInlineContent(content) : <br />}
      </p>

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

export default Paragraph;