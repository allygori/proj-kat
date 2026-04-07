'use client';

// Reference: AGENTS.md § 3.3 — Media grid item component
import Image from 'next/image';
import { MoreVertical, Copy, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteMediaAction, purgeMediaAction } from '../_actions/media-actions';
import { useRouter } from 'next/navigation';

interface MediaItemProps {
  asset: any;
  onEdit?: (asset: any) => void;
  onSelect?: (asset: any) => void;
  selectable?: boolean;
  selected?: boolean;
}

export function MediaItem({
  asset,
  onEdit,
  onSelect,
  selectable = false,
  selected = false,
}: MediaItemProps) {
  const router = useRouter();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(asset.url);
    toast.success('URL copied to clipboard');
  };

  const softDelete = async () => {
    try {
      await deleteMediaAction(asset._id);
      toast.success('Moved to trash (soft delete)');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to soft delete');
    }
  };

  const hardDelete = async () => {
    const confirm = window.confirm('DANGER: This will permanently delete the file from Vercel Blob and Database. Are you sure?');
    if (!confirm) return;

    try {
      await purgeMediaAction(asset._id);
      toast.success('Permanently deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to purge file');
    }
  };

  return (
    <div
      onClick={() => onSelect?.(asset)}
      className={cn(
        'group relative aspect-square overflow-hidden rounded-xl bg-slate-50 border transition-all cursor-pointer ring-offset-2',
        selected ? 'ring-2 ring-primary border-primary' : 'border-[#E2EDF2] hover:border-sky-300 shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-800'
      )}
    >
      {/* Thumbnail */}
      <Image
        src={asset.url}
        alt={asset.alt_text || asset.original_name}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="200px"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Action Trigger */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg bg-white/90 backdrop-blur dark:bg-slate-800/90 border-none">
              <MoreVertical className="h-4 w-4" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleCopyUrl}>
              <Copy className="mr-2 h-4 w-4" /> Salin URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(asset)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Metadata
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={softDelete} className="text-amber-600">
              <Trash2 className="mr-2 h-4 w-4" /> Ke Tempat Sampah
            </DropdownMenuItem>
            <DropdownMenuItem onClick={hardDelete} className="text-red-600 font-bold focus:bg-red-50 dark:focus:bg-red-950">
              <ShieldAlert className="mr-2 h-4 w-4" /> Permanent Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Overlay Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-bold">
        {Math.round(asset.size / 1024)} KB • {asset.mime_type.split('/')[1]}
      </div>
    </div>
  );
}
