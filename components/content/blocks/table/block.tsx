import React from 'react';
import { TableContent, TableCell, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";
import { cn } from "@/lib/utils";

type TableBlockProps = {
  content?: TableContent;
  properties?: Properties;
}

const TableBlock = ({ content, properties = {} }: TableBlockProps) => {

  if (!content) return null;

  const headerRows = content.headerRows || 0;
  const headerCols = content.headerCols || 0;

  const renderCell = (cell: TableCell) => {
    const cellStyle: React.CSSProperties = {};
    if (cell.props?.textColor && cell.props.textColor !== "default") {
      cellStyle.color = cell.props.textColor;
    }
    if (cell.props?.backgroundColor && cell.props.backgroundColor !== "default") {
      cellStyle.backgroundColor = cell.props.backgroundColor;
    }

    const alignClass = cell.props?.textAlignment
      ? `text-${cell.props.textAlignment}`
      : "text-left";

    return {
      content: cell.content.length > 0 ? RenderInlineContent(cell.content) : <br />,
      style: cellStyle,
      alignClass,
      colspan: cell.props?.colspan || 1,
      rowspan: cell.props?.rowspan || 1,
    };
  };

  return (
    <div className="w-full overflow-x-auto my-8">
      <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-800 text-sm md:text-base">
        {headerRows > 0 && (
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            {content.rows.slice(0, headerRows).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cell, cellIndex) => {
                  const { content: cellContent, style, alignClass, colspan, rowspan } = renderCell(cell);
                  return (
                    <th
                      key={cellIndex}
                      colSpan={colspan}
                      rowSpan={rowspan}
                      className={cn("p-3 md:p-4 font-semibold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800", alignClass)}
                      style={style}
                    >
                      {cellContent}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
        )}
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {content.rows.slice(headerRows).map((row, rowIndex) => (
            <tr key={rowIndex} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
              {row.cells.map((cell, cellIndex) => {
                const { content: cellContent, style, alignClass, colspan, rowspan } = renderCell(cell);
                const isHeaderCol = cellIndex < headerCols;

                if (isHeaderCol) {
                  return (
                    <th
                      key={cellIndex}
                      colSpan={colspan}
                      rowSpan={rowspan}
                      className={cn("p-3 md:p-4 font-semibold bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 align-top", alignClass)}
                      style={style}
                    >
                      {cellContent}
                    </th>
                  );
                }

                return (
                  <td
                    key={cellIndex}
                    colSpan={colspan}
                    rowSpan={rowspan}
                    className={cn("p-3 md:p-4 border border-slate-200 dark:border-slate-800 align-top text-slate-700 dark:text-slate-300", alignClass)}
                    style={style}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableBlock;
