// src: https://www.blocknotejs.org/docs/foundations/document-structure

export type Styles = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  textColor?: string;
  backgroundColor?: string;
  [key: string]: any;
};

export type Properties = {
  textAlignment?: "left" | "center" | "right" | "justify";
  textColor?: string;
  backgroundColor?: string;
  level?: number; 
  url?: string; 
  caption?: string;
  name?: string;
  checked?: boolean;
  language?: string; // For code blocks
  isToggleable?: boolean; // For toggleable headings (toggle wrapper)
  [key: string]: any;
};

export type Link = {
  type: "link";
  content: StyledText[];
  href: string;
};

export type StyledText = {
  type: "text";
  text: string;
  styles: Styles;
};

export type CustomInlineContent = {
  type: string;
  content: StyledText[] | undefined;
  props: Record<string, boolean | number | string>;
};

export type InlineContent = Link | StyledText | CustomInlineContent;

export type TableCell = {
  type: "tableCell";
  content: InlineContent[];
  props: {
    colspan?: number;
    rowspan?: number;
    backgroundColor?: string;
    textColor?: string;
    textAlignment?: "left" | "center" | "right" | "justify";
  };
};

export type TableContent = {
  type: "tableContent";
  columnWidths: (number | null | undefined)[];
  headerRows?: number;
  headerCols?: number;
  rows: {
    cells: TableCell[];
  }[];
};

export type Block = {
  id: string;
  type: string;
  props: Properties;
  content?: InlineContent[] | TableContent | undefined;
  children?: Block[];
};

export type Content = InlineContent;
