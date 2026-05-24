import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
//import { useAuth } from './hooks/useAuth';
//import { useEffect } from 'react';


export default function App() {
  
  return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>

  );
}