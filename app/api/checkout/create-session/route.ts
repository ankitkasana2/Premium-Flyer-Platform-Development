import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

// In-memory storage for order data (temporary until payment completes)
// In production, use Redis or database
const orderDataStore = new Map<string, any>()

export async function POST(request: Request) {
  try {
    const { amount, orderData } = await request.json()

    console.log('📋 Creating Stripe session with order data')
    console.log('💰 Amount:', amount)
    console.log('📦 Order data received:', {
      userId: orderData.userId,
      email: orderData.userEmail,
      presenting: orderData.formData?.presenting,
      total_price: orderData.formData?.total_price
    })

    // Generate a unique temp session ID for storing order data
    const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Store complete order data temporarily (will be retrieved after payment)
    orderDataStore.set(tempSessionId, {
      orderData,
      timestamp: Date.now()
    })

    console.log('🔑 Temp session ID created:', tempSessionId)
    console.log('💾 Order data stored in memory')

    // Clean up old entries (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    for (const [key, value] of orderDataStore.entries()) {
      if (value.timestamp < oneHourAgo) {
        orderDataStore.delete(key)
      }
    }

    // Create a Stripe Checkout Session with minimal metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Flyer Design Order',
              description: `Custom flyer for ${orderData.formData?.presenting || 'Event'}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        // Store only essential data (Stripe has 500 char limit per metadata value)
        tempSessionId: tempSessionId,
        userId: orderData.userId || '',
        userEmail: orderData.userEmail || '',
        totalPrice: amount.toString(),
      },
    })

    console.log('✅ Stripe session created:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      tempSessionId: tempSessionId // Return to client for backup storage
    })
  } catch (error) {
    console.error('❌ Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Export function to retrieve stored order data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tempSessionId = searchParams.get('tempSessionId')

    if (!tempSessionId) {
      return NextResponse.json(
        { error: 'Missing tempSessionId' },
        { status: 400 }
      )
    }

    const stored = orderDataStore.get(tempSessionId)

    if (!stored) {
      return NextResponse.json(
        { error: 'Order data not found or expired' },
        { status: 404 }
      )
    }

    // Return the order data and delete it (one-time use)
    orderDataStore.delete(tempSessionId)

    return NextResponse.json({
      success: true,
      orderData: stored.orderData
    })
  } catch (error) {
    console.error('❌ Error retrieving order data:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve order data' },
      { status: 500 }
    )
  }
}
