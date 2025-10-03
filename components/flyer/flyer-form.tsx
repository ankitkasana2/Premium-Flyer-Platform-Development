"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload, Calendar, Clock, MapPin, Music, User, Sparkles, Check } from "lucide-react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"

type Flyer = {
  id: string
  name: string
  category: string
  price: number
  priceType: "basic" | "regular" | "premium"
  hasPhotos: boolean
  imageUrl: string
  tags: string[]
  isRecentlyAdded?: boolean
  isFeatured?: boolean
};


const EventBookingForm = () => {

  const { authStore, filterBarStore, FlyerStore } = useStore()
  const [flyer, setFlyer] = useState<Flyer | undefined>(undefined)
  const [eventTitle, setEventTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [location, setLocation] = useState("")
  const [djName, setDjName] = useState("")
  const [hostName, setHostName] = useState("")
  const [note, setNote] = useState("")
  const [extras, setExtras] = useState({
    bottle: false,
    food: false,
    animation: false,
  })
  const [deliveryTime, setDeliveryTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [djImage, setDjImage] = useState<string | null>(null)
  const [hostImage, setHostImage] = useState<string | null>(null)


  useEffect(() => {
    // whenever store.flyer changes, update local state
    setFlyer(FlyerStore.flyer ?? undefined)
  }, [FlyerStore.flyer])




  const calculateTotal = () => {
    let total = 0
    if (extras.bottle) total += 10
    if (extras.food) total += 15
    if (extras.animation) total += 20
    if (deliveryTime === "3days") total += 20
    if (deliveryTime === "24hours") total += 40
    return total
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Form submitted:", {
      eventTitle,
      date,
      startTime,
      location,
      djName,
      hostName,
      extras,
      deliveryTime,
      note,
      total: calculateTotal(),
    })

    setIsSubmitting(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "dj" | "host") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "dj") {
          setDjImage(reader.result as string)
        } else {
          setHostImage(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-2 gap-8 p-4 md:p-8 max-w-[1600px] mx-auto">
        {/* Left Side - Event Flyer */}
        <div className="space-y-8">
          <div className="relative bg-gradient-to-br from-orange-900/20 via-black to-purple-900/20 rounded-2xl overflow-hidden border-2 border-red-600/40 glow-effect transition-all duration-300 hover:border-red-600/60">
            <div className="absolute inset-0 bg-[url('/spooky-halloween-party-atmosphere.jpg')] bg-cover bg-center opacity-20" />

            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-600/60 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-red-600/60 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-red-600/60 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-600/60 rounded-br-2xl" />

            <div className="relative p-8 md:p-12 space-y-8">
              <div className="space-y-2 float-effect">
                <h1
                  className="text-6xl md:text-7xl font-bold text-white leading-none tracking-tight drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  style={{ fontFamily: "Impact, sans-serif" }}
                >
                  It's Spooky
                  <br />
                  Season
                </h1>
                <Sparkles className="w-8 h-8 text-red-500 animate-pulse" />
              </div>

              <div className="aspect-[3/4] bg-gradient-to-b from-orange-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border-2 border-red-600/40 overflow-hidden transition-all duration-300 hover:border-red-600/70 hover:scale-[1.02]">
                <img
                  src={flyer?.imageUrl}
                  alt="Event promotional image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* <div className="flex items-baseline gap-4">
                <span className="text-7xl md:text-8xl font-bold text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
                  10
                </span>
                <span className="text-7xl md:text-8xl font-bold text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
                  03
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-white font-semibold">18+ OPEN 10PM</p>
                <p className="text-gray-300">VIBES: ZCS 76 SA86</p>
                <p className="text-gray-300">LHLT DJNQNS DBQN R16QUENTSN16.COM</p>
              </div>

              <div className="space-y-1 bg-black/40 p-4 rounded-lg border border-red-600/30">
                <p className="text-2xl font-bold text-red-500 flex items-center gap-2">
                  <Music className="w-6 h-6" />
                  MUSIC BY
                </p>
                <p className="text-xl text-white">DJ GALO</p>
                <p className="text-xl text-white">DJ BELMOR</p>
              </div>

              <div className="text-4xl font-bold tracking-wider">
                W<span className="inline-block">⊕</span>RLD
              </div>

              <div className="pt-4">
                <p className="text-xs text-gray-400">UPLQZ SEGT REALITIQN ZA SB</p>
                <p className="text-xs text-gray-400">LQHM1 DAHE 950 DP2B8</p>
              </div> */}
            </div>
          </div>

          {/* Similar Flyers */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-500">Similar Flyers</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-gradient-to-br from-orange-900/30 to-purple-900/30 rounded-lg border-2 border-red-600/30 overflow-hidden transition-all duration-300 hover:border-red-600/70 hover:scale-105 cursor-pointer"
                >
                  <img
                    src={`/halloween-party-flyer-.jpg?height=400&width=300&query=halloween+party+flyer+${i}`}
                    alt={`Similar flyer ${i}`}
                    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Details Section */}
          <div className="space-y-6 bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border-2 border-red-600/30">
            <h2 className="text-4xl font-bold text-red-500 flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="eventTitle" className="text-red-400 text-sm mb-2 block font-semibold">
                  Event Title *
                </Label>
                <Input
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  className="bg-black/60 border-2 border-red-600/50 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-lg h-12 transition-all duration-300"
                  placeholder="Enter event name..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="date"
                    className="text-red-400 text-sm mb-2 block font-semibold flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="bg-black/60 border-2 border-red-600/50 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-lg h-12 transition-all duration-300"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="startTime"
                    className="text-red-400 text-sm mb-2 block font-semibold flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Start Time *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="bg-black/60 border-2 border-red-600/50 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-lg h-12 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-red-400 text-sm mb-2 block font-semibold flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Location *
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="bg-black/60 border-2 border-red-600/50 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-lg h-12 transition-all duration-300"
                  placeholder="Enter venue address..."
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6 bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border-2 border-red-600/30">
            <h2 className="text-3xl font-bold text-red-500">Additional Information</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white text-base font-semibold flex items-center gap-2">
                    <Music className="w-5 h-5 text-red-500" />
                    Main DJ or Artist
                  </Label>
                  <label htmlFor="dj-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
                      <span className="text-sm font-semibold">Upload Image</span>
                      <Upload className="w-4 h-4" />
                    </div>
                    <input
                      id="dj-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "dj")}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3 bg-black/60 border-2 border-red-600/50 rounded-lg p-3 transition-all duration-300 hover:border-red-600/70">
                  {djImage && (
                    <img
                      src={djImage || "/placeholder.svg"}
                      alt="DJ"
                      className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                    />
                  )}
                  <Input
                    value={djName}
                    onChange={(e) => setDjName(e.target.value)}
                    placeholder="Enter DJ name..."
                    className="bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                  />
                  <span className="text-gray-500 text-sm whitespace-nowrap">
                    {djImage ? "Image uploaded" : "No file chosen"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white text-base font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-red-500" />
                    Host
                  </Label>
                  <label htmlFor="host-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
                      <span className="text-sm font-semibold">Upload Image</span>
                      <Upload className="w-4 h-4" />
                    </div>
                    <input
                      id="host-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "host")}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3 bg-black/60 border-2 border-red-600/50 rounded-lg p-3 transition-all duration-300 hover:border-red-600/70">
                  {hostImage && (
                    <img
                      src={hostImage || "/placeholder.svg"}
                      alt="Host"
                      className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                    />
                  )}
                  <Input
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Enter host name..."
                    className="bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                  />
                  <span className="text-gray-500 text-sm whitespace-nowrap">
                    {hostImage ? "Image uploaded" : "No file chosen"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Extras Section */}
          <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border-2 border-red-600/30">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-red-500 flex items-center gap-2">
                <Sparkles className="w-7 h-7" />
                Extras
              </h2>
              <Plus className="h-6 w-6 text-red-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-red-600/20 hover:border-red-600/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="bottle"
                    checked={extras.bottle}
                    onCheckedChange={(checked) => setExtras({ ...extras, bottle: checked as boolean })}
                    className="border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 rounded-sm w-5 h-5"
                  />
                  <Label htmlFor="bottle" className="text-white text-base cursor-pointer font-medium">
                    Bottle for VIP
                  </Label>
                </div>
                <span className="text-red-400 font-bold">$10</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-red-600/20 hover:border-red-600/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="food"
                    checked={extras.food}
                    onCheckedChange={(checked) => setExtras({ ...extras, food: checked as boolean })}
                    className="border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 rounded-sm w-5 h-5"
                  />
                  <Label htmlFor="food" className="text-white text-base cursor-pointer font-medium">
                    Food for VIP
                  </Label>
                </div>
                <span className="text-red-400 font-bold">$15</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-red-600/20 hover:border-red-600/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="animation"
                    checked={extras.animation}
                    onCheckedChange={(checked) => setExtras({ ...extras, animation: checked as boolean })}
                    className="border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 rounded-sm w-5 h-5"
                  />
                  <Label htmlFor="animation" className="text-white text-base cursor-pointer font-medium">
                    Add animation
                  </Label>
                </div>
                <span className="text-red-400 font-bold">$20</span>
              </div>
            </div>
          </div>

          {/* Delivery Time Section */}
          <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border-2 border-red-600/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-3xl font-bold text-red-500 flex items-center gap-2">
                <Clock className="w-7 h-7" />
                Delivery Time
              </h2>
              <div className="flex gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>3 Days $10
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>2 Days $20
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  24h $40
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-red-600/20 hover:border-red-600/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="delivery3"
                    checked={deliveryTime === "3days"}
                    onCheckedChange={(checked) => checked && setDeliveryTime("3days")}
                    className="border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 rounded-sm w-5 h-5"
                  />
                  <Label htmlFor="delivery3" className="text-white text-base cursor-pointer font-medium">
                    3 Days
                  </Label>
                </div>
                <span className="text-red-400 font-bold">$20</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-red-600/20 hover:border-red-600/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="delivery24"
                    checked={deliveryTime === "24hours"}
                    onCheckedChange={(checked) => checked && setDeliveryTime("24hours")}
                    className="border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 rounded-sm w-5 h-5"
                  />
                  <Label htmlFor="delivery24" className="text-white text-base cursor-pointer font-medium">
                    24 Hours
                  </Label>
                </div>
                <span className="text-red-400 font-bold">$40</span>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="space-y-2">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note for the designer (optional)..."
              className="bg-black/60 border-2 border-red-600/50 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-lg min-h-[120px] resize-none transition-all duration-300"
            />
          </div>

          {/* Submit Section */}
          <div className="space-y-4 bg-gradient-to-br from-red-950/30 to-black p-6 rounded-2xl border-2 border-red-600/40">
            <div className="flex items-center justify-between text-xl">
              <span className="text-white font-semibold">Total Amount:</span>
              <span className="text-red-500 font-bold text-2xl">${calculateTotal()}</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold h-14 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Submit Order
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}



export default observer(EventBookingForm)