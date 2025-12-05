# Environment Variables Template for Direct OAuth

## Add these to your `.env.local` file

```env
# ============================================
# GOOGLE OAUTH CREDENTIALS
# ============================================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# ============================================
# APPLE OAUTH CREDENTIALS
# ============================================
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.yourapp.web
NEXT_PUBLIC_APPLE_CLIENT_SECRET=your-apple-jwt-token
```

## How to Get Credentials

### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create a project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `http://localhost:3000/auth/callback/google`
6. Copy Client ID and Client Secret

### Apple OAuth
1. Go to https://developer.apple.com/
2. Create a Services ID
3. Enable "Sign in with Apple"
4. Add return URL: `http://localhost:3000/auth/callback/apple`
5. Generate JWT token as client secret (see OAUTH_CREDENTIALS_SETUP.md)
6. Copy Client ID and JWT token

## Important Notes

⚠️ **Before testing:**
1. Add these variables to your `.env.local` file
2. Restart your dev server: `npm run dev`
3. The buttons will now redirect to Google/Apple directly (not Cognito)

⚠️ **Without credentials:**
- You'll get error: "Google Client ID not configured" or "Apple Client ID not configured"

## Full Setup Guide

See `OAUTH_CREDENTIALS_SETUP.md` for detailed step-by-step instructions.
