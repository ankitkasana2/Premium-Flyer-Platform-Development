import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

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

    console.log('Payment successful, processing order...')

    // Get order data from metadata
    const orderDataStr = session.metadata?.orderData
    if (!orderDataStr) {
      console.error('No order data in session metadata')
      return NextResponse.redirect(
        new URL('/checkout?error=missing_order_data', request.url)
      )
    }

    const orderData = JSON.parse(orderDataStr)
    console.log('Order data from metadata:', orderData)

    // Transform the data to match the backend API format (using real data)
    const transformedData = {
      presenting: orderData.eventDetails?.presenting || '',
      event_title: orderData.eventDetails?.mainTitle || '',
      event_date: orderData.eventDetails?.date || '',
      address_phone: `${orderData.eventDetails?.address || ''} | ${orderData.eventDetails?.phoneNumber || ''}`,
      flyer_info: orderData.eventDetails?.eventInformation || '',
      custom_notes: orderData.eventDetails?.customNotes || '',
      delivery_time: orderData.deliveryTime || '1 Hour',
      email: orderData.email || orderData.userEmail || 'user@example.com', // Use real email
      story_size_version: orderData.extras?.storySizeVersion || false,
      custom_flyer: orderData.extras?.customFlyer || false,
      animated_flyer: orderData.extras?.animatedFlyer || false,
      instagram_post_size: orderData.extras?.instagramPostSize || true,
      flyer_is: orderData.flyerId || 26,
      category_id: orderData.categoryId || 9,
      user_id: orderData.userId || orderData.user?.id || '99ae0488-f0a1-70db-db50-da298fdef51esery', // Use real user ID
      total_price: orderData.subtotal || 10,
      subtotal: orderData.subtotal || 10,
      image_url: orderData.image || orderData.imageUrl || 'https://images.unsplash.com/photo.jpg',
      web_user_id: ''
    }

    console.log('Transformed data for API:', transformedData)

    // Create FormData for the backend API
    const formData = new FormData()
    
    // Add all text fields
    Object.entries(transformedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })
    
    // Add JSON fields
    const djs = [
      { name: orderData.eventDetails?.mainDJ || 'DJ 1' },
      ...(orderData.eventDetails?.additionalDJs?.filter((dj: string) => dj.trim()) || []).map((name: string) => ({ name }))
    ]
    formData.append('djs', JSON.stringify(djs))
    formData.append('host', JSON.stringify({ name: orderData.eventDetails?.hostedBy || 'Test Host' }))
    formData.append('sponsors', JSON.stringify([{ name: 'Sponsor 1' }, { name: 'Sponsor 2' }]))
    
    // Add the duplicate total_price field with space (as seen in Postman)
    formData.append(' total_price', String(orderData.subtotal || 78))

    // Submit to backend API
    console.log('Submitting to backend API...')
    const response = await fetch('http://193.203.161.174:3007/api/orders', {
      method: 'POST',
      body: formData
    })

    console.log('Backend API response status:', response.status)
    console.log('Backend API response ok:', response.ok)

    const responseData = await response.json()
    console.log('Backend API response:', responseData)

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create order')
    }

    // Get order ID from response
    const orderId = responseData.orderId || responseData.id || responseData._id
    console.log('Order created with ID:', orderId)

    // Redirect to thank you page
    return NextResponse.redirect(
      new URL(`/thank-you${orderId ? `?orderId=${orderId}` : ''}`, request.url)
    )
  } catch (error) {
    console.error('Checkout success handler error:', error)
    return NextResponse.redirect(
      new URL('/checkout?error=processing_error', request.url)
    )
  }
}
