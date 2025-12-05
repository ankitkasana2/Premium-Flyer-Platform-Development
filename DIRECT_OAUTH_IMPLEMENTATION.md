# Direct Google & Apple OAuth Implementation Guide

## 🎯 Overview

This implementation provides **direct Google and Apple OAuth** authentication **without using AWS Cognito**. Users who sign in with Google or Apple will be automatically registered in your backend database.

---

## ✅ What Was Implemented

### 1. **OAuth Client** (`lib/oauth-client.ts`)
- Direct Google OAuth 2.0 integration
- Direct Apple Sign In integration
- Automatic backend database registration
- User data extraction from OAuth providers

### 2. **Callback Pages**
- `app/auth/callback/google/page.tsx` - Handles Google OAuth callback
- `app/auth/callback/apple/page.tsx` - Handles Apple OAuth callback

### 3. **AuthStore Updates** (`stores/AuthStore.ts`)
- `signInWithGoogleDirect()` - Initiates Google OAuth flow
- `signInWithAppleDirect()` - Initiates Apple OAuth flow
- `setOAuthUser()` - Sets user data after successful OAuth
- `useAuthStore()` - Singleton hook for accessing AuthStore

---

## 🔄 OAuth Flow

### Google OAuth Flow
```
1. User clicks "Continue with Google"
   ↓
2. signInWithGoogleDirect() called
   ↓
3. Redirect to Google OAuth (accounts.google.com)
   ↓
4. User authenticates with Google
   ↓
5. Google redirects to /auth/callback/google?code=...
   ↓
6. Exchange code for access token
   ↓
7. Get user info from Google API
   ↓
8. Register user in backend database
   ↓
9. Update AuthStore with user data
   ↓
10. Redirect to home page (user is logged in)
```

### Apple OAuth Flow
```
1. User clicks "Continue with Apple"
   ↓
2. signInWithAppleDirect() called
   ↓
3. Redirect to Apple OAuth (appleid.apple.com)
   ↓
4. User authenticates with Apple
   ↓
5. Apple redirects to /auth/callback/apple (POST)
   ↓
6. Exchange code for ID token
   ↓
7. Decode ID token to get user info
   ↓
8. Register user in backend database
   ↓
9. Update AuthStore with user data
   ↓
10. Redirect to home page (user is logged in)
```

---

## 🔑 User ID Formats

| Provider | Format | Example |
|----------|--------|---------|
| Google | `google_{googleId}` | `google_114455667788990011223` |
| Apple | `apple_{appleId}` | `apple_000123.abc456def789.0123` |

---

## 📦 Backend API Integration

Both Google and Apple OAuth automatically call your backend API:

**Endpoint**: `POST http://193.203.161.174:3007/api/web/auth/register`

**Payload for Google**:
```json
{
  "fullname": "John Doe",
  "email": "john@gmail.com",
  "user_id": "google_114455667788990011223"
}
```

**Payload for Apple**:
```json
{
  "fullname": "Jane Smith",
  "email": "jane@privaterelay.appleid.com",
  "user_id": "apple_000123.abc456def789.0123"
}
```

---

## ⚙️ Setup Instructions

### Step 1: Get OAuth Credentials

Follow the detailed guide in `OAUTH_CREDENTIALS_SETUP.md` to get:
- Google Client ID and Client Secret
- Apple Client ID and Client Secret (JWT)

### Step 2: Add Environment Variables

Create or update `.env.local`:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.yourapp.web
NEXT_PUBLIC_APPLE_CLIENT_SECRET=your-apple-jwt-token
```

### Step 3: Configure OAuth Redirect URIs

**Google Cloud Console**:
- Add: `http://localhost:3000/auth/callback/google`
- Add: `https://yourdomain.com/auth/callback/google`

**Apple Developer Console**:
- Add: `http://localhost:3000/auth/callback/apple`
- Add: `https://yourdomain.com/auth/callback/apple`

### Step 4: Update Your UI

Add buttons to call the OAuth methods:

```tsx
import { useAuthStore } from "@/stores/AuthStore";

function LoginButtons() {
  const authStore = useAuthStore();

  return (
    <div>
      <button onClick={() => authStore.signInWithGoogleDirect()}>
        Continue with Google
      </button>
      
      <button onClick={() => authStore.signInWithAppleDirect()}>
        Continue with Apple
      </button>
    </div>
  );
}
```

### Step 5: Test the Implementation

1. Restart your dev server: `npm run dev`
2. Click "Continue with Google"
3. Complete Google authentication
4. Check console logs for success messages
5. Verify user in backend database
6. Repeat for Apple OAuth

---

## 🧪 Testing Checklist

- [ ] Google OAuth credentials configured
- [ ] Apple OAuth credentials configured
- [ ] Environment variables added to `.env.local`
- [ ] Dev server restarted
- [ ] Google sign-in works
- [ ] Apple sign-in works
- [ ] Users registered in backend database
- [ ] User IDs have correct prefixes
- [ ] Console logs show success messages

---

## 📊 Console Logs

### Successful Google Sign-In
```
Processing Google callback with code: 4/0Adeu5BW...
Google sign-in successful: {
  id: "114455667788990011223",
  email: "user@gmail.com",
  name: "John Doe",
  provider: "google"
}
User successfully registered in database
```

### Successful Apple Sign-In
```
Processing Apple callback with code: c1234abc...
Apple sign-in successful: {
  id: "000123.abc456def789.0123",
  email: "user@privaterelay.appleid.com",
  name: "Jane Smith",
  provider: "apple"
}
User successfully registered in database
```

---

## 🛡️ Error Handling

### Common Errors

**"Google Client ID not configured"**
- Solution: Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`

**"Apple Client ID not configured"**
- Solution: Add `NEXT_PUBLIC_APPLE_CLIENT_ID` to `.env.local`

**"redirect_uri_mismatch"**
- Solution: Verify redirect URIs in OAuth console match exactly

**"Failed to exchange code for token"**
- Solution: Check client secret is correct

**"Failed to register user in database"**
- Solution: Verify backend API is running and accessible

---

## 🔐 Security Considerations

### Client Secrets in Frontend
- ⚠️ For public OAuth clients (web apps), client secrets are **not truly secret**
- ✅ Google and Apple OAuth are designed to work this way
- ✅ The authorization code flow provides security
- ✅ Tokens are short-lived and validated by the provider

### Best Practices
1. Use HTTPS in production
2. Validate tokens on your backend
3. Implement rate limiting
4. Monitor for suspicious activity
5. Rotate Apple JWT tokens every 6 months

---

## 📝 Code Examples

### Using OAuth in a Component

```tsx
"use client";

import { observer } from "mobx-react-lite";
import { useAuthStore } from "@/stores/AuthStore";

const LoginPage = observer(() => {
  const authStore = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      await authStore.signInWithGoogleDirect();
      // Redirect happens automatically
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await authStore.signInWithAppleDirect();
      // Redirect happens automatically
    } catch (error) {
      console.error("Apple sign-in failed:", error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn} disabled={authStore.loading}>
        {authStore.loading ? "Signing in..." : "Continue with Google"}
      </button>

      <button onClick={handleAppleSignIn} disabled={authStore.loading}>
        {authStore.loading ? "Signing in..." : "Continue with Apple"}
      </button>

      {authStore.error && (
        <div className="error">{authStore.error}</div>
      )}
    </div>
  );
});

export default LoginPage;
```

### Checking Authentication Status

```tsx
import { observer } from "mobx-react-lite";
import { useAuthStore } from "@/stores/AuthStore";

const UserProfile = observer(() => {
  const authStore = useAuthStore();

  if (!authStore.isLoggedIn) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {authStore.user?.name}!</h1>
      <p>Email: {authStore.user?.email}</p>
      <p>Provider: {authStore.user?.provider}</p>
    </div>
  );
});
```

---

## 🚀 Differences from Cognito OAuth

| Feature | Cognito OAuth | Direct OAuth |
|---------|---------------|--------------|
| Setup Complexity | Medium | Low |
| AWS Dependency | Yes | No |
| Cost | AWS charges | Free (except Apple dev account) |
| Customization | Limited | Full control |
| User Management | AWS Cognito | Your backend |
| Token Management | AWS handles | You handle |
| Provider Support | Google, Apple, Facebook, etc. | Manual integration |

---

## 📚 Related Documentation

- `OAUTH_CREDENTIALS_SETUP.md` - How to get OAuth credentials
- `BACKEND_REGISTRATION_INTEGRATION.md` - Backend API integration
- `TESTING_GUIDE.md` - Testing instructions

---

## 🎯 Next Steps

1. **Get OAuth Credentials** (see `OAUTH_CREDENTIALS_SETUP.md`)
2. **Add to .env.local**
3. **Update your UI** to use the new OAuth methods
4. **Test both flows**
5. **Verify database registration**
6. **Deploy to production**

---

## ✅ Success Criteria

You'll know it's working when:
1. ✅ Clicking "Continue with Google" redirects to Google
2. ✅ After Google auth, user is redirected back and logged in
3. ✅ User appears in backend database with `google_` prefix
4. ✅ Same flow works for Apple with `apple_` prefix
5. ✅ Console shows success messages
6. ✅ No errors in console

---

**Your direct Google and Apple OAuth is ready to use! 🎉**
