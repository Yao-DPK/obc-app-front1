// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { Toaster } from 'sonner';

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}