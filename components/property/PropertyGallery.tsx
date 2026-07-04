"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PropertyGalleryProps } from "@/types/property.types";

export default function PropertyGallery({ images, name }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  const coverImage = images.find((img) => img.isCover) ?? images[0];
  const otherImages = images.filter((img) => img !== coverImage).slice(0, 4);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 rounded-xl overflow-hidden">
        {/* Cover Image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={coverImage.url}
            alt={coverImage.alt ?? name}
            fill
            className="object-cover hover:brightness-90 transition"
          />
        </div>

        {/* Other Images */}
        {otherImages.map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer"
            onClick={() => openLightbox(i + 1)}
          >
            <Image
              src={img.url}
              alt={img.alt ?? `${name} ${i + 2}`}
              fill
              className="object-cover hover:brightness-90 transition"
            />
            {/* Show all photos button on last image */}
            {i === otherImages.length - 1 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium">
                +{images.length - 5} photos
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] mx-8">
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt ?? name}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}