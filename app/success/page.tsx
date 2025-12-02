'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🚀 Success page loaded - creating order after payment');
    
    // Get session parameters
    const sessionId = searchParams.get('session_id');
    console.log('📋 Session ID from URL:', sessionId);
    
    if (!sessionId) {
      console.log('❌ No session_id found in URL');
      setError('No session ID found. Please contact support.')
      return
    }

    // Check if order was already processed in this session
    const orderProcessed = sessionStorage.getItem('orderProcessed')
    console.log('📋 Order processed status:', orderProcessed);
    
    if (orderProcessed === 'true') {
      console.log('✅ Order already processed, skipping');
      setOrderCreated(true)
      return
    }

    // Prevent multiple executions
    if (orderCreated || isCreatingOrder) {
      console.log('⏳ Already creating order, skipping');
      return
    }

    const createOrderAfterPayment = async () => {
      console.log('🚀 Starting order creation after payment...');
      
      // Mark as processing immediately
      sessionStorage.setItem('orderProcessed', 'processing')
      setIsCreatingOrder(true)
      setError(null)

      try {
        // First try to get stored order data using temp session ID
        const tempSessionId = sessionStorage.getItem('tempSessionId')
        console.log('🔑 Temp session ID from storage:', tempSessionId);
        
        let orderData = null
        
        if (tempSessionId) {
          try {
            const storedResponse = await fetch(`/api/checkout/store-order-data?sessionId=${tempSessionId}`)
            if (storedResponse.ok) {
              const storedData = await storedResponse.json()
              orderData = storedData.orderData
              console.log('✅ Retrieved REAL order data from storage:', orderData)
            } else {
              console.log('❌ Failed to retrieve stored order data')
            }
          } catch (error) {
            console.log('❌ Error retrieving stored order data:', error)
          }
        }

        // If no stored data, try to get from sessionStorage backup
        if (!orderData) {
          const pendingOrderData = sessionStorage.getItem('pendingOrder')
          if (pendingOrderData) {
            orderData = JSON.parse(pendingOrderData)
            console.log('✅ Retrieved order data from sessionStorage backup:', orderData)
          }
        }

        // If still no data, show error - we need real data to create order
        if (!orderData) {
          console.log('❌ No stored order data found - cannot create order without real form data')
          setError('Order data not found. Please fill out the form again and try checkout.')
          sessionStorage.removeItem('orderProcessed')
          return
        }

        console.log('📋 Creating order with data:', orderData);

        // Create FormData for the order API
        const formData = new FormData()

        // Add all order fields
        formData.append('presenting', orderData.presenting || '')
        formData.append('event_title', orderData.event_title || '')
        formData.append('event_date', orderData.event_date || '')
        formData.append('flyer_info', orderData.flyer_info || '')
        formData.append('address_phone', orderData.address_phone || '')
        formData.append('story_size_version', (orderData.story_size_version || false).toString())
        formData.append('custom_flyer', (orderData.custom_flyer || false).toString())
        formData.append('animated_flyer', (orderData.animated_flyer || false).toString())
        formData.append('instagram_post_size', (orderData.instagram_post_size || true).toString())
        formData.append('delivery_time', orderData.delivery_time || '24 hours')
        formData.append('custom_notes', orderData.custom_notes || '')
        formData.append('flyer_is', orderData.flyer_id || '1')
        formData.append('category_id', orderData.category_id || '1')
        formData.append('user_id', orderData.user_id || '')
        formData.append('web_user_id', orderData.web_user_id || '')
        formData.append('email', orderData.email || 'user@example.com')
        formData.append('total_price', (orderData.total_price || 0).toString())
        formData.append('subtotal', (orderData.subtotal || 0).toString())
        formData.append('image_url', orderData.image_url || '')
        
        // Add JSON fields
        formData.append('djs', JSON.stringify(orderData.djs || []))
        formData.append('host', JSON.stringify(orderData.host || {}))
        formData.append('sponsors', JSON.stringify(orderData.sponsors || []))

        console.log('✅ FormData prepared, calling API now...');
        
        // Send order to backend
        const response = await fetch('/api/orders', {
          method: 'POST',
          body: formData,
        })

        console.log('✅ API called, response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
          console.error('❌ API Error:', errorData);
          throw new Error(errorData.message || 'Failed to create order')
        }

        const result = await response.json()
        console.log('✅ Order created successfully:', result);
        
        setOrderCreated(true)
        
        // Mark as completed
        sessionStorage.setItem('orderProcessed', 'true')
        
        // Clean up session storage
        sessionStorage.removeItem('pendingOrder')
        sessionStorage.removeItem('tempSessionId')

        // Redirect to thank you page
        const orderId = result.orderId || result.id || result._id
        setTimeout(() => {
          router.push(`/thank-you${orderId ? `?orderId=${orderId}` : ''}`)
        }, 2000)

      } catch (err: any) {
        console.error('❌ Error creating order:', err);
        setError(err.message || 'Failed to create order. Please contact support.')
        // Remove processing flag on error to allow retry
        sessionStorage.removeItem('orderProcessed')
      } finally {
        setIsCreatingOrder(false)
      }
    }

    createOrderAfterPayment()

    // Cleanup function to reset flag if user navigates away during processing
    return () => {
      if (isCreatingOrder) {
        sessionStorage.removeItem('orderProcessed')
      }
    }
  }, [searchParams, router, orderCreated, isCreatingOrder])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950/30 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 text-center">
        {isCreatingOrder ? (
          <>
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Creating Your Order...</h1>
            <p className="text-gray-300">Please wait while we process your order.</p>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Order Error</h1>
            <p className="text-gray-300 mb-6 whitespace-pre-line">{error}</p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/')} className="w-full">
                Go Back Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/flyer-form')}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Start New Order
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-gray-300 mb-6">
              Your order has been created successfully and will be processed shortly.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/')} className="w-full">
                Go Back Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/order-confirmation')}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                View Order Details
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
