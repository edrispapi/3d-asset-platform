/**
 * AetherLens Entities: User, Model3D, and Settings
 */
import { IndexedEntity, Entity } from "./core-utils";
import type { User, Model3D, ViewerConfig } from "@shared/types";
import { DEFAULT_VIEWER_CONFIG } from "@shared/types";
// USER ENTITY
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData: User[] = [
    { id: 'u1', name: 'Admin User', email: 'admin@aetherlens.io', role: 'admin' }
  ];
}
// MODEL ENTITY
const SEED_MODELS: Model3D[] = [
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
export class ModelEntity extends IndexedEntity<Model3D> {
  static readonly entityName = "model";
  static readonly indexName = "models";
  static readonly initialState: Model3D = {
    id: "",
    title: "",
    url: "",
    createdAt: 0,
    config: DEFAULT_VIEWER_CONFIG,
  };
  static seedData = SEED_MODELS;
}
// SETTINGS ENTITY (Singleton)
interface Settings {
  theme: string;
  arDefault: boolean;
  uploadLimit: number;
}
export class SettingsEntity extends Entity<Settings> {
  static readonly entityName = "settings";
  static readonly initialState: Settings = {
    theme: 'dark',
    arDefault: true,
    uploadLimit: 50,
  };
}