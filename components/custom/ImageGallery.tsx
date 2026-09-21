"use client"

import { cn } from "@/lib/utils"
import type { GalleryImage } from "@/type"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { useState, useCallback } from "react"

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    )
  }, [images.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    )
  }, [images.length])

  if (images.length === 0) return null

  const count = images.length

  return (
    <>
      <div
        className={cn(
          "grid gap-2 overflow-hidden rounded-lg",
          count === 1 && "grid-cols-1",
          count === 2 && "grid-cols-2",
          count === 3 && "grid-cols-2 grid-rows-2",
          count === 4 && "grid-cols-2 grid-rows-2"
        )}
      >
        {images.map((image, i) => (
          <button
            key={`${image.url}-${i}`}
            type="button"
            onClick={() => openLightbox(i)}
            className={cn(
              "group relative overflow-hidden bg-muted/30",
              count === 1 && "aspect-video",
              count === 2 && "aspect-[4/3]",
              count === 3 && i === 0 && "row-span-2 aspect-auto h-full",
              count === 3 && i > 0 && "aspect-[4/3]",
              count === 4 && "aspect-[4/3]"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt || "Gallery image"}
              fill
              sizes={
                count === 1
                  ? "(max-width: 672px) 100vw, 672px"
                  : "(max-width: 672px) 50vw, 336px"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder={image.lqip ? "blur" : "empty"}
              blurDataURL={image.lqip || undefined}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) closeLightbox()
        }}
      >
        <DialogContent className="h-screen w-screen min-w-screen border-none bg-black/85 p-0 sm:max-w-4xl [&>[data-slot=dialog-close]]:hidden">
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-3 right-3 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
              >
                <XIcon className="size-4" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                  >
                    <ChevronLeftIcon className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                  >
                    <ChevronRightIcon className="size-5" />
                  </button>
                </>
              )}

              <div className="relative flex max-h-[80vh] w-full items-center justify-center p-8">
                <Image
                  src={images[lightboxIndex].url}
                  alt={images[lightboxIndex].alt || "Gallery image"}
                  width={images[lightboxIndex].width || 1200}
                  height={images[lightboxIndex].height || 800}
                  className="max-h-[75vh] w-auto rounded object-contain"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className={cn(
                        "size-1.5 rounded-full transition-colors",
                        i === lightboxIndex
                          ? "bg-white"
                          : "bg-white/40 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
