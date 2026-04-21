import { Block, Content, TableContent } from "../types";
import Heading from "./heading/block";
import Paragraph from "./paragraph/block";
import ImageBlock from "./image/block";
import Quote from "./quote/block";
import TableBlock from "./table/block";
import BulletListItem from "./list/bullet-list-item/block";
import NumberedListItem from "./list/numbered-list-item/block";
import CheckListItem from "./list/check-list-item/block";
import ToggleListItem from "./list/toggle-list-item/block";
import DividerBlock from "./divider/block";
import PageBreakBlock from "./page-break/block";
import VideoBlock from "./video/block";
import AudioBlock from "./audio/block";
import FileBlock from "./file/block";
import CodeBlock from "./code-block/block";

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
        />
      );
    case 'quote':
      return (
        <Quote
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
        />
      );
    case 'table':
      return (
        <TableBlock
          key={block.id}
          content={block.content as TableContent}
          properties={block.props}
        />
      );
    case 'bulletListItem':
      return (
        <BulletListItem 
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    case 'numberedListItem':
      return (
        <NumberedListItem 
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    case 'checkListItem':
      return (
        <CheckListItem 
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    case 'toggleListItem':
      return (
        <ToggleListItem 
          key={block.id}
          content={block.content as Content[]}
          properties={block.props}
          children={block.children}
        />
      );
    case 'divider':
      return <DividerBlock key={block.id} />;
    case 'pageBreak':
    case 'page-break':
      return <PageBreakBlock key={block.id} />;
    case 'video':
      return <VideoBlock key={block.id} properties={block.props} />;
    case 'audio':
      return <AudioBlock key={block.id} properties={block.props} />;
    case 'file':
      return <FileBlock key={block.id} properties={block.props} />;
    case 'codeBlock':
    case 'code-block':
      return (
        <CodeBlock 
          key={block.id} 
          content={block.content as Content[]} 
          properties={block.props} 
        />
      );
    default:
      console.warn(`BlockNote Renderer: Unknown block type "${block.type}" encountered.`);
      return null;
  }
}

export default RenderBlock;