/**
 * src/components/ErrorFallback.tsx
 *
 * A simple, generic error fallback component to be used across the app.
 * - Does not rely on React Router hooks.
 * - Accessible (role="alert", aria-live).
 * - Small, centered, and styled with Tailwind CSS.
 *
 * Props:
 *  - message?: string        -> Primary error message (defaults to a generic message)
 *  - details?: string        -> Optional smaller details text (non-sensitive)
 *  - onRetry?: () => void    -> Optional retry handler rendered as a button
 *
 * This file is TypeScript + React and intended to be production-ready and type-safe.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
export interface ErrorFallbackProps {
  /**
   * Optional title (some error boundaries pass a title separate from message)
   */
  title?: string;
  /**
   * Primary error message shown to the user.
   */
  message?: string;
  /**
   * Optional supplementary details. Should not contain sensitive info.
   */
  details?: string;
  /**
   * Optional status message (e.g., HTTP status text).
   */
  statusMessage?: string;
  /**
   * The original error object if provided.
   */
  error?: unknown;
  /**
   * Optional retry handler (e.g., re-fetch or reset). If provided, a retry button is shown.
   */
  onRetry?: () => void;
  /**
   * Optional go home handler (e.g., navigate to root). If provided, a secondary button is shown.
   */
  onGoHome?: () => void;
}
/**
 * ErrorFallback
 *
 * Generic UI to display when an unexpected error occurs.
 * It intentionally avoids any React Router-specific hooks so it can be used anywhere.
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title,
  message = 'An unexpected error occurred.',
  statusMessage,
  details,
  error,
  onRetry,
  onGoHome,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full flex items-center justify-center p-6"
    >
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm px-6 py-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title ?? message}
        </h2>
        {statusMessage ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{statusMessage}</p>
        ) : details ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{details}</p>
        ) : (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Please try again or contact support if the problem persists.
          </p>
        )}
        {onRetry || onGoHome ? (
          <div className="mt-4 flex items-center justify-center space-x-3">
            {onRetry ? (
              <Button variant="default" onClick={onRetry}>
                Try again
              </Button>
            ) : null}
            {onGoHome ? (
              <Button variant="default" onClick={onGoHome}>
                Go home
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default ErrorFallback;