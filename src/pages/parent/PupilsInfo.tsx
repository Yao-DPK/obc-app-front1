// apps/web/src/pages/parent/ChildInfo.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import type { User } from "@/types";
import { useLoaderData } from 'react-router-dom';
import { getAge } from '@/utils/utils';


export default function ChildInfoPage() {
  const child = useLoaderData<User>();
  


  if (!child) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Enfant non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      
      <PageHeader
        title={`${child.firstName} ${child.lastName}`}
        description="Informations personnelles"
        showBack
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-green-600" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{child.firstName} {child.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sexe</p>
              <p className="font-medium">{child.gender === 'M' ? 'Garçon' : 'Fille'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(child.birthDate!).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Âge</p>
              <p className="font-medium">{getAge(child.birthDate!)} ans</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Catégorie</p>
              <p className="font-medium">{child.class}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut inscription</p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✅ Validé
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {child.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {child.phone}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {child.address}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}