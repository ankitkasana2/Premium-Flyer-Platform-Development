"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderTracking } from "@/components/order/order-tracking"
import { useAuth } from "@/lib/auth"
import { SAMPLE_ORDERS, ORDER_STATUSES, type Order } from "@/lib/orders"
import { Search, Eye, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import OrderHistoryList from "@/components/order/order-history-list"


const orders = [
  {
    id: "ord_9f2c8a",
    title: "DJ Spin Night",
    flyerId: 'f1',
    variant: "Glossy, Full Color",
    size: '8.5" × 11"',
    quantity: 500,
    priceCents: 1500,
    currency: "USD",
    orderedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    orderTime: '12:00',
    status: "delivered" as const,
    imageUrl: "/pic10.jpg",
    orderNumber: "100245",
    deliverySpeed: '24h',
    priceDesc: {
      story : '10',
      differentDesign: '20',
      animatedFlyer: '25',
      deliverySpeed: '0',
    }
  },
  {
    id: "ord_b71d32",
    title: "DJ Groove Party",
    flyerId: 'f2',
    variant: "Matte, Double-sided",
    size: '5" × 7"',
    quantity: 1000,
    priceCents: 2500,
    currency: "USD",
    orderedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    orderTime: '16:20',
    status: "shipped" as const,
    imageUrl: "/pic25.jpg",
    orderNumber: "100141",
    deliverySpeed: '5h',
    priceDesc: {
      story : '10',
      differentDesign: '20',
      animatedFlyer: '25',
      deliverySpeed: '10',
    }
  },
  {
    id: "ord_5a03fe",
    title: "Ladies Night Out",
    flyerId: 'f4',
    variant: "Recycled Stock",
    size: '4" × 6"',
    quantity: 250,
    priceCents: 4000,
    currency: "USD",
    orderedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 62).toISOString(),
    orderTime: '11:11',
    status: "canceled" as const,
    imageUrl: "/pic21.jpg",
    orderNumber: "100079",
    deliverySpeed: '1h',
    priceDesc: {
      story : '10',
      differentDesign: '20',
      animatedFlyer: '25',
      deliverySpeed: '20',
    }
  },
]

async function handleReorder(orderId: string) {
  // In a real app, call a server action or API route here to create a new order.
  // This demo only logs to the console.
  console.log("[v0] Reorder requested for:", orderId)
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Mock orders for the current user
  const userOrders = SAMPLE_ORDERS
  const router = useRouter()

  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.flyerName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in to view your orders</h1>
        </div>
        <Footer />
      </div>
    )
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="mb-4">
              ← Back to Orders
            </Button>
          </div>
          <OrderTracking order={selectedOrder} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground text-sm">Track and manage your flyer orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-field-background border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-field-background border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (

          <OrderHistoryList orders={orders} onReorder={handleReorder} />
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"}
              </p>
              {!searchTerm && statusFilter === "all" && <Button className="hover:cursor-pointer" onClick={() => { router.push('/categories') }}>Browse Flyers</Button>}
            </CardContent>
          </Card>
        )}
      </main>

    </div>
  )
}
