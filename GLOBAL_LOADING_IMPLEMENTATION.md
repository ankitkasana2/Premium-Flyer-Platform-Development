# 🎨 Global Loading & Banner Loading Implementation

## ✅ What Was Implemented

### 1. **Global Loading Store**
- Created `stores/LoadingStore.ts` for managing global loading states
- Added to `StoreProvider` for app-wide access

### 2. **Global Loader Component**
- Created `components/ui/global-loader.tsx`
- Uses iOS-style loader with red color on black background
- Shows during page transitions and API calls

### 3. **Updated Root Layout**
- Added `<GlobalLoader />` to `app/layout.tsx`
- Now available throughout the entire application

---

## 📝 Manual Fix Required

### **Update Banner Loading State**

**File:** `components/home/HeroSection.tsx`

**Find this code (around line 68-74):**
```typescript
  // Loading state
  if (bannerStore.loading) {
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      </section>
    );
  }
```

**Replace with:**
```typescript
  // Loading state with black background and red loader
  if (bannerStore.loading) {
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center justify-center bg-black">
        <IOSLoader size="md" color="text-red-500" text="Loading banners..." />
      </section>
    );
  }
```

---

## 🎯 How to Use Global Loader

### **In Any Component:**

```typescript
import { useStore } from "@/stores/StoreProvider";

const MyComponent = () => {
  const { loadingStore } = useStore();

  const handleNavigation = async () => {
    // Start loading
    loadingStore.startLoading("Navigating...");
    
    try {
      // Do something (API call, navigation, etc.)
      await router.push("/some-page");
    } finally {
      // Stop loading
      loadingStore.stopLoading();
    }
  };

  return <button onClick={handleNavigation}>Go</button>;
};
```

### **Example: Show Loader During API Call**

```typescript
const fetchData = async () => {
  loadingStore.startLoading("Fetching data...");
  
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    // Process data
  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.stopLoading();
  }
};
```

---

## 🎨 Loader Customization

### **Available Sizes:**
- `xs` - Extra small (w-4 h-4)
- `sm` - Small (w-5 h-5) - **Default**
- `md` - Medium (w-8 h-8)
- `lg` - Large (w-12 h-12)
- `xl` - Extra large (w-16 h-16)

### **Available Colors:**
- `text-red-500` - **Red (Default for global loader)**
- `text-white` - White
- `text-gray-500` - Gray
- `text-primary` - Primary color
- Any Tailwind text color class

### **Usage Examples:**

```typescript
// Small red loader
<IOSLoader size="sm" color="text-red-500" />

// Medium white loader with text
<IOSLoader size="md" color="text-white" text="Loading..." />

// Large loader, full screen
<IOSLoader size="lg" color="text-red-500" text="Please wait..." fullScreen={true} />
```

---

## 📊 Current Implementation Status

### ✅ **Completed:**
1. ✅ Created `LoadingStore`
2. ✅ Added to `StoreProvider`
3. ✅ Created `GlobalLoader` component
4. ✅ Added to root layout
5. ✅ Added `IOSLoader` import to `HeroSection`

### ⚠️ **Manual Fix Needed:**
1. ⚠️ Update banner loading state in `HeroSection.tsx` (see instructions above)

---

## 🧪 Testing

### **Test Global Loader:**

1. In any component, add:
```typescript
const { loadingStore } = useStore();

// Show loader
loadingStore.startLoading("Testing...");

// Hide loader after 3 seconds
setTimeout(() => loadingStore.stopLoading(), 3000);
```

2. You should see:
   - Black background with blur
   - Red iOS-style spinner
   - Text "Testing..."

### **Test Banner Loader:**

1. Clear browser cache
2. Reload the page
3. While banners are loading, you should see:
   - Black background (not gray/white)
   - Red iOS-style spinner
   - Text "Loading banners..."

---

## 🎯 Summary

Your application now has:
- ✅ **Global loading state** - Available app-wide
- ✅ **iOS-style loader** - Small, attractive, Apple-like
- ✅ **Red color** - Matches your brand
- ✅ **Black background** - Professional look
- ✅ **Custom text** - Shows what's loading

**Just make the manual fix in `HeroSection.tsx` and you're all set!** 🚀
