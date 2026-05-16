'use client'

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getFirebaseStorage } from './firebase-client'

export async function uploadCoverImage(file: File, postSlug: string): Promise<string> {
  const storage = getFirebaseStorage()
  const ext = file.name.split('.').pop()
  const path = `covers/${postSlug}-${Date.now()}.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function uploadInlineImage(file: File): Promise<string> {
  const storage = getFirebaseStorage()
  const ext = file.name.split('.').pop()
  const path = `inline/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const storage = getFirebaseStorage()
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch {
    // ignore if already deleted
  }
}
