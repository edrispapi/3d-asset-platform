import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { ViewerConfig } from '@/lib/types';
import { Loader2 } from 'lucide-react';
// This augmentation allows the custom element 'model-viewer' to be used in JSX.
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add custom element properties here
    src?: string;
    poster?: string;
    alt?: string;
    'auto-rotate'?: boolean;
    'camera-controls'?: boolean;
    ar?: boolean;
    'ar-modes'?: string;
    'shadow-intensity'?: number;
    exposure?: number;
    loading?: 'auto' | 'lazy' | 'eager';
    reveal?: 'auto' | 'interaction' | 'manual';
    // This is a catch-all for any other properties
    [key: string]: any;
  }
}
interface ModelViewerWrapperProps {
  src: string;
  poster?: string;
  alt?: string;
  config: ViewerConfig;
  className?: string;
  autoPlay?: boolean;
  theme?: {
    backgroundColor?: string;
  };
}
export function ModelViewerWrapper({
  src,
  poster,
  alt,
  config,
  className,
  autoPlay = false,
  theme = {},
}: ModelViewerWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const handleLoad = () => setIsLoading(false);
    const handleError = (event: Event) => {
      console.warn('Model viewer error:', event);
      setIsLoading(false);
      setLoadError('Failed to load 3D model. Check URL and CORS policy.');
    };
    const handleProgress = (event: CustomEvent) => {
      const progressBar = viewer.querySelector('#progress-bar-fill') as HTMLElement;
      if (progressBar) {
        progressBar.style.width = `${event.detail.totalProgress * 100}%`;
      }
    };
    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);
    viewer.addEventListener('progress', handleProgress);
    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
      viewer.removeEventListener('progress', handleProgress);
    };
  }, [src]);
  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900/50 text-red-400 h-full w-full rounded-lg border border-zinc-800 ${className}`}>
        <p>{loadError}</p>
      </div>
    );
  }
  return (
    <div className={`relative w-full h-full group ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-sm text-zinc-400">Loading 3D Asset...</span>
          </div>
        </div>
      )}
      <model-viewer
        ref={viewerRef}
        src={src}
        poster={poster}
        alt={alt || '3D Model'}
        auto-rotate={config.autoRotate || autoPlay}
        camera-controls={config.cameraControls}
        ar={config.ar}
        ar-modes={config.arModes}
        shadow-intensity={config.shadowIntensity}
        exposure={config.exposure}
        loading="eager"
        style={{ width: '100%', height: '100%', backgroundColor: theme.backgroundColor || 'transparent' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-lg transform transition-transform active:scale-95 opacity-0 group-hover:opacity-100"
        >
          View in AR
        </button>
        <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1 bg-zinc-800/50">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: '0%' }} id="progress-bar-fill"></div>
        </div>
      </model-viewer>
    </div>
  );
}