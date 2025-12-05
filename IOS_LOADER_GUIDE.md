# iOS Loader Component - Usage Guide

## 🎨 Overview

A sleek, **Apple-style spinner** component (also known as an activity indicator) for displaying loading states throughout your application. It features 12 fading blades that rotate to create the classic loading animation.

---

## 📦 Component Variants

### **IOSLoader** (Main Component)

```tsx
import { IOSLoader } from "@/components/ui/ios-loader";

<IOSLoader 
  size="md"                    // "xs" | "sm" | "md" | "lg" | "xl"
  text="Loading..."            // Optional text
  color="text-red-500"         // Tailwind text color class
  fullScreen={false}           // Full screen overlay
  className="my-4"             // Additional classes
/>
```

---

## 🎯 Use Cases

### 1. **Page Loading (Full Screen)**
```tsx
if (loading) {
  return (
    <IOSLoader 
      size="xl" 
      text="Loading..." 
      color="text-white"
      fullScreen={true}
    />
  );
}
```

### 2. **Section Loading (Black Background)**
```tsx
{loading && (
  <section className="bg-black py-8 flex justify-center">
    <IOSLoader 
      size="lg" 
      text="Loading banners..." 
      color="text-red-500"
    />
  </section>
)}
```

### 3. **Button Loading State**
```tsx
<button disabled={loading} className="flex items-center gap-2">
  {loading && <IOSLoader size="xs" color="text-white" />}
  {loading ? "Processing..." : "Submit"}
</button>
```

---

## 🎨 Size Options

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 16px (w-4) | Buttons, inline text |
| `sm` | 20px (w-5) | Small containers |
| `md` | 32px (w-8) | Cards, default |
| `lg` | 48px (w-12) | Sections, modals |
| `xl` | 64px (w-16) | Full screen, hero areas |

---

## 📍 Where It's Used

### ✅ Already Implemented:

1. **Home Page** (`app/page.tsx`)
   - Shows red iOS loader while fetching flyers
   - Size: `lg`, Text: "Loading flyers..."

2. **Hero Section** (`components/home/HeroSection.tsx`)
   - Black background with red iOS loader
   - Handles loading, error, and empty states

3. **Google & Apple OAuth Callbacks**
   - Full screen red iOS loader during authentication
   - Size: `xl`, Text: "Signing in with..."

---

## 🔧 Customization

### Changing Color
The loader inherits the current text color (`currentColor`). You can set it via the `color` prop or `className`.

```tsx
// Red loader
<IOSLoader color="text-red-500" />

// White loader
<IOSLoader color="text-white" />

// Blue loader
<IOSLoader className="text-blue-600" />
```

### Animation Speed
The animation is defined in `app/globals.css` as `spinner-leaf-fade 800ms linear infinite`. You can adjust the `800ms` duration there to make it faster or slower.

---

## 🎬 Animation Details

- **Structure**: 12 `div` elements (blades) positioned in a circle.
- **Animation**: Each blade fades opacity from 1 to 0.25.
- **Timing**: Staggered delays create the rotating trail effect.
- **CSS**: Uses `animate-spinner-leaf-fade` custom utility.

---

**Your iOS-style loader is ready to use! 🎉**
