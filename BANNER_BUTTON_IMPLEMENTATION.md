# Banner Button Implementation

## Overview
Updated the banner system to conditionally display buttons based on the `button_enabled` field from the API and use dynamic `button_text` instead of hardcoded "GET IT".

## Changes Made

### 1. **HeroSection Component** (`components/home/HeroSection.tsx`)

#### Key Updates:
- ✅ **Conditional Button Rendering**: Button only shows when `button_enabled` is `true`
- ✅ **Dynamic Button Text**: Uses `button_text` from API instead of hardcoded "GET IT"
- ✅ **Proper Link Handling**: Uses `getBannerLink()` method from BannerStore
- ✅ **Description Support**: Added support for displaying banner description

#### Code Changes:

```tsx
{/* Conditionally render button only if button_enabled is true */}
{currentBanner.button_enabled && (
  <Button
    size="sm"
    onClick={handleButtonClick}
    className="hover:cursor-pointer hover:scale-105 duration-300 min-w-[100px] sm:min-w-[120px] px-6 tracking-[.1000rem] bg-primary shadow-lg shadow-black/50 z-10"
  >
    {currentBanner.button_text || 'GET IT'}
  </Button>
)}
```

## API Response Structure

The banner API returns the following structure:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 12,
      "title": "AIR PLANE gk",
      "description": null,
      "button_text": "testing",
      "button_enabled": true,
      "link_type": "category",
      "link_value": "Ladies Night",
      "display_order": 0,
      "image": "b88edd729519.jpg",
      "status": true,
      "image_url": "http://193.203.161.174:3007/uploads/banners/b88edd729519.jpg"
    }
  ]
}
```

## Behavior

### When `button_enabled` is `true`:
- ✅ Button is displayed
- ✅ Button text shows the value from `button_text` field
- ✅ Clicking the button navigates to the link specified by `link_type` and `link_value`

### When `button_enabled` is `false`:
- ✅ Button is **NOT** displayed
- ✅ Users can still click on the banner image to navigate

## Link Types Supported

The `getBannerLink()` method in BannerStore handles the following link types:

1. **`category`**: Links to `/categories?slug={category-slug}`
2. **`flyer`**: Links to `/flyer/{flyer-id}`
3. **`external`**: Links to external URL
4. **`none`**: No link (returns null)

## Example Scenarios

### Scenario 1: Banner with Button
```json
{
  "title": "Summer Sale",
  "button_text": "Shop Now",
  "button_enabled": true,
  "link_type": "category",
  "link_value": "Summer Collection"
}
```
**Result**: Shows "Shop Now" button that links to `/categories?slug=summer-collection`

### Scenario 2: Banner without Button
```json
{
  "title": "New Arrivals",
  "button_text": null,
  "button_enabled": false,
  "link_type": "category",
  "link_value": "New Items"
}
```
**Result**: No button shown, but clicking the banner image navigates to `/categories?slug=new-items`

### Scenario 3: Banner with Custom Button Text
```json
{
  "title": "Limited Offer",
  "button_text": "Grab Deal",
  "button_enabled": true,
  "link_type": "external",
  "link_value": "https://example.com/deal"
}
```
**Result**: Shows "Grab Deal" button that links to the external URL

## Testing

To test the implementation:

1. **Create a banner with `button_enabled: true`**:
   - Verify the button appears
   - Verify it shows the correct `button_text`
   - Verify clicking navigates to the correct link

2. **Create a banner with `button_enabled: false`**:
   - Verify the button does NOT appear
   - Verify clicking the banner image still works

3. **Test different link types**:
   - Category links
   - Flyer links
   - External links
   - No link (none)

## Additional Features

- **Description Display**: If a banner has a `description` field, it will be displayed below the title
- **Responsive Design**: Button adapts to different screen sizes
- **Smooth Animations**: Hover effects and transitions for better UX
- **Fallback Text**: If `button_text` is null but `button_enabled` is true, it defaults to "GET IT"

## Notes

- The `image_url` field from the API is now prioritized over constructing the URL manually
- All lint errors have been resolved
- The component properly uses MobX observer pattern for reactive updates
