// src/components/CustomChildAvatar.tsx
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { userService } from '@/lib/services/user.service';

interface ChildAvatarProps {
  userId: number;
  firstName: string;
  lastName: string;
  sexe: 'M' | 'F';
  photoUrl?: string | null; // optionnel, si déjà disponible
}

export const ChildAvatar = ({ userId, firstName, lastName, sexe, photoUrl: initialPhotoUrl }: ChildAvatarProps) => {
  const [isFlipped, setIsFlipped] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl || null);
  const [isLoading, setIsLoading] = useState(!initialPhotoUrl);

  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  useEffect(() => {
    if (initialPhotoUrl) {
      setPhotoUrl(initialPhotoUrl);
      setIsLoading(false);
      return;
    }

    const fetchPhoto = async () => {
      setIsLoading(true);
      try {
        const { signedUrl } = await userService.fetchUserPicture(userId);
        setPhotoUrl(signedUrl);
      } catch {
        setPhotoUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchPhoto();
    }
  }, [userId, initialPhotoUrl]);

  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div
      className="relative w-14 h-14 cursor-pointer perspective-500"
      onClick={toggleFlip}
    >
      <div
        className={`w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Face avant : initiales */}
        <div className="absolute w-full h-full rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-lg backface-hidden border-2 border-green-200">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-green-700" />
          ) : (
            initials
          )}
        </div>

        {/* Face arrière : photo ou placeholder sexe */}
        <div className="absolute w-full h-full rounded-full border-2 border-green-200 overflow-hidden backface-hidden rotate-y-180">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-3xl ${
                sexe === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
              }`}
            >
              {sexe === 'M' ? '👦' : '👧'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};