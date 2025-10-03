'use client'

import EventBookingForm from "@/components/flyer/flyer-form"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"



const FlyerPage = ()=> {

  const { authStore, filterBarStore, FlyerStore } = useStore()
  const {FlyerId} = useParams()

  useEffect(() => {
    FlyerStore.fetchFlyer(FlyerId as string)
  }, [FlyerId])
  

  

  return (
    <main className="min-h-screen bg-black">
      <EventBookingForm />
    </main>
  )
}


export default observer(FlyerPage);