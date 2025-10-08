export type LibraryItem = {
  id: string
  name: string
  type: "image" | "logo"
  dataUrl: string
  createdAt: string
  size?: number
}

const LIBRARY_KEY = (userId: string) => `grodify_media_${userId || "guest"}`
const MAX_ITEMS_PER_USER = 500 // simple guard

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function imageFileToWebPDataUrl(file: File, quality = 0.8): Promise<string> {
  // Convert any image File to WebP data URL using canvas
  const dataUrl = await fileToDataUrl(file)
  const img = await loadImage(dataUrl)
  const canvas = document.createElement("canvas")
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL("image/webp", quality)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^\w\-.]+/g, "_")
}

export function listLibrary(userId: string, type?: LibraryItem["type"]): LibraryItem[] {
  const raw = localStorage.getItem(LIBRARY_KEY(userId))
  const items: LibraryItem[] = raw ? JSON.parse(raw) : []
  return type ? items.filter((i) => i.type === type) : items
}

export function saveToLibrary(userId: string, item: Omit<LibraryItem, "id" | "createdAt">): LibraryItem {
  const key = LIBRARY_KEY(userId)
  const current = listLibrary(userId)
  const newItem: LibraryItem = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...item,
  }
  // basic cap
  const next = [...current, newItem].slice(-MAX_ITEMS_PER_USER)
  localStorage.setItem(key, JSON.stringify(next))
  return newItem
}

export function removeFromLibrary(userId: string, id: string) {
  const key = LIBRARY_KEY(userId)
  const current = listLibrary(userId)
  const next = current.filter((i) => i.id !== id)
  localStorage.setItem(key, JSON.stringify(next))
}
