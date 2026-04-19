import { Block, Content, TableContent } from "../types";
import Heading from "./heading/block";
import Paragraph from "./paragraph/block";
import ImageBlock from "./image/block";
import Quote from "./quote/block";
import TableBlock from "./table/block";
import { ListItem } from "./list/block";

type RenderBlockProps = {
  block: Block;
}

const RenderBlock = ({ block }: RenderBlockProps) => {
  if (!block) return null;

  switch(block.type) {
    case 'paragraph':
      return (
        <Paragraph
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    case 'heading':
      return (
        <Heading 
          key={block.id} 
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    case 'image':
      return (
        <ImageBlock
          key={block.id}
          properties={block.props}
          children={block.children}
        />
      );
    case 'quote':
      return (
        <Quote
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    case 'table':
      return (
        <TableBlock
          key={block.id}
          content={block.content as TableContent}
          properties={block.props}
          children={block.children}
        />
      );
    case 'bulletListItem':
    case 'numberedListItem':
      // Fallback single render if called directly outside of a list group
      return (
        <ListItem 
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    default:
      console.warn(`BlockNote Renderer: Unknown block type "${block.type}" encountered.`);
      return null;
  }
}

export default RenderBlock;