// apps/web/src/pages/parent/ParentProfile.tsx
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Loader2 
} from 'lucide-react';
import { AdultAvatar } from '@/components/CustomAdultAvatar';

export default function ParentProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  

  const joinedDate = user!.createdAt ? new Date(Date.now()).toLocaleDateString('fr-FR') : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      <PageHeader
        title={`${user!.firstName || ''} ${user!.lastName || ''}`}
        description="Votre profil et vos informations personnelles"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====== CARTE PROFIL ====== */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar + Nom */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
                <AdultAvatar photoUrl={user!.photoUrl || null} firstName={user!.firstName! || "firstname"} lastName={user.lastName! || "firstname"} sexe={user!.gender! as "M"|"F"}  />
              <div>
                <h2 className="text-xl font-bold">{user!.firstName} {user!.lastName}</h2>
                <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role || 'Parent'}
                </Badge>
              </div>
            </div>

            {/* Grille d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prénom</p>
                <p className="font-medium">{user!.firstName || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{user!.lastName || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </p>
                <p className="font-medium">{user!.email || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  Téléphone
                </p>
                <p className="font-medium">{user!.phone || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Adresse
                </p>
                <p className="font-medium">{user!.address || 'Non renseignée'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====== CARTE COMPTE ====== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Rôle</p>
              <p className="font-medium capitalize">{user.role || 'Parent'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Membre depuis
              </p>
              <p className="font-medium">{joinedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                ✅ Actif
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}