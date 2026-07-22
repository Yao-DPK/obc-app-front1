// apps/web/src/hooks/useInscriptionForm.ts
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import type { DocumentType, inscriptionFile } from '@/types';
import {
  joueurInfoSchema,
  attestationSchema,
  type FullFormData,
  type JoueurFormData,
  type AttestationData,
} from '@/types/inscription.schema';



export function useInscriptionForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSelfManaged, setIsSelfManaged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredFiles, setRequiredFiles] = useState<inscriptionFile[]>([]);

  const form = useForm<FullFormData>({
    resolver: (step === 1 ? zodResolver(joueurInfoSchema) : zodResolver(attestationSchema)) as any,
    defaultValues: {
      gender: 'M',
      isSelfManaged: false,
      guardians: [
        { email: '', firstName: '', lastName: '', phone: '', relationship: 'Mère' },
      ],
      signatoryType: 'guardian',
      acceptedTerms: true,
      signatureFile: undefined,
    },
  });

  const { control, register, handleSubmit, formState, watch, setValue, getValues } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'guardians' });

  const onNextStep = () => {
    handleSubmit(() => setStep((prev) => prev + 1))();
  };

  const onPreviousStep = () => setStep((prev) => prev - 1);

  const updateRequiredFile = (fileType: DocumentType, file: File | null) => {
    if (file) {
      setRequiredFiles((prev) => {
        const existing = prev.find((f) => f.fileType.name === fileType.name);
        if (existing) {
          return prev.map((f) => (f.fileType.name === fileType.name ? { ...f, file } : f));
        }
        return [...prev, { fileType, file, isObligatory: true }];
      });
    } else {
      setRequiredFiles((prev) => prev.filter((f) => f.fileType.name !== fileType.name));
    }
  };

  const onSubmitFinal = async () => {
    const step1Data = getValues() as JoueurFormData;
    const step2Data = getValues() as AttestationData;
    const payload = {
      step1: step1Data,
      step2: step2Data,
      step3: {
        documents: requiredFiles.map((f) => ({ fileType: f.fileType, isObligatory: f.isObligatory })),
      },
    };
    console.log(`1`);
    const formData = new FormData();
    console.log(`2`);
    formData.append('data', JSON.stringify(payload));
    const signatureFile = getValues('signatureFile');
    if (signatureFile) formData.append('signature', signatureFile);
    console.log(`Step 3 files: ${JSON.stringify(requiredFiles)}`);
    requiredFiles.forEach((f) => {
      console.log(`Ajout ${f.fileType.name}`);
      formData.append(f.fileType.name, f.file)
    });
    console.log(`3`);
    setIsSubmitting(true);
    try {
      console.log(`4`);
      const res = await api.post('/api/inscription/pre-register', formData, /* {
        headers: { 'Content-Type': 'multipart/form-data' },
      } */);
      console.log(`res result: ${JSON.stringify(res)}`);
      console.log(`5`);
      toast.success('Inscription soumise !');
      navigate('/home');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    isSelfManaged,
    setIsSelfManaged,
    isSubmitting,
    requiredFiles,
    form: {
      register,
      control,
      handleSubmit,
      formState,
      watch,
      setValue,
      getValues,
    },
    fields,
    append,
    remove,
    onNextStep,
    onPreviousStep,
    updateRequiredFile,
    onSubmitFinal,
  };
}