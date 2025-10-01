"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormType =
  | "basic_with_photos"
  | "basic_without_photos"
  | "regular_with_photos"
  | "regular_without_photos"
  | "premium_with_photos"
  | "premium_without_photos"
  | "birthday"

type DeliverySpeed = "24h" | "5h" | "1h"

const BASE_PRICES: Record<Exclude<FormType, "birthday">, number> = {
  basic_with_photos: 10,
  basic_without_photos: 10,
  regular_with_photos: 15,
  regular_without_photos: 15,
  premium_with_photos: 40,
  premium_without_photos: 40,
}

const DELIVERY_COST: Record<DeliverySpeed, number> = {
  "24h": 0,
  "5h": 10,
  "1h": 20,
}

const SAMPLE_FLYERS: Array<{
  id: string
  title: string
  tier: "basic" | "regular" | "premium" | "birthday"
  src: string
}> = [
  {
    id: "halloween-party-flyer-dark-spooky",
    title: "Halloween Party",
    tier: "premium",
    src: "/halloween-party-flyer-dark-spooky.jpg",
  },
  {
    id: "christmas-party-flyer-elegant-gold",
    title: "Christmas Party",
    tier: "premium",
    src: "/christmas-party-flyer-elegant-gold.jpg",
  },
  {
    id: "edm-dj-party-flyer-neon-lights",
    title: "EDM / DJ Night",
    tier: "regular",
    src: "/edm-dj-party-flyer-neon-lights.jpg",
  },
  {
    id: "ladies-night-party-flyer-pink-elegant",
    title: "Ladies Night",
    tier: "regular",
    src: "/ladies-night-party-flyer-pink-elegant.jpg",
  },
  {
    id: "summer-beach-party-flyer-tropical",
    title: "Summer Beach",
    tier: "regular",
    src: "/summer-beach-party-flyer-tropical.jpg",
  },
  {
    id: "valentines-party-flyer-romantic-red",
    title: "Valentine’s",
    tier: "regular",
    src: "/valentines-party-flyer-romantic-red.jpg",
  },
  {
    id: "memorial-day-party-flyer-patriotic",
    title: "Memorial Day",
    tier: "regular",
    src: "/memorial-day-party-flyer-patriotic.jpg",
  },
  {
    id: "foam-party-flyer-bubbles-blue",
    title: "Foam Party",
    tier: "regular",
    src: "/foam-party-flyer-bubbles-blue.jpg",
  },
  {
    id: "hookah-night-flyer-smoke-purple",
    title: "Hookah Night",
    tier: "basic",
    src: "/hookah-night-flyer-smoke-purple.jpg",
  },
  {
    id: "brunch-party-flyer-elegant-gold",
    title: "Brunch",
    tier: "basic",
    src: "/brunch-party-flyer-elegant-gold.jpg",
  },
  { id: "game-night-flyer-neon-gaming", title: "Game Night", tier: "basic", src: "/game-night-flyer-neon-gaming.jpg" },
  {
    id: "basic-club-flyer-minimal-black",
    title: "Minimal Club",
    tier: "basic",
    src: "/basic-club-flyer-minimal-black.jpg",
  },
  {
    id: "presidents-day-flyer-american-flag",
    title: "President’s Day",
    tier: "regular",
    src: "/presidents-day-flyer-american-flag.jpg",
  },
  {
    id: "birthday-party-flyer-celebration",
    title: "Birthday",
    tier: "birthday",
    src: "/birthday-party-flyer-celebration.jpg",
  },
]

export default function FlyerForm({
  defaultFormType = "basic_with_photos",
  flyerId,
}: {
  defaultFormType?: FormType
  flyerId?: string
}) {
  const [formType, setFormType] = useState<FormType>(defaultFormType)
  const [presenting, setPresenting] = useState("")
  const [mainTitle, setMainTitle] = useState("")
  const [date, setDate] = useState("")
  const [eventInfo, setEventInfo] = useState("")
  const [mainDJ, setMainDJ] = useState("")
  const [djs, setDjs] = useState<string[]>(["", "", "", ""])
  const [hostedBy, setHostedBy] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const [venueLogo, setVenueLogo] = useState<File | null>(null)
  const [promoterLogo, setPromoterLogo] = useState<File | null>(null)
  const [sponsorLogo, setSponsorLogo] = useState<File | null>(null)

  const [photos, setPhotos] = useState<File[]>([]) // up to 5 for with-photos
  const [birthdayPhoto, setBirthdayPhoto] = useState<File | null>(null) // for birthday form only

  const [extraStory, setExtraStory] = useState(false) // +$10
  const [extraDifferent, setExtraDifferent] = useState(false) // +$10
  const [extraAnimated, setExtraAnimated] = useState(false) // +$25
  const [delivery, setDelivery] = useState<DeliverySpeed>("24h")
  const [notes, setNotes] = useState("")

  const initialFlyer = SAMPLE_FLYERS.find((f) => f.id === flyerId) || null
  const [selectedFlyer, setSelectedFlyer] = useState<null | { id: string; title: string; src: string; tier: string }>(
    initialFlyer
      ? { id: initialFlyer.id, title: initialFlyer.title, src: initialFlyer.src, tier: initialFlyer.tier }
      : null,
  )

  const isWithPhotos =
    formType === "basic_with_photos" || formType === "regular_with_photos" || formType === "premium_with_photos"

  const isWithoutPhotos =
    formType === "basic_without_photos" ||
    formType === "regular_without_photos" ||
    formType === "premium_without_photos"

  const isBirthday = formType === "birthday"

  const basePrice = useMemo(() => {
    if (isBirthday) return null
    return BASE_PRICES[formType as Exclude<FormType, "birthday">]
  }, [formType, isBirthday])

  const extrasPrice = useMemo(() => {
    let total = 0
    if (extraStory) total += 10
    if (extraDifferent) total += 10
    if (extraAnimated) total += 25
    return total
  }, [extraStory, extraDifferent, extraAnimated])

  const totalPrice = useMemo(() => {
    const deliveryFee = DELIVERY_COST[delivery]
    if (isBirthday) {
      // Birthday price depends on template; show just add-ons
      return `— + $${extrasPrice + deliveryFee} (extras & delivery)`
    }
    const base = basePrice ?? 0
    return `$${base + extrasPrice + deliveryFee}`
  }, [basePrice, extrasPrice, delivery, isBirthday])

  function onPhotosChange(files: FileList | null) {
    if (!files) return
    const picks = Array.from(files).slice(0, 5)
    setPhotos(picks)
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = new FormData()
    // Core fields
    formData.append("formType", formType)
    if (flyerId) formData.append("flyerId", flyerId)
    if (!flyerId && selectedFlyer?.id) formData.append("flyerId", selectedFlyer.id)
    formData.append("presenting", presenting)
    formData.append("mainTitle", mainTitle)
    formData.append("date", date)
    formData.append("eventInfo", eventInfo)
    formData.append("mainDJ", mainDJ)
    djs.forEach((dj, i) => formData.append(`dj_${i + 1}`, dj))
    formData.append("hostedBy", hostedBy)
    formData.append("address", address)
    formData.append("phone", phone)

    // Logos
    if (venueLogo) formData.append("venueLogo", venueLogo)
    if (promoterLogo) formData.append("promoterLogo", promoterLogo)
    if (sponsorLogo) formData.append("sponsorLogo", sponsorLogo)

    // Photos (conditional)
    if (isWithPhotos) {
      photos.forEach((p, i) => formData.append(`photo_${i + 1}`, p))
    }
    if (isBirthday && birthdayPhoto) {
      formData.append("birthdayPhoto", birthdayPhoto)
    }

    // Extras
    formData.append("extraStory", String(extraStory))
    formData.append("extraDifferent", String(extraDifferent))
    formData.append("extraAnimated", String(extraAnimated))
    formData.append("delivery", delivery)
    formData.append("notes", notes)

    // Pricing snapshot (non-authoritative)
    if (basePrice !== null && basePrice !== undefined) {
      formData.append("basePrice", String(basePrice))
    }
    formData.append("computedTotal", typeof totalPrice === "string" ? totalPrice : String(totalPrice))

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to submit order")
      // Redirect to confirmation or payment step
      window.location.href = "/orders?submitted=1"
    } catch (err: any) {
      console.error("[v0] Order submit failed:", err?.message || err)
      alert("There was an error submitting your order. Please try again.")
    }
  }

  return (
    <div className="w-full">
      {/* Header / Summary */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white">Flyer Order Form</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Netflix-style experience. Complete the details below and we’ll design and deliver to your Email / SMS /
          Profile.
        </p>
      </div>

      {/* Flyer Selection */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Choose Flyer</h3>
          <a
            href="/catalog?return=/order/new"
            className="text-sm text-red-500 hover:text-red-400 underline underline-offset-4"
          >
            Browse Full Catalog
          </a>
        </div>

        {selectedFlyer ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedFlyer.src || "/placeholder.svg?height=120&width=90&query=Selected%20flyer%20preview"}
              alt={`Selected flyer: ${selectedFlyer.title}`}
              className="w-24 h-32 object-cover rounded-md border border-zinc-800"
            />
            <div className="flex-1">
              <div className="text-white font-medium">{selectedFlyer.title}</div>
              <div className="text-xs text-zinc-400">ID: {selectedFlyer.id}</div>
              <button
                type="button"
                onClick={() => setSelectedFlyer(null)}
                className="mt-2 text-sm text-zinc-200 underline underline-offset-4 hover:text-white"
              >
                Change Flyer
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-400 mb-3">Pick a flyer to include in your order.</p>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max">
                {SAMPLE_FLYERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFlyer({ id: f.id, title: f.title, src: f.src, tier: f.tier })}
                    className="group relative rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    aria-label={`Select ${f.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.src || "/placeholder.svg?height=160&width=120&query=Flyer%20template"}
                      alt={f.title}
                      className="w-28 h-40 object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-black/60 rounded-b-md">
                      <div className="text-xs text-white font-medium line-clamp-1">{f.title}</div>
                      <div className="text-[10px] text-zinc-300 capitalize">{f.tier}</div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-md ring-0 group-hover:ring-2 group-hover:ring-red-600" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Form Type + Price */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-300">Form Type</label>
            <select
              className="bg-zinc-900 text-white rounded-md border border-zinc-800 px-3 py-2"
              value={formType}
              onChange={(e) => setFormType(e.target.value as FormType)}
            >
              <optgroup label="Basic ($10)">
                <option value="basic_with_photos">Basic – With Photos</option>
                <option value="basic_without_photos">Basic – Without Photos</option>
              </optgroup>
              <optgroup label="Regular ($15)">
                <option value="regular_with_photos">Regular – With Photos</option>
                <option value="regular_without_photos">Regular – Without Photos</option>
              </optgroup>
              <optgroup label="Premium ($40)">
                <option value="premium_with_photos">Premium – With Photos</option>
                <option value="premium_without_photos">Premium – Without Photos</option>
              </optgroup>
              <optgroup label="Birthday">
                <option value="birthday">Birthday (1 main photo + logos)</option>
              </optgroup>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-zinc-300">Estimated Total</span>
            <div className="text-2xl font-bold">
              <span className="text-white">{totalPrice}</span>
            </div>
            <p className="text-xs text-zinc-500">Base price depends on selection. Taxes/fees calculated at checkout.</p>
          </div>
        </div>
      </div>

      {/* The Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Details */}
        <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-300">Presenting</label>
              <Input
                value={presenting}
                onChange={(e) => setPresenting(e.target.value)}
                placeholder="Presented by Club XYZ"
                className="bg-zinc-900 text-white border-zinc-800"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-300">Main Title</label>
              <Input
                value={mainTitle}
                onChange={(e) => setMainTitle(e.target.value)}
                placeholder="Halloween Bash"
                className="bg-zinc-900 text-white border-zinc-800"
                required
              />
            </div>
            <div>
              <label className="text-sm text-zinc-300">Date</label>
              <Input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Sat · Oct 31 · 10PM"
                className="bg-zinc-900 text-white border-zinc-800"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-zinc-300">Event Information</label>
              <Textarea
                value={eventInfo}
                onChange={(e) => setEventInfo(e.target.value)}
                placeholder="Music genres, dress code, bottle specials, etc."
                className="bg-zinc-900 text-white border-zinc-800 min-h-24"
              />
            </div>
          </div>
        </section>

        {/* Talent & Hosts */}
        {!isBirthday && (
          <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Talent & Hosts</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-zinc-300">Main DJ</label>
                <Input
                  value={mainDJ}
                  onChange={(e) => setMainDJ(e.target.value)}
                  placeholder="Main DJ / Headliner"
                  className="bg-zinc-900 text-white border-zinc-800"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-300">Hosted by</label>
                <Input
                  value={hostedBy}
                  onChange={(e) => setHostedBy(e.target.value)}
                  placeholder="Host / MC / Promoter"
                  className="bg-zinc-900 text-white border-zinc-800"
                />
              </div>

              <div className="md:col-span-2 grid gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <Input
                    key={i}
                    value={djs[i]}
                    onChange={(e) => {
                      const next = [...djs]
                      next[i] = e.target.value
                      setDjs(next)
                    }}
                    placeholder={`DJ ${i + 1} (optional)`}
                    className="bg-zinc-900 text-white border-zinc-800"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Birthday Talent */}
        {isBirthday && (
          <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Birthday Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm text-zinc-300">Birthday Person Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBirthdayPhoto(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1">Upload one clear photo for the birthday person.</p>
              </div>
            </div>
          </section>
        )}

        {/* Venue & Contact */}
        <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Venue & Contact</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-300">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Nightlife Ave, City"
                className="bg-zinc-900 text-white border-zinc-800"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-300">Phone Number</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-zinc-900 text-white border-zinc-800"
              />
            </div>

            <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm text-zinc-300">Venue Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVenueLogo(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-300">Promoter Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPromoterLogo(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-300">Sponsor Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSponsorLogo(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Photos (conditional for with-photos) */}
        {isWithPhotos && (
          <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">DJ / Host / Artist Photos</h3>
            <div className="grid gap-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onPhotosChange(e.target.files)}
                  className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Upload up to 5 photos. The first photo will be used as primary.
                </p>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {photos.map((file, idx) => {
                    const src = URL.createObjectURL(file)
                    return (
                      <div key={idx} className="relative rounded-md overflow-hidden border border-zinc-800 bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src || "/placeholder.svg"}
                          alt={`Upload ${idx + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5"
                          aria-label={`Remove photo ${idx + 1}`}
                        >
                          Remove
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Extras */}
        <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Extras</h3>
          <div className="grid gap-3">
            <label className="flex items-center gap-3 text-zinc-200">
              <input type="checkbox" checked={extraStory} onChange={(e) => setExtraStory(e.target.checked)} />
              <span>Story Size Version (+$10)</span>
            </label>
            <label className="flex items-center gap-3 text-zinc-200">
              <input type="checkbox" checked={extraDifferent} onChange={(e) => setExtraDifferent(e.target.checked)} />
              <span>Make Flyer Different / Custom (+$10)</span>
            </label>
            <label className="flex items-center gap-3 text-zinc-200">
              <input type="checkbox" checked={extraAnimated} onChange={(e) => setExtraAnimated(e.target.checked)} />
              <span>Animated Flyer (+$25)</span>
            </label>
            <div className="text-xs text-zinc-500">Instagram Post Size: included by default</div>
          </div>
        </section>

        {/* Delivery */}
        <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Delivery</h3>
          <div className="grid gap-2 text-zinc-200">
            {(["24h", "5h", "1h"] as DeliverySpeed[]).map((speed) => (
              <label key={speed} className="flex items-center gap-3">
                <input type="radio" name="delivery" checked={delivery === speed} onChange={() => setDelivery(speed)} />
                <span>
                  {speed === "24h" && "24 hours (Free)"}
                  {speed === "5h" && "5 hours (+$10)"}
                  {speed === "1h" && "1 hour (+$20)"}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Custom Notes</h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or changes?"
            className="bg-zinc-900 text-white border-zinc-800 min-h-24"
          />
        </section>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-400">
            By continuing you agree to our Terms and acknowledge auto-delivery to your Email / SMS / Profile.
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  )
}
