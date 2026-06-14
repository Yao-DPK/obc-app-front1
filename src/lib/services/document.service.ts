import type { DocumentFile } from "@/types";
import api from "../axios";

export interface UploadDocumentPayload{
    files: DocumentFile[]
}

export const documentService = {
    async uploadDocuments(payload: FormData){
        const { data } = await api.post("/api/documents/upload", payload, {
            headers: {'Content-Type' : 'multipart/form-data'},
        });
        return { data };
    }
}