'use client';

// Reference: AGENTS.md § 3.3 — Reusable media selector modal
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaGrid } from './media-grid';
import { ImagePlus, CheckCircle2 } from 'lucide-react';
import { MediaUploadDialog } from './media-upload-dialog';

interface MediaPickerModalProps {
  title?: string;
  description?: string;
  trigger?: React.ReactElement;
  onSelect: (asset: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MediaPickerModal({
  title = "Pilih Media",
  description = "Pilih file dari media library atau unggah baru untuk konten klinis.",
  trigger,
  onSelect,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: MediaPickerModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const handleSelect = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] flex flex-col p-0 border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-[#F8FAFB] dark:bg-slate-950/50 border-b border-[#E2EDF2] dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
             <div>
               <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                 <ImagePlus className="h-6 w-6 text-primary" />
                 {title}
               </DialogTitle>
               <DialogDescription className="pt-1.5 font-medium text-slate-500">
                 {description}
               </DialogDescription>
             </div>
             <MediaUploadDialog />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <MediaGrid 
            selectable 
            onSelect={(asset) => setSelectedAsset(asset)} 
            // selectedId={selectedAsset?._id}
          />
        </div>

        <DialogFooter className="p-8 border-t border-[#E2EDF2] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
             {selectedAsset ? (
               <span className="flex items-center gap-2 text-primary animate-in fade-in slide-in-from-left-2 transition-all">
                 <CheckCircle2 className="h-4 w-4" /> 1 File Terpilih: {selectedAsset.original_name}
               </span>
             ) : (
               'Belum ada media terpilih'
             )}
           </div>
           
           <div className="flex items-center gap-3">
             <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl text-xs font-bold uppercase tracking-widest px-6 h-11 text-slate-500">
               Batal
             </Button>
             <Button 
               onClick={handleSelect} 
               disabled={!selectedAsset}
               className="rounded-xl bg-primary shadow-xl shadow-primary/20 h-11 px-8 text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:scale-100"
             >
               Gunakan Media Ini
             </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
