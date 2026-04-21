import React from 'react';
import { Properties } from "../../types";
import { cn } from "@/lib/utils";

type VideoBlockProps = {
  properties?: Properties;
}

const VideoBlock = ({ properties = {} }: VideoBlockProps) => {
  if (!properties.url) return null;

  const alignClass = properties.textAlignment 
    ? `text-${properties.textAlignment}` 
    : "text-center";

  return (
    <figure className={cn("my-8 flex flex-col items-center", alignClass)}>
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-center">
        <video 
          controls 
          className="w-full h-auto max-h-[650px] object-contain"
          src={properties.url}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {properties.caption && (
        <figcaption className="mt-3 text-sm text-slate-500 italic text-center">
          {properties.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default VideoBlock;
