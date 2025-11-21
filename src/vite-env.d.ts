/// <reference types="vite/client" />
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
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
        'camera-orbit'?: string;
        'camera-target'?: string;
        'field-of-view'?: string;
        'max-camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'max-field-of-view'?: string;
        'min-field-of-view'?: string;
        'interpolation-decay'?: number;
        autoplay?: boolean;
        style?: React.CSSProperties;
      },
      HTMLElement
    >;
  }
}