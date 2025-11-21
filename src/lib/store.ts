import { create } from 'zustand';
import { Model3D } from './types';
import { api } from './api-client';
import { toast } from 'sonner';
interface AppState {
  models: Model3D[];
  isLoading: boolean;
  error: string | null;
  fetchModels: () => Promise<void>;
  addModel: (newModelData: { title: string; url: string }) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;
  updateModel: (id: string, updates: Partial<Model3D>) => Promise<void>;
  getModel: (id: string) => Model3D | undefined;
}
export const useAppStore = create<AppState>((set, get) => ({
  models: [],
  isLoading: true,
  error: null,
  fetchModels: async () => {
    try {
      set({ isLoading: true, error: null });
      const models = await api<Model3D[]>('/api/models');
      set({ models, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch models';
      set({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
    }
  },
  addModel: async (newModelData) => {
    try {
      const newModel = await api<Model3D>('/api/models', {
        method: 'POST',
        body: JSON.stringify(newModelData),
      });
      set((state) => ({ models: [newModel, ...state.models] }));
      toast.success(`Model "${newModel.title}" added successfully.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add model';
      toast.error(errorMessage);
    }
  },
  deleteModel: async (id: string) => {
    const originalModels = get().models;
    // Optimistic update
    set((state) => ({ models: state.models.filter((m) => m.id !== id) }));
    toast.warning('Deleting model...');
    try {
      await api(`/api/models/${id}`, { method: 'DELETE' });
      toast.success('Model deleted successfully.');
    } catch (error) {
      // Revert on failure
      set({ models: originalModels });
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete model';
      toast.error(errorMessage);
    }
  },
  updateModel: async (id, updates) => {
    const originalModels = get().models;
    // Optimistic update
    set((state) => ({
      models: state.models.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
    try {
      // In a real app, you'd have a PUT/PATCH endpoint
      // await api(`/api/models/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
      console.log('Simulating model update for:', id, updates);
      toast.success('Model updated (simulated).');
    } catch (error) {
      set({ models: originalModels });
      const errorMessage = error instanceof Error ? error.message : 'Failed to update model';
      toast.error(errorMessage);
    }
  },
  getModel: (id: string) => {
    return get().models.find((m) => m.id === id);
  },
}));