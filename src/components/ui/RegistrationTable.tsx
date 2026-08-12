import { useEffect, useState } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { useUserStore } from '@/stores/useUserStore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Users, 
  Loader2, 
  User, 
  Phone, 
  Mail,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

interface RegistrationTableProps {
  status: string;
}

// Configuration des statuts
const statusConfig = {
  pre_inscrit: {
    label: 'Pré-inscrit',
    icon: <Clock className="h-3.5 w-3.5" />,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    emptyIcon: <Clock className="h-12 w-12 text-amber-300" />,
    emptyMessage: 'Aucune inscription en attente.',
    emptySubMessage: 'Les nouvelles demandes apparaîtront ici automatiquement.',
    titleIcon: <Clock className="h-5 w-5 text-amber-500" />,
    headerColor: 'border-l-4 border-l-amber-500',
  },
  inscrit: {
    label: 'Validé',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    badgeClass: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    emptyIcon: <UserCheck className="h-12 w-12 text-green-300" />,
    emptyMessage: 'Aucune inscription validée.',
    emptySubMessage: 'Les inscriptions validées apparaîtront ici.',
    titleIcon: <UserCheck className="h-5 w-5 text-green-500" />,
    headerColor: 'border-l-4 border-l-green-500',
  },
  rejeté: {
    label: 'Rejeté',
    icon: <XCircle className="h-3.5 w-3.5" />,
    badgeClass: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    emptyIcon: <AlertCircle className="h-12 w-12 text-red-300" />,
    emptyMessage: 'Aucune inscription rejetée.',
    emptySubMessage: 'Les inscriptions rejetées apparaîtront ici.',
    titleIcon: <AlertCircle className="h-5 w-5 text-red-500" />,
    headerColor: 'border-l-4 border-l-red-500',
  },
};

export function RegistrationTable({ status }: RegistrationTableProps) {
  const { users, fetchPlayers } = useUserStore();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingUsers = users.filter((u) => u.registrationStatus === status);
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pre_inscrit;

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleValidate = async (userId: number) => {
    setLoadingId(userId);
    try {
      const selectedUser = users.find((u) => u.id === userId);
      if (!selectedUser) {
        toast.error("Cet utilisateur n'existe pas");
        return;
      }
      navigate(`validate/${userId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (userId: number) => {
    setLoadingId(userId);
    try {
      await api.patch(`/api/users/${userId}/reject-registration`);
      toast.success('Inscription rejetée');
      await fetchPlayers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPlayers();
    setIsRefreshing(false);
    toast.success('Liste actualisée');
  };

  // Animation variants
  const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: easeOut
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      delay: 0.1,
      ease: easeOut
    }
  }
};

  if (pendingUsers.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              {config.emptyIcon}
            </motion.div>
            <p className="text-lg font-semibold text-gray-700">{config.emptyMessage}</p>
            <p className="text-sm text-muted-foreground mt-1">{config.emptySubMessage}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Actualiser
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      <motion.div variants={cardVariants}>
        <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 ${config.headerColor}`}>
          <CardHeader className="pb-4 pt-5 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  {config.titleIcon}
                </div>
                <div>
                  <CardTitle className="text-xl font-heading text-primary flex items-center gap-2">
                    {status === 'pre_inscrit' && `En attente`}
                    {status === 'inscrit' && `Validées`}
                    {status === 'rejeté' && `Rejetées`}
                    <Badge variant="secondary" className="ml-2 text-sm font-normal">
                      {pendingUsers.length}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {status === 'pre_inscrit' && 'Validez ou rejetez les demandes d\'inscription.'}
                    {status === 'inscrit' && 'Liste des inscriptions déjà validées.'}
                    {status === 'rejeté' && 'Liste des inscriptions rejetées.'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-muted-foreground hover:text-primary"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Actualiser</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Version desktop : Tableau */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                    <TableHead className="text-left font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nom complet
                      </div>
                    </TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </div>
                    </TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Statut</TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {pendingUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-xs">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <span>{user.lastName} {user.firstName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate max-w-[180px]">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            {user.phone || '—'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${config.badgeClass} flex items-center gap-1.5 w-fit`}>
                            {config.icon}
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {status !== 'inscrit' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all duration-200"
                                onClick={() => handleValidate(user.id)}
                                disabled={loadingId === user.id}
                              >
                                {loadingId === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                <span className="hidden sm:inline">Valider</span>
                              </Button>
                            )}
                            {status !== 'rejeté' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="shadow-sm hover:shadow transition-all duration-200"
                                onClick={() => handleReject(user.id)}
                                disabled={loadingId === user.id}
                              >
                                {loadingId === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-1" />
                                )}
                                <span className="hidden sm:inline">Rejeter</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Version tablette : grille compacte */}
            <div className="hidden md:block lg:hidden">
              <div className="divide-y divide-gray-100">
                {pendingUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm flex-shrink-0">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-primary truncate">
                          {user.lastName} {user.firstName}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="truncate">{user.email}</span>
                          <span className="flex-shrink-0">•</span>
                          <span className="flex-shrink-0">{user.phone || '—'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <Badge variant="outline" className={`${config.badgeClass} flex items-center gap-1 text-xs`}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Version mobile : Cartes */}
            <div className="md:hidden">
              <div className="space-y-3 p-4">
                {pendingUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-100">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm flex-shrink-0">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-primary truncate">
                                {user.lastName} {user.firstName}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={`${config.badgeClass} flex items-center gap-1 text-xs flex-shrink-0`}>
                            {config.icon}
                            {config.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{user.phone || 'Téléphone non renseigné'}</span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          {status !== 'inscrit' && (
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all duration-200"
                              onClick={() => handleValidate(user.id)}
                              disabled={loadingId === user.id}
                            >
                              {loadingId === user.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Valider
                            </Button>
                          )}
                          {status == 'inscrit' && (
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all duration-200"
                              onClick={() => handleValidate(user.id)}
                              disabled={loadingId === user.id}
                            >
                              {loadingId === user.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Voir
                            </Button>
                          )}
                          {status !== 'rejeté' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 shadow-sm hover:shadow transition-all duration-200"
                              onClick={() => handleReject(user.id)}
                              disabled={loadingId === user.id}
                            >
                              {loadingId === user.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Rejeter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}