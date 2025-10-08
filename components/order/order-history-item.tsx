"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export type OrderHistoryItemProps = {
  order: {
    id: string
    title: string
    flyerId: string
    variant?: string
    size?: string
    quantity: number
    priceCents: number
    currency?: string
    orderedAt: string // ISO string
    status: "processing" | "shipped" | "delivered" | "canceled"
    imageUrl?: string
    orderNumber?: string
  }
  className?: string
  onReorder?: (orderId: string) => Promise<void> | void
}

function formatMoney(cents: number, currency = "USD") {
  const amount = cents / 100
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function statusBadgeVariant(status: OrderHistoryItemProps["order"]["status"]) {
  switch (status) {
    case "processing":
      return "secondary" as const
    case "shipped":
      return "secondary" as const
    case "delivered":
      return "outline" as const
    case "canceled":
      return "destructive" as const
    default:
      return "secondary" as const
  }
}

export function OrderHistoryItem({ order, className, onReorder }: OrderHistoryItemProps) {
  const { toast } = useToast()
  const [isReordering, setIsReordering] = React.useState(false)
  const router = useRouter()


  return (
    <Card
      className={cn(
        "p-4 md:p-5 bg-field-background text-card-foreground",
        "flex flex-col gap-4 md:flex-row md:items-start",
        className,
      )} 
      role="article"
      aria-label={`Order ${order.orderNumber || order.id}`}
    >
      {/* Image */}
      <figure className={cn("w-full md:w-40 lg:w-48", "rounded-lg overflow-hidden bg-secondary")}>
        <img
          src={order.imageUrl || "/placeholder.svg?height=192&width=192&query=flyer%20preview" || "/placeholder.svg"}
          alt={`Flyer preview: ${order.title}`}
          className="h-40 w-full object-cover md:h-48"
        />
        <figcaption className="sr-only">{"Flyer image"}</figcaption>
      </figure>

      {/* Details + Actions */}
      <div className="flex-1 grid gap-3">
        {/* Header row */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="grid gap-1">
            <h3 className="text-base md:text-lg font-semibold text-pretty">{order.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {order.orderNumber ? <span>Order #{order.orderNumber}</span> : null}
              <span className="hidden md:inline" aria-hidden>
                ·
              </span>
              <time dateTime={order.orderedAt}>{new Date(order.orderedAt).toLocaleDateString()}</time>
              <span className="hidden md:inline" aria-hidden>
                ·
              </span>
              <Badge variant={statusBadgeVariant(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="sr-only">Order total</span>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-medium">{formatMoney(order.priceCents, order.currency)}</div>
            </div>
            <Button
              onClick={()=>{router.push(`/flyer/${order.flyerId}`)}}
            >
              {isReordering ? "Reordering…" : "Reorder"}
            </Button>
          </div>
        </div>

        {/* Key specs */}
        <div
          className={cn("grid gap-2 rounded-md border border-border", "bg-card/50 p-3 md:p-4")}
          role="list"
          aria-label="Order details"
        >
          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <div className="grid gap-1" role="listitem">
              <span className="text-muted-foreground">Variant</span>
              <span className="font-medium">{order.variant || "Standard Flyers"}</span>
            </div>
            <div className="grid gap-1" role="listitem">
              <span className="text-muted-foreground">Size</span>
              <span className="font-medium">{order.size || '8.5" × 11"'}</span>
            </div>
            <div className="grid gap-1" role="listitem">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">{order.quantity}</span>
            </div>
            <div className="grid gap-1" role="listitem">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-sm">{order.id}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default OrderHistoryItem
