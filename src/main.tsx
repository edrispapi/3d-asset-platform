import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import { ModelManager } from '@/pages/dashboard/ModelManager';
import { ModelDetail } from '@/pages/dashboard/ModelDetail';
import { UserManagement } from '@/pages/dashboard/UserManagement';
import { EmbedViewer } from '@/pages/embed/EmbedViewer';
import { Login } from '@/pages/auth/Login';
import { Toaster } from '@/components/ui/sonner';
import { useAppStore } from './lib/store';
const PrivateRoute: React.FC = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/models" replace />
          },
          {
            path: "models",
            element: <ModelManager />,
          },
          {
            path: "models/:id",
            element: <ModelDetail />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "settings",
            element: <div className="p-4 text-zinc-400">Settings module coming soon.</div>
          }
        ]
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
);