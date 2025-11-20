import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { ModelViewerWrapper } from '@/components/ui/model-viewer-wrapper';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Model3D } from '@/lib/types';
export function EmbedViewer() {
  const { id } = useParams<{ id: string }>();
  // Use getState pattern or simple selector for this one-shot read if store persistence was real.
  // Since we are using in-memory Zustand, this will only work if we navigated here from within the app
  // or if the ID matches the initial mock data.
  const getModel = useAppStore(state => state.getModel);
  const [model, setModel] = useState<Model3D | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      const found = getModel(id);
      setModel(found);
      setLoading(false);
    }
  }, [id, getModel]);
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  if (!model) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 p-4 text-center">
        <AlertTriangle className="w-12 h-12 mb-4 text-yellow-500" />
        <h2 className="text-xl font-bold text-zinc-200">Model Not Found</h2>
        <p className="mt-2">The requested 3D asset could not be loaded.</p>
      </div>
    );
  }
  return (
    <div className="w-full h-screen bg-transparent overflow-hidden">
      <ModelViewerWrapper 
        src={model.url} 
        poster={model.posterUrl}
        config={model.config}
        className="w-full h-full"
        autoPlay={true}
      />
    </div>
  );
}