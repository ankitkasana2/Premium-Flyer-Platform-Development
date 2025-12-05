# Red Loader Component - Usage Guide

## 🎨 Overview

A beautiful, customizable **red-themed loader** component for displaying loading states throughout your application.

---

## 📦 Component Variants

### 1. **RedLoader** (Main Component)
Full-featured loader with spinning circle, text, and animated dots.

```tsx
import { RedLoader } from "@/components/ui/red-loader";

<RedLoader 
  size="lg"                    // "sm" | "md" | "lg" | "xl"
  text="Loading flyers..."     // Custom text
  fullScreen={false}           // Full screen overlay
/>
```

### 2. **RedSkeletonLoader**
Skeleton loader with red accent for content placeholders.

```tsx
import { RedSkeletonLoader } from "@/components/ui/red-loader";

<RedSkeletonLoader />
```

### 3. **RedInlineLoader**
Compact loader for buttons and inline elements.

```tsx
import { RedInlineLoader } from "@/components/ui/red-loader";

<RedInlineLoader text="Processing..." />
```

### 4. **RedSpinner**
Simple spinning circle without text.

```tsx
import { RedSpinner } from "@/components/ui/red-loader";

<RedSpinner size="md" />  // "sm" | "md" | "lg"
```

---

## 🎯 Use Cases

### 1. **Page Loading (Full Screen)**
```tsx
if (loading) {
  return (
    <RedLoader 
      size="xl" 
      text="Loading..." 
      fullScreen={true}
    />
  );
}
```

### 2. **Section Loading**
```tsx
{flyersStore.loading && (
  <section className="py-8">
    <RedLoader 
      size="lg" 
      text="Loading flyers..." 
      fullScreen={false}
    />
  </section>
)}
```

### 3. **Button Loading State**
```tsx
<button disabled={loading}>
  {loading ? (
    <RedInlineLoader text="Signing in..." />
  ) : (
    "Sign In"
  )}
</button>
```

### 4. **Card/Content Loading**
```tsx
{loading ? (
  <RedSkeletonLoader />
) : (
  <div>Your content here</div>
)}
```

---

## 🎨 Size Options

| Size | Spinner | Text | Use Case |
|------|---------|------|----------|
| `sm` | 8px | Small | Inline, buttons |
| `md` | 12px | Base | Cards, sections |
| `lg` | 16px | Large | Main content |
| `xl` | 24px | XL | Full screen |

---

## 📍 Where It's Used

### ✅ Already Implemented:

1. **Home Page** (`app/page.tsx`)
   - Shows red loader while fetching flyers
   - Size: `lg`, Text: "Loading flyers..."

2. **Google OAuth Callback** (`app/auth/callback/google/page.tsx`)
   - Full screen loader during authentication
   - Size: `xl`, Text: "Signing in with Google..."

3. **Apple OAuth Callback** (`app/auth/callback/apple/page.tsx`)
   - Full screen loader during authentication
   - Size: `xl`, Text: "Signing in with Apple..."

---

## 🔧 Customization Examples

### Custom Colors (if needed)
The loader uses Tailwind's `red-500` by default. To change:

```tsx
// In red-loader.tsx, replace:
border-red-500  →  border-blue-500
text-red-500    →  text-blue-500
bg-red-500      →  bg-blue-500
```

### Custom Animation Speed
```tsx
// Modify animation duration in className:
animate-spin  →  animate-[spin_0.5s_linear_infinite]
animate-pulse →  animate-[pulse_1s_ease-in-out_infinite]
```

### Custom Text Styling
```tsx
<RedLoader 
  size="lg"
  text={
    <span className="text-red-600 font-bold text-2xl">
      Please wait...
    </span>
  }
/>
```

---

## 🎬 Animation Details

### Spinning Circle
- **Animation**: Continuous 360° rotation
- **Speed**: 1 second per rotation
- **Color**: Red border with transparent top

### Pulsing Text
- **Animation**: Fade in/out
- **Speed**: 2 seconds per cycle
- **Color**: Red text

### Bouncing Dots
- **Animation**: Vertical bounce
- **Delay**: Staggered (0ms, 150ms, 300ms)
- **Color**: Red dots

---

## 📱 Responsive Behavior

The loader automatically adapts to screen size:
- **Mobile**: Smaller spacing, compact layout
- **Desktop**: Larger spacing, more prominent

---

## ♿ Accessibility

- ✅ `role="status"` for screen readers
- ✅ `aria-label="Loading"` on spinner
- ✅ Semantic HTML structure
- ✅ Keyboard navigation friendly

---

## 🚀 Quick Examples

### Example 1: Data Fetching
```tsx
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <RedLoader size="lg" text="Fetching data..." />;
  }

  return <div>{/* Your content */}</div>;
};
```

### Example 2: Form Submission
```tsx
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async () => {
  setSubmitting(true);
  await submitForm();
  setSubmitting(false);
};

return (
  <button onClick={handleSubmit} disabled={submitting}>
    {submitting ? (
      <RedInlineLoader text="Submitting..." />
    ) : (
      "Submit"
    )}
  </button>
);
```

### Example 3: Page Transition
```tsx
const router = useRouter();
const [navigating, setNavigating] = useState(false);

const handleNavigate = () => {
  setNavigating(true);
  router.push('/dashboard');
};

if (navigating) {
  return (
    <RedLoader 
      size="xl" 
      text="Redirecting..." 
      fullScreen={true}
    />
  );
}
```

---

## 🎯 Best Practices

1. **Use fullScreen sparingly** - Only for critical operations
2. **Provide meaningful text** - Tell users what's happening
3. **Match size to context** - Larger for important content
4. **Don't nest loaders** - One loader per loading state
5. **Clear loading state** - Always set `loading = false` when done

---

## 🐛 Troubleshooting

### Loader not showing?
- Check if `loading` state is `true`
- Verify import path is correct
- Ensure component is rendered

### Loader too small/large?
- Adjust `size` prop
- Check parent container constraints

### Animation not smooth?
- Ensure Tailwind animations are enabled
- Check for CSS conflicts

---

## 📚 Related Components

- `components/ui/button.tsx` - For button loading states
- `components/ui/skeleton.tsx` - Alternative skeleton loader
- `components/ui/spinner.tsx` - Generic spinner (if exists)

---

**Your red loader is ready to use! 🎉**

Just import and use wherever you need a loading state.
