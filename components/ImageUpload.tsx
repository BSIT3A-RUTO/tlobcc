import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { getImageUrl } from '../services/storageService';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  onUpload,
  label = 'Upload Image',
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');

  // Resolve the image URL on load
  useEffect(() => {
    if (currentImage) {
      getImageUrl(currentImage)
        .then(url => setPreview(url))
        .catch(() => setPreview(currentImage));
    }
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Show local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase
      const storagePath = await onUpload(file);
      onImageChange(storagePath);
      // Get the full URL for preview
      const fullUrl = await getImageUrl(storagePath);
      setPreview(fullUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-slate-300">{label}</label>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-600 rounded-md cursor-pointer hover:border-[#4fb7b3] hover:bg-slate-800/50 transition-colors">
            <Upload size={16} className="text-slate-400" />
            <span className="text-sm text-slate-400">
              {isUploading ? 'Uploading...' : 'Click to upload'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {preview && (
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md border border-slate-600"
            />
            <button
              onClick={() => {
                setPreview('');
                onImageChange('');
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
