import React, { useState, useRef } from 'react'
import { cn } from '@/shared/utils/classnames'
import { isValidPythonFile, validateFileSize } from '@/shared/utils/validators'

interface FileUploadProps {
  onUpload: (file: File) => void
  disabled?: boolean
  isUploading?: boolean
}

export function FileUpload({ onUpload, disabled, isUploading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null)

    if (!isValidPythonFile(file.name)) {
      setError('Only .py files are allowed')
      return
    }

    if (!validateFileSize(file, 10)) {
      setError('File size must be less than 10MB')
      return
    }

    onUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <div className="w-full" data-testid="file-upload">
      <div
        data-testid="drop-zone"
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".py"
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
          data-testid="file-input"
        />

        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mt-2 text-sm text-gray-600">
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <span className="font-semibold">Click to upload</span> or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-gray-500">Python files only (max 10MB)</p>

        {disabled && (
          <p className="mt-2 text-sm text-red-600">Daily submission limit reached</p>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <button
        data-testid="upload-button"
        disabled={disabled}
        className="hidden"
      >
        Upload
      </button>
    </div>
  )
}
