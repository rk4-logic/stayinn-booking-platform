export interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  isCover: boolean;
}

export interface UseImageUploadOptions {
  folder?: string;
  maxFiles?: number;
}

export interface ImageUploaderProps {
  initialImages?: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder?: string;
  maxFiles?: number;
}