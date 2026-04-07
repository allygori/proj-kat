'use client';

// Reference: AGENTS.md § 3.3 — Dashboard media library grid
import { useEffect, useState } from 'react';
import { MediaItem } from './media-item';
import { getMediaAssetsAction } from '../_actions/media-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ImagePlus, RefreshCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaGridProps {
  onEdit?: (asset: any) => void;
  onSelect?: (asset: any) => void;
  selectable?: boolean;
}

export function MediaGrid({ onEdit, onSelect, selectable }: MediaGridProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await getMediaAssetsAction();
      setAssets(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter((asset: any) => 
    asset.original_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600">
        <AlertCircle className="h-10 w-10 mb-4" />
        <p className="font-semibold">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchAssets} className="mt-4">
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 border border-dashed rounded-3xl bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
        <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-6">
          <ImagePlus className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No media found</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs mb-8">
          Start by uploading clinical images, radiographs, or case study photos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid Toolbar Filter */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-[#E2EDF2] dark:bg-slate-900 dark:border-slate-800 shadow-sm sm:max-w-md">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari media (nama file, alt text)..."
          className="bg-transparent border-none focus:ring-0 text-sm flex-1 placeholder:text-slate-400 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5 pb-20">
        {filteredAssets.map((asset) => (
          <MediaItem 
            key={asset._id} 
            asset={asset} 
            onEdit={onEdit} 
            onSelect={onSelect}
            selectable={selectable}
          />
        ))}
      </div>
    </div>
  );
}
