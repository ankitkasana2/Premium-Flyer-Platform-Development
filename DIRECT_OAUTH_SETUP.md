# 🔐 Direct OAuth Configuration Guide (Google & Apple)

## ✅ What Was Implemented

Your application now supports **direct OAuth authentication** with Google and Apple, **completely separate from AWS Cognito**. This means:

- ✅ **Google Sign-In** - Direct integration with Google OAuth 2.0
- ✅ **Apple Sign-In** - Direct integration with Apple Sign In
- ✅ **Automatic Backend Registration** - Users are registered in your database
- ✅ **No Cognito Dependency** - Social logins work independently

---

## 🎯 How It Works

### **Authentication Flow**

```
User Clicks "Continue with Google/Apple"
    ↓
Redirect to Google/Apple OAuth
    ↓
User Authenticates with Google/Apple
    ↓
Redirect to /auth/callback/google or /auth/callback/apple
    ↓
Exchange Code for User Info
    ↓
Register User in Backend Database
    POST /api/web/auth/register
    {
      "fullname": "John Doe",
      "email": "user@gmail.com",
      "user_id": "google_114455667788990011223"
    }
    ↓
Set User Session
    ↓
Redirect to Home Page
```

---

## 📝 Environment Variables Required

You need to add these environment variables to your `.env.local` file:

### **For Google OAuth**

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **For Apple OAuth**

```env
# Apple OAuth Configuration
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.yourapp
NEXT_PUBLIC_APPLE_CLIENT_SECRET=your-apple-client-secret
```

---

## 🔧 How to Get OAuth Credentials

### **Google OAuth Setup**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "Grodify" (or your app name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Grodify Web Client"

5. **Configure Authorized Redirect URIs**
   
   **For Development:**
   ```
   http://localhost:3000/auth/callback/google
   ```
   
   **For Production:**
   ```
   https://yourdomain.com/auth/callback/google
   ```

6. **Copy Credentials**
   - Client ID: `123456789-abcdefg.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-abc123def456`
   - Add these to your `.env.local`

---

### **Apple Sign In Setup**

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account/

2. **Create an App ID**
   - Go to "Certificates, Identifiers & Profiles"
   - Click "Identifiers" → "+" button
   - Select "App IDs" → Continue
   - Description: "Grodify"
   - Bundle ID: `com.yourcompany.grodify`
   - Enable "Sign In with Apple"
   - Click "Continue" → "Register"

3. **Create a Services ID**
   - Go to "Identifiers" → "+" button
   - Select "Services IDs" → Continue
   - Description: "Grodify Web"
   - Identifier: `com.yourcompany.grodify.web`
   - Enable "Sign In with Apple"
   - Click "Configure"

4. **Configure Sign In with Apple**
   
   **Primary App ID:** Select your App ID from step 2
   
   **Domains and Subdomains:**
   ```
   localhost (for development)
   yourdomain.com (for production)
   ```
   
   **Return URLs:**
   ```
   http://localhost:3000/auth/callback/apple (development)
   https://yourdomain.com/auth/callback/apple (production)
   ```
   
   - Click "Save" → "Continue" → "Register"

5. **Create a Key**
   - Go to "Keys" → "+" button
   - Key Name: "Grodify Sign In Key"
   - Enable "Sign In with Apple"
   - Click "Configure" → Select your Primary App ID
   - Click "Save" → "Continue" → "Register"
   - **Download the key file** (.p8) - You can only download it once!
   - Note the Key ID

6. **Generate Client Secret**
   
   Apple requires a JWT token as the client secret. You'll need to generate this using:
   - Team ID (found in your Apple Developer account)
   - Key ID (from step 5)
   - Private Key (.p8 file from step 5)
   - Services ID (from step 3)
   
   **Use this Node.js script to generate the secret:**
   
   ```javascript
   const jwt = require('jsonwebtoken');
   const fs = require('fs');
   
   const privateKey = fs.readFileSync('path/to/AuthKey_XXXXXXXXXX.p8');
   const teamId = 'YOUR_TEAM_ID';
   const clientId = 'com.yourcompany.grodify.web';
   const keyId = 'YOUR_KEY_ID';
   
   const token = jwt.sign({}, privateKey, {
     algorithm: 'ES256',
     expiresIn: '180d',
     audience: 'https://appleid.apple.com',
     issuer: teamId,
     subject: clientId,
     header: {
       alg: 'ES256',
       kid: keyId
     }
   });
   
   console.log('Apple Client Secret:', token);
   ```

7. **Add to .env.local**
   ```env
   NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.grodify.web
   NEXT_PUBLIC_APPLE_CLIENT_SECRET=<generated-jwt-token>
   ```

---

## 📂 Files Modified

### 1. **`stores/AuthStore.ts`**
   - Added `setOAuthUser()` method to handle direct OAuth sign-in
   - Stores user session from Google/Apple without Cognito

### 2. **`components/auth/auth-modal.tsx`**
   - Updated `handleSocialSignIn()` to use direct OAuth
   - Now calls `signInWithGoogle()` or `signInWithApple()` from `lib/oauth-client.ts`

### 3. **`app/auth/callback/google/page.tsx`**
   - Fixed to use correct MobX store provider
   - Handles Google OAuth callback

### 4. **`app/auth/callback/apple/page.tsx`**
   - Fixed to use correct MobX store provider
   - Handles Apple OAuth callback

### 5. **`lib/oauth-client.ts`** (Already existed)
   - Contains all OAuth logic
   - Handles token exchange and user info retrieval
   - Automatically registers users in backend database

---

## 🧪 Testing Instructions

### **Test Google Sign-In**

1. Add Google credentials to `.env.local`
2. Restart your dev server: `npm run dev`
3. Open your app: `http://localhost:3000`
4. Click "Sign In" → "Continue with Google"
5. You should be redirected to Google
6. Sign in with your Google account
7. You'll be redirected back to `/auth/callback/google`
8. Check browser console for logs
9. You should be redirected to home page
10. Check your database for the new user with `google_` prefix

### **Test Apple Sign-In**

1. Add Apple credentials to `.env.local`
2. Restart your dev server: `npm run dev`
3. Open your app: `http://localhost:3000`
4. Click "Sign In" → "Continue with Apple"
5. You should be redirected to Apple
6. Sign in with your Apple ID
7. You'll be redirected back to `/auth/callback/apple`
8. Check browser console for logs
9. You should be redirected to home page
10. Check your database for the new user with `apple_` prefix

---

## 🔍 Expected Console Output

### **Successful Google Sign-In:**
```
Processing Google callback with code: 4/0AY0e-g7...
Google sign-in successful: {
  id: "114455667788990011223",
  email: "user@gmail.com",
  name: "John Doe",
  picture: "https://...",
  provider: "google"
}
✅ User successfully registered in database: {...}
Setting OAuth user: {...}
```

### **Successful Apple Sign-In:**
```
Processing Apple callback with code: c1234567890abcdef...
Apple sign-in successful: {
  id: "001234.abcdef123456.7890",
  email: "user@privaterelay.appleid.com",
  name: "John Doe",
  provider: "apple"
}
✅ User successfully registered in database: {...}
Setting OAuth user: {...}
```

---

## 🎯 User ID Formats

| Provider | Format | Example |
|----------|--------|---------|
| **Google** | `google_{googleId}` | `google_114455667788990011223` |
| **Apple** | `apple_{appleId}` | `apple_001234.abcdef123456.7890` |
| **Email/Password** | `cognito_{userId}` | `cognito_abc123def456` |

---

## 🛠️ Troubleshooting

### **Issue: "Google Client ID not configured"**

**Solution:**
1. Check `.env.local` has `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. Restart dev server after adding env variables
3. Make sure the variable name is correct (must start with `NEXT_PUBLIC_`)

### **Issue: "Redirect URI mismatch"**

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add the exact redirect URI: `http://localhost:3000/auth/callback/google`
4. For production, add: `https://yourdomain.com/auth/callback/google`

### **Issue: "Failed to exchange code for token"**

**Solution:**
1. Check that `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` is correct
2. Make sure you're using the correct client secret (not client ID)
3. Verify the redirect URI matches exactly

### **Issue: Apple Sign-In shows "Invalid client"**

**Solution:**
1. Regenerate the Apple client secret (JWT token)
2. Make sure the JWT is not expired (max 180 days)
3. Verify the Services ID matches `NEXT_PUBLIC_APPLE_CLIENT_ID`

---

## 📊 Backend Database Schema

Users from OAuth will be stored with this structure:

```javascript
{
  fullname: "John Doe",
  email: "user@gmail.com",
  user_id: "google_114455667788990011223",
  created_at: "2025-12-05T...",
  updated_at: "2025-12-05T..."
}
```

---

## ✅ Quick Setup Checklist

- [ ] Get Google Client ID and Secret
- [ ] Get Apple Client ID and Secret
- [ ] Add credentials to `.env.local`
- [ ] Configure redirect URIs in Google Cloud Console
- [ ] Configure return URLs in Apple Developer Portal
- [ ] Restart dev server
- [ ] Test Google sign-in
- [ ] Test Apple sign-in
- [ ] Verify users in database
- [ ] Check user IDs have correct prefixes

---

## 🎉 Summary

Your application now has:
- ✅ **Direct Google OAuth** - No Cognito required
- ✅ **Direct Apple OAuth** - No Cognito required
- ✅ **Automatic Backend Registration** - Users saved in database
- ✅ **Proper User ID Formatting** - `google_` and `apple_` prefixes
- ✅ **Seamless User Experience** - Redirect flow works smoothly

**Just add your OAuth credentials to `.env.local` and you're ready to go!** 🚀
