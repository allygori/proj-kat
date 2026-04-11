interface PostContentProps {
  htmlContent?: string;
}

export function PostContent({ htmlContent }: PostContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <div 
        className="prose prose-lg dark:prose-invert font-sans text-[#41474f] dark:text-slate-300 leading-relaxed space-y-8 max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: htmlContent || '<p class="text-center text-slate-500 italic">No content available.</p>' 
        }}
      />
    </article>
  );
}
