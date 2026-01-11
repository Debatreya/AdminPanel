import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "@/config/env"
import type { ImgBBUploadResponse, ImgBBUploadResult } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Upload an image to ImgBB and get the URL
 * @param image - File object, base64 string, or image URL
 * @param name - Optional name for the image
 * @param expiration - Optional expiration time in seconds (60-15552000)
 * @returns Object containing image URL, delete URL, and image data
 * @throws Error if upload fails
 */
export async function uploadToImgBB(
  image: File | string,
  name?: string,
  expiration?: number
): Promise<ImgBBUploadResult> {
  try {
    const formData = new FormData()
    
    // Handle different input types
    if (image instanceof File) {
      formData.append('image', image)
      if (!name) {
        name = image.name.replace(/\.[^/.]+$/, '') // Remove extension
      }
    } else {
      // Assume it's a base64 string or URL
      formData.append('image', image)
    }
    
    if (name) {
      formData.append('name', name)
    }
    
    // Build URL with query parameters
    const url = new URL('https://api.imgbb.com/1/upload')
    url.searchParams.append('key', env.IMGBB_API_KEY)
    
    if (expiration) {
      // Validate expiration range (60 seconds to 180 days)
      if (expiration < 60 || expiration > 15552000) {
        throw new Error('Expiration must be between 60 and 15552000 seconds')
      }
      url.searchParams.append('expiration', expiration.toString())
    }
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`ImgBB upload failed: ${response.statusText}`)
    }
    
    const data: ImgBBUploadResponse = await response.json()
    
    if (!data.success) {
      throw new Error('ImgBB upload failed: Invalid response')
    }
    
    return {
      url: data.data.image.url,
      deleteUrl: data.data.delete_url,
      imageData: {
        filename: data.data.image.filename,
        name: data.data.image.name,
        url: data.data.image.url,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload image to ImgBB: ${error.message}`)
    }
    throw new Error('Failed to upload image to ImgBB: Unknown error')
  }
}
