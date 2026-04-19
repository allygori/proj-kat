import React from 'react';
import { Block, TableContent, InlineContent, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";
import RenderBlock from "../render-block";
import { cn } from "@/lib/utils";

type TableBlockProps = {
  content?: TableContent;
  properties?: Properties;
  children?: Block[];
}

const TableBlock = ({ content, properties = {}, children }: TableBlockProps) => {

  if (!content) return null;

  const headerRows = content.headerRows || 0;

  return (
    <div className="w-full overflow-x-auto my-8">
      <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-800 text-sm md:text-base">
        {headerRows > 0 && (
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            {content.rows.slice(0, headerRows).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cellContent: InlineContent[], cellIndex: number) => (
                  <th key={cellIndex} className="p-3 md:p-4 font-semibold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
                    {cellContent.length > 0 ? RenderInlineContent(cellContent) : <br />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {content.rows.slice(headerRows).map((row, rowIndex) => (
            <tr key={rowIndex} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
              {row.cells.map((cellContent: InlineContent[], cellIndex: number) => {
                const headerCols = content.headerCols || 0;
                const isHeaderCol = cellIndex < headerCols;
                
                if (isHeaderCol) {
                  return (
                    <th key={cellIndex} className="p-3 md:p-4 font-semibold bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 align-top">
                      {cellContent.length > 0 ? RenderInlineContent(cellContent) : <br />}
                    </th>
                  );
                }

                return (
                  <td key={cellIndex} className="p-3 md:p-4 border border-slate-200 dark:border-slate-800 align-top text-slate-700 dark:text-slate-300">
                    {cellContent.length > 0 ? RenderInlineContent(cellContent) : <br />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render nested blocks if any */}
      {children && children.length > 0 && (
        <div className="pl-6 space-y-2 mt-4">
          {children.map((child: Block) => (
            <RenderBlock key={child.id} block={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TableBlock;
