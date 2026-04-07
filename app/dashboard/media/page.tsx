'use client';

// Reference: AGENTS.md § 3.3 — Media library dashboard page integration
import { useState } from 'react';
import { MediaGrid } from './_components/media-grid';
import { MediaUploadDialog } from './_components/media-upload-dialog';
import { MediaDetailsSheet } from './_components/media-details-sheet';
import { LayoutGrid, Images, Trash2, Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MediaPage() {
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    setSheetOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFB] dark:bg-slate-950 p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      {/* Dental Library Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em] animate-in slide-in-from-left-4 duration-500">
            <Images className="h-4 w-4" />
            Clinical Assets
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
             Media Library
          </h1>
          <p className="text-slate-500 font-medium max-w-lg dark:text-slate-400">
             Manage Clinical Case Studies, Clinical Opini, and Multimedia Content for the Blog.
          </p>
        </div>
        
        <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-500">
           <MediaUploadDialog />
        </div>
      </div>

      {/* Main View Port */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-white dark:bg-slate-900 border border-[#E2EDF2] dark:border-slate-800 p-1 rounded-full h-11">
            <TabsTrigger value="all" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-wider">
              <LayoutGrid className="mr-2 h-4 w-4" /> Semua Media
            </TabsTrigger>
            <TabsTrigger value="trash" className="rounded-full px-6 data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all font-bold text-xs uppercase tracking-wider disabled:opacity-50">
              <Trash2 className="mr-2 h-4 w-4" /> Tempat Sampah
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0 focus-visible:outline-none">
          <MediaGrid onEdit={handleEdit} />
        </TabsContent>
        
        <TabsContent value="trash" className="mt-0 focus-visible:outline-none">
           <div className="flex flex-col items-center justify-center p-24 border border-dashed rounded-3xl bg-slate-50 dark:bg-slate-900">
              <Trash2 className="h-10 w-10 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium italic">Trashed assets will appear here (Future Update)</p>
           </div>
        </TabsContent>
      </Tabs>

      {/* Sheet for editing details */}
      <MediaDetailsSheet 
        asset={editingAsset} 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </div>
  );
}
