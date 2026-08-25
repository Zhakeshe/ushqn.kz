import { supabase } from './supabase'

const BUCKET = 'uploads'
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
export const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain',
] as const

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'txt'])

export function validateUpload(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
    return 'Unsupported file type. Use JPG, PNG, WebP, GIF, PDF, or TXT.'
  }
  if (!ALLOWED_EXTENSIONS.has(extension)) return 'This file extension is not allowed.'
  if (file.size <= 0) return 'The file is empty.'
  if (file.size > MAX_UPLOAD_BYTES) return 'The file is larger than 10 MB.'
  return null
}

function safePath(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, ''))
    .filter(Boolean)
    .join('/')
}

export async function uploadPublicFile(
  userId: string,
  path: string,
  file: File,
): Promise<string | null> {
  const fullPath = await uploadOwnedFile(userId, path, file)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fullPath)
  return data.publicUrl
}

export async function uploadOwnedFile(userId: string, path: string, file: File): Promise<string> {
  return uploadToOwnedBucket(BUCKET, userId, path, file)
}

export async function uploadPrivateEvidence(userId: string, path: string, file: File): Promise<string> {
  return uploadToOwnedBucket('evidence', userId, path, file)
}

async function uploadToOwnedBucket(bucket: string, userId: string, path: string, file: File): Promise<string> {
  const validationError = validateUpload(file)
  if (validationError) throw new Error(validationError)
  if (!userId || userId.includes('/')) throw new Error('Invalid upload owner.')
  const cleanPath = safePath(path)
  if (!cleanPath) throw new Error('Invalid upload path.')
  const fullPath = `${userId}/${cleanPath}`
  const { error } = await supabase.storage.from(bucket).upload(fullPath, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) {
    throw error
  }
  return fullPath
}
