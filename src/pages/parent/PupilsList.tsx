// apps/web/src/pages/dashboard/ParentDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, FileText, CreditCard, Info, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChildAvatar } from '@/components/CustomChildAvatar';
import { useNavigate } from 'react-router-dom';
import { useGuardianStore } from '@/stores/useGuardianStore';
import { useAuth } from '@/stores/useAuth';


export default function PupilsList() {
  const { players, getMyPlayers } = useGuardianStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getMyPlayers();
  }, [user])

  const getAge = (birthDate?: string | null): number | null => {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

  // Couleur de statut (badge)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validé':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Validé</span>;
      case 'pré-inscrit':
        return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">📋 Pré-inscrit</span>;
      case 'attestation_signée':
        return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✍️ Attestation</span>;
      default:
        return null;
    }
  };

  function handleDocuments(id: number): void {
    navigate(`${id}/documents`)
  }

  function handleInfos(id: number): void {
    navigate(`${id}/infos`)
  }

  function handlePayments(id: number): void {
    navigate(`${id}/payments`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      <PageHeader
        title="Mes enfants"
        description="Retrouvez toutes les informations et actions pour chacun de vos enfants"
      />

      {players.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun enfant enregistré.</p>
            <p className="text-sm text-muted-foreground">
              Contactez l'administration pour associer un enfant à votre compte.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {players.map((child) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Avatar */}
                    <ChildAvatar photoUrl={child.photoUrl || null} firstName={child.firstName!} lastName={child.lastName!} sexe={child.gender! as "M"|"F"}  />

                  {/* Infos enfant */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-primary truncate">
                        {child.firstName} {child.lastName}
                      </p>
                      {getStatusBadge(child.registrationStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getAge(child.birthDate)} ans • {child.class}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Version desktop : boutons séparés */}
                    <div className="hidden sm:flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-blue-600 hover:bg-blue-50" title="Documents" onClick={() => handleDocuments(child.id)}>
                        <FileText className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-green-600 hover:bg-green-50" title="Paiements" onClick={() => handlePayments(child.id)}>
                        <CreditCard className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-purple-600 hover:bg-purple-50" title="Informations personnelles" onClick={() => handleInfos(child.id)}>
                        <Info className="h-5 w-5" />
                      </Button>

                    </div>

                    {/* Version mobile : menu compact */}
                    <div className="sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleDocuments(child.id)}>
                            <FileText className="h-4 w-4 mr-2" /> Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePayments(child.id)}>
                            <CreditCard className="h-4 w-4 mr-2" /> Paiements
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleInfos(child.id)}>
                            <Info className="h-4 w-4 mr-2" /> Infos personnelles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}