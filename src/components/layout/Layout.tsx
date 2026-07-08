// src/components/layout/Layout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';
import logo from '/src/assets/OBC.png';
import { SidebarContent } from './SidebarContent';

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      {/* Mobile header with logo and menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent mobile onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 pt-16 md:pt-0">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main
          id="main-content"
          className="flex-1 p-4 md:p-6 overflow-y-auto"
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer placé après le contenu principal */}
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}