import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import CustomLoader from './components/CustomLoader';
import { router } from './AppRouter';


export default function App() {
    const { restoreSession, isLoading } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) {
    return <CustomLoader />;
}

  return (
    <RouterProvider router={router} />
  );
}