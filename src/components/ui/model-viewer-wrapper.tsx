import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import * as errorReporter from '@/lib/errorReporter';
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
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Only attempt to load model-viewer on the client and if it's not already registered.
    if (typeof window === 'undefined') return;
    try {
      if (customElements.get('model-viewer')) return;
      const existingScript = document.getElementById('model-viewer-script') as HTMLScriptElement | null;
      if (existingScript) return;
      const script = document.createElement('script');
      script.id = 'model-viewer-script';
      script.type = 'module';
      // Use CDN ESM build
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.onload = () => {
        // model-viewer registers itself when the script loads
      };
      script.onerror = (err) => {
        (errorReporter as any)?.capture?.(err);
        if (isMountedRef.current) {
          setLoadError('Failed to load 3D viewer library.');
        }
        console.info('Failed to load @google/model-viewer from CDN', err);
      };
      document.head.appendChild(script);
    } catch (err) {
      (errorReporter as any)?.capture?.(err as any);
    }
  }, []);
  useEffect(() => {
    // Use a global ref-counted guard so multiple mounted instances don't stomp on each other.
    const globalKey = '__modelViewerConsoleSuppress';
    const win = (window as any);
    const patterns = [
      'Falling back to next ar-mode',
      'Request to present in WebXR denied',
      '[WARNING] {}',
      '[CONSOLE ERROR]',
      'model-viewer.min.js',
      '"response": {}',
    ];

    const shouldSuppress = (firstArg?: any) => {
      try {
        if (firstArg == null) return false;
        if (typeof firstArg === 'string') {
          for (const p of patterns) {
            if (firstArg.includes(p)) return true;
          }
          return false;
        }
        let s: string;
        try {
          s = JSON.stringify(firstArg);
        } catch (e) {
          s = String(firstArg);
        }
        for (const p of patterns) {
          if (s.includes(p)) return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    };

    if (!win[globalKey]) {
      win[globalKey] = {
        count: 0,
        originalWarn: console.warn,
        originalError: console.error,
      };
    }
    const state = win[globalKey] as {
      count: number;
      originalWarn: typeof console.warn;
      originalError: typeof console.error;
    };

    state.count = (state.count || 0) + 1;

    // Only override when the first instance mounts.
    if (state.count === 1) {
      console.warn = (...args: any[]) => {
        try {
          if (shouldSuppress(args[0])) return;
        } catch (e) {
          // fall through
        }
        state.originalWarn.apply(console, args);
      };
      console.error = (...args: any[]) => {
        try {
          if (shouldSuppress(args[0])) return;
        } catch (e) {
          // fall through
        }
        state.originalError.apply(console, args);
      };
    }

    return () => {
      // Decrement and restore originals when no instances remain.
      state.count = Math.max(0, (state.count || 1) - 1);
      if (state.count === 0) {
        try {
          console.warn = state.originalWarn;
          console.error = state.originalError;
        } catch (e) {
          // ignore restore errors
        }
        try {
          delete win[globalKey];
        } catch (e) {
          win[globalKey] = undefined;
        }
      }
    };
  }, []);
  const handleLoad = useCallback(() => {
    if (isMountedRef.current) {
      setIsLoading(false);
    }
  }, []);
  const handleError = useCallback(async (event: Event) => {
    const baseErr = new Error(`Model-viewer error for src: ${src}`);
    (errorReporter as any)?.capture?.(baseErr);
    // Attempt to distinguish network/CORS issues by performing a HEAD request.
    try {
      const resp = await fetch(src, { method: 'HEAD', mode: 'cors' });
      if (!resp.ok) {
        (errorReporter as any)?.capture?.(new Error(`HEAD request failed with status ${resp.status} for ${src}`));
        if (isMountedRef.current) {
          setIsLoading(false);
          setLoadError(`Failed to fetch 3D model: HTTP ${resp.status}`);
        }
      } else {
        // HEAD succeeded but model-viewer still errored.
        if (isMountedRef.current) {
          setIsLoading(false);
          setLoadError('Failed to load 3D model. Check file integrity or supported formats.');
        }
      }
    } catch (fetchErr) {
      // Likely network or CORS error (TypeError), treat as CORS-blocked for user-friendly messaging.
      (errorReporter as any)?.capture?.(fetchErr as any);
      if (isMountedRef.current) {
        setIsLoading(false);
        setLoadError('Model blocked by CORS—host the file on a public CDN with Access-Control-Allow-Origin: *');
      }
    }
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
  }, [viewerRef, handleLoad, handleError, handleProgress]);
  const viewerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: theme.backgroundColor || 'transparent',
    '--ar-button-display': 'none', // Hide default button
  } as any), [theme.backgroundColor]);
  const { autoRotate, cameraControls, ar, arModes, shadowIntensity, exposure } = config;
  const computedArModes = useMemo(() => {
    if (!ar) return '';
    if (typeof window === 'undefined') return arModes || '';
    const isSecureContext = window.isSecureContext;
    const hasXR = (navigator as any).xr && typeof (navigator as any).xr.isSessionSupported === 'function';
    if (isSecureContext && hasXR) {
      return arModes || 'webxr scene-viewer quick-look';
    }
    if (ar) {
      console.info('AR support is unavailable in this browser or context. Requires a secure (HTTPS) connection and WebXR support.');
    }
    return '';
  }, [ar, arModes]);
  const viewerProps = useMemo(() => ({
    src,
    poster,
    alt: alt || '3D Model',
    'auto-play': autoPlay,
    'auto-rotate': autoRotate || autoPlay,
    'camera-controls': cameraControls,
    ar: computedArModes ? true : undefined,
    'ar-modes': computedArModes,
    'shadow-intensity': shadowIntensity,
    exposure: exposure,
    loading: 'eager' as const,
    'crossorigin': 'anonymous',
  }), [src, poster, alt, autoPlay, autoRotate, cameraControls, computedArModes, shadowIntensity, exposure]);
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
        {...viewerProps}
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