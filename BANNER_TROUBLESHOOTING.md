# 🔧 Banner Loading Troubleshooting Guide

## ✅ What Was Fixed

### **All States Now Have Black Background:**
1. ✅ **Loading state** - Black background + Red loader
2. ✅ **Error state** - Black background + Red error message
3. ✅ **No banners state** - Black background + Red loader + Message

### **Added Console Logging:**
- 🎬 Component mount
- 🔄 Loading state
- ❌ Error state
- ⚠️ No banners state
- ✅ Banner display

---

## 🔍 Debugging Steps

### **Step 1: Open Browser Console**

Press `F12` or `Ctrl + Shift + I` to open Developer Tools

### **Step 2: Check Console Messages**

You should see one of these:

#### **✅ Success (Banners Loading):**
```
🎬 HeroSection mounted, fetching banners...
📢 Banners loaded: [...]
✅ Showing banner: 1 of 3
```

#### **🔄 Loading:**
```
🎬 HeroSection mounted, fetching banners...
🔄 Banners are loading...
```

#### **❌ Error:**
```
🎬 HeroSection mounted, fetching banners...
❌ Banner error: HTTP error! status: 404
Error fetching banners: ...
```

#### **⚠️ No Active Banners:**
```
🎬 HeroSection mounted, fetching banners...
📢 Banners loaded: [...]
⚠️ No active banners found. Total banners: 2
All banners: [{status: false, ...}, {status: false, ...}]
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: "No active banners available"**

**Cause:** Banners exist but `status` is `false`

**Solution:**
1. Go to your admin panel
2. Find your banners
3. Set `status` to `true` (or check the "Active" checkbox)
4. Refresh the page

**Check in Console:**
```
⚠️ No active banners found. Total banners: 2
All banners: [{status: false, ...}, {status: false, ...}]
```

---

### **Issue 2: "Error loading banners"**

**Cause:** API endpoint not responding

**Solution:**
1. **Check API is running:**
   - Visit: `http://193.203.161.174:3007/api/banners`
   - Should return JSON with banners

2. **Check CORS:**
   - Backend must allow requests from your frontend domain

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for `/api/banners` request
   - Check status code and response

**Check in Console:**
```
❌ Banner error: HTTP error! status: 404
Error fetching banners: Failed to fetch
```

---

### **Issue 3: Loader Shows Forever**

**Cause:** API call never completes

**Solution:**
1. **Check API URL:**
   ```typescript
   // In config/api.ts
   export const getApiUrl = (path = '') => {
     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://193.203.161.174:3007'
     return `${baseUrl}${path}`
   }
   ```

2. **Test API directly:**
   ```bash
   curl http://193.203.161.174:3007/api/banners
   ```

3. **Check Network Tab:**
   - Is the request pending?
   - Is it failing?
   - What's the response?

---

### **Issue 4: White Background Still Showing**

**Cause:** Old file cached or not updated

**Solution:**
1. **Hard Refresh:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear Cache:**
   - `Ctrl + Shift + Delete`
   - Clear cached images and files

3. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl + C)
   npm run dev
   ```

4. **Check File Updated:**
   - Open `components/home/HeroSection.tsx`
   - Look for `bg-black` on lines 75, 87, 100

---

## 📊 Expected API Response

Your API should return:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Special Offer",
      "description": "Get 50% off",
      "button_text": "Shop Now",
      "button_enabled": true,
      "link_type": "category",
      "link_value": "electronics",
      "display_order": 1,
      "image": "banner1.jpg",
      "image_url": "http://193.203.161.174:3007/uploads/banners/banner1.jpg",
      "status": true,
      "created_at": "2025-12-05T...",
      "updated_at": "2025-12-05T..."
    }
  ]
}
```

**Important Fields:**
- `status: true` - Banner must be active
- `image` or `image_url` - Must have valid image
- `button_enabled` - Controls button visibility

---

## 🧪 Quick Test

### **Test 1: Check API Directly**

Open in browser:
```
http://193.203.161.174:3007/api/banners
```

Should see JSON response with banners.

### **Test 2: Check Console Logs**

1. Open homepage
2. Open console (F12)
3. Look for:
   - 🎬 Component mounted
   - 📢 Banners loaded
   - ✅ Showing banner

### **Test 3: Check Network**

1. Open DevTools → Network tab
2. Reload page
3. Look for `/api/banners` request
4. Check:
   - Status: 200 OK
   - Response: JSON with banners
   - Time: Should be fast

---

## ✅ Verification Checklist

- [ ] API endpoint returns banners: `http://193.203.161.174:3007/api/banners`
- [ ] At least one banner has `status: true`
- [ ] Console shows: "📢 Banners loaded"
- [ ] Console shows: "✅ Showing banner: 1 of X"
- [ ] Background is black (not white/gray)
- [ ] Loader is red color
- [ ] No errors in console

---

## 🎯 Next Steps

### **If you see "No active banners available":**

1. **Check your database:**
   ```sql
   SELECT id, title, status FROM banners;
   ```

2. **Update banner status:**
   ```sql
   UPDATE banners SET status = true WHERE id = 1;
   ```

3. **Or use admin panel** to activate banners

### **If you see "Error loading banners":**

1. **Check backend is running**
2. **Check API endpoint exists**
3. **Check CORS settings**
4. **Check network connectivity**

---

## 📞 Still Having Issues?

**Share this information:**

1. **Console output** (copy all messages)
2. **Network tab** (screenshot of `/api/banners` request)
3. **API response** (from `http://193.203.161.174:3007/api/banners`)
4. **Database query result** (SELECT * FROM banners)

This will help diagnose the exact issue!

---

**🎉 Once banners are active, you'll see them with a beautiful black background!** 🚀
