import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function SafeImage({ src, alt, className, fallbackClassName }: SafeImageProps) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", fallbackClassName ?? className)}>
        <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  );
}
