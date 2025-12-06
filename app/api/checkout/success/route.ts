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
      console.error('❌ No session_id in request')
      return NextResponse.redirect(
        new URL('/checkout?error=missing_session_id', request.url)
      )
    }

    console.log('🔍 Processing success for session:', sessionId)

    // Retrieve the session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      console.error('❌ Session not found:', sessionId)
      return NextResponse.redirect(
        new URL('/checkout?error=session_not_found', request.url)
      )
    }

    if (session.payment_status !== 'paid') {
      console.error('❌ Payment not successful for session:', sessionId)
      return NextResponse.redirect(
        new URL('/checkout?error=payment_failed', request.url)
      )
    }

    console.log('✅ Payment verified successfully!')

    // Get tempSessionId from metadata
    const tempSessionId = session.metadata?.tempSessionId

    if (!tempSessionId) {
      console.error('❌ No tempSessionId found in session metadata')
      return NextResponse.redirect(
        new URL(`/success?session_id=${sessionId}&error=${encodeURIComponent('Order data reference not found')}`, request.url)
      )
    }

    console.log('🔑 Temp session ID from metadata:', tempSessionId)

    // Retrieve order data from temporary storage
    let orderData
    try {
      const retrieveResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/checkout/create-session?tempSessionId=${tempSessionId}`
      )

      if (!retrieveResponse.ok) {
        console.error('❌ Failed to retrieve order data from storage')
        throw new Error('Order data not found in storage')
      }

      const retrieveData = await retrieveResponse.json()
      orderData = retrieveData.orderData
      console.log('✅ Retrieved order data from storage:', {
        userId: orderData.userId,
        presenting: orderData.formData?.presenting,
        total_price: orderData.formData?.total_price
      })
    } catch (retrieveError) {
      console.error('❌ Error retrieving order data:', retrieveError)
      return NextResponse.redirect(
        new URL(`/success?session_id=${sessionId}&error=${encodeURIComponent('Order data not found or expired')}`, request.url)
      )
    }

    // Extract form data from the retrieved order data
    const formDataObj = orderData.formData || orderData

    console.log('🚀 Creating REAL order with actual form data...')

    // Create FormData for the backend API with REAL data
    const formData = new FormData()

    // Add all fields from the actual order data
    formData.append('presenting', formDataObj.presenting || '')
    formData.append('event_title', formDataObj.event_title || '')
    formData.append('event_date', formDataObj.event_date || '')
    formData.append('flyer_info', formDataObj.flyer_info || '')
    formData.append('address_phone', formDataObj.address_phone || '')
    formData.append('story_size_version', (formDataObj.story_size_version || false).toString())
    formData.append('custom_flyer', (formDataObj.custom_flyer || false).toString())
    formData.append('animated_flyer', (formDataObj.animated_flyer || false).toString())
    formData.append('instagram_post_size', (formDataObj.instagram_post_size || true).toString())
    formData.append('delivery_time', formDataObj.delivery_time || '24 hours')
    formData.append('custom_notes', formDataObj.custom_notes || '')
    formData.append('flyer_is', (formDataObj.flyer_is || 1).toString())
    formData.append('category_id', (formDataObj.category_id || 1).toString())
    formData.append('user_id', formDataObj.user_id || orderData.userId || '')
    formData.append('web_user_id', formDataObj.user_id || orderData.userId || '')
    formData.append('email', formDataObj.email || orderData.userEmail || 'user@example.com')
    formData.append('total_price', (formDataObj.total_price || 0).toString())
    formData.append('subtotal', (formDataObj.subtotal || 0).toString())
    formData.append('image_url', formDataObj.image_url || '')

    // Add JSON fields with actual data
    formData.append('djs', JSON.stringify(formDataObj.djs || []))
    formData.append('host', JSON.stringify(formDataObj.host || {}))
    formData.append('sponsors', JSON.stringify(formDataObj.sponsors || []))

    console.log('📤 Submitting REAL order to backend API...')
    console.log('📋 Order details:', {
      presenting: formDataObj.presenting,
      event_title: formDataObj.event_title,
      total_price: formDataObj.total_price,
      user_id: formDataObj.user_id
    })

    // Submit to backend API - THIS IS THE ONLY PLACE WHERE ORDER IS CREATED
    const response = await fetch(`${BACKEND_API_URL}/api/orders`, {
      method: 'POST',
      body: formData
    })

    console.log('📬 Backend API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Backend API error:', errorText)

      return NextResponse.redirect(
        new URL(`/success?session_id=${sessionId}&order_created=false&error=${encodeURIComponent('Failed to create order')}`, request.url)
      )
    }

    const responseData = await response.json()
    console.log('🎉 Order created successfully:', responseData)

    // Get order ID from response
    const orderId = responseData.orderId || responseData.id || responseData._id
    console.log('📋 Order ID:', orderId)

    // Redirect to thank you page with order ID and session ID
    return NextResponse.redirect(
      new URL(`/thank-you?orderId=${orderId || ''}&session_id=${sessionId}&order_created=true`, request.url)
    )

  } catch (error) {
    console.error('❌ Checkout success handler error:', error)
    return NextResponse.redirect(
      new URL(`/success?order_created=false&error=${encodeURIComponent('Processing error')}`, request.url)
    )
  }
}
