import React from 'react';
import { Model3D } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Code2, Trash2, Box } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ModelViewerWrapper } from '@/components/ui/model-viewer-wrapper';
import { toast } from 'sonner';
interface ModelCardProps {
  model: Model3D;
  onDelete: (id: string) => void;
  onView: (model: Model3D) => void;
}
export function ModelCard({ model, onDelete, onView }: ModelCardProps) {
  const handleEmbedCopy = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${model.id}" width="100%" height="500px" frameborder="0" allow="camera; microphone; fullscreen; autoplay; xr-spatial-tracking"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard');
  };
  return (
    <Card className="group overflow-hidden border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10">
      <div className="aspect-[4/3] w-full relative bg-zinc-950/50 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <ModelViewerWrapper 
             src={model.url} 
             poster={model.posterUrl}
             config={{...model.config, autoRotate: false, cameraControls: false}}
             className="pointer-events-none" // Disable interaction in card preview
           />
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 z-10">
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-none"
            onClick={() => onView(model)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-zinc-100 truncate pr-4" title={model.title}>{model.title}</h3>
            <p className="text-xs text-zinc-500 mt-1">
              {new Date(model.createdAt).toLocaleDateString()} • {model.size || 'Unknown Size'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-zinc-400 hover:text-zinc-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-zinc-900 border-zinc-800 text-zinc-200">
              <DropdownMenuItem onClick={() => onView(model)} className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEmbedCopy} className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                <Code2 className="w-4 h-4 mr-2" />
                Copy Embed
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={() => onDelete(model.id)} 
                className="text-red-400 focus:bg-red-950/30 focus:text-red-300 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}