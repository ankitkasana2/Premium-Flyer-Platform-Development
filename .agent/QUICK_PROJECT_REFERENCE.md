# 🚀 Grodify - Quick Reference Guide

## 📌 Essential Information

**Project:** Premium Digital Flyer Marketplace  
**Framework:** Next.js 14 + TypeScript + MobX  
**Theme:** Netflix-inspired (Black/Red)  
**Backend API:** http://193.203.161.174:3007

---

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Dev Server:** http://localhost:3000

---

## 📂 Key Directories

| Directory | Purpose |
|-----------|---------|
| `/app` | Next.js pages (App Router) |
| `/components` | React components |
| `/stores` | MobX state stores |
| `/lib` | Utilities and helpers |
| `/config` | Configuration files |
| `/public` | Static assets |

---

## 🔑 Core Stores (MobX)

### AuthStore
```typescript
// Login
await authStore.login({ email, password })

// Register
await authStore.register({ fullname, email, password })

// OAuth
await authStore.signInWithProvider('google' | 'apple')

// Logout
await authStore.logout()

// Check auth status
authStore.isLoggedIn
authStore.user
```

### FlyersStore
```typescript
// Fetch all flyers
await flyersStore.fetchFlyers()

// Get flyers by category
flyersStore.flyersByCategory('Ladies Night')

// Get special categories
flyersStore.recentlyAdded
flyersStore.premiumFlyers  // $40
flyersStore.basicFlyers    // $10
```

### CartStore
```typescript
// Load cart
await cartStore.load(userId)

// Add to cart
await cartStore.addToCart(formData)

// Get cart info
cartStore.count
cartStore.totalPrice
cartStore.cartItems
```

### BannerStore
```typescript
// Fetch banners
await bannerStore.fetchBanners()

// Get active banners
bannerStore.activeBanners

// Get banner link
bannerStore.getBannerLink(banner)
```

---

## 🎨 Color Scheme

```css
/* Primary */
--primary: #b92025        /* Netflix Red */
--background: #000000     /* Black */
--foreground: #ffffff     /* White */

/* Accent */
--secondary: #f59e0b      /* Golden */
--accent: #f59e0b         /* Golden */

/* UI */
--card: oklch(13% 0.028 261.692)  /* Dark Gray */
--border: oklch(27.8% 0.033 256.848)
--input: #1f2937
```

---

## 🔌 API Endpoints

### Flyers
```typescript
GET /api/flyers              // Get all flyers
```

### Banners
```typescript
GET /api/banners             // Get all banners
```

### Cart
```typescript
GET /api/cart/{userId}       // Get user cart
POST /api/cart/add           // Add to cart
DELETE /api/cart/remove/{id} // Remove item
DELETE /api/cart/clear/{id}  // Clear cart
```

### Auth
```typescript
POST /api/web/auth/register  // Register user in DB
```

---

## 🧩 Common Components

### Layout
```tsx
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
```

### Flyer Components
```tsx
import { FlyerCard } from "@/components/flyer/flyer-card"
import FlyersSection from "@/components/home/FlyersSection"
import FlyersCarousel from "@/components/home/FlyersCarousel"
```

### UI Components (Radix)
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// ... 50+ more components
```

### Loaders
```tsx
import { IOSLoader } from "@/components/ui/ios-loader"

<IOSLoader size="sm" color="text-red-500" />
```

---

## 🎯 Common Patterns

### Using Stores in Components
```tsx
'use client'
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"

const MyComponent = observer(() => {
  const { authStore, flyersStore, cartStore } = useStore()
  
  // Use stores...
  
  return <div>...</div>
})

export default MyComponent
```

### Fetching Data
```tsx
useEffect(() => {
  if (!flyersStore.flyers.length && !flyersStore.loading) {
    flyersStore.fetchFlyers()
  }
}, [flyersStore])
```

### Handling Loading States
```tsx
{flyersStore.loading && (
  <IOSLoader size="sm" color="text-red-500" />
)}

{flyersStore.error && (
  <div className="text-red-500">{flyersStore.error}</div>
)}

{!flyersStore.loading && flyersStore.flyers.length > 0 && (
  // Render content
)}
```

---

## 🔐 Authentication Flow

### Email/Password Registration
```
1. User fills form
2. authStore.register() → AWS Cognito
3. Auto-register in backend DB
4. Auto-login (if no email verification)
5. Redirect to app
```

### OAuth (Google/Apple)
```
1. User clicks "Sign in with Google/Apple"
2. Redirect to Cognito Hosted UI
3. User authenticates
4. Redirect back to app
5. Extract data from JWT
6. Register in backend DB
7. User logged in
```

### User ID Formats
- Email/Password: `cognito_{userId}`
- Google: `google_{googleId}`
- Apple: `apple_{appleId}`

---

## 🛒 Cart & Checkout Flow

```
1. User customizes flyer
2. Fill FlyerFormStore
3. Submit → cartStore.addToCart()
4. Navigate to /cart
5. Review items
6. Click checkout
7. Stripe payment
8. Order created
9. Download flyer
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 640px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

---

## 🎭 Dynamic Categories

### How It Works
```typescript
// 1. Fetch flyers
await flyersStore.fetchFlyers()

// 2. Extract categories
const categories = getDynamicCategoriesFromFlyers(flyersStore.flyers)

// 3. Render sections
categories.map(cat => <FlyersSection key={cat.id} type={cat} />)
```

### Special Categories
- **Recently Added** - `recently_added: true`
- **Premium Flyers** - `price: $40`
- **Basic Flyers** - `price: $10`

### Regular Categories
Extracted from `flyer.categories` array

---

## 🐛 Debugging Tips

### Check API Response
```javascript
// In browser console
console.log('Flyers:', flyersStore.flyers)
console.log('Categories:', flyersStore.allCategories)
console.log('Cart:', cartStore.cartItems)
```

### Network Tab
- Check `/api/flyers` response
- Check `/api/banners` response
- Check `/api/cart/*` requests

### Console Logs
Look for these emojis:
- 🎬 Banner operations
- 📢 Banner data
- 📊 Categories
- ✅ Success
- ❌ Errors
- 🔄 Loading

---

## 📚 Important Files

### Configuration
- `config/api.ts` - API base URL
- `lib/aws-config.ts` - AWS Cognito config
- `app/globals.css` - Theme colors
- `tsconfig.json` - TypeScript config
- `next.config.mjs` - Next.js config

### State Management
- `stores/AuthStore.ts` - Authentication (813 lines)
- `stores/FlyersStore.ts` - Flyer data
- `stores/CartStore.ts` - Shopping cart
- `stores/BannerStore.ts` - Banners
- `stores/StoreProvider.tsx` - Provider

### Pages
- `app/page.tsx` - Homepage
- `app/categories/page.tsx` - Category browsing
- `app/cart/page.tsx` - Shopping cart
- `app/checkout/page.tsx` - Checkout
- `app/flyer/[id]/page.tsx` - Flyer details

### Components
- `components/layout/header.tsx` - Navigation
- `components/home/HeroSection.tsx` - Banner carousel
- `components/home/FlyersSection.tsx` - Category sections
- `components/flyer/flyer-card.tsx` - Flyer card

---

## 🔧 Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://193.203.161.174:3007
NEXT_PUBLIC_AWS_REGION=your-region
NEXT_PUBLIC_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=your-client-id
NEXT_PUBLIC_OAUTH_DOMAIN=your-domain
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN=http://localhost:3000
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

---

## 🚨 Common Issues & Solutions

### Issue: Flyers not loading
**Solution:** Check API endpoint and CORS settings

### Issue: Auth not working
**Solution:** Verify AWS Cognito configuration in `.env.local`

### Issue: Cart count not updating
**Solution:** Ensure `cartStore.load(userId)` is called after login

### Issue: Images not displaying
**Solution:** Check S3 bucket permissions and image URLs

### Issue: Build errors
**Solution:** TypeScript errors are ignored in build, but check console

---

## 📖 Documentation Files

Key documentation in project root:
- `IMPLEMENTATION_SUMMARY.md` - Cognito integration
- `DYNAMIC_CATEGORIES_IMPLEMENTATION.md` - Category system
- `OAUTH_QUICK_REFERENCE.md` - OAuth setup
- `STRIPE_INTEGRATION.md` - Payment setup
- `TESTING_GUIDE.md` - Testing procedures

---

## 🎯 Quick Commands

```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors (not blocking)
npx tsc --noEmit

# Format code
npx prettier --write .

# Lint
npm run lint
```

---

## 💡 Pro Tips

1. **Always use observer()** for components using MobX stores
2. **Check console logs** - they're very helpful for debugging
3. **Use TypeScript** - types are defined in `lib/types.ts`
4. **Test auth flows** - Email, Google, Apple all work differently
5. **Monitor API calls** - Use browser Network tab
6. **Read documentation** - 30+ MD files with detailed guides

---

**Last Updated:** December 6, 2025  
**For detailed analysis:** See `PROJECT_ANALYSIS.md`
