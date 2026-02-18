'use client';

import { useState, useCallback, useRef } from 'react';
import { validateImage } from '@/lib/image-utils';

interface UseImageUploadOptions {
  onSuccess?: (file: File) => void;
}

interface UseImageUploadReturn {
  file: File | null;
  previewUrl: string;
  error: string | null;
  isDragging: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openFilePicker: () => void;
  reset: () => void;
}

export function useImageUpload(options?: UseImageUploadOptions): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onSuccessRef = useRef(options?.onSuccess);
  onSuccessRef.current = options?.onSuccess;

  const handleFileSelect = useCallback((selectedFile: File) => {
    const validationError = validateImage(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selectedFile);
    });

    onSuccessRef.current?.(selectedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return {
    file,
    previewUrl,
    error,
    isDragging,
    inputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    openFilePicker,
    reset,
  };
}
