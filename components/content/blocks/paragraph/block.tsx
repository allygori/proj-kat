import { Content, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";
import { cn } from "@/lib/utils";

type ParagraphProps = {
  content?: Content[];
  properties?: Properties;
}

const Paragraph = ({ content = [], properties = {} }: ParagraphProps) => {

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
    <p
      className={cn("text-slate-800 dark:text-slate-200", alignClass, content.length > 0 ? "my-2 py-1 leading-relaxed" : "my-0 leading-0.5")}
      style={customStyle}
    >
      {content.length > 0 ? RenderInlineContent(content) : <br />}
    </p>
  )
}

export default Paragraph;