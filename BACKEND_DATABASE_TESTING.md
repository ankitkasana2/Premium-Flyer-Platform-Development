# ✅ Backend Database Integration - Testing Guide

## 🎯 What Was Implemented

Your application now **automatically registers users in your backend database** after successful Cognito authentication. This happens for:

1. ✅ **Email/Password Registration** - Users registered via Cognito
2. ✅ **Google Sign-In** - OAuth users from Google
3. ✅ **Apple Sign-In** - OAuth users from Apple

## 🔄 How It Works

### Registration Flow

```
User Registers/Logs In
    ↓
AWS Cognito Authentication
    ↓
Extract User Data from JWT Token
    ↓
Call Backend API: POST /api/web/auth/register
    ↓
User Saved in Database
    ↓
User Sees Their Name (Not ID)
```

### API Call Details

**Endpoint:**
```
POST http://193.203.161.174:3007/api/web/auth/register
```

**Payload Format:**
```json
{
  "fullname": "Girish Kumar",
  "email": "girish@gmail.com",
  "user_id": "google_114455667788990011223"
}
```

### User ID Formats

| Authentication Method | User ID Format | Example |
|----------------------|----------------|---------|
| Email/Password | `cognito_{userId}` | `cognito_abc123def456` |
| Google Sign-In | `google_{googleId}` | `google_114455667788990011223` |
| Apple Sign-In | `apple_{appleId}` | `apple_xyz789abc123` |

---

## 🧪 Testing Instructions

### Test 1: Email/Password Registration

1. **Open your application** in a browser
2. **Click "Sign In"** button
3. **Switch to "Sign Up"** tab
4. **Fill in the registration form:**
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
5. **Submit the form**
6. **Open Browser Console** (Press F12)
7. **Look for these console logs:**

```
✅ Expected Console Output:
Raw user from AWS: {...}
Session tokens: {...}
ID Token exists: true
JWT payload: {...}
Email from token: test@example.com
Name from token: Test User
Provider from token: cognito
Normalized user: {...}
Formatted user ID for database: cognito_abc123...
Registering user in database with ID: cognito_abc123...
✅ User successfully registered in database: {...}
```

8. **Verify in Backend Database:**
   - Check your database for a new user
   - Email should be: `test@example.com`
   - Full name should be: `Test User`
   - User ID should start with: `cognito_`

9. **Verify in UI:**
   - User should be automatically logged in
   - Top-right corner should show user avatar with initials "TU"
   - Clicking avatar should show dropdown with "Test User" name

---

### Test 2: Google Sign-In

1. **Open your application** in a browser
2. **Click "Sign In"** button
3. **Click "Continue with Google"**
4. **Complete Google authentication**
5. **You'll be redirected back to the app**
6. **Open Browser Console** (Press F12)
7. **Look for these console logs:**

```
✅ Expected Console Output:
Raw user from AWS: {...}
JWT payload: {...}
Email from token: your.email@gmail.com
Name from token: Your Full Name
Provider from token: google
Formatted user ID for database: google_114455667788990011223
✅ User successfully registered/updated in database: {...}
```

8. **Verify in Backend Database:**
   - Check your database for the user
   - Email should be your Google email
   - Full name should be your Google account name
   - User ID should start with: `google_`

9. **Verify in UI:**
   - Top-right corner should show your Google profile picture OR initials
   - Clicking avatar should show dropdown with your Google name
   - **NOT** showing a long user ID

---

### Test 3: Apple Sign-In

1. **Open your application** in a browser
2. **Click "Sign In"** button
3. **Click "Continue with Apple"**
4. **Complete Apple authentication**
5. **You'll be redirected back to the app**
6. **Open Browser Console** (Press F12)
7. **Look for these console logs:**

```
✅ Expected Console Output:
Raw user from AWS: {...}
JWT payload: {...}
Email from token: your.email@privaterelay.appleid.com
Name from token: Your Name
Provider from token: apple
Formatted user ID for database: apple_xyz789...
✅ User successfully registered/updated in database: {...}
```

8. **Verify in Backend Database:**
   - Check your database for the user
   - Email should be your Apple email (or private relay)
   - Full name should be your Apple account name
   - User ID should start with: `apple_`

9. **Verify in UI:**
   - Top-right corner should show your initials
   - Clicking avatar should show dropdown with your Apple name

---

## 📝 What Changed in the Code

### 1. AuthStore.ts (stores/AuthStore.ts)

**Added Import:**
```typescript
import { registerUserInDatabase, formatCognitoUserId } from "@/lib/api-client"
```

**Updated `updateUserFromAmplify()` method:**
- ✅ Extracts full name from JWT token
- ✅ Detects provider (cognito/google/apple) from JWT
- ✅ Calls backend API to register user
- ✅ Formats user_id with provider prefix
- ✅ Shows user's name instead of ID in UI

**Updated `register()` method:**
- ✅ Calls backend API immediately after Cognito registration
- ✅ Formats user_id as `cognito_{userId}`
- ✅ Continues authentication even if backend fails (graceful degradation)

### 2. API Client (lib/api-client.ts)

**Already exists** with these functions:
- `registerUserInDatabase()` - Calls your backend API
- `formatCognitoUserId()` - Formats user IDs with provider prefix

---

## 🎯 Success Criteria

You'll know it's working when:

1. ✅ **Console shows:** "✅ User successfully registered in database"
2. ✅ **Database contains:** New user with correct email, name, and user_id
3. ✅ **User ID has prefix:** `cognito_`, `google_`, or `apple_`
4. ✅ **UI shows name:** User's actual name appears in dropdown menu
5. ✅ **Avatar shows initials:** Based on user's full name
6. ✅ **No errors:** Authentication works smoothly

---

## 🔍 Troubleshooting

### Issue: "❌ Failed to register user in database"

**Possible Causes:**
1. Backend API is not running
2. Backend API URL is incorrect
3. Backend API endpoint doesn't exist
4. CORS issues

**Solution:**
1. Verify backend is running at: `http://193.203.161.174:3007`
2. Test endpoint with Postman:
   ```bash
   POST http://193.203.161.174:3007/api/web/auth/register
   Content-Type: application/json
   
   {
     "fullname": "Test User",
     "email": "test@example.com",
     "user_id": "cognito_test123"
   }
   ```
3. Check backend logs for errors

### Issue: User sees their ID instead of name

**Possible Causes:**
1. JWT token doesn't contain name field
2. Name extraction failed

**Solution:**
1. Check console logs for "Name from token:"
2. If empty, check JWT payload structure
3. Verify Cognito user attributes include "name"

### Issue: User not appearing in database

**Possible Causes:**
1. Backend API call failed silently
2. Database connection issue
3. Backend validation errors

**Solution:**
1. Check browser console for error messages
2. Check backend server logs
3. Verify database connection
4. Test API endpoint manually with Postman

---

## 📊 Database Schema

Your backend should store users with this structure:

```javascript
{
  fullname: "Girish Kumar",        // User's full name
  email: "girish@gmail.com",       // User's email
  user_id: "google_114455667788990011223",  // Unique ID with provider prefix
  created_at: "2025-12-05T...",    // Timestamp
  updated_at: "2025-12-05T..."     // Timestamp
}
```

**Important:**
- `user_id` is the **primary key** or **unique identifier**
- Backend should handle **upsert** (update if exists, insert if new)
- This allows re-registration on every login (acts as automatic retry)

---

## 🚀 Next Steps

1. ✅ **Test all three authentication methods** (Email, Google, Apple)
2. ✅ **Verify database entries** for each method
3. ✅ **Check UI displays names** correctly
4. ✅ **Monitor console logs** for any errors
5. ✅ **Test on different browsers** (Chrome, Safari, Firefox)

---

## 📚 Related Documentation

- **IMPLEMENTATION_SUMMARY.md** - Detailed implementation overview
- **BACKEND_REGISTRATION_INTEGRATION.md** - Full technical documentation
- **OAUTH_CREDENTIALS_SETUP.md** - OAuth configuration guide

---

## ✅ Quick Verification Checklist

- [ ] Email/Password registration works
- [ ] User appears in database with `cognito_` prefix
- [ ] User's name shows in UI (not ID)
- [ ] Google sign-in works
- [ ] Google user in database with `google_` prefix
- [ ] Google user's name shows in UI
- [ ] Apple sign-in works
- [ ] Apple user in database with `apple_` prefix
- [ ] Apple user's name shows in UI
- [ ] Console shows success messages
- [ ] No errors in browser console
- [ ] Backend API receives correct data

---

**🎉 If all checks pass, your integration is complete!**
