import Image from "next/image";

export default function Phone({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2.6rem] border border-border bg-surface p-2 shadow-[0_24px_60px_-20px_rgba(60,30,10,0.35)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={1206}
        height={2622}
        priority={priority}
        sizes="(min-width: 1024px) 300px, 60vw"
        className="h-auto w-full rounded-[2.1rem]"
      />
    </div>
  );
}
