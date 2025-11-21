import { create } from 'zustand';
import { Model3D, User } from '@shared/types';
import { api } from './api-client';
import { toast } from 'sonner';
interface Settings {
  theme: string;
  arDefault: boolean;
  uploadLimit: number;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (credentials: { username: string; password?: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}
interface UserState {
  users: User[];
  isLoadingUsers: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (userData: { name: string; email: string }) => Promise<void>;
}
interface ModelState {
  models: Model3D[];
  isLoading: boolean;
  error: string | null;
  fetchModels: () => Promise<void>;
  addModel: (newModelData: { title: string; url: string }) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;
  updateModel: (id: string, updates: Partial<Model3D>) => Promise<void>;
}
interface SettingsState {
  settings: Settings;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}
type AppState = AuthState & UserState & ModelState & SettingsState;
export const useAppStore = create<AppState>((set, get) => ({
  // Auth State
  isAuthenticated: false,
  user: null,
  token: null,
  login: async (credentials) => {
    const { token, user } = await api<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('aetherlens_token', token);
    set({ isAuthenticated: true, user, token });
    await get().fetchSettings();
  },
  logout: () => {
    localStorage.removeItem('aetherlens_token');
    set({ isAuthenticated: false, user: null, token: null });
  },
  checkAuth: () => {
    const token = localStorage.getItem('aetherlens_token');
    if (token) {
      const user: User = { id: 'u1', name: 'Admin User', email: 'admin@aetherlens.io', role: 'admin' };
      set({ isAuthenticated: true, token, user });
      get().fetchSettings();
    } else {
      set({ isAuthenticated: false, token: null, user: null });
    }
  },
  // User State
  users: [],
  isLoadingUsers: true,
  fetchUsers: async () => {
    try {
      set({ isLoadingUsers: true });
      const { items: users } = await api<{ items: User[] }>('/api/users');
      set({ users, isLoadingUsers: false });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch users';
      toast.error(msg);
      set({ isLoadingUsers: false });
    }
  },
  addUser: async (userData) => {
    try {
      const newUser = await api<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      set((state) => ({ users: [...state.users, newUser] }));
      toast.success(`User "${newUser.name}" created.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create user';
      toast.error(msg);
    }
  },
  // Model State
  models: [],
  isLoading: true,
  error: null,
  fetchModels: async () => {
    try {
      set({ isLoading: true, error: null });
      const { items: models } = await api<{ items: Model3D[] }>('/api/models');
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
      throw error;
    }
  },
  deleteModel: async (id: string) => {
    const originalModels = get().models;
    set((state) => ({ models: state.models.filter((m) => m.id !== id) }));
    toast.warning('Deleting model...');
    try {
      await api(`/api/models/${id}`, { method: 'DELETE' });
      toast.success('Model deleted successfully.');
    } catch (error) {
      set({ models: originalModels });
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete model';
      toast.error(errorMessage);
    }
  },
  updateModel: async (id, updates) => {
    const originalModels = get().models;
    set((state) => ({
      models: state.models.map((m) => (m.id === id ? { ...m, ...updates, config: { ...m.config, ...updates.config } } : m)),
    }));
    try {
      const updatedModel = await api<Model3D>(`/api/models/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      set((state) => ({
        models: state.models.map((m) => (m.id === id ? updatedModel : m)),
      }));
    } catch (error) {
      set({ models: originalModels });
      const errorMessage = error instanceof Error ? error.message : 'Failed to update model';
      toast.error(errorMessage);
      throw error;
    }
  },
  // Settings State
  settings: { theme: 'dark', arDefault: true, uploadLimit: 50 },
  fetchSettings: async () => {
    try {
      const settings = await api<Settings>('/api/settings');
      set({ settings });
    } catch (error) {
      console.warn('Could not fetch settings, using defaults.');
    }
  },
  updateSettings: async (updates) => {
    const originalSettings = get().settings;
    set(state => ({ settings: { ...state.settings, ...updates } }));
    try {
      const updatedSettings = await api<Settings>('/api/settings', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      set({ settings: updatedSettings });
    } catch (error) {
      set({ settings: originalSettings });
      toast.error('Failed to update settings.');
      throw error;
    }
  },
}));
// Initialize auth state on load
useAppStore.getState().checkAuth();