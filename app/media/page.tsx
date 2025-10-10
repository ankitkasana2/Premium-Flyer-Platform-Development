"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/lib/auth"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    listLibrary,
    saveToLibrary,
    removeFromLibrary,
    sanitizeFileName,
    imageFileToWebPDataUrl,
    fileToDataUrl,
    renameLibraryItem,
    replaceLibraryItem,
    setLibraryItemType,
    type LibraryItem,
} from "@/lib/uploads"
import { Upload, Search, SortAsc, SortDesc, Edit2, Trash2, Replace, Tag, Check } from "lucide-react"

type FilterType = "all" | "image" | "logo"
type SortType = "recent" | "name"

export default function MediaPage() {
    const { user } = useAuth()
    const userId = user?.id || "guest"

    const [items, setItems] = useState<LibraryItem[]>([])
    const [filter, setFilter] = useState<FilterType>("all")
    const [sortBy, setSortBy] = useState<SortType>("recent")
    const [q, setQ] = useState("")
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropRef = useRef<HTMLDivElement>(null)

    // load
    useEffect(() => {
        setItems(listLibrary(userId))
    }, [userId])

    // derived
    const filtered = useMemo(() => {
        let next = items
        if (filter !== "all") next = next.filter((i) => i.type === filter)
        if (q.trim()) {
            const needle = q.toLowerCase()
            next = next.filter((i) => i.name.toLowerCase().includes(needle))
        }
        if (sortBy === "name") {
            next = [...next].sort((a, b) => a.name.localeCompare(b.name))
        } else {
            next = [...next].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        }
        return next
    }, [items, filter, q, sortBy])

    // drag & drop
    useEffect(() => {
        const box = dropRef.current
        if (!box) return
        const onDragOver = (e: DragEvent) => {
            e.preventDefault()
            box.classList.add("ring-2", "ring-primary/50")
        }
        const onDragLeave = () => box.classList.remove("ring-2", "ring-primary/50")
        const onDrop = async (e: DragEvent) => {
            e.preventDefault()
            box.classList.remove("ring-2", "ring-primary/50")
            if (!e.dataTransfer?.files?.length) return
            await handleUploadFiles(Array.from(e.dataTransfer.files))
        }
        box.addEventListener("dragover", onDragOver)
        box.addEventListener("dragleave", onDragLeave)
        box.addEventListener("drop", onDrop)
        return () => {
            box.removeEventListener("dragover", onDragOver)
            box.removeEventListener("dragleave", onDragLeave)
            box.removeEventListener("drop", onDrop)
        }
    }, [userId])

    const handleUploadFiles = async (files: File[]) => {
        const added: LibraryItem[] = []
        for (const f of files) {
            const isImage = f.type.startsWith("image/")
            const dataUrl = isImage ? await imageFileToWebPDataUrl(f, 0.8) : await fileToDataUrl(f)
            const type: LibraryItem["type"] = /logo/i.test(f.name) ? "logo" : "image"
            const saved = saveToLibrary(userId, {
                name: sanitizeFileName(f.name),
                dataUrl,
                type,
                size: f.size,
            })
            added.push(saved)
        }
        if (added.length) {
            setItems(listLibrary(userId))
        }
    }

    const onBrowseClick = () => fileInputRef.current?.click()

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.currentTarget
        const files = inputEl.files ? Array.from(inputEl.files) : []
        try {
            if (files.length) {
                await handleUploadFiles(files)
            }
        } finally {
            if (inputEl) inputEl.value = ""
        }
    }

    const onDelete = (id: string) => {
        removeFromLibrary(userId, id)
        setItems((prev) => prev.filter((i) => i.id !== id))
    }

    const onRename = (id: string) => {
        const item = items.find((i) => i.id === id)
        if (!item) return
        setRenamingId(id)
        setRenameValue(item.name)
    }

    const onRenameCommit = () => {
        if (!renamingId) return
        renameLibraryItem(userId, renamingId, renameValue || "untitled")
        setItems(listLibrary(userId))
        setRenamingId(null)
    }

    const onReplace = async (id: string) => {
        // open a hidden file input scoped to replace
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = async () => {
            const file = input.files?.[0]
            if (file) {
                await replaceLibraryItem(userId, id, file)
                setItems(listLibrary(userId))
            }
        }
        input.click()
    }

    const onRetag = (id: string, next: LibraryItem["type"]) => {
        setLibraryItemType(userId, id, next)
        setItems(listLibrary(userId))
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground text-balance">Media Library</h1>
                    <p className="text-muted-foreground text-sm">Upload, organize, and reuse assets for faster orders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-transparent hover:!bg-primary hover:!text-white hover:cursor-pointer" onClick={onBrowseClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                    <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={onFileChange} className="hidden" />
                </div>
            </div>

            <Card className="bg-card border-border">
                <CardHeader className="flex flex-col gap-3">
                    <CardTitle className="text-card-foreground">Your assets</CardTitle>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search media..."
                                    className="pl-8 bg-card text-input-text border-border w-56"
                                />
                            </div>
                        </div>

                        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="ml-auto">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="image">Images</TabsTrigger>
                                <TabsTrigger value="logo">Logos</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button
                            variant="outline"
                            className=" hover:!bg-primary text-foreground hover:cursor-pointer hover:!text-white"
                            onClick={() => setSortBy((s) => (s === "recent" ? "name" : "recent"))}
                            title="Toggle sort"
                        >
                            {sortBy === "recent" ? (
                                <>
                                    <SortDesc className="mr-2 h-4 w-4" /> Recent
                                </>
                            ) : (
                                <>
                                    <SortAsc className="mr-2 h-4 w-4" /> Name
                                </>
                            )}
                        </Button>
                        <Badge >{filtered.length} items</Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Drag-and-drop zone */}
                    <div ref={dropRef} className="mb-6 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Drag and drop files here, or{" "}
                            <button className="underline text-primary" onClick={onBrowseClick}>
                                browse
                            </button>
                            .
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No media yet. Upload to get started.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {filtered.map((item) => {
                                const isRenaming = renamingId === item.id
                                return (
                                    <div key={item.id} className="group rounded-lg overflow-hidden border border-border bg-background">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.dataUrl || "/placeholder.svg?height=300&width=300&query=media-preview"}
                                            alt={item.name}
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="p-3 flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-2">
                                                {isRenaming ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Input
                                                            value={renameValue}
                                                            onChange={(e) => setRenameValue(e.target.value)}
                                                            className="bg-input border-border h-8"
                                                        />
                                                        <Button size="sm" onClick={onRenameCommit}>
                                                            <Check className="h-2 w-2" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-medium truncate max-w-[200px]" title={item.name}>
                                                        {item.name}
                                                    </p>
                                                )}
                                                <Badge variant="outline" className="uppercase text-[10px]">
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="bg-transparent text-xs hover:!bg-card hover:!text-white hover:cursor-pointer"
                                                    onClick={() => onRename(item.id)}
                                                >
                                                    <Edit2 className="h-2 w-2 mr-1" />
                                                    Rename
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                   className="bg-transparent text-xs hover:!bg-card hover:!text-white hover:cursor-pointer"
                                                    onClick={() => onReplace(item.id)}
                                                >
                                                    <Replace className="h-2 w-2 mr-1" />
                                                    Replace
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="bg-transparent text-xs hover:!bg-card hover:!text-white hover:cursor-pointer"
                                                    onClick={() => onRetag(item.id, item.type === "logo" ? "image" : "logo")}
                                                    title="Toggle tag"
                                                >
                                                    <Tag className="h-2 w-2 mr-1" />
                                                    {item.type === "logo" ? "Set Image" : "Set Logo"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => onDelete(item.id)}
                                                    className="ml-auto hover:cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-2 w-2 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
