// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="text-center text-sm text-muted-foreground fixed bottom-0 left-0 right-0 bg-white z-50 shadow-md py-6 border-t border-border/30">
      &copy; {new Date().getFullYear()} Olympic Basket-ball Center – Tous droits réservés
    </footer>
  );
}