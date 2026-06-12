import React from 'react';
import AppRoute from './routes/AppRoute';
import ErrorBoundary from './ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { Toaster } from "sonner";

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppRoute />
        <Toaster />
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;