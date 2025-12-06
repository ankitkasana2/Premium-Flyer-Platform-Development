# 🧪 Favorites Feature - Testing Guide

## ✅ Quick Test Steps

### **Step 1: Sign In**
1. Open the app in your browser
2. Click the "Sign In" button in the header
3. Sign in with:
   - Email/Password, OR
   - Google account, OR
   - Apple account

### **Step 2: Add Flyer to Favorites**
1. Navigate to the home page or categories page
2. Find any flyer you like
3. Click the **heart icon** (❤️) on the flyer card
4. You should see:
   - ✅ Toast notification: "Added to favorites!"
   - ✅ Heart icon turns **red** (filled)
   - ✅ Console log: "✅ Added to favorites: {flyerId}"

### **Step 3: View Favorites**
1. Click on "Favorites" in the navigation menu
2. You should see:
   - ✅ The flyer you just favorited
   - ✅ Flyer image displayed
   - ✅ Price badge
   - ✅ Premium/Photo ribbons (if applicable)
   - ✅ Filled red heart icon
   - ✅ Flyer title

### **Step 4: Click to Checkout**
1. On the `/favorites` page
2. Click **anywhere on the flyer card** (not the heart icon)
3. You should:
   - ✅ Navigate to `/flyer/{flyerId}`
   - ✅ See the flyer detail/checkout page
   - ✅ URL has query params: `?image=...&name=...&price=...`

### **Step 5: Remove from Favorites**
1. On the `/favorites` page
2. Click the **heart icon** on any flyer
3. You should see:
   - ✅ Toast notification: "Removed from favorites"
   - ✅ Flyer disappears from the list
   - ✅ Console log: "✅ Removed from favorites: {flyerId}"

---

## 🔍 Troubleshooting

### **Issue: "Sign in to view favorites" message**
**Cause**: You're not logged in
**Solution**: 
1. Click "Sign In" button
2. Log in with your account
3. Favorites will automatically load

### **Issue: Favorites not showing after login**
**Solution**:
1. Open browser console (F12)
2. Look for: "🔄 User logged in, fetching favorites for: {userId}"
3. Check for any error messages
4. Refresh the page

### **Issue: Heart icon not turning red**
**Solution**:
1. Make sure you're logged in
2. Check browser console for errors
3. Verify the API call succeeded

### **Issue: Can't add to favorites**
**Solution**:
1. Make sure you're logged in
2. Check browser console for errors
3. Verify backend API is running: `http://193.203.161.174:3007`

---

## 📊 Expected Console Logs

### **On Login**
```
🔄 User logged in, fetching favorites for: google_114455667788990011223
✅ Fetched 2 favorites for user: google_114455667788990011223
```

### **On Add to Favorites**
```
✅ Added to favorites: 26
```

### **On Remove from Favorites**
```
✅ Removed from favorites: 26
```

### **On Logout**
```
🔄 User logged out, clearing favorites
```

---

## 🎯 Success Criteria

- ✅ User can sign in
- ✅ User can add flyers to favorites
- ✅ Heart icon turns red when favorited
- ✅ Favorites appear on `/favorites` page
- ✅ User can click flyer to go to checkout
- ✅ User can remove favorites
- ✅ Toast notifications appear for all actions
- ✅ Favorites persist across page refreshes
- ✅ Favorites sync with backend

---

## 🔗 API Endpoints Being Used

```
POST http://193.203.161.174:3007/api/favorites/add
GET  http://193.203.161.174:3007/api/favorites/user/{user_id}
DELETE http://193.203.161.174:3007/api/favorites/remove
```

---

## 📱 Test on Different Devices

- ✅ Desktop browser
- ✅ Mobile browser
- ✅ Tablet
- ✅ Different screen sizes

---

**Last Updated**: December 6, 2025
**Status**: Ready for Testing ✅
