# 🔄 GET Favorites API - Runs on Page Load

## ✅ Implementation Complete

The GET favorites API now runs automatically on **every page load** when a user is logged in!

---

## 🎯 How It Works

### **FavoritesSync Component**
Located in root layout (`app/layout.tsx`), this component:

1. **Watches for user changes** via `useEffect(() => {...}, [user?.id])`
2. **Runs when**:
   - Page loads (if user is logged in)
   - User logs in
   - User logs out
   - User ID changes

3. **Fetches favorites** from backend:
   ```typescript
   GET http://193.203.161.174:3007/api/favorites/user/{userId}
   ```

---

## 📊 What Happens on Page Load

```
1. App loads
    ↓
2. AuthStore loads user from AWS Cognito
    ↓
3. FavoritesSync detects user.id
    ↓
4. Calls favoritesStore.fetchFavorites(userId)
    ↓
5. API GET request to backend
    ↓
6. Backend returns favorites array
    ↓
7. favoritesStore updates with favorites
    ↓
8. FlyerCard components check isFavorited()
    ↓
9. Red hearts show for favorited flyers ❤️
```

---

## 🧪 How to Verify

### **Step 1: Open Browser Console**
Press `F12` to open DevTools

### **Step 2: Refresh Page**
Press `F5` or `Ctrl + R`

### **Step 3: Check Console Logs**
You should see:
```
🔄 Fetching favorites for user: google_114455667788990011223
📊 Current favorites count: 0
✅ Fetched 3 favorites for user: google_114455667788990011223
```

### **Step 4: Check Network Tab**
1. Go to Network tab in DevTools
2. Look for request:
   ```
   GET /api/favorites/user/google_114455667788990011223
   ```
3. Check response:
   ```json
   {
     "success": true,
     "count": 3,
     "favorites": [...]
   }
   ```

---

## 📊 Console Logs Explained

### **On Page Load (Logged In)**
```javascript
🔄 Fetching favorites for user: google_114455667788990011223
📊 Current favorites count: 0  // Before fetch
✅ Fetched 3 favorites for user: google_114455667788990011223  // After fetch
```

### **On Page Load (Not Logged In)**
```javascript
🔄 No user found, clearing favorites
```

### **On Login**
```javascript
🔄 Fetching favorites for user: google_114455667788990011223
📊 Current favorites count: 0
✅ Fetched 3 favorites for user: google_114455667788990011223
```

### **On Logout**
```javascript
🔄 No user found, clearing favorites
🔄 User logged out, clearing favorites
```

---

## 🔍 Troubleshooting

### **Issue: No console logs on page load**

#### **Check 1: Is FavoritesSync in layout?**
```typescript
// app/layout.tsx
<StoreProvider>
  <FavoritesSync />  {/* ← Should be here */}
  ...
</StoreProvider>
```

#### **Check 2: Is user loaded?**
```javascript
// In console:
console.log(authStore.user)
// Should show user object, not null
```

---

### **Issue: Console shows "No user found"**

**Cause**: User is not logged in or not loaded yet

**Solutions**:
1. Sign in to your account
2. Check if AWS Cognito session is valid
3. Check localStorage for user data:
   ```javascript
   console.log(localStorage.getItem('grodify_session'))
   ```

---

### **Issue: API call fails**

#### **Check Network Tab**
1. Open DevTools → Network
2. Look for failed request
3. Check error message

#### **Common Errors**
- **404**: Backend endpoint doesn't exist
- **401**: User not authenticated
- **500**: Backend server error

#### **Solution**
Verify backend is running:
```
http://193.203.161.174:3007
```

---

## ✅ Success Criteria

The GET favorites API is working correctly if:

1. ✅ **Console shows fetch logs** on page load
2. ✅ **Network tab shows GET request** to `/api/favorites/user/{userId}`
3. ✅ **API returns success** with favorites array
4. ✅ **Hearts are red** for favorited flyers
5. ✅ **Favorites count** is correct

---

## 🎯 Quick Test

### **Test 1: Fresh Page Load**
1. Close browser
2. Open app
3. Sign in
4. Check console for:
   ```
   🔄 Fetching favorites for user: ...
   ✅ Fetched X favorites for user: ...
   ```

### **Test 2: Page Refresh**
1. Add some favorites
2. Press F5
3. Check console for fetch logs
4. Hearts should be red

### **Test 3: Navigate Between Pages**
1. Go to home page
2. Go to categories
3. Go back to home
4. Hearts should stay red (no new API call needed)

---

## 📝 Technical Details

### **Component Location**
```
app/layout.tsx
  └─ StoreProvider
      └─ FavoritesSync  ← Runs on every page
```

### **useEffect Dependencies**
```typescript
useEffect(() => {
  // Fetch favorites
}, [user?.id])  // Re-runs when user.id changes
```

### **API Endpoint**
```
GET http://193.203.161.174:3007/api/favorites/user/{userId}
```

### **Response Format**
```json
{
  "success": true,
  "count": 3,
  "favorites": [
    {
      "id": 26,
      "title": "Flyer Name",
      "price": "$15",
      ...
    }
  ]
}
```

---

## 🎉 Result

**The GET favorites API now runs automatically on every page load!**

- ✅ No manual trigger needed
- ✅ Runs when user is logged in
- ✅ Updates favoritesStore
- ✅ Hearts show correct state
- ✅ Works on all pages

---

## 🚀 Try It Now!

1. **Open browser console** (F12)
2. **Refresh the page** (F5)
3. **Look for console logs**:
   ```
   🔄 Fetching favorites for user: ...
   ✅ Fetched X favorites for user: ...
   ```
4. **Check Network tab** for GET request
5. **Hearts should be red** for favorited flyers

**The API is running on page load!** 🎉

---

**Last Updated**: December 6, 2025
**Status**: ✅ GET Favorites API Runs on Page Load
**Location**: `components/favorites/FavoritesSync.tsx`
