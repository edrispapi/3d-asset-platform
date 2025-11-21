import "react";
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import '@google/model-viewer';
import * as errorReporter from '@/lib/errorReporter';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
import { ViewerConfig } from '@shared/types';
import { Loader2 } from 'lucide-react';
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
  const viewerRef = useRef<any>(null);
  const handleLoad = useCallback(() => setIsLoading(false), []);
  const handleError = useCallback((event: Event) => {
    errorReporter?.capture?.(new Error(`Model-viewer error for src: ${src}`));
    setIsLoading(false);
    setLoadError('Failed to load 3D model. Check URL and CORS policy.');
  }, [src]);
  const handleProgress = useCallback((event: CustomEvent) => {
    const progressBar = viewerRef.current?.querySelector('#progress-bar-fill') as HTMLElement | null;
    if (progressBar) {
      progressBar.style.width = `${event.detail.totalProgress * 100}%`;
    }
  }, []);
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);
    viewer.addEventListener('progress', handleProgress);
    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
      viewer.removeEventListener('progress', handleProgress);
    };
  }, [src, JSON.stringify(config), handleLoad, handleError, handleProgress]);
  const backgroundColor = theme.backgroundColor;
  const viewerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: backgroundColor || 'transparent',
    '--ar-button-display': 'none', // Hide default button
  }), [backgroundColor]);
  const computedArModes = useMemo(() => {
    if (!config.ar) return '';
    if (typeof window === 'undefined') return config.arModes || '';
    const secure = (window as any).isSecureContext;
    const hasXR = !!(navigator as any).xr;
    // Only enable AR modes if running in a secure context and XR is available
    if (secure && hasXR) {
      return config.arModes || '';
    }
    // Fallback to empty string to avoid enabling AR modes that aren't supported
    return '';
  }, [config.ar, config.arModes]);
  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900/50 text-red-400 h-full w-full rounded-lg border border-zinc-800 ${className}`}>
        <p className="p-4 text-center">{loadError}</p>
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
            <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1 bg-zinc-800/50 rounded-t-lg overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: '0%' }} id="progress-bar-fill"></div>
            </div>
          </div>
        </div>
      )}
      <model-viewer
        ref={viewerRef}
        src={src}
        poster={poster}
        alt={alt || '3D Model'}
        auto-play={autoPlay ? 'true' : 'false'}
        auto-rotate={(config.autoRotate || autoPlay) ? 'true' : 'false'}
        camera-controls={config.cameraControls ? 'true' : 'false'}
        ar={config.ar ? 'true' : 'false'}
        ar-modes={computedArModes}
        shadow-intensity={config.shadowIntensity != null ? String(config.shadowIntensity) : undefined}
        exposure={config.exposure != null ? String(config.exposure) : undefined}
        loading="eager"
        dev-mode="false"
        style={viewerStyle}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 flex items-center justify-center h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-lg transform transition-all active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          AR
        </button>
      </model-viewer>
    </div>
  );
}