import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout'
import { ModelManager } from '@/pages/dashboard/ModelManager'
import { EmbedViewer } from '@/pages/embed/EmbedViewer'
import { Toaster } from '@/components/ui/sonner';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/models" replace /> // Redirect dashboard root to models for now
      },
      {
        path: "models",
        element: <ModelManager />,
      },
      {
        path: "settings",
        element: <div className="p-4 text-zinc-400">Settings module coming in Phase 3</div>
      }
    ]
  },
  {
    path: "/embed/:id",
    element: <EmbedViewer />,
    errorElement: <RouteErrorBoundary />,
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster richColors closeButton theme="dark" />
    </ErrorBoundary>
  </StrictMode>,
)