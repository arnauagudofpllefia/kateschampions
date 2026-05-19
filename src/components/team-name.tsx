import Image from "next/image";

type TeamNameProps = {
  name: string;
  crest: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function TeamName({ name, crest, size = "md", className = "" }: TeamNameProps) {
  const logoSize = size === "sm" ? 20 : size === "lg" ? 36 : 28;
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-3xl" : "text-base";

  return (
    <span className={`inline-flex items-center gap-2 ${textSize} ${className}`.trim()}>
      <Image
        src={crest}
        alt={`Escudo de ${name}`}
        width={logoSize}
        height={logoSize}
        className="rounded-full border border-white/20 bg-white/90 object-cover"
      />
      <span>{name}</span>
    </span>
  );
}
