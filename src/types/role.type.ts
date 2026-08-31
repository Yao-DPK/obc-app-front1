export interface Role{
    role: string;
    translation: string;
}

export const Roles = {
    "player" : "Joueur",
    "parent" : "Parent",
    "admin" : "Administrateur",
    "super_admin": "Superviseur"
}

export const ROLE_LABELS: Record<string, string> = {
    super_admin: 'Administrateur',
    admin: 'Superviseur',
    parent: 'Parent',
    player: 'Joueur',
};