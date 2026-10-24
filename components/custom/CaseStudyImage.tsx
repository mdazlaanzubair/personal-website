import { cn } from "@/lib/utils"
import type { CaseStudyImageInterface } from "@/type"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

/**
 * A case-study image that is never cropped.
 *
 * - "frame" (cards): a fixed 16:10 box so grids stay even. The whole image is
 *   fitted inside, with a blurred copy of it filling any spare space.
 * - "natural" (case-study page): the box takes the image's own aspect ratio.
 *
 * While the asset hasn't been uploaded yet, a plain 16:10 placeholder holds
 * the space so the layout doesn't jump.
 */
export default function CaseStudyImage({
  image,
  sizes,
  variant = "frame",
  priority = false,
  className,
}: {
  image: CaseStudyImageInterface | null
  sizes: string
  variant?: "frame" | "natural"
  priority?: boolean
  className?: string
}) {
  const asset = image?.asset
  const dimensions = asset?.metadata?.dimensions
  const lqip = asset?.metadata?.lqip
  const useNaturalRatio = variant === "natural" && Boolean(dimensions)

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted/40",
        !useNaturalRatio && "aspect-[16/10]",
        className
      )}
      style={
        useNaturalRatio && dimensions
          ? { aspectRatio: `${dimensions.width} / ${dimensions.height}` }
          : undefined
      }
    >
      {image && asset ? (
        <>
          {!useNaturalRatio && lqip && (
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-60 blur-2xl"
              style={{ backgroundImage: `url(${lqip})` }}
            />
          )}
          <Image
            src={asset.url}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip ?? undefined}
          />
          {image.kind === "illustration" && (
            <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
              Illustrative
            </span>
          )}
        </>
      ) : (
        <div
          role="img"
          aria-label={image?.alt}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ImageIcon
            aria-hidden="true"
            className="size-6 text-muted-foreground/30"
          />
        </div>
      )}
    </div>
  )
}
