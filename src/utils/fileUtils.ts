export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const extension = getFileExtension(file.name).toLowerCase();
  return allowedTypes.includes(extension);
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB