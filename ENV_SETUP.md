# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

### Stripe Configuration
```bash
# Stripe Publishable Key (found in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Secret Key (found in Stripe Dashboard > Developers > API keys)
STRIPE_SECRET_KEY=sk_test_...
```

### Application URLs
```bash
# Base URL of your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Backend API URL
NEXT_PUBLIC_API_URL=http://193.203.161.174:3007
```

## Getting Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. In the left sidebar, go to **Developers** > **API keys**
4. Copy the **Publishable key** (starts with `pk_test_` for test mode)
5. Reveal and copy the **Secret key** (starts with `sk_test_` for test mode)
6. Add them to your `.env.local` file

## Test Mode vs Live Mode

- **Test Mode**: Use keys that start with `pk_test_` and `sk_test_`
- **Live Mode**: Use keys that start with `pk_live_` and `sk_live_`

**Never use live keys in development!**

## Webhook Configuration (Optional)

For production, you'll need to configure webhooks:

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/checkout/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## Testing

Use Stripe test cards to test the payment flow:

- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Notes

- The `.env.local` file should never be committed to version control
- Make sure to restart your development server after changing environment variables
- In production, ensure these variables are set in your hosting environment
