import type { UploadedImage, UseImageUploadOptions } from "@/types/image.types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { folder = "stayinn/properties", maxFiles = 10 } = options;
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);

  // upload files — returns updated images array so parent gets latest state
  const uploadImages = useCallback(
    async (files: FileList | File[]): Promise<UploadedImage[]> => {
      const fileArray = Array.from(files);

      // client-side validation
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSizeMB = 10;

      for (const file of fileArray) {
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} is not a supported format (JPG, PNG, WEBP)`);
          return images;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`${file.name} exceeds ${maxSizeMB}MB limit`);
          return images;
        }
      }

      if (images.length + fileArray.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return images;
      }

      setUploading(true);

      try {
        const uploadPromises = fileArray.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");

          const data = await response.json();
          return {
            url: data.url,
            publicId: data.publicId,
            width: data.width,
            height: data.height,
            isCover: false,
          } as UploadedImage;
        });

        const uploaded = await Promise.all(uploadPromises);

        // return latest images so parent receives correct state
        let updated: UploadedImage[] = [];
        setImages((prev) => {
          updated = [...prev, ...uploaded];
          if (updated.length > 0 && !updated.some((img) => img.isCover)) {
            updated[0] = { ...updated[0], isCover: true };
          }
          return updated;
        });

        toast.success(
          `${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`
        );

        // small delay to ensure state update propagates
        await new Promise((resolve) => setTimeout(resolve, 0));
        return updated;
      } catch (error) {
        toast.error("Failed to upload images");
        console.error(error);
        return images;
      } finally {
        setUploading(false);
      }
    },
    [images, folder, maxFiles]
  );

  // remove image — returns updated images array
  const removeImage = useCallback(
    async (publicId: string): Promise<UploadedImage[]> => {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });

        let updated: UploadedImage[] = [];
        setImages((prev) => {
          updated = prev.filter((img) => img.publicId !== publicId);
          if (updated.length > 0 && !updated.some((img) => img.isCover)) {
            updated[0] = { ...updated[0], isCover: true };
          }
          return updated;
        });

        return updated;
      } catch (error) {
        toast.error("Failed to remove image");
        console.error(error);
        return images;
      }
    },
    [images]
  );

  // set cover — returns updated images array
  const setCover = useCallback(
    (publicId: string): UploadedImage[] => {
      let updated: UploadedImage[] = [];
      setImages((prev) => {
        updated = prev.map((img) => ({
          ...img,
          isCover: img.publicId === publicId,
        }));
        return updated;
      });
      return updated;
    },
    []
  );

  const setInitialImages = useCallback((initialImages: UploadedImage[]) => {
    setImages(initialImages);
  }, []);

  return {
    images,
    uploading,
    uploadImages,
    removeImage,
    setCover,
    setInitialImages,
  };
}