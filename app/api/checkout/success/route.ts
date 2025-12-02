import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const BACKEND_API_URL = "http://193.203.161.174:3007";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      console.error('No session_id in request')
      return NextResponse.redirect(
        new URL('/checkout?error=missing_session_id', request.url)
      )
    }

    console.log('Processing success for session:', sessionId)

    // Retrieve the session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      console.error('Session not found:', sessionId)
      return NextResponse.redirect(
        new URL('/checkout?error=session_not_found', request.url)
      )
    }

    if (session.payment_status !== 'paid') {
      console.error('Payment not successful for session:', sessionId)
      return NextResponse.redirect(
        new URL('/checkout?error=payment_failed', request.url)
      )
    }

    console.log('✅ Payment successful, processing order...')

    // Since we can't access sessionStorage from server-side, we need to create a fallback
    // or use the metadata to identify the order. For now, let's create a basic order
    // with the available metadata and enhance it as much as possible.

    const userId = session.metadata?.userId || ''
    const flyerId = session.metadata?.flyerId || ''
    const totalPrice = session.metadata?.totalPrice || '0'
    const eventTitle = session.metadata?.eventTitle || 'Event'
    const subtotal = session.metadata?.subtotal || '0'

    console.log('📋 Creating order with available metadata:', { userId, flyerId, totalPrice, eventTitle, subtotal })

    // Create FormData for the backend API
    const formData = new FormData()
    
    // Add all available fields
    formData.append('presenting', eventTitle || 'Event Presenter')
    formData.append('event_title', eventTitle || 'Event Title')
    formData.append('event_date', new Date().toISOString().split('T')[0])
    formData.append('flyer_info', 'Event flyer created after payment')
    formData.append('address_phone', 'Event contact information')
    formData.append('story_size_version', 'false')
    formData.append('custom_flyer', 'false')
    formData.append('animated_flyer', 'false')
    formData.append('instagram_post_size', 'true')
    formData.append('delivery_time', '24 hours')
    formData.append('custom_notes', 'Order created after successful payment')
    formData.append('flyer_is', flyerId || '1')
    formData.append('category_id', '1')
    formData.append('user_id', userId)
    formData.append('web_user_id', userId)
    formData.append('email', 'user@example.com')
    formData.append('total_price', totalPrice)
    formData.append('subtotal', subtotal)
    formData.append('image_url', '')
    
    // Add basic JSON fields
    formData.append('djs', JSON.stringify([{ name: 'Main DJ' }, { name: 'Second DJ' }]))
    formData.append('host', JSON.stringify({ name: 'Event Host' }))
    formData.append('sponsors', JSON.stringify([{ name: 'Sponsor 1' }, { name: 'Sponsor 2' }, { name: 'Sponsor 3' }]))

    console.log('📤 Submitting order to backend API...')
    console.log('📋 FormData keys:', Array.from(formData.keys()))

    // Submit to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/orders`, {
      method: 'POST',
      body: formData
    })

    console.log('📬 Backend API response status:', response.status)
    console.log('✅ Backend API response ok:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Backend API error:', errorText)
      
      return NextResponse.redirect(
        new URL(`/success?order_created=false&error=${encodeURIComponent('Failed to create order in backend')}`, request.url)
      )
    }

    const responseData = await response.json()
    console.log('🎉 Order created successfully:', responseData)

    // Get order ID from response
    const orderId = responseData.orderId || responseData.id || responseData._id
    console.log('📋 Order created with ID:', orderId)

    // Redirect to thank you page with order ID
    return NextResponse.redirect(
      new URL(`/thank-you${orderId ? `?orderId=${orderId}` : ''}`, request.url)
    )

  } catch (error) {
    console.error('❌ Checkout success handler error:', error)
    return NextResponse.redirect(
      new URL(`/success?order_created=false&error=${encodeURIComponent('Processing error')}`, request.url)
    )
  }
}
