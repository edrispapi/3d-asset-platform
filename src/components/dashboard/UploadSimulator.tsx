import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, UploadCloud, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface UploadSimulatorProps {
  onUpload: (data: { title: string; url: string }) => Promise<void>;
}
export function UploadSimulator({ onUpload }: UploadSimulatorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedUrl = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (droppedUrl && (droppedUrl.endsWith('.glb') || droppedUrl.endsWith('.gltf'))) {
      setUrl(droppedUrl);
      setTitle(droppedUrl.split('/').pop()?.replace(/\.(glb|gltf)$/, '') || 'New Model');
      toast.info('Model URL detected from drop.');
    } else {
      toast.error('Invalid drop. Please drop a valid GLB/GLTF file URL.');
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error('Please provide both a title and a URL.');
      return;
    }
    setIsUploading(true);
    try {
      await onUpload({ title, url });
      setIsDialogOpen(false);
      setTitle('');
      setUrl('');
    } catch (error) {
      // Error toast is handled in the store
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border-none">
          <Plus className="w-4 h-4 mr-2" />
          Add Model
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New 3D Model</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter a URL or drag and drop a URL to a GLB/GLTF file.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors",
              isDragging ? "border-blue-500 bg-blue-950/30" : "border-zinc-700 hover:border-zinc-600"
            )}
          >
            <UploadCloud className="w-10 h-10 text-zinc-500 mb-2" />
            <p className="text-sm text-zinc-400">Drag & drop a URL here</p>
            <p className="text-xs text-zinc-600">or enter manually below</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-zinc-300">Model Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vintage Chair" className="bg-zinc-900 border-zinc-800 focus:border-blue-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-zinc-300">GLB File URL</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-zinc-900 border-zinc-800 focus:border-blue-500" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isUploading} className="bg-blue-600 hover:bg-blue-500 text-white">
            {isUploading ? 'Adding...' : 'Add Asset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}