import  { Button } from "@/components/ui/button";
import  { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2, Upload, File } from "lucide-react";
import { useState } from "react";

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (userId: number, file: File, docType: string) => Promise<void>;
  userId: number;
  docType: string;
  isUploading?: boolean;
}

export function UploadDocumentModal({ open, onOpenChange, onUpload, userId, docType, isUploading = false }: UploadDocumentModalProps){
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        await onUpload(userId, selectedFile, docType);
        setSelectedFile(null);
    };
  
    return(
        <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Télécharger un document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="file">Fichier *</Label>
              <div className="relative">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:text-sm file:font-medium file:bg-primary/10 file:text-primary file:border-0 file:rounded-md hover:file:bg-primary/20"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Formats acceptés : PDF, JPG, PNG, DOC, DOCX
              </p>
              {selectedFile && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                  <File className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {(selectedFile.size / 1024).toFixed(1)} Ko
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-red-500"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setSelectedFile(null);
                }}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="gap-2 w-full sm:w-auto"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Télécharger
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
}