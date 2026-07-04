// apps/web/src/pages/parent/ChildInfo.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router-dom';
import { User, Calendar, Phone, Mail, MapPin } from 'lucide-react';

export const MOCK_CHILDREN = [
  {
    id: 1,
    firstName: 'Kouadio',
    lastName: 'Konan',
    sexe: 'M',
    dateNaissance: '2014-03-15',
    age: 12,
    class: 'Cadets',
    registrationStatus: 'validé',
    email: 'kouadio.konan@email.com',
    phone: '07 57 99 05 48',
    adresse: 'Riviera Palmeraie, Cité SIPIM, Abidjan',
    parent: {
      name: 'Konan Konan',
      phone: '05 54 76 78 48',
      email: 'konan.parent@email.com'
    }
  },
  {
    id: 2,
    firstName: 'Karine',
    lastName: 'Konan',
    sexe: 'F',
    dateNaissance: '2012-03-15',
    age: 14,
    class: 'Cadets',
    registrationStatus: 'validé',
    email: 'karine.konan@email.com',
    phone: '07 57 99 05 48',
    adresse: 'Riviera Palmeraie, Cité SIPIM, Abidjan',
    parent: {
      name: 'Konan Konan',
      phone: '05 54 76 78 48',
      email: 'konan.parent@email.com'
    }
  }
];

export default function ChildInfoPage() {
  const { id } = useParams<{ id: string }>();
  const childId = Number(id);
  
  const child = MOCK_CHILDREN.find((c) => c.id === childId);

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
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
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
              <p className="font-medium">{child.sexe === 'M' ? 'Garçon' : 'Fille'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(child.dateNaissance).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Âge</p>
              <p className="font-medium">{child.age} ans</p>
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
                {child.adresse}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">👨‍👩‍👦 Parent / Tuteur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{child.parent.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {child.parent.phone}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {child.parent.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}