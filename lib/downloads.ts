"use client"

export type DeliveredFileType = "image" | "video" | "document" | "psd"

export interface DeliveredFile {
    id: string
    fileName: string
    type: DeliveredFileType
    size: number // bytes
    url: string
    unread: boolean
}

export interface OrderDelivery {
    orderId: string
    title: string
    deliveredAt: string // ISO
    files: DeliveredFile[]
}

const keyFor = (userId: string) => `grodify_downloads_${userId}`

export function getDownloads(userId: string): OrderDelivery[] {
    if (typeof window === "undefined") return []
    const raw = window.localStorage.getItem(keyFor(userId))
    try {
        return raw ? (JSON.parse(raw) as OrderDelivery[]) : []
    } catch {
        return []
    }
}

function setDownloads(userId: string, data: OrderDelivery[]) {
    if (typeof window === "undefined") return
    window.localStorage.setItem(keyFor(userId), JSON.stringify(data))
}

export function seedSampleDownloads(userId: string) {
    if (typeof window === "undefined") return
    const existing = getDownloads(userId)
    if (existing && existing.length > 0) return

    const now = new Date()
    const iso = (d: Date) => d.toISOString()
    const sample: OrderDelivery[] = [
        {
            orderId: "ORD-1024",
            title: "Neon Nights Party – Final Flyers",
            deliveredAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 2)), // 2h ago
            files: [
                {
                    id: "f1",
                    fileName: "neon-nights-instagram-post.webp",
                    type: "image",
                    size: 342_113,
                    url: "/pic10.jpg",
                    unread: true,
                },
                {
                    id: "f2",
                    fileName: "neon-nights-story.webp",
                    type: "image",
                    size: 401_887,
                    url: "/pic25.jpg",
                    unread: true,
                },
                {
                    id: "f3",
                    fileName: "neon-nights-print.pdf",
                    type: "document",
                    size: 2_145_000,
                    url: "/pic26.jpg",
                    unread: true,
                },
            ],
        },
        {
            orderId: "ORD-1068",
            title: "Halloween Horror – Video Package",
            deliveredAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24)), // 1 day ago
            files: [
                {
                    id: "f4",
                    fileName: "halloween-animated-1080.mp4",
                    type: "video",
                    size: 22_340_112,
                    url: "/pic29.jpg",
                    unread: false,
                },
                {
                    id: "f5",
                    fileName: "halloween-cover.webp",
                    type: "image",
                    size: 298_001,
                    url: "/pic35.jpg",
                    unread: false,
                },
            ],
        },
        {
            orderId: "ORD-1112",
            title: "Ladies Night – Final Set",
            deliveredAt: iso(new Date(now.getTime() - 1000 * 60 * 30)), // 30m ago
            files: [
                {
                    id: "f6",
                    fileName: "ladies-night-post.webp",
                    type: "image",
                    size: 256_112,
                    url: "/pic21.jpg",
                    unread: true,
                },
            ],
        },
    ]

    setDownloads(userId, sample)
}

export function getUnreadDownloadsCount(userId: string): number {
    const data = getDownloads(userId)
    return data.reduce((sum, od) => sum + od.files.filter((f) => f.unread).length, 0)
}

export function markFileRead(userId: string, orderId: string, fileId: string) {
    const data = getDownloads(userId)
    let changed = false
    data.forEach((od) => {
        if (od.orderId !== orderId) return
        od.files = od.files.map((f) => (f.id === fileId ? { ...f, unread: false } : f))
        changed = true
    })
    if (changed) setDownloads(userId, data)
    return getDownloads(userId)
}

export function markAllRead(userId: string) {
    const data = getDownloads(userId).map((od) => ({
        ...od,
        files: od.files.map((f) => ({ ...f, unread: false })),
    }))
    setDownloads(userId, data)
    return data
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
