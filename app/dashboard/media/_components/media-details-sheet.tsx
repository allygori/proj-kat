'use client';

// Reference: AGENTS.md § 3.3 — Dashboard media library metadata editor
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateMediaMetadataAction } from '../_actions/media-actions';
import { toast } from 'sonner';
import { Save, ExternalLink, Database } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

interface MediaDetailsSheetProps {
  asset: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaDetailsSheet({ asset, open, onOpenChange }: MediaDetailsSheetProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    alt_text: '',
    caption: '',
    credits: '',
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        alt_text: asset.alt_text || '',
        caption: asset.caption || '',
        credits: asset.credits || '',
      });
    }
  }, [asset]);

  const handleUpdate = async () => {
    if (!asset) return;
    setIsUpdating(true);
    try {
      await updateMediaMetadataAction(asset._id, formData);
      toast.success('Metadata updated successfully');
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!asset) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] p-0 flex flex-col h-full bg-white dark:bg-slate-950 border-none shadow-2xl">
        <SheetHeader className="p-8 bg-slate-50 dark:bg-slate-900/50 border-b border-[#E2EDF2] dark:border-slate-800">
          <SheetTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            File Details
          </SheetTitle>
          <SheetDescription className="pt-1">
            Manage metadata for clinical images and media.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* File Preview Card */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-[#E2EDF2] dark:bg-slate-800 dark:border-slate-800 ring-4 ring-slate-50 dark:ring-slate-900/50">
              <Image
                src={asset.url}
                alt={asset.original_name}
                fill
                className="object-contain"
                loading="eager"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-lg bg-white/90 backdrop-blur dark:bg-slate-800/90"
                  render={<a href={asset.url} target="_blank" rel="noopener noreferrer" />}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* File Metadata Info List */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-[#F8FAFB] dark:bg-slate-900/50 p-4 rounded-xl text-xs font-medium border border-[#E2EDF2] dark:border-slate-800">
              <div className="text-slate-400">File Name</div>
              <div className="text-slate-700 dark:text-slate-300 truncate text-right">{asset.original_name}</div>
              <div className="text-slate-400">File Size</div>
              <div className="text-slate-700 dark:text-slate-300 text-right">{Math.round(asset.size / 1024)} KB</div>
              <div className="text-slate-400">MIME Type</div>
              <div className="text-slate-700 dark:text-slate-300 uppercase text-right tracking-tighter">{asset.mime_type}</div>
              <div className="text-slate-400">Diterbitkan</div>
              <div className="text-slate-700 dark:text-slate-300 text-right">{new Date(asset.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <Separator className="bg-[#E2EDF2] dark:bg-slate-800" />

          {/* Form Fields Section */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2.5">
              <Label htmlFor="alt-text" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Alt Text</Label>
              <Input
                id="alt-text"
                placeholder="Deskripsi untuk aksesibilitas..."
                className="rounded-xl bg-slate-50 border-[#E2EDF2] dark:bg-slate-900 dark:border-slate-800 h-10 ring-offset-sky-500"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              />
              <p className="text-[10px] font-medium text-slate-400 pl-1 leading-normal italic">
                Describe the clinical purpose of the image for SEO and accessibility.
              </p>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="caption" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Keterangan Gambar (Caption)</Label>
              <Textarea
                id="caption"
                placeholder="Tambahkan keterangan untuk ditampilkan di bawah gambar..."
                className="rounded-xl bg-slate-50 border-[#E2EDF2] dark:bg-slate-900 dark:border-slate-800 min-h-[80px]"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="credits" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Sumber / Kredit</Label>
              <Input
                id="credits"
                placeholder="Contoh: Dr. Elena Vance"
                className="rounded-xl bg-slate-50 border-[#E2EDF2] dark:bg-slate-900 dark:border-slate-800"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Action Footer Button Group */}
        <SheetFooter className="p-8 border-t border-[#E2EDF2] dark:border-slate-800 bg-[#F8FAFB] dark:bg-slate-900/50">
          <Button
            type="submit"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full rounded-xl bg-primary shadow-xl shadow-primary/20 h-11 text-xs font-bold uppercase tracking-widest"
          >
            {isUpdating ? (
              <Database className="mr-2 h-4 w-4 animate-pulse" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Metadata
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
