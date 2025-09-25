import React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

const HeroSection = () => {
    return (
        <section className="relative px-4 min-h-[60vh] flex items-center">
            <div className="container h-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

                <Image
                    src="/hero-section-img.jpg"
                    alt="Halloween Flyer"
                    fill
                    className="absolute inset-0 object-fill"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>


                {/* Left Side: Text + Button */}
                <div className="absolute left-[10%] flex flex-col items-center md:items-start text-center md:text-left justify-center ">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-snug tracking-wider flex flex-col">
                        HALLOWEEN <span className='text-2xl md:text-3xl'> PARTY </span>
                    </h1>
                    <Button size={'sm'} className="hover:cursor-pointer hover:scale-105 duration-300 w-[120px] tracking-[.1000rem] shadow-lg shadow-black/50]">
                        GET IT
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
