# 🚀 Grodify - Developer Quick Reference

## 📌 Essential Information

### **Project Type**
Next.js 14 (App Router) + TypeScript + MobX + Stripe + AWS Cognito

### **Backend API**
```
Base URL: http://193.203.161.174:3007
```

### **Key Technologies**
- **Framework**: Next.js 14.2.16
- **Language**: TypeScript 5
- **State**: MobX 6.13.7
- **Auth**: AWS Cognito
- **Payments**: Stripe
- **Styling**: Tailwind CSS 4.1.9
- **UI**: Radix UI + Custom Components

---

## 🛠️ Quick Start

### **Installation**
```bash
cd "d:\Flyer Web App\Flyer Frontend\grodify"
npm install
```

### **Development**
```bash
npm run dev
# Opens on http://localhost:3000
```

### **Build**
```bash
npm run build
npm run start
```

---

## 📂 Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js pages and API routes |
| `components/` | React components (UI + business logic) |
| `stores/` | MobX state management stores |
| `lib/` | Utility functions and helpers |
| `config/` | Configuration files |
| `hooks/` | Custom React hooks |
| `public/` | Static assets |

---

## 🔑 Environment Variables

### **Required Variables**
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://193.203.161.174:3007

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# AWS Cognito
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=us-east-1_...
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=...
NEXT_PUBLIC_AWS_OAUTH_DOMAIN=...
NEXT_PUBLIC_AWS_OAUTH_REDIRECT_SIGN_IN=http://localhost:3000/auth/callback
NEXT_PUBLIC_AWS_OAUTH_REDIRECT_SIGN_OUT=http://localhost:3000
```

---

## 🗂️ Important Files

### **Core Application Files**

| File | Purpose | Lines |
|------|---------|-------|
| `app/layout.tsx` | Root layout with providers | 87 |
| `app/page.tsx` | Home page with dynamic categories | 213 |
| `app/globals.css` | Global styles (Netflix theme) | 178 |
| `stores/AuthStore.ts` | Authentication logic | 813 |
| `stores/CartStore.ts` | Shopping cart management | 366 |
| `stores/flyersStore.ts` | Flyer data management | 93 |
| `lib/types.ts` | TypeScript type definitions | 232 |
| `lib/orders.ts` | Order utilities | 249 |
| `config/api.ts` | API configuration | 12 |

### **Key Components**

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | `components/layout/header.tsx` | Navigation, cart, user menu |
| Footer | `components/layout/footer.tsx` | Footer links and info |
| HeroSection | `components/home/HeroSection.tsx` | Banner carousel |
| FlyerCard | `components/flyer/flyer-card.tsx` | Flyer display card |
| AuthModal | `components/auth/auth-modal.tsx` | Login/register modal |
| OrderForm | `components/order/order-form.tsx` | Order creation form |

---

## 🎯 Common Tasks

### **1. Add a New Page**

```typescript
// app/new-page/page.tsx
'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function NewPage() {
  return (
    <div className="min-h-screen bg-background">
      <h1>New Page</h1>
    </div>
  )
}
```

### **2. Create a New Store**

```typescript
// stores/NewStore.ts
import { makeAutoObservable, runInAction } from "mobx"

export class NewStore {
  data: any[] = []
  loading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetchData() {
    this.loading = true
    this.error = null
    
    try {
      const response = await fetch('/api/endpoint')
      const data = await response.json()
      
      runInAction(() => {
        this.data = data
        this.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }
}
```

### **3. Add to StoreProvider**

```typescript
// stores/StoreProvider.tsx
import { NewStore } from './NewStore'

const stores = {
  authStore: new AuthStore(),
  flyersStore: new FlyersStore(),
  newStore: new NewStore(), // Add here
  // ...
}
```

### **4. Use Store in Component**

```typescript
'use client'

import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"

const MyComponent = observer(() => {
  const { newStore } = useStore()
  
  useEffect(() => {
    newStore.fetchData()
  }, [])
  
  if (newStore.loading) return <div>Loading...</div>
  if (newStore.error) return <div>Error: {newStore.error}</div>
  
  return <div>{/* Render data */}</div>
})

export default MyComponent
```

### **5. Create API Route**

```typescript
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true, data: [] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Your logic here
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

### **6. Add Form with Validation**

```typescript
'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type FormData = z.infer<typeof formSchema>

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("name")} />
      {form.formState.errors.name && (
        <span>{form.formState.errors.name.message}</span>
      )}
      
      <input {...form.register("email")} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## 🔌 API Integration

### **Making API Calls**

```typescript
import { getApiUrl } from "@/config/api"

// GET request
const fetchData = async () => {
  const response = await fetch(getApiUrl("/api/endpoint"))
  const data = await response.json()
  return data
}

// POST request
const postData = async (payload: any) => {
  const response = await fetch(getApiUrl("/api/endpoint"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  return data
}

// POST with FormData (file upload)
const uploadFile = async (formData: FormData) => {
  const response = await fetch(getApiUrl("/api/upload"), {
    method: "POST",
    body: formData, // No Content-Type header needed
  })
  const data = await response.json()
  return data
}
```

---

## 🎨 Styling Guide

### **Color Variables**

```css
/* Primary Colors */
--background: #000000        /* Black */
--foreground: #ffffff        /* White */
--primary: #b92025          /* Netflix Red */
--secondary: #f59e0b        /* Golden */

/* Component Colors */
--card: oklch(13% 0.028 261.692)  /* Dark Gray */
--muted: #374151            /* Muted Gray */
--accent: #f59e0b           /* Golden */
--destructive: #be123c      /* Dark Red */
```

### **Common Tailwind Classes**

```typescript
// Buttons
className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md"

// Cards
className="bg-card border border-border rounded-xl p-6"

// Text
className="text-foreground text-lg font-semibold"

// Containers
className="container mx-auto px-4 py-8"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Flex
className="flex items-center justify-between gap-4"
```

---

## 🔐 Authentication

### **Check if User is Logged In**

```typescript
import { useStore } from "@/stores/StoreProvider"

const MyComponent = () => {
  const { authStore } = useStore()
  
  if (!authStore.isLoggedIn) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome, {authStore.user?.name}</div>
}
```

### **Get Current User**

```typescript
const { authStore } = useStore()
const user = authStore.user

// User object structure:
// {
//   id: string
//   name: string
//   email: string
//   provider: 'cognito' | 'google' | 'apple'
//   phone?: string
//   favorites?: string[]
//   orders?: string[]
// }
```

### **Login/Logout**

```typescript
const { authStore } = useStore()

// Login
await authStore.login({ email, password })

// Logout
await authStore.logout()

// Social login
await authStore.signInWithProvider('google')
await authStore.signInWithProvider('apple')
```

---

## 💳 Stripe Integration

### **Create Checkout Session**

```typescript
// app/api/checkout/create-session/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const { amount, orderId } = await request.json()
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Custom Flyer',
        },
        unit_amount: amount * 100, // Convert to cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
  })
  
  return Response.json({ sessionId: session.id })
}
```

---

## 🛒 Cart Operations

### **Add to Cart**

```typescript
const { cartStore, authStore } = useStore()

const addToCart = async (formData: FormData) => {
  if (!authStore.user) {
    authStore.handleAuthModal()
    return
  }
  
  formData.append('user_id', authStore.user.id)
  
  await cartStore.addToCart(formData)
  toast.success('Added to cart!')
}
```

### **Get Cart Count**

```typescript
const { cartStore } = useStore()
const cartCount = cartStore.count
```

---

## 📊 Data Fetching Patterns

### **Fetch on Mount**

```typescript
useEffect(() => {
  if (!flyersStore.flyers.length && !flyersStore.loading) {
    flyersStore.fetchFlyers()
  }
}, [flyersStore])
```

### **Fetch with Dependencies**

```typescript
useEffect(() => {
  if (userId) {
    cartStore.load(userId)
  }
}, [userId, cartStore])
```

### **Manual Fetch**

```typescript
const handleRefresh = async () => {
  await flyersStore.fetchFlyers()
}
```

---

## 🎯 Routing

### **Navigation**

```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()

// Navigate to page
router.push('/flyer/123')

// Navigate with query params
router.push('/categories?slug=summer')

// Go back
router.back()

// Refresh
router.refresh()
```

### **Link Component**

```typescript
import Link from 'next/link'

<Link href="/flyer/123">
  View Flyer
</Link>

// With query params
<Link href={{
  pathname: '/flyer/123',
  query: { image: imageUrl, name: flyerName }
}}>
  View Flyer
</Link>
```

---

## 🔔 Notifications

### **Toast Notifications**

```typescript
import { toast } from "sonner"

// Success
toast.success('Operation successful!')

// Error
toast.error('Something went wrong')

// Info
toast.info('Information message')

// Loading
toast.loading('Processing...')

// Promise
toast.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Failed to load data',
  }
)
```

---

## 🐛 Debugging Tips

### **Console Logging**

```typescript
// Log store state
console.log('Flyers:', toJS(flyersStore.flyers))

// Log user data
console.log('User:', toJS(authStore.user))

// Log API response
console.log('API Response:', data)
```

### **React DevTools**
- Install React DevTools browser extension
- Inspect component props and state
- View component hierarchy

### **MobX DevTools**
- Install MobX DevTools browser extension
- Track state changes
- View store data

---

## 📦 Build & Deploy

### **Build for Production**

```bash
npm run build
```

### **Test Production Build**

```bash
npm run start
```

### **Environment-Specific Builds**

```bash
# Development
NODE_ENV=development npm run build

# Production
NODE_ENV=production npm run build
```

---

## 🔧 Troubleshooting

### **Common Issues**

| Issue | Solution |
|-------|----------|
| "Failed to load Stripe" | Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| "User not found" | Check AWS Cognito configuration |
| "API error" | Verify backend is running at `http://193.203.161.174:3007` |
| "Build fails" | Clear `.next` folder and rebuild |
| "Memory error" | Build uses 4GB heap size (already configured) |

### **Clear Cache**

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Clear build artifacts
rm -rf .next out
```

---

## 📚 Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Package management
npm install <package>      # Install package
npm uninstall <package>    # Remove package
npm update                 # Update packages

# Git
git status                 # Check status
git add .                  # Stage changes
git commit -m "message"    # Commit changes
git push                   # Push to remote
```

---

## 🔗 Important Links

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **MobX Docs**: https://mobx.js.org
- **Tailwind CSS**: https://tailwindcss.com
- **Stripe Docs**: https://stripe.com/docs
- **AWS Cognito**: https://docs.aws.amazon.com/cognito

---

## 📞 Need Help?

1. Check the documentation files in the project root
2. Review the `PROJECT_ANALYSIS.md` for detailed information
3. Check the `ARCHITECTURE_OVERVIEW.md` for system architecture
4. Search existing issues in the project

---

**Last Updated**: December 6, 2025
**Version**: 1.0
