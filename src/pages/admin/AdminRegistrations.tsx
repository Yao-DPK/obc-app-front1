import { PageHeader } from '@/components/ui/PageHeader';
import { RegistrationTable } from '@/components/ui/RegistrationTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminRegistrations() {
  return (
    <div className="space-y-8 mb-20">
      <PageHeader
        title="Gestion des inscriptions"
        description="Validez ou rejetez les demandes d'inscription des joueurs"
      />
      
      <Tabs defaultValue="pre_inscrit" className="w-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-xl">
          <TabsTrigger 
            value="pre_inscrit" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-700 rounded-lg transition-all duration-300 flex items-center gap-2 py-2.5"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">En attente</span>
            <span className="sm:hidden">Attente</span>
          </TabsTrigger>
          <TabsTrigger 
            value="inscrit" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-700 rounded-lg transition-all duration-300 flex items-center gap-2 py-2.5"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Validées</span>
            <span className="sm:hidden">Validées</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rejeté" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 rounded-lg transition-all duration-300 flex items-center gap-2 py-2.5"
          >
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Rejetées</span>
            <span className="sm:hidden">Rejetées</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pre_inscrit" className="mt-6">
          <RegistrationTable status="pre_inscrit" />
        </TabsContent>
        
        <TabsContent value="inscrit" className="mt-6">
          <RegistrationTable status="inscrit" />
        </TabsContent>
        
        <TabsContent value="rejeté" className="mt-6">
          <RegistrationTable status="rejeté" />
        </TabsContent>
      </Tabs>
    </div>
  );
}