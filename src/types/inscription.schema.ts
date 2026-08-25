import { z } from 'zod';

export const joueurInfoSchema = z.object({
  email: z.string().email().optional(),
  /* password: z.string().min(6).optional(),
  confirmPassword: z.string().min(6).optional(), */
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['M', 'F']),
  phone: z.string().optional(),
  address: z.string().optional(),
  school: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  isSelfManaged: z.boolean().default(false).optional(),
  guardians: z
    .array(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().optional(),
        relationship: z.enum(['Père', 'Mère', 'Tuteur']),
      })
    )
    .optional(),
})/* .refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
}) */;

export const attestationSchema = z.object({
  signatoryType: z.enum(['guardian']),
  selectedGuardianIndex: z.number().optional(),
  signatoryFullName: z.string().min(2),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions',
  }),
  signatureFile: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'Le fichier de signature est requis',
  }),
});

export type JoueurFormData = z.infer<typeof joueurInfoSchema>;
export type AttestationData = z.infer<typeof attestationSchema>;
export type FullFormData = JoueurFormData & AttestationData;