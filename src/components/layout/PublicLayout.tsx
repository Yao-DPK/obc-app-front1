import { Outlet, Link } from 'react-router-dom';
import logo from '../../assets/OBC.png';
import { Toaster } from 'sonner';
import { Footer } from './Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <header className="bg-primary shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="LOGO OBC" className="h-10 w-auto" />
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}