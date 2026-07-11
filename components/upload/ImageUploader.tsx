"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";
import type { ImageUploaderProps } from "@/types/image.types";


export default function ImageUploader({
  initialImages = [],
  onChange,
  folder = "stayinn/properties",
  maxFiles = 10,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const {
    images,
    uploading,
    uploadImages,
    removeImage,
    setCover,
    setInitialImages,
  } = useImageUpload({ folder, maxFiles });

  // set initial images once
  useEffect(() => {
    if (!initialized.current && initialImages.length > 0) {
      setInitialImages(initialImages);
      initialized.current = true;
    }
  }, [initialImages, setInitialImages]);

  // notify parent whenever images change
  useEffect(() => {
    onChange(images);
  }, [images, onChange]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await uploadImages(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async (publicId: string) => {
    await removeImage(publicId);
  };

  const handleSetCover = (publicId: string) => {
    setCover(publicId);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          uploading
            ? "border-blue-300 bg-blue-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-600 font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Click to upload images
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG, WEBP up to 10MB each • Max {maxFiles} images
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.publicId}
              className={cn(
                "relative group rounded-lg overflow-hidden aspect-square border-2 transition-colors",
                image.isCover
                  ? "border-blue-600"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <Image
                src={image.url}
                alt="Property image"
                fill
                className="object-cover"
              />

              {/* Cover badge */}
              {image.isCover && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="h-3 w-3 fill-white" />
                  Cover
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isCover && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs"
                    onClick={() => handleSetCover(image.publicId)}
                  >
                    Set Cover
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 w-7 p-0"
                  onClick={() => handleRemove(image.publicId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {images.length}/{maxFiles} images •{" "}
        {images.find((img) => img.isCover)
          ? "Cover image selected"
          : images.length > 0
          ? "First image is set as cover"
          : "No images uploaded"}
      </p>
    </div>
  );
}