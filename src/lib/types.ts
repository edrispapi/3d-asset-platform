/**
 * AetherLens Type Definitions
 */
export interface ViewerConfig {
  autoRotate: boolean;
  cameraControls: boolean;
  shadowIntensity: number;
  exposure: number;
  ar: boolean;
  arModes: string;
}
export interface Model3D {
  id: string;
  title: string;
  url: string;
  posterUrl?: string;
  createdAt: number;
  config: ViewerConfig;
  size?: string; // Human readable size e.g. "12MB"
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
}
export const DEFAULT_VIEWER_CONFIG: ViewerConfig = {
  autoRotate: true,
  cameraControls: true,
  shadowIntensity: 1,
  exposure: 1,
  ar: true,
  arModes: 'webxr scene-viewer quick-look',
};