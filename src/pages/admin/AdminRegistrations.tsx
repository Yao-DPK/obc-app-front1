// src/pages/admin/AdminRegistrations.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { RegistrationTable } from '@/components/ui/RegistrationTable';

export default function AdminRegistrations() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des inscriptions"
        description="Validez ou rejetez les demandes d'inscription des joueurs"
      />
      <RegistrationTable />
    </div>
  );
}