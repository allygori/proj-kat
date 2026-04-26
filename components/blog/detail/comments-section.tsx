import { User, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function CommentsSection() {
  return (
    <section className="mt-24 max-w-3xl mx-auto px-6">
      <h3 className="font-sans text-2xl font-bold mb-10 text-[#191c1f] dark:text-white">
        Reflections & Discussion
      </h3>

      <div className="space-y-10">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e7e8ec] dark:bg-slate-700 shrink-0 flex items-center justify-center">
            <User className="h-6 w-6 text-[#717880] dark:text-slate-400" />
          </div>
          <div className="flex-1 bg-white dark:bg-slate-900 border border-[#e7e8ec] dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-sans font-bold text-sm text-[#191c1f] dark:text-white">
                Marcus Thorne
              </span>
              <span className="text-xs text-[#717880] dark:text-slate-400 font-medium">
                2 days ago
              </span>
            </div>
            <p className="font-sans text-[#41474f] dark:text-slate-300">
              Truly fascinating to see the clinical link between inflammation and CRP levels. This makes my quarterly cleanings feel much more essential than just &apos;getting my teeth polished.&apos;
            </p>
            <button className="mt-4 text-xs font-semibold text-[#00466e] dark:text-sky-300 uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              <Reply className="h-3.5 w-3.5" /> Reply
            </button>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <label className="block font-sans font-bold text-sm mb-4 text-[#191c1f] dark:text-white">
            Add your perspective
          </label>
          <Textarea 
            className="w-full rounded-2xl bg-[#edeef2] dark:bg-slate-800 border-none focus-visible:ring-2 focus-visible:ring-[#00466e]/20 p-6 min-h-[120px] text-[#41474f] dark:text-slate-200"
            placeholder="Share your thoughts..."
          />
          <div className="flex justify-end pt-2">
            <Button className="bg-linear-to-br from-[#00466e] to-[#1b5e8c] text-white px-8 py-6 h-auto rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 border-none">
              Post Comment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
