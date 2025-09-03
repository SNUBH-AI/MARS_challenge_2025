export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPythonFile(fileName: string): boolean {
  return fileName.endsWith('.py')
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export interface ValidationError {
  field: string
  message: string
}

export class ValidationErrors {
  private errors: ValidationError[] = []

  add(field: string, message: string): void {
    this.errors.push({ field, message })
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  getErrors(): ValidationError[] {
    return this.errors
  }

  getFieldError(field: string): string | undefined {
    return this.errors.find(e => e.field === field)?.message
  }

  clear(): void {
    this.errors = []
  }
}
