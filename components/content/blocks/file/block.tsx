import React from 'react';
import { Properties } from "../../types";

type FileBlockProps = {
  properties?: Properties;
}

const FileBlock = ({ properties = {} }: FileBlockProps) => {
  if (!properties.url) return null;

  const fileName = properties.name || properties.url.split('/').pop() || "Download File";

  return (
    <div className="my-6">
      <a 
        href={properties.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg shadow-sm transition-colors max-w-sm group text-decoration-none"
      >
        <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary/20 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" height="20" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            {fileName}
          </span>
          <span className="text-xs text-slate-500 uppercase font-medium mt-0.5">
            File Attachment
          </span>
        </div>
      </a>
    </div>
  );
};

export default FileBlock;
