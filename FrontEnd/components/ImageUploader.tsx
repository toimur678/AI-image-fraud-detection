import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File, base64: string, mimeType: string, previewUrl: string) => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      setError("File size too large. Please upload an image under 20MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      const mimeType = file.type;
      onImageSelected(file, base64Data, mimeType, result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative w-full h-full flex flex-col items-center justify-center p-6 text-center transition-all duration-300 rounded-2xl border-2 border-dashed
          ${isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : ''}
          ${isDragging 
            ? 'bg-indigo-500/20 border-indigo-400/50 scale-[1.02]' 
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isAnalyzing}
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-full shadow-sm transition-colors ${isDragging ? 'bg-indigo-500/30 text-white' : 'bg-white/10 text-white'}`}>
            {isDragging ? <Upload size={28} /> : <ImageIcon size={28} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              {isDragging ? 'Drop image here' : 'Upload Evidence'}
            </h3>
            <p className="text-sm text-white/70 max-w-[220px] mx-auto leading-relaxed">
              Drag and drop your file here or click to browse from your computer
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-500/20 text-red-100 text-sm rounded-xl border border-red-500/30 flex items-center gap-2 shadow-sm animate-fade-in">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}
    </div>
  );
};
