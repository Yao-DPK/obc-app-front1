import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import CustomLoader from './components/CustomLoader';


export default function App() {
    const { restoreSession, isLoading } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) {
    return <CustomLoader />;
}

  return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>

  );
}