"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload, CalendarIcon, Clock, MapPin, Music, User, Sparkles, Check } from "lucide-react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


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

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}



const EventBookingForm = () => {

  const { authStore, filterBarStore, FlyerStore } = useStore()
  const [flyer, setFlyer] = useState<Flyer | undefined>(undefined)
  const [eventTitle, setEventTitle] = useState("")
  const [date, setDate] = useState<Date | undefined>(
    new Date("2025-06-01")
  )
  const [value, setValue] = useState(formatDate(date))
  const [month, setMonth] = useState<Date | undefined>(date)
  const [open, setOpen] = useState(false)
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
  const [djImage2, setDjImage2] = useState<string | null>(null)
  const [hostImage, setHostImage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileName2, setFileName2] = useState<string | null>(null)
  const [presenting, setPresenting] = useState('')
  const [information, setInformation] = useState('')
  const [address, setAddress] = useState('')
  const [djList, setDjList] = useState<{ name: string; image: string | null }[]>([
    { name: "", image: null },
    { name: "", image: null },
  ])


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setDjList(prev => {
          const newList = [...prev]
          newList[index].image = reader.result as string
          return newList
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const name = e.target.value
    setDjList(prev => {
      const newList = [...prev]
      newList[index].name = name
      return newList
    })
  }

  const handleRemoveImage = (index: number) => {
    setDjList(prev => {
      const newList = [...prev]
      newList[index].image = null
      return newList
    })
  }

  const handleAddField = () => {
    setDjList(prev => [...prev, { name: "", image: null }])
  }

  const handleRemoveField = (index: number) => {
    setDjList(prev => prev.filter((_, i) => i !== index))
  }





  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }


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

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "dj" | "host") => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       if (type === "dj") {
  //         setDjImage(reader.result as string)
  //       } else {
  //         setHostImage(reader.result as string)
  //       }
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-2 gap-8 p-4 md:p-8 max-w-[1600px] mx-auto">
        {/* Left Side - Event Flyer */}
        <div className="space-y-8">
          <div className="relative bg-gradient-to-br from-orange-900/20 via-black to-purple-900/20 rounded-2xl overflow-hidden border-1 border-primary glow-effect transition-all duration-300 hover:border-primary">
            <div className="absolute inset-0 bg-[url('/spooky-halloween-party-atmosphere.jpg')] bg-cover bg-center opacity-20" />

            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary rounded-br-2xl" />

            <div className="relative p-8 md:p-12 space-y-8">
              <div className="space-y-2 float-effect">
                <h1
                  className="text-2xl md:text-4xl font-bold text-white leading-none tracking-tight drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  style={{ fontFamily: "Impact, sans-serif" }}
                >
                  It's Spooky
                  <br />
                  Season
                </h1>
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>

              <div className="aspect-[3/4] bg-gradient-to-b from-orange-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border-2 border-primary overflow-hidden transition-all duration-300 hover:border-primary hover:scale-[1.02]">
                <img
                  src={flyer?.imageUrl}
                  alt="Event promotional image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Similar Flyers */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Similar Flyers</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-gradient-to-br from-orange-900/30 to-purple-900/30 rounded-lg border-2 border-primary overflow-hidden transition-all duration-300 hover:border-primary hover:scale-105 cursor-pointer"
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
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Details Section */}
          <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl 
          border-1 border-primary">
            <h2 className="text-xl font-bold  flex items-center gap-3">
              <CalendarIcon className="w-4 h-4" />
              Event Details
            </h2>

            <div className=" grid grid-cols-2 gap-6">
              {/* presenting  */}
              <div className="col-span-1">
                <Label htmlFor="eventTitle" className="text-sm mb-2 block font-semibold">
                  Presenting *
                </Label>
                <Input
                  id="presenting"
                  value={presenting}
                  onChange={(e) => setPresenting(e.target.value)}
                  required
                  className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg h-10
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                  placeholder="Presenting..."
                />
              </div>

              {/* main titile  */}
              <div className="col-span-1">
                <Label htmlFor="eventTitle" className="text-sm mb-2 block font-semibold">
                  Event Title *
                </Label>
                <Input
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg h-10
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                  placeholder="Enter event name..."
                />
              </div>

              {/* date  */}
              <div>
                <Label
                  htmlFor="date"
                  className=" text-sm mb-2 font-semibold flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Date *
                </Label>
                <div className="relative flex gap-2">
                  <Input
                    id="date"
                    value={value}
                    placeholder="June 01, 2025"
                    className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg h-10
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setValue(e.target.value)
                      if (isValidDate(date)) {
                        setDate(date)
                        setMonth(date)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen(true)
                      }
                    }}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div
                        id="date-picker"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                          setDate(date)
                          setValue(formatDate(date))
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* flyer information  */}
              <div className="col-span-2">
                <Label htmlFor="eventTitle" className="text-sm mb-2 block font-semibold">
                  Flyer Information
                </Label>
                <Textarea
                  id="information"
                  value={information}
                  onChange={(e) => setInformation(e.target.value)}
                  required
                  className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg h-10
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                  placeholder="Enter flyer information..."
                />
              </div>

              {/* address and phone  */}
              <div className="col-span-2">
                <Label htmlFor="eventTitle" className="text-sm mb-2 block font-semibold">
                  Address & Phone no. *
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg h-10
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                  placeholder="Enter address & phone number..."
                />
              </div>

              {/* file upload button  */}
              <div className="col-span-1">
                <Label htmlFor="eventTitle" className="text-sm mb-2 block font-semibold">
                  Venue Logo
                </Label>
                <div className="flex flex-col gap-2">
                  {/* hidden file input */}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Shadcn Button triggers file input */}
                  <Button
                    variant="outline"
                    size={'lg'}
                    className="flex items-center gap-2 border-primary text-primary hover:!bg-gray-950 hover:text-primary"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>

                  {/* Optional: show selected file name */}
                  {fileName && (
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {fileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-6 
          rounded-2xl border-1 border-primary">
            <h2 className="text-xl font-bold ">DJ & Artist</h2>


            {djList.map((dj, index) => (
              <div key={index} className="grid grid-cols-2 gap-6 mb-4">
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Music className="w-4 h-4 text-theme" />
                      Main DJ or Artist
                    </Label>

                    <div className="flex items-center gap-4">
                      {/* Upload */}
                      <label htmlFor={`dj-upload-${index}`} className="cursor-pointer">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="text-sm font-semibold">Upload Image</span>
                          <Upload className="w-4 h-4" />
                        </div>
                        <input
                          id={`dj-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="hidden"
                        />
                      </label>

                      {/* Remove Field Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove Field
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-950 border-2 border-primary rounded-lg p-3 transition-all duration-300 h-12 hover:border-primary hover:ring-2 hover:ring-primary">
                    {dj.image && (
                      <>
                        <img
                          src={dj.image}
                          alt="DJ"
                          className="w-8 h-8 rounded-full object-fill border-2 border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-primary text-sm hover:underline"
                        >
                          Remove Image
                        </button>
                      </>
                    )}

                    <Input
                      value={dj.name}
                      onChange={(e) => handleNameChange(e, index)}
                      placeholder="Enter DJ name..."
                      className="bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />

                    <span className="text-gray-500 text-sm whitespace-nowrap">
                      {dj.image ? "Image uploaded" : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" onClick={handleAddField} className="mt-2">
              Add More
            </Button>




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