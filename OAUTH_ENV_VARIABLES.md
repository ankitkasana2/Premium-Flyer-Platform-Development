# 🔑 OAuth Environment Variables - Quick Reference

## 📝 Add These to `.env.local`

```env
# ============================================
# GOOGLE OAUTH CONFIGURATION
# ============================================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# ============================================
# APPLE OAUTH CONFIGURATION
# ============================================
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.yourapp.web
NEXT_PUBLIC_APPLE_CLIENT_SECRET=your-generated-jwt-token
```

---

## 🔗 Redirect URIs to Configure

### **Google Cloud Console**
```
Development:  http://localhost:3000/auth/callback/google
Production:   https://yourdomain.com/auth/callback/google
```

### **Apple Developer Portal**
```
Development:  http://localhost:3000/auth/callback/apple
Production:   https://yourdomain.com/auth/callback/apple
```

---

## 🚀 Quick Start

1. **Get credentials** from Google Cloud Console and Apple Developer Portal
2. **Add to `.env.local`** (create file if it doesn't exist)
3. **Restart dev server**: `npm run dev`
4. **Test**: Click "Continue with Google" or "Continue with Apple"

---

## 📚 Full Documentation

See `DIRECT_OAUTH_SETUP.md` for complete setup instructions.
