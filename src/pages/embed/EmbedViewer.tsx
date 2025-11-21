import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModelViewerWrapper } from '@/components/ui/model-viewer-wrapper';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Model3D } from '@/lib/types';
import { api } from '@/lib/api-client';
export function EmbedViewer() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model3D | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) {
      setError('No model ID provided.');
      setLoading(false);
      return;
    }
    const fetchModelData = async () => {
      try {
        setLoading(true);
        const modelData = await api<Model3D>(`/api/viewer/${id}`);
        setModel(modelData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model.');
      } finally {
        setLoading(false);
      }
    };
    fetchModelData();
  }, [id]);
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  if (error || !model) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 p-4 text-center">
        <AlertTriangle className="w-12 h-12 mb-4 text-yellow-500" />
        <h2 className="text-xl font-bold text-zinc-200">Model Not Found</h2>
        <p className="mt-2">{error || 'The requested 3D asset could not be loaded.'}</p>
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