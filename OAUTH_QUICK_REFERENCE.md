# Quick Reference: Direct Google & Apple OAuth

## 🎯 What You Have Now

✅ **Direct Google OAuth** (no Cognito needed)  
✅ **Direct Apple OAuth** (no Cognito needed)  
✅ **Automatic database registration**  
✅ **User ID formatting** (`google_`, `apple_` prefixes)  

---

## 📁 Files Created/Modified

### Created:
- `lib/oauth-client.ts` - OAuth client functions
- `app/auth/callback/google/page.tsx` - Google callback handler
- `app/auth/callback/apple/page.tsx` - Apple callback handler
- `OAUTH_CREDENTIALS_SETUP.md` - Credential setup guide
- `DIRECT_OAUTH_IMPLEMENTATION.md` - Full implementation guide

### Modified:
- `stores/AuthStore.ts` - Added OAuth methods

---

## ⚙️ Quick Setup

### 1. Get Credentials
- **Google**: https://console.cloud.google.com/
- **Apple**: https://developer.apple.com/

### 2. Add to .env.local
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-secret

NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.app
NEXT_PUBLIC_APPLE_CLIENT_SECRET=your-jwt-token
```

### 3. Configure Redirect URIs
**Google & Apple**:
- `http://localhost:3000/auth/callback/google`
- `http://localhost:3000/auth/callback/apple`

### 4. Use in Your UI
```tsx
import { useAuthStore } from "@/stores/AuthStore";

function LoginButtons() {
  const authStore = useAuthStore();
  
  return (
    <>
      <button onClick={() => authStore.signInWithGoogleDirect()}>
        Continue with Google
      </button>
      
      <button onClick={() => authStore.signInWithAppleDirect()}>
        Continue with Apple
      </button>
    </>
  );
}
```

---

## 🔄 How It Works

### Google Flow:
```
Click button → Google auth → Callback → Register in DB → Logged in
```

### Apple Flow:
```
Click button → Apple auth → Callback → Register in DB → Logged in
```

---

## 🔑 User ID Formats

| Provider | Format |
|----------|--------|
| Google | `google_114455667788990011223` |
| Apple | `apple_000123.abc456def789.0123` |

---

## 📊 Backend API Call

**Endpoint**: `POST /api/web/auth/register`

**Payload**:
```json
{
  "fullname": "John Doe",
  "email": "john@gmail.com",
  "user_id": "google_114455667788990011223"
}
```

---

## ✅ Testing Checklist

- [ ] Add credentials to `.env.local`
- [ ] Restart dev server
- [ ] Test Google sign-in
- [ ] Test Apple sign-in
- [ ] Check console logs
- [ ] Verify users in database

---

## 🐛 Common Issues

**"Client ID not configured"**
→ Add env variables to `.env.local`

**"redirect_uri_mismatch"**
→ Check redirect URIs in OAuth console

**"Failed to register in database"**
→ Verify backend API is running

---

## 📚 Full Documentation

- **Setup Guide**: `OAUTH_CREDENTIALS_SETUP.md`
- **Implementation**: `DIRECT_OAUTH_IMPLEMENTATION.md`

---

## 🎯 Next Steps

1. Get Google credentials
2. Get Apple credentials
3. Add to `.env.local`
4. Test both flows
5. Deploy!

---

**Need help?** Check the full documentation files above.
