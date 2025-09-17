import React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

const HeroSection = () => {
    return (
        <section className="relative px-4 min-h-[80vh] flex items-center">
            <div className="container h-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

                {/* Left Side: Text + Button */}
                <div className="absolute left-[8%] flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 [text-shadow:_2px_2px_6px_rgba(239,68,68,0.8)] tracking-wider">
                        HALLOWEEN PARTY
                    </h1>
                    <Button className="hover:cursor-pointer hover:scale-105 duration-300 w-[200px] tracking-[.1500rem]">
                        GET
                    </Button>
                </div>

                {/* Right Side: Image */}
                <div className="absolute right-[5%] h-[300px] w-[260px] sm:h-[400px] sm:w-[320px] md:h-[80%] md:w-[380px] rounded-md overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                    <Image
                        src="/halloween-horror-party-flyer-spooky.jpg"
                        alt="Halloween Flyer"
                        fill
                        className="object-cover hover:scale-105 duration-300 h-full"
                    />
                </div>

            </div>
        </section>
    )
}

export default HeroSection
