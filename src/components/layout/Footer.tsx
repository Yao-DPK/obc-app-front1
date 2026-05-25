// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="text-center text-sm text-muted-foreground py-6 border-t border-border/30">
      &copy; {new Date().getFullYear()} Olympic Basket-ball Center – Tous droits réservés
    </footer>
  );
}