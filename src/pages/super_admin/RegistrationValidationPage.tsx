// src/pages/RegistrationValidationPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, CreditCard, CheckCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CustomLoader from '@/components/CustomLoader';
import { useUserStore } from '@/stores/useUserStore';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { inscriptionService } from '@/lib/services/inscription.service';
import { PlayerInfoTab } from '@/components/validation/PlayerInfoTab';
import { PaymentTab } from '@/components/validation/PaymentTab';
import { Badge } from '@/components/ui/badge';
import { PlayerDocumentsTab } from '@/components/validation/PlayerDocumentTab';
import { useDocumentTypeStore } from '@/stores/documents/useDocumentTypeStore';

export function RegistrationValidationPage() {
  const { userId } = useParams();
  const { user, fetchUserByIdAndRole, isLoading: userLoading } = useUserStore();
  const { isLoading: docsLoading, fetchUserDocuments } = useDocumentStore();
  const { fetchDocTypes } = useDocumentTypeStore();
  const { fetchObligations } = usePaymentStore();
  const requiredDocs: string[] = ["Extrait de Naissance", "Photo"];
  const [isInfoValid, setIsInfoValid] = useState(false);
  const [isDocsValid, setIsDocsValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');

  useEffect(() => {
    if (userId) {
      fetchUserByIdAndRole(Number(userId), 'player');
      fetchUserDocuments(Number(userId)); 
      fetchObligations();
      fetchDocTypes({names: requiredDocs});
    }
  }, [userId, fetchUserByIdAndRole, fetchUserDocuments, fetchObligations]);

  if (userLoading || !user) {
    return <CustomLoader />;
  }

  const allValidated = isInfoValid && isDocsValid && isPaymentValid;

  const handleValidateRegistration = async () => {
    try {
      await inscriptionService.validateRegistration(user!.id);
      toast.success('✅ Inscription validée avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la validation');
    }
  };

  // Nombre de sections validées
  const validatedCount = [isInfoValid, isDocsValid, isPaymentValid].filter(Boolean).length;

  return (
    <div className="space-y-4 sm:space-y-8 mb-20">
      {/* ====== HEADER MOBILE COMPACT ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -ml-2"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-primary truncate max-w-[180px] sm:max-w-none">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Validation • {validatedCount}/3 sections
            </p>
          </div>
        </div>

        {/* Statut mobile (compact) */}
        <div className="flex items-center gap-2 sm:hidden">
          <div className="flex items-center gap-1">
            {[isInfoValid, isDocsValid, isPaymentValid].map((valid, i) => (
              <span
                key={i}
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition-colors',
                  valid ? 'bg-green-500' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {allValidated ? '✅ Complet' : `${validatedCount}/3`}
          </span>
        </div>

        {/* Bouton de validation (desktop) */}
        <Button
          onClick={handleValidateRegistration}
          disabled={!allValidated}
          className={cn(
            'hidden sm:flex gap-2 shadow-lg transition-all',
            allValidated
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/25'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          <CheckCircle className="h-4 w-4" />
          Valider l'inscription
        </Button>
      </div>

      {/* ====== TABS ====== */}
      <Tabs
        defaultValue="informations"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-0.5 sm:p-1 rounded-xl h-auto">
          <TabsTrigger
            value="informations"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 text-[10px] sm:text-sm"
          >
            <User className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Informations</span>
            <span className="sm:hidden text-[10px]">Infos</span>
            {isInfoValid ? (
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500" />
            ) : (
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-300" />
            )}
          </TabsTrigger>

          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 text-[10px] sm:text-sm"
          >
            <FileText className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Documents</span>
            <span className="sm:hidden text-[10px]">Docs</span>
            {isDocsValid ? (
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500" />
            ) : (
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-300" />
            )}
          </TabsTrigger>

          <TabsTrigger
            value="paiement"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 text-[10px] sm:text-sm"
          >
            <CreditCard className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Paiement</span>
            <span className="sm:hidden text-[10px]">Pay</span>
            {isPaymentValid ? (
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500" />
            ) : (
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-300" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informations" className="mt-4 sm:mt-6">
          <PlayerInfoTab
            user={user}
            onValidChange={setIsInfoValid}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-4 sm:mt-6">
          <PlayerDocumentsTab
            userId={user.id}
            isLoading={docsLoading}
            onSuccess={() => fetchUserDocuments(user.id)}
            onValidChange={setIsDocsValid}
          />
        </TabsContent>

        <TabsContent value="paiement" className="mt-4 sm:mt-6">
          <PaymentTab
            playerId={user.id}
            onValidChange={setIsPaymentValid}
          />
        </TabsContent>
      </Tabs>

      {/* ====== BOUTON DE VALIDATION MOBILE ====== */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg sm:hidden z-50">
        <Button
          onClick={handleValidateRegistration}
          disabled={!allValidated}
          className={cn(
            'w-full gap-2 py-6 text-base font-semibold transition-all',
            allValidated
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          <CheckCircle className="h-5 w-5" />
          {allValidated ? 'Valider l\'inscription' : `${validatedCount}/3 sections validées`}
        </Button>
      </div>

      {/* ====== STATUT GLOBAL (DESKTOP) ====== */}
      <div className="hidden sm:flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Statut global :</span>
          {allValidated ? (
            <Badge className="bg-green-100 text-green-700 border-green-200 text-sm px-4 py-1.5">
              ✅ Toutes les sections sont validées
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-sm px-4 py-1.5">
              ⚠️ {!isInfoValid && '• Informations '}
              {!isDocsValid && '• Documents '}
              {!isPaymentValid && '• Paiement '}
              à vérifier
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Validé
          </span>
          <span className="flex items-center gap-1 ml-2">
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            En attente
          </span>
        </div>
      </div>
    </div>
  );
}