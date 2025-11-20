import { create } from 'zustand';
import { Model3D, DEFAULT_VIEWER_CONFIG } from './types';
interface AppState {
  models: Model3D[];
  addModel: (model: Model3D) => void;
  deleteModel: (id: string) => void;
  updateModel: (id: string, updates: Partial<Model3D>) => void;
  getModel: (id: string) => Model3D | undefined;
}
// Initial mock data for the demo
const INITIAL_MODELS: Model3D[] = [
  {
    id: 'm1',
    title: 'Astronaut',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    posterUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.webp',
    createdAt: Date.now(),
    config: { ...DEFAULT_VIEWER_CONFIG },
    size: '2.5MB',
  },
  {
    id: 'm2',
    title: 'Neil Armstrong Spacesuit',
    url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    createdAt: Date.now() - 100000,
    config: { ...DEFAULT_VIEWER_CONFIG, autoRotate: false },
    size: '5.1MB',
  },
  {
    id: 'm3',
    title: 'Canoe',
    url: 'https://modelviewer.dev/shared-assets/models/Canoe.glb',
    createdAt: Date.now() - 200000,
    config: { ...DEFAULT_VIEWER_CONFIG },
    size: '8.2MB',
  }
];
export const useAppStore = create<AppState>((set, get) => ({
  models: INITIAL_MODELS,
  addModel: (model) => set((state) => ({ models: [model, ...state.models] })),
  deleteModel: (id) => set((state) => ({ models: state.models.filter((m) => m.id !== id) })),
  updateModel: (id, updates) =>
    set((state) => ({
      models: state.models.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  getModel: (id) => get().models.find((m) => m.id === id),
}));