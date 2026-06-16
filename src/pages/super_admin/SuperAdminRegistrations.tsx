// src/pages/admin/AdminRegistrations.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { RegistrationTable } from '@/components/ui/RegistrationTable';

export default function SuperAdminRegistrations() {
  return (
    <div className="space-y-6 mb-20">
      <PageHeader
        title="Gestion des inscriptions"
        description="Validez ou rejetez les demandes d'inscription des joueurs"
      />
      <RegistrationTable status="pre_inscrit"/>
      <RegistrationTable status="inscrit"/>
      <RegistrationTable status="rejeté"/>
    </div>
  );
}