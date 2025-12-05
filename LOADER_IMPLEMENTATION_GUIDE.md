# iOS-Style Red Loader Implementation Guide

## Overview
This project now includes an Apple iOS-style loader in red color that automatically displays during:
1. **Page Navigation** - When users navigate between pages
2. **API Calls** - When data is being fetched from the backend

## Components

### 1. IOSLoader Component
Location: `components/ui/ios-loader.tsx`

A reusable iOS-style spinner component with customizable size and color.

**Props:**
- `size`: "xs" | "sm" | "md" | "lg" | "xl" (default: "sm")
- `color`: Tailwind text color class (default: "text-foreground")
- `text`: Optional loading text to display below the spinner
- `fullScreen`: Boolean to show as fullscreen overlay
- `className`: Additional CSS classes

**Example Usage:**
```tsx
import { IOSLoader } from "@/components/ui/ios-loader";

// Basic usage
<IOSLoader size="md" color="text-red-500" />

// With text
<IOSLoader size="lg" color="text-red-500" text="Loading..." />

// Fullscreen
<IOSLoader size="xl" color="text-red-500" text="Please wait..." fullScreen />
```

### 2. PageTransitionLoader Component
Location: `components/ui/page-transition-loader.tsx`

Automatically shows the red iOS loader during page navigation. Already integrated in the root layout.

**Features:**
- Automatically detects route changes
- Shows red iOS loader with backdrop blur
- Smooth fade in/out transitions
- Integrated with LoadingStore for global state management

### 3. LoadingStore
Location: `stores/LoadingStore.ts`

MobX store that manages the global loading state.

**Methods:**
- `startLoading(text?: string)` - Show the loader with optional text
- `stopLoading()` - Hide the loader

**Properties:**
- `isLoading` - Boolean indicating if loader is visible
- `loadingText` - Current loading text

## Usage in Your Code

### Method 1: Using the useLoading Hook (Recommended)

```tsx
import { useLoading } from "@/hooks/useLoading";

function MyComponent() {
    const { withLoading } = useLoading();

    const fetchData = async () => {
        await withLoading(async () => {
            const response = await fetch('/api/data');
            const data = await response.json();
            return data;
        }, "Fetching data...");
    };

    return <button onClick={fetchData}>Load Data</button>;
}
```

### Method 2: Manual Control

```tsx
import { useLoading } from "@/hooks/useLoading";

function MyComponent() {
    const { startLoading, stopLoading } = useLoading();

    const handleSubmit = async () => {
        try {
            startLoading("Submitting form...");
            await submitForm();
        } finally {
            stopLoading();
        }
    };

    return <button onClick={handleSubmit}>Submit</button>;
}
```

### Method 3: Direct Store Access

```tsx
import { useStore } from "@/stores/StoreProvider";

function MyComponent() {
    const { loadingStore } = useStore();

    const loadData = async () => {
        loadingStore.startLoading("Loading...");
        try {
            await fetchData();
        } finally {
            loadingStore.stopLoading();
        }
    };

    return <button onClick={loadData}>Load</button>;
}
```

## Automatic Page Transition Loading

The loader automatically appears when:
- User clicks a link to navigate to another page
- URL changes (including query parameters)
- Browser back/forward buttons are used

**No additional code needed!** The `PageTransitionLoader` component in the root layout handles this automatically.

## Customization

### Change Loader Color
Edit `components/ui/page-transition-loader.tsx`:
```tsx
<IOSLoader
    size="lg"
    color="text-blue-500"  // Change to any Tailwind color
    text={loadingStore.loadingText}
/>
```

### Change Loader Size
```tsx
<IOSLoader
    size="xl"  // xs, sm, md, lg, xl
    color="text-red-500"
    text={loadingStore.loadingText}
/>
```

### Change Background Overlay
Edit the wrapper div in `page-transition-loader.tsx`:
```tsx
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
    {/* Adjust bg-black/90 and backdrop-blur-md as needed */}
</div>
```

### Change Animation Speed
Edit `app/globals.css`:
```css
.animate-spinner-leaf-fade {
  animation: spinner-leaf-fade 0.8s linear infinite;  /* Change 1s to 0.8s for faster */
}
```

## Examples

### Example 1: Contact Form Submission
```tsx
"use client";

import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";

export default function ContactPage() {
    const { withLoading } = useLoading();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        await withLoading(async () => {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                toast.success("Message sent!");
            }
        }, "Sending message...");
    };

    return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 2: Data Fetching on Mount
```tsx
"use client";

import { useEffect } from "react";
import { useLoading } from "@/hooks/useLoading";

export default function ProductsPage() {
    const { withLoading } = useLoading();

    useEffect(() => {
        withLoading(async () => {
            const response = await fetch('/api/products');
            const products = await response.json();
            setProducts(products);
        }, "Loading products...");
    }, []);

    return <div>...</div>;
}
```

### Example 3: Button Click Action
```tsx
"use client";

import { useLoading } from "@/hooks/useLoading";

export default function DownloadButton() {
    const { startLoading, stopLoading } = useLoading();

    const handleDownload = async () => {
        startLoading("Preparing download...");
        try {
            await generatePDF();
            await downloadFile();
        } finally {
            stopLoading();
        }
    };

    return <button onClick={handleDownload}>Download</button>;
}
```

## Technical Details

### Animation
The iOS spinner uses 12 rotating blades with staggered fade animations to create the characteristic Apple loading spinner effect.

### CSS Keyframes
```css
@keyframes spinner-leaf-fade {
  0%, 100% { opacity: 0; }
  25% { opacity: 0.3; }
  50% { opacity: 1; }
  75% { opacity: 0.7; }
}
```

### Z-Index Layering
- PageTransitionLoader: `z-[100]`
- Ensures loader appears above all content

### Performance
- Uses MobX for efficient state management
- Minimal re-renders with observer pattern
- Smooth 60fps animations

## Troubleshooting

### Loader doesn't appear during API calls
Make sure you're using the `useLoading` hook or directly calling `loadingStore.startLoading()` and `loadingStore.stopLoading()`.

### Loader appears but doesn't disappear
Ensure you're calling `stopLoading()` in a `finally` block to guarantee it runs even if an error occurs.

### Loader color not changing
Make sure you're using valid Tailwind color classes (e.g., `text-red-500`, not `red-500`).

### Multiple loaders appearing
Only one loader should be visible at a time. The LoadingStore manages a single global loading state.

## Best Practices

1. **Always use try/finally** when manually controlling the loader
2. **Use descriptive loading text** to inform users what's happening
3. **Keep loading times short** - if an operation takes >3 seconds, consider showing progress
4. **Don't overuse** - only show loader for operations that actually need it
5. **Test on slow connections** to ensure loader appears and disappears correctly

## Files Modified/Created

### Created:
- `components/ui/page-transition-loader.tsx` - Page navigation loader
- `hooks/useLoading.ts` - Loading state hook
- `LOADER_IMPLEMENTATION_GUIDE.md` - This documentation

### Modified:
- `app/layout.tsx` - Integrated PageTransitionLoader
- `app/globals.css` - Added iOS spinner animations

### Existing (Unchanged):
- `components/ui/ios-loader.tsx` - iOS spinner component
- `components/ui/global-loader.tsx` - Legacy global loader (can be removed if not used)
- `stores/LoadingStore.ts` - Loading state management
