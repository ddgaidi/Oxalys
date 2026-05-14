/*
 * Commentaires de structure : Rend le logo Oxalys sous forme de composant reutilisable.
 */
import Image from "next/image";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  size?: number;
  className?: string;
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function OxalysLogo({ size = 40, className = "" }: Props) {
  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/oxalys.png"
        alt="Oxalys Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
