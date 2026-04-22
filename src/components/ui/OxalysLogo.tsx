import Image from "next/image";

interface Props {
  size?: number;
  className?: string;
}

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
