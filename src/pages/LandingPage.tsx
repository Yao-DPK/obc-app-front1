import { AnimatePresence, motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  UserPlus,
  Upload,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/stores/useAuth';
import logo from '@/assets/OBC.png';

// ========== COMPOSANTS INTERNES ==========

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
    {children}
  </h2>
);

const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-12">
    {children}
  </p>
);

// ========== COMPOSANT PRINCIPAL ==========

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const navLinks = [
    { label: 'Fonctionnement', href: '#how-it-works' },
    { label: 'Documents', href: '#documents' },
    { label: 'Tarifs', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ====== HEADER ====== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 flex-shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="OBC" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/home" 
              className="text-sm text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Acceuil
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              to="/register" 
              className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              S'inscrire
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-gray-700 hover:text-primary font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    to="/home"
                    className="block w-full text-center text-gray-700 hover:text-primary font-medium py-2.5 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Acceuil
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-primary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ====== HERO ====== */}
      <section id="hero" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              Inscrivez votre enfant
              <span className="block text-secondary">en toute simplicité</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-lg">
              Gérez les inscriptions, les documents et les paiements en un seul endroit. 
              Une plateforme pensée pour les parents et les joueurs du centre OBC.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                  Commencer l'inscription
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <UserPlus className="h-20 w-20 mx-auto text-primary/60" />
                <p className="text-lg font-medium text-gray-600">Inscription en 3 étapes</p>
                <p className="text-sm text-muted-foreground">Informations • Attestation • Documents</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FONCTIONNEMENT ====== */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle>Comment ça marche ?</SectionTitle>
          <SectionSubtitle>
            L'inscription se fait entièrement en ligne. Suivez les étapes et finalisez en quelques minutes.
          </SectionSubtitle>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: <FileText className="h-8 w-8 text-primary" />,
                title: 'Informations personnelles',
                description: 'Remplissez les informations du joueur (nom, date de naissance, contact, scolarité) et celles des parents ou tuteurs.',
              },
              {
                step: '2',
                icon: <CheckCircle className="h-8 w-8 text-primary" />,
                title: 'Attestation et règlement',
                description: 'Lisez et acceptez les conditions générales. Choisissez le signataire (parent ou joueur) et téléchargez la signature scannée.',
              },
              {
                step: '3',
                icon: <Upload className="h-8 w-8 text-primary" />,
                title: 'Documents obligatoires',
                description: 'Téléversez les pièces justificatives : extrait de naissance, photo d\'identité, et tout autre document requis.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-t-4 border-t-primary">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary/30">{item.step}</span>
                      <div className="p-2 rounded-lg bg-primary/10">{item.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Une fois l'inscription soumise, elle sera validée par l'administration du club. Vous serez informé par email.
            </p>
          </div>
        </div>
      </section>

      {/* ====== DOCUMENTS REQUIS ====== */}
      <section id="documents" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <SectionTitle>Documents requis</SectionTitle>
          <SectionSubtitle>
            Pour finaliser l'inscription, vous devez fournir les documents suivants.
          </SectionSubtitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {
            // TODO: Récuperer ces informations depuis le backend
            [
              {
                icon: <FileText className="h-6 w-6 text-primary" />,
                label: 'Extrait de naissance',
                details: 'Copie scannée ou photo claire',
              },
              {
                icon: <FileText className="h-6 w-6 text-primary" />,
                label: "Photo d'identité",
                details: 'Format passeport, fond clair',
              },
              {
                icon: <FileText className="h-6 w-6 text-primary" />,
                label: 'Signature de l\'attestation',
                details: 'Signature manuscrite scannée (PDF ou image)',
              },
              /* {
                icon: <FileText className="h-6 w-6 text-primary" />,
                label: 'Certificat médical',
                details: 'À fournir avant le début des entraînements',
              }, */
            ].map((doc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">{doc.icon}</div>
                    <div>
                      <p className="font-medium text-primary">{doc.label}</p>
                      <p className="text-xs text-muted-foreground">{doc.details}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Formats acceptés : PDF, JPG, JPEG, PNG (max 5 Mo par fichier).
            </p>
          </div>
        </div>
      </section>

      {/* ====== TARIFS ET MODALITÉS ====== */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle>Tarifs et modalités</SectionTitle>
          <SectionSubtitle>
            Les frais d'inscription et de fonctionnement sont détaillés ci-dessous.
          </SectionSubtitle>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-2 border-primary/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-primary">Inscription annuelle</h3>
                </div>
                <p className="text-3xl font-bold text-primary">50 000 FCFA</p>
                <p className="text-sm text-muted-foreground">
                  Frais d'inscription pour la saison (valable du 1er septembre au 30 juillet).
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-primary">Mensualité</h3>
                </div>
                <p className="text-3xl font-bold text-secondary">15 000 FCFA / mois</p>
                <p className="text-sm text-muted-foreground">
                  À payer au plus tard le 05 du mois en cours. Frais d'entraînement et d'encadrement.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ⚠️ Les paiements sont à effectuer via la plateforme (Orange Money, Wave, ou carte bancaire) ou en contactant directement l'administration du centre.<br/>
              Un suivi des paiements est disponible dans votre espace personnel.
            </p>
          </div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white md:text-4xl font-bold mb-4">
            Prêt à inscrire votre enfant ?
          </h2>
          <p className="text-lg text-white/80 max-w-lg mx-auto mb-8">
            Lancez-vous dès maintenant, l'inscription ne prend que quelques minutes.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              Commencer l'inscription
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="OBC" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">OBC</span>
            </div>
            <p className="text-sm text-gray-400">
              Olympic Basket Center – Riviera Palmeraie, Abidjan.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/home" className="hover:text-white transition">Acceuil</a></li>
              <li><Link to="/register" className="hover:text-white transition">Inscription</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Connexion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                05 54 76 78 48
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                informations.obc@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                Riviera Palmeraie, Villa 763
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Horaires</h4>
            <ul className="space-y-1 text-sm">
              <li>Lun – Ven : 14h – 20h</li>
              <li>Sam : 09h – 18h</li>
              <li>Dim : Fermé</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © 2025 Olympic Basket Center – Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}