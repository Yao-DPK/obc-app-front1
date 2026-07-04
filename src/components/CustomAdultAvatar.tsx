import { useState } from "react";

// Composant enfant pour l'avatar
export const AdultAvatar = ({ 
  photoUrl, 
  firstName, 
  lastName, 
  sexe 
}: { 
  photoUrl: string | null; 
  firstName: string; 
  lastName: string; 
  sexe: 'M' | 'F' 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div 
      className="relative w-14 h-14 cursor-pointer perspective-500"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Face avant : initiales */}
        <div className="absolute w-full h-full rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-lg backface-hidden border-2 border-green-200">
          {initials}
        </div>
        {/* Face arrière : photo ou placeholder sexe */}
        <div className="absolute w-full h-full rounded-full border-2 border-green-200 overflow-hidden backface-hidden rotate-y-180">
          {photoUrl ? (
            <img src={photoUrl} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-3xl ${sexe === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
              {sexe === 'M' ? '🧑' : '👩'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};