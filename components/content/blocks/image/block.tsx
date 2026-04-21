import React from 'react';
import Image from 'next/image';
import { Properties } from "../../types";
import { cn } from "@/lib/utils";

type ImageBlockProps = {
  properties?: Properties;
}

const ImageBlock = ({ properties = {} }: ImageBlockProps) => {

  const customStyle: React.CSSProperties = {};
  
  const alignClass = properties.textAlignment 
    ? `text-${properties.textAlignment}` 
    : "text-center";

  if (!properties.url) {
    return null;
  }

  return (
    <figure className={cn("my-8 flex flex-col items-center", alignClass)} style={customStyle}>
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-slate-100 flex justify-center">
        <Image 
          src={properties.url} 
          alt={properties.caption || properties.name || "Blog image"}
          width={1200}
          height={800}
          className="w-full h-auto object-cover"
        />
      </div>
      {properties.caption && (
        <figcaption className="mt-3 text-sm text-slate-500 italic text-center">
          {properties.caption}
        </figcaption>
      )}
    </figure>
  )
}

export default ImageBlock;
