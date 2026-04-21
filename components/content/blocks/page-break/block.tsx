import React from 'react';

const PageBreakBlock = () => {
  return (
    <div className="my-10 w-full flex items-center justify-center opacity-50" style={{ pageBreakAfter: "always" }}>
      <div className="w-full border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
      <span className="absolute px-4 bg-white dark:bg-slate-950 text-xs text-slate-400 uppercase tracking-widest hidden print:block">
        Page Break
      </span>
    </div>
  );
};

export default PageBreakBlock;
