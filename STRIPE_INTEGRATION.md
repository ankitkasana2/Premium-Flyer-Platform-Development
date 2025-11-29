# Stripe Checkout Integration

This document explains the Stripe checkout and order submission implementation for the flyer ordering application.

## Overview

The application now supports a complete checkout flow:
1. User fills out the order form with event details and uploads files
2. User clicks "Proceed to Payment"
3. Stripe Checkout session is created
4. User is redirected to Stripe's secure payment page
5. After successful payment, order is submitted to the backend API
6. User is redirected to a thank you page with order confirmation

## Key Components

### 1. Order Form (`components/order/order-form.tsx`)
- Collects all order information
- Handles file uploads (venue logo, host file, DJ images)
- Integrates with Stripe checkout
- Shows loading states and error messages

### 2. Checkout Hook (`hooks/useCheckout.ts`)
- Manages the Stripe checkout process
- Creates checkout sessions via API
- Handles errors and loading states

### 3. Order Submission Hook (`hooks/useOrderSubmission.ts`)
- Submits orders to the backend API
- Handles multipart form data with files
- Manages success/error states

### 4. API Routes
- `app/api/checkout/create-session/route.ts`: Creates Stripe checkout sessions
- `app/api/checkout/success/route.ts`: Handles successful payments and order submission

### 5. Pages
- `app/checkout/page.tsx`: Displays the order form
- `app/thank-you/page.tsx`: Shows order confirmation after successful payment

## API Integration

The backend API expects:
- **Endpoint**: `POST http://193.203.161.174:3007/api/orders`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - Text fields (presenting, event_title, etc.)
  - JSON stringified arrays (djs, host, sponsors)
  - Boolean fields as strings ("true"/"false")
  - Files with specific keys (venue_logo, host_file, dj_0, dj_1, sponsor_0, etc.)

## File Upload Structure

Files are uploaded as part of the order submission:
- `venue_logo`: Venue logo file
- `host_file`: Host/promoter file
- `dj_0`, `dj_1`, ...: DJ image files
- `sponsor_0`, `sponsor_1`, ...: Sponsor files

## Error Handling

The implementation includes comprehensive error handling:
- Stripe loading errors
- Checkout session creation errors
- Payment failures
- Order submission errors
- Network errors

## Testing

To test the checkout flow:

1. Set up your Stripe keys in `.env.local`
2. Use Stripe test cards:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
3. Navigate to `/checkout?flyerId=<flyer-id>`
4. Fill out the form and submit
5. Complete the test payment in Stripe Checkout

## Security Considerations

- Stripe keys are stored in environment variables
- No sensitive data is exposed to the client
- Payments are processed through Stripe's secure infrastructure
- Webhook verification for production (to be implemented)

## Future Enhancements

1. **Webhook Integration**: Set up Stripe webhooks for real-time payment confirmation
2. **User Authentication**: Integrate with AWS Cognito for user management
3. **Order History**: Implement order tracking and history pages
4. **Email Notifications**: Send confirmation emails after successful orders
5. **File Validation**: Add client-side file size and type validation
6. **Saved Drafts**: Allow users to save order drafts before payment

## Troubleshooting

### Common Issues

1. **"Failed to load Stripe"**
   - Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
   - Ensure the key starts with `pk_test_` for test mode

2. **"Failed to create checkout session"**
   - Check that `STRIPE_SECRET_KEY` is set correctly
   - Verify the key starts with `sk_test_` for test mode
   - Check server logs for detailed error messages

3. **Order not created after payment**
   - Check the success webhook handler logs
   - Verify the backend API is accessible
   - Check that the order data format matches API expectations

4. **Memory issues with large files**
   - Files are uploaded as part of the order submission
   - Consider implementing separate file upload for large files
   - Add file size limits on the client side

## Support

For issues related to:
- Stripe integration: Check Stripe documentation
- Backend API: Contact the backend team
- Frontend implementation: Check the component documentation
