import type { DocumentFile } from "@/types";
import api from "../axios";

export interface UploadDocumentPayload{
    files: DocumentFile[]
}

export const inscriptionService = {
    async validateRegistration(userId: number){
        console.log("Validatiing Registration");
        const { data } = await api.patch(`/api/inscription/validate/${userId}`)
        return { data };
    }
}