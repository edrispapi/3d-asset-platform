import '@/lib/errorReporter';
import { enableMapSet } from "immer";

import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import { ModelManager } from '@/pages/dashboard/ModelManager';
import { ModelDetail } from '@/pages/dashboard/ModelDetail';
import { UserManagement } from '@/pages/dashboard/UserManagement';
import { Settings } from '@/pages/dashboard/Settings';
import { EmbedViewer } from '@/pages/embed/EmbedViewer';
import { Login } from '@/pages/auth/Login';
import { Toaster } from '@/components/ui/sonner';
import { useAppStore } from './lib/store';
export const PrivateRoute: React.FC = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const ErrorFallback: React.FC = () => {
  return <div role="alert">An unexpected error occurred. Please try again later.</div>;
};

const AppInitializer: React.FC = () => {
  useEffect(() => {
    useAppStore.getState().checkAuth();
  }, []);
  return <Outlet />;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppInitializer />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <PrivateRoute />,
        children: [
          {
            element: <DashboardLayout />,
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
                element: <Settings />,
              }
            ]
          }
        ]
      },
      {
        path: "/embed/:id",
        element: <EmbedViewer />,
      }
    ]
  }
]);
const RootApp: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors closeButton theme="dark" />
    </>
  );
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RootApp />
    </ErrorBoundary>
  </StrictMode>,
);