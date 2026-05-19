// src/components/layout/Header.tsx
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import logo from '../../assets/OBC.png'

export function Footer() {

  return (
    <footer className="text-center text-sm text-muted-foreground py-6 border-t border-border/30">
        &copy; {new Date().getFullYear()} Olympic Basket-ball Center – Tous droits réservés
      </footer>
  );
}