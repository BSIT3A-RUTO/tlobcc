import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: 'sermons' | 'events' | 'ministries' | 'pastors';
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Image URL',
  folder = 'sermons',
}) => {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [pastedUrl, setPastedUrl] = useState(value);
  const [showPreview, setShowPreview] = useState(!!value);

  const handleUploadComplete = (url: string) => {
    onChange(url);
    setShowPreview(true);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPastedUrl(url);
  };

  const handleUrlSubmit = () => {
    if (pastedUrl.trim()) {
      onChange(pastedUrl);
      setShowPreview(true);
    }
  };

  const handleClear = () => {
    onChange('');
    setPastedUrl('');
    setShowPreview(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-xs uppercase text-slate-400 font-semibold">{label}</label>

      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-lg border border-white/10">
        <button
          onClick={() => {
            setMode('upload');
            setShowPreview(false);
          }}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-[#4fb7b3] text-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload size={14} className="inline mr-2" />
          Upload
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-[#4fb7b3] text-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Paste URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === 'upload' && (
        <ImageUpload folder={folder} onUploadComplete={handleUploadComplete} />
      )}

      {/* Paste URL Mode */}
      {mode === 'paste' && (
        <div className="space-y-2">
          <input
            type="text"
            value={pastedUrl}
            onChange={handleUrlChange}
            placeholder="Paste image URL here..."
            className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-white/20 text-sm text-white placeholder-slate-500 focus:border-[#4fb7b3] focus:outline-none"
          />
          <button
            onClick={handleUrlSubmit}
            className="w-full px-3 py-2 rounded-lg bg-[#4fb7b3] text-black text-sm font-semibold hover:bg-[#4fb7b3]/90 transition-colors"
          >
            Confirm URL
          </button>
        </div>
      )}

      {/* Preview */}
      {showPreview && value && (
        <div className="rounded-lg border border-white/10 bg-slate-900/50 p-3">
          <div className="flex items-start gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => {
                  // Fallback for failed images
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 mb-1">Preview</p>
              <p className="text-xs text-slate-300 truncate">{value}</p>
            </div>
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-slate-500">
        {mode === 'upload'
          ? 'Upload an image file (JPG, PNG, WebP). Max 5MB.'
          : 'Paste a valid image URL (must start with http/https)'}
      </p>
    </div>
  );
};
