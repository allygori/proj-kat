'use client';

// Reference: AGENTS.md § 3.3 & 3.5 — Media upload dialog component
import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadMediaAction } from '../_actions/media-actions';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function MediaUploadDialog() {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (files: FileList) => {
    setIsUploading(true);
    setProgress(10);

    try {
      const results = [];
      const total = files.length;

      for (let i = 0; i < total; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const result = await uploadMediaAction(formData);
        results.push(result);
        setProgress(Math.round(((i + 1) / total) * 100));
      }

      toast.success(`${results.length} files uploaded successfully.`, {
        description: 'New media assets are now available in the library.',
      });
      setOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to upload files', {
        description: 'Check your connection and try again.',
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processUpload(e.dataTransfer.files);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isUploading && setOpen(v)}>
      <DialogTrigger render={
        <Button className="rounded-full px-6 bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload
        </Button>
      } />
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
              <UploadCloud className="h-5 w-5 text-primary" />
            </div>
            Media Library Upload
          </DialogTitle>
          <DialogDescription className="pb-4 border-b border-[#E2EDF2] pt-2">
            Upload clinical case photos, radiographs, or product images for the dental blog.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "group relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all cursor-pointer",
              isDragOver ? "border-primary bg-sky-50 dark:bg-sky-900/10" : "border-[#E2EDF2] hover:border-sky-300 bg-slate-50 dark:bg-slate-900/50 hover:bg-sky-50 dark:hover:bg-sky-900/10",
              isUploading && "pointer-events-none opacity-60"
            )}
          >
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />

            <div className={cn(
              "p-4 rounded-full bg-white dark:bg-slate-800 shadow-xl mb-4 transition-transform group-hover:scale-110 duration-500",
              isUploading ? "animate-pulse" : ""
            )}>
              {isUploading ? (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              ) : (
                <UploadCloud className="h-10 w-10 text-primary" />
              )}
            </div>

            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
              {isUploading ? 'Menunggah File...' : 'Drag and drop or Upload a file'}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              SVG, PNG, JPG or PDF (max 2.5MB)
            </p>

            {isUploading && (
              <div className="absolute inset-x-8 bottom-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between text-xs font-bold text-primary mb-2 uppercase tracking-tight">
                  <span>Uploading Files</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-200 dark:bg-slate-800" />
              </div>
            )}
          </div>
        </div>

        {!isUploading && (
          <div className="bg-slate-50 dark:bg-slate-900/80 p-6 flex justify-between items-center border-t border-[#E2EDF2] dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Vercel Blob Storage Active
            </div>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="rounded-full text-slate-600">
              Batal
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
