# AetherLens - 3D Asset Management & WebAR Platform

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/edrispapi/3d-asset-platform)

AetherLens is a sophisticated, visually immersive web platform designed for businesses to manage, visualize, and distribute 3D product models. It serves as a bridge between static e-commerce and spatial computing. The platform consists of two distinct environments: a secure, feature-rich Admin Dashboard for managing 3D assets (GLB/GLTF), generating embed codes, and managing customer accounts; and a high-performance, lightweight Public Viewer that renders interactive 3D models with Augmented Reality (AR) capabilities using Google's `<model-viewer>` technology. The system is built on Cloudflare's Edge network, ensuring low-latency delivery of asset metadata. The UI prioritizes a 'dark mode' aesthetic common in 3D software, utilizing glassmorphism, subtle gradients, and precise typography to frame the 3D content beautifully.

## Key Features

- **Admin Dashboard**: Secure login, customer account management, 3D model uploads (GLB/GLTF), and product metadata editing.
- **Model Management**: CRUD operations for 3D assets with grid/list views and upload via URL or file drop.
- **Embed Code Generation**: Produce unique iframe embeds for seamless integration into external websites.
- **Interactive 3D Viewer**: Full-screen AR-ready viewer with orbit controls, zoom, rotation, and AR triggers (WebXR compatible).
- **Responsive Design**: Mobile-first layout with collapsible sidebar navigation and flawless cross-device support.
- **Persistent Storage**: Backend powered by Cloudflare Durable Objects for metadata and configuration persistence.
- **AR Integration**: One-tap AR viewing using Google's Model Viewer for real-world product placement.
- **Visual Excellence**: Dark theme with glassmorphism effects, smooth animations, and professional typography.

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS v3, shadcn/ui (Radix UI primitives), Framer Motion for animations, Lucide React icons.
- **3D & AR**: @google/model-viewer for WebGL rendering and AR support.
- **Backend**: Hono (lightweight web framework), Cloudflare Workers for API routing.
- **Storage & Persistence**: Cloudflare Durable Objects for entity-based data management (models, users, configs).
- **State Management**: Zustand for lightweight, performant state handling.
- **Utilities**: clsx, tailwind-merge, Zod for validation, Sonner for toasts, Date-fns for utilities.
- **Development**: Vite for fast bundling, TypeScript for type safety, ESLint for linting.

## Installation

This project uses Bun as the package manager for faster performance. Ensure you have Bun installed (v1.0+).

1. Clone the repository:
   ```
   git clone <repository-url>
   cd aether-lens-3d
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up environment variables (if needed for production):
   - Copy `.env.example` to `.env` and configure any required values (e.g., API keys for external services).

4. Generate Cloudflare Worker types:
   ```
   bun run cf-typegen
   ```

The project is now ready for development.

## Usage

### Running the Application

- **Development Server** (Frontend + Worker proxy):
  ```
  bun run dev
  ```
  The app will be available at `http://localhost:3000`. The backend API is proxied through Vite for seamless development.

- **Preview Build**:
  ```
  bun run preview
  ```
  Serves the production build at `http://localhost:4173`.

### Core Workflows

1. **Admin Access**:
   - Navigate to the landing page and log in (initial demo uses mock auth; extend for real JWT/OAuth).
   - Use the dashboard to upload 3D models via URL or file (simulated upload in Phase 1).

2. **Model Upload**:
   - In the dashboard, click "Upload Model" and provide a GLB/GLTF URL (e.g., from a public CDN).
   - Metadata (title, description) is saved to Durable Objects.

3. **Embed Generation**:
   - Select a model in the detail view.
   - Customize viewer settings (e.g., auto-rotate, lighting).
   - Copy the generated `<iframe>` code for embedding in external sites.

4. **Public Viewer**:
   - Use the embed URL (e.g., `/viewer/:modelId`) in an iframe.
   - Users can interact with the 3D model and activate AR on supported devices (iOS Safari, Chrome).

### API Endpoints

The backend exposes RESTful APIs via Cloudflare Workers. All responses follow `ApiResponse<T>` format.

- `GET /api/models`: List models (paginated).
- `POST /api/models`: Create a new model.
- `GET /api/models/:id`: Fetch model details.
- `DELETE /api/models/:id`: Delete a model.
- `GET /api/viewer/:id`: Public viewer config (read-only).

Extend routes in `worker/user-routes.ts` using the entity pattern from `worker/entities.ts`.

## Development

### Project Structure

- **Frontend (`src/`)**:
  - `pages/`: Route components (e.g., `HomePage.tsx`, `Dashboard.tsx`).
  - `components/ui/`: shadcn/ui primitives (do not modify).
  - `components/layout/`: Reusable layouts like `AppLayout.tsx`.
  - `hooks/`: Custom hooks (e.g., `use-theme.ts`).
  - `lib/`: Utilities like `api-client.ts` for API calls.

- **Backend (`worker/`)**:
  - `index.ts`: Main Hono app (do not modify).
  - `user-routes.ts`: Add custom API routes here.
  - `entities.ts`: Define entities (e.g., `ModelEntity`) extending `IndexedEntity`.
  - `core-utils.ts`: Core Durable Object utilities (do not modify).

- **Shared (`shared/`)**:
  - `types.ts`: TypeScript interfaces for API and data models.

### Adding Features

1. **New Entity** (e.g., for Models):
   - Extend `IndexedEntity` in `worker/entities.ts`.
   - Add CRUD routes in `worker/user-routes.ts` using helpers like `ok()`, `bad()`.

2. **Frontend Integration**:
   - Use `api()` from `src/lib/api-client.ts` for backend calls.
   - Leverage shadcn/ui components (import from `@/components/ui/*`).
   - For 3D rendering: Import `<model-viewer>` and configure with props like `src`, `ar`, `auto-rotate`.

3. **State Management**:
   - Use Zustand stores for global state (select primitives only to avoid re-renders).
   - Example: `const models = useStore(s => s.models);`

4. **Styling**:
   - Tailwind CSS with dark mode support.
   - Use `cn()` utility for conditional classes.
   - Follow UI non-negotiables: Root wrapper with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

5. **Testing**:
   - Lint: `bun run lint`.
   - No E2E tests pre-configured; add Vitest or Playwright as needed.

### Common Pitfalls

- Ensure CORS is enabled for external 3D file hosts (GLB URLs).
- Avoid infinite loops: Follow Zustand primitive selector rules and React effect patterns.
- For AR: Test on real devices (iOS 12+, Android Chrome 81+); GLB files must be CORS-enabled.

## Deployment

Deploy to Cloudflare Workers for global edge execution with Durable Objects for persistence.

1. **Build the Project**:
   ```
   bun run build
   ```
   This generates static assets in `dist/` and bundles the worker.

2. **Configure Wrangler**:
   - Edit `wrangler.jsonc` only for bindings/migrations (do not modify core structure).
   - Set account-specific values if needed (e.g., custom domains).

3. **Deploy**:
   ```
   bun run deploy
   ```
   This uploads the worker and assets to Cloudflare. The app will be live at your worker's URL (e.g., `https://aether-lens-3d.your-subdomain.workers.dev`).

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/edrispapi/3d-asset-platform)

### Post-Deployment

- **Custom Domain**: Use Wrangler to bind a custom domain via `wrangler deploy --config wrangler.toml`.
- **Environment Variables**: Set secrets in the Cloudflare dashboard (e.g., for auth tokens).
- **Monitoring**: Enable observability in `wrangler.jsonc`; view logs in Cloudflare dashboard.
- **Scaling**: Durable Objects handle state automatically; no manual sharding needed.

For production, ensure 3D assets are hosted on a CORS-enabled CDN (e.g., Cloudflare R2) to optimize loading.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Follow TypeScript and ESLint rules. Focus on visual excellence and performance.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, open a GitHub issue. For commercial support or custom features, contact the development team.