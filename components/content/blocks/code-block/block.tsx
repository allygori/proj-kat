import React from 'react';
import { Content, Properties } from "../../types";
import RenderInlineContent from "../../render-inline-content";

type CodeBlockProps = {
  content?: Content[];
  properties?: Properties;
}

const CodeBlock = ({ content = [], properties = {} }: CodeBlockProps) => {
  const language = properties.language || "text";

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 select-none">
        <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
          {language}
        </span>
        <div className="flex gap-1.5 opacity-60">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-800 dark:text-slate-300 whitespace-pre">
        <code className={`language-${language} block min-w-full`} data-language={language}>
          {content.length > 0 ? RenderInlineContent(content) : <br />}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
