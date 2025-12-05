# Dynamic Categories Implementation

## 🎯 Overview

This document describes the implementation of dynamic category display based on flyers fetched from the backend API. The system now automatically organizes and displays flyers by their categories instead of using hardcoded data.

## 📡 API Integration

### Backend API Endpoint
```
GET http://193.203.161.174:3007/api/flyers
```

### Response Format
```json
[
  {
    "id": 50,
    "title": "black-friday-free-flyer-psd-template-7-81905",
    "price": "$10",
    "form_type": "Only Info",
    "recently_added": 1,
    "categories": [
      "Recently Added",
      "Basic Flyers",
      "Premium Flyers",
      "DJ Image or Artist",
      "Brunch",
      "Drink Flyers",
      "Hookah Flyers",
      "All Black Party",
      "Foam Party"
    ],
    "image_url": "https://flyer-app-bucket-2025.s3.ap-southeast-2.amazonaws.com/...",
    "created_at": "2025-12-03T16:45:38.000Z",
    "recentlyAdded": true
  }
]
```

## 🏗️ Architecture Changes

### 1. **FlyersStore** (`stores/flyersStore.ts`)

Enhanced with new computed properties:

#### New Features:
- **`allCategories`**: Extracts all unique categories from flyers
- **`categoriesWithCounts`**: Returns category names with flyer counts
- **Improved filtering**: Handles both string prices (`"$10"`) and numeric prices

#### Key Methods:
```typescript
get allCategories() {
  // Returns: ["Recently Added", "Basic Flyers", "Premium Flyers", ...]
}

get categoriesWithCounts() {
  // Returns: { "Recently Added": 5, "Basic Flyers": 12, ... }
}

flyersByCategory(category: string) {
  // Returns flyers that have the category in their categories array
}
```

### 2. **CategoryStore** (`stores/CategoryStore.ts`)

Updated to work with API data:

#### New Features:
- **`setFlyersStore(store)`**: Links to FlyersStore for API data access
- **`allFlyers` getter**: Returns API data or falls back to SAMPLE_FLYERS
- **Enhanced filtering**: Works with both API format (categories array) and legacy format

#### Key Changes:
```typescript
// Now supports both formats
if (Array.isArray(fly.categories)) {
  return fly.categories.includes(categoryName)
}
// Fallback to old format
return fly.category === categoryName
```

### 3. **Helper Functions** (`lib/types.ts`)

Added new function for dynamic category generation:

```typescript
getDynamicCategoriesFromFlyers(apiFlyers: any[]): Category[]
```

This function:
1. Extracts all categories from API flyers
2. Matches them with predefined category configurations
3. Creates new category objects for categories not in the predefined list
4. Returns categories that have at least one flyer

### 4. **Home Page** (`app/page.tsx`)

Converted to client component with dynamic data loading:

#### Flow:
1. **Fetch flyers** on component mount
2. **Extract categories** from loaded flyers
3. **Display sections** for each category with flyers
4. **Loading states** with skeleton UI
5. **Error handling** with user-friendly messages

```tsx
useEffect(() => {
  if (flyersStore.flyers.length > 0) {
    const dynamicCategories = getDynamicCategoriesFromFlyers(
      toJS(flyersStore.flyers)
    )
    setCategories(dynamicCategories.filter(cat => cat.homePage))
  }
}, [flyersStore.flyers])
```

### 5. **Categories Page** (`app/categories/page.tsx`)

Updated to fetch API data before filtering:

```tsx
useEffect(() => {
  if (!flyersStore.flyers.length && !flyersStore.loading) {
    flyersStore.fetchFlyers()
  }
}, [flyersStore])
```

### 6. **StoreProvider** (`stores/StoreProvider.tsx`)

Connected stores together:

```typescript
constructor() {
  // ... other stores
  this.categoryStore.setFlyersStore(this.flyersStore)
}
```

## 🎨 UI Components

### FlyersSection Component
- Automatically fetches flyers on mount
- Filters flyers by category
- Shows loading skeleton while fetching
- Handles empty states

### FlyerCard Component
- Already compatible with API format
- Uses `flyer.image_url` from API
- Displays price from API (handles both `"$10"` and `10` formats)

## 📊 Category Mapping

### Special Categories:
1. **Recently Added**: Flyers with `recently_added: 1` or `recentlyAdded: true`
2. **Premium Flyers**: Flyers with `price: "$40"` or `price: 40`
3. **Basic Flyers**: Flyers with `price: "$10"` or `price: 10`

### Dynamic Categories:
All other categories are extracted from the `categories` array in each flyer.

## 🔄 Data Flow

```
1. User visits homepage
   ↓
2. FlyersStore.fetchFlyers() called
   ↓
3. API returns flyers with categories array
   ↓
4. getDynamicCategoriesFromFlyers() extracts unique categories
   ↓
5. HomePage displays FlyersSection for each category
   ↓
6. FlyersSection filters flyers by category name
   ↓
7. FlyersCarousel displays FlyerCard for each flyer
```

## 🎯 Benefits

### 1. **Dynamic Content**
- Categories automatically appear/disappear based on available flyers
- No manual category management needed

### 2. **Scalability**
- New categories from backend automatically show up
- No frontend code changes needed for new categories

### 3. **Flexibility**
- Flyers can belong to multiple categories
- Easy to reorganize content from backend

### 4. **Performance**
- Single API call fetches all flyers
- Client-side filtering is fast
- MobX ensures efficient re-renders

## 🧪 Testing

### Test Scenarios:

1. **Homepage Load**
   - ✅ Flyers fetch from API
   - ✅ Categories extracted correctly
   - ✅ Each category section displays relevant flyers

2. **Categories Page**
   - ✅ Clicking category link filters correctly
   - ✅ Price filters work with API data
   - ✅ "Recently Added" filter works

3. **Empty States**
   - ✅ Shows loading skeleton while fetching
   - ✅ Shows error message if API fails
   - ✅ Shows "no flyers" message if empty

4. **Price Handling**
   - ✅ String prices (`"$10"`) parsed correctly
   - ✅ Numeric prices (10) handled correctly
   - ✅ Premium/Basic filtering works

## 🔍 Debugging

### Console Logs:
The implementation includes helpful console logs:

```javascript
console.log('📊 Dynamic categories loaded:', homePageCategories)
```

### Check Points:
1. **API Response**: Check browser Network tab for `/api/flyers`
2. **Store State**: Use React DevTools to inspect `flyersStore.flyers`
3. **Categories**: Check console for extracted categories
4. **Filtering**: Verify `flyersByCategory()` returns correct flyers

## 🚀 Future Enhancements

1. **Category Metadata**
   - Add category descriptions from backend
   - Category-specific images/banners

2. **Caching**
   - Cache API responses
   - Implement stale-while-revalidate pattern

3. **Search & Filter**
   - Full-text search across flyers
   - Advanced filtering by multiple criteria

4. **Analytics**
   - Track popular categories
   - Monitor category performance

## 📝 Migration Notes

### From Hardcoded to Dynamic:

**Before:**
```typescript
const categories = getCategoriesWithFlyers(SAMPLE_FLYERS)
```

**After:**
```typescript
const dynamicCategories = getDynamicCategoriesFromFlyers(
  flyersStore.flyers
)
```

### Backward Compatibility:
- Falls back to `SAMPLE_FLYERS` if API fails
- Supports both old and new data formats
- Existing components work without changes

## ✅ Checklist

- [x] FlyersStore fetches from API
- [x] Categories extracted dynamically
- [x] HomePage displays dynamic categories
- [x] Categories page works with API data
- [x] Price filtering handles string/number formats
- [x] Loading states implemented
- [x] Error handling added
- [x] Backward compatibility maintained
- [x] Documentation created

## 🎉 Result

The application now dynamically displays all categories based on the flyers available in the backend API. Categories automatically organize flyers, and the UI updates in real-time as data changes.
