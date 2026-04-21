import React from 'react';
import { Properties } from "../../types";

type AudioBlockProps = {
  properties?: Properties;
}

const AudioBlock = ({ properties = {} }: AudioBlockProps) => {
  if (!properties.url) return null;

  return (
    <div className="my-6 w-full max-w-lg mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col items-center">
      {properties.name && (
        <span className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          {properties.name}
        </span>
      )}
      <audio 
        controls 
        className="w-full"
        src={properties.url}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioBlock;
