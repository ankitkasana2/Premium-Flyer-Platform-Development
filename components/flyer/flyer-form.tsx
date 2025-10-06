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
import SponsorsBlock from "../orer-form/sponser"
import ExtrasBlock from "../orer-form/extra-block"
import DeliveryTimeBlock from "../orer-form/delivery-time-block"
import { FlyersCarousel } from "../home/FlyersCarousel"


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

  const { authStore, filterBarStore, FlyerFormStore } = useStore()
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
  const [hostImage, setDjImage] = useState<string | null>(null)
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
  const [host, setHost] = useState<{ name: string; image: string | null }[]>([
    { name: "", image: null },
  ])


  // for host 
  const handleFileUploadHost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDjImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  // for artist 
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
    setFlyer(FlyerFormStore.flyer ?? undefined)
  }, [FlyerFormStore.flyer])




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



  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-2 gap-8 p-4 md:p-8 max-w-[1600px] mx-auto">
        {/* Left Side - Event Flyer */}
        <div className="space-y-6">
          <div className="relative bg-gradient-to-br from-orange-900/20 via-black to-purple-900/20 rounded-2xl overflow-hidden border-1 border-primary glow-effect transition-all duration-300 hover:border-primary">


            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary rounded-br-2xl" />

            <div className="relative p-3 md:p-6 space-y-4">
              <div className="space-y-2 float-effect">
                <h1
                  className="text-xl md:text-3xl font-bold text-white leading-none tracking-tight drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  style={{ fontFamily: "Impact, sans-serif" }}
                >
                  {flyer?.name}
                </h1>
              </div>

              <div className="aspect-[3/4]  rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-primary hover:scale-[1.02]">
                <img
                  src={flyer?.imageUrl}
                  alt="Event promotional image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Details Section */}
          <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl 
          border-1 border-gray-800">
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
                <Input
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
          <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 
          rounded-2xl border-1 border-gray-800">
            <h2 className="text-xl font-bold ">DJ or Artist</h2>

            {djList.map((dj, index) => (
              <div key={index} className="grid grid-cols-2 gap-6 mb-4">
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Music className="w-4 h-4 text-theme text-sm" />
                      Main DJ or Artist {index + 1}
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
                        className="text-primary cursor-pointer text-xs hover:underline"
                      >
                        Remove Field
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-950 border-1 rounded-lg p-3  h-10  shadow-md
             hover:!ring-0 hover:!outline-none hover:!border-primary
             hover:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300">
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

            <Button type="button" onClick={handleAddField} className="mt-2 bg-primary hover:cursor-pointer">
              Add More
            </Button>

          </div>


          {/* Host Information Section */}
          <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border-1 border-gray-800">
            <h2 className="text-xl font-bold">Host</h2>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Music className="w-4 h-4 text-theme text-sm" />
                    Main DJ or Artist
                  </Label>

                  <div className="flex items-center gap-4">
                    {/* Upload */}
                    <label htmlFor="dj-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-primary">
                        <span className="text-sm font-semibold">Upload Image</span>
                        <Upload className="w-4 h-4" />
                      </div>
                      <input
                        id="dj-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUploadHost}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-950 border-1 rounded-lg p-3 h-10 shadow-md
        hover:!ring-0 hover:!outline-none hover:!border-primary
        hover:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
        transition-all duration-300">

                  {hostImage && (
                    <>
                      <img
                        src={hostImage}
                        alt="DJ"
                        className="w-8 h-8 rounded-full object-fill border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setDjImage(null)}
                        className="text-primary text-xs hover:underline"
                      >
                        Remove Image
                      </button>
                    </>
                  )}

                  <Input
                    value={djName}
                    onChange={(e) => setDjName(e.target.value)}
                    placeholder="Enter DJ name..."
                    className="bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                  />

                  <span className="text-gray-500 text-sm whitespace-nowrap">
                    {hostImage ? "Image uploaded" : "No file chosen"}
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* sponser Section */}
          <SponsorsBlock />


          {/* Extras Section */}
          <ExtrasBlock />

          {/* Delivery Time Section */}
          <DeliveryTimeBlock />

          {/* Note Section */}
          <div className="space-y-2">
            <Textarea
              value={note}
              rows={5}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note for the designer (optional)..."
              className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg 
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
            />
          </div>

          {/* Submit Section */}
          <div className="bg-gradient-to-br from-red-950/30 to-black p-4 rounded-2xl border border-gray-800 
          flex items-center justify-between">
            {/* Left: Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-red-550 text-white font-bold h-9 px-3 
              text-base rounded-lg hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/50"
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

            {/* Right: Total Amount */}
            <div className="text-right">
              <span className="block text-sm text-gray-300 font-semibold">Total</span>
              <span className="text-primary font-bold text-lg">${calculateTotal()}</span>
            </div>
          </div>

        </form>
      </div>
      {/* Similar Flyers */}
      <div className="space-y-4 p-4  rounded-2xl mt-10">
        <h3 className="text-xl font-bold text-white">Similar Flyers</h3>

        <div className="">
          <FlyersCarousel flyers={FlyerFormStore.similarFlyers} />
        </div>
      </div>
    </div>
  )
}



export default observer(EventBookingForm)