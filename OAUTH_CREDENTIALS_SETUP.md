# Google and Apple OAuth Configuration

## Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth Credentials
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth Credentials
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.yourapp
NEXT_PUBLIC_APPLE_CLIENT_SECRET=your-apple-client-secret
NEXT_PUBLIC_APPLE_TEAM_ID=your-apple-team-id
NEXT_PUBLIC_APPLE_KEY_ID=your-apple-key-id
```

## How to Get Google OAuth Credentials

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Create a new project or select an existing one

### Step 2: Enable Google+ API
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Add authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback/google
   https://yourdomain.com/auth/callback/google
   ```
5. Click "Create"
6. Copy your **Client ID** and **Client Secret**

### Step 4: Add to .env.local
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

---

## How to Get Apple OAuth Credentials

### Step 1: Apple Developer Account
1. You need an Apple Developer account ($99/year)
2. Visit: https://developer.apple.com/

### Step 2: Create an App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" > "+" button
3. Select "App IDs" > "Continue"
4. Select "App" > "Continue"
5. Fill in:
   - Description: Your app name
   - Bundle ID: `com.yourcompany.yourapp`
6. Enable "Sign in with Apple"
7. Click "Continue" > "Register"

### Step 3: Create a Services ID
1. Go to "Identifiers" > "+" button
2. Select "Services IDs" > "Continue"
3. Fill in:
   - Description: Your app name (Web)
   - Identifier: `com.yourcompany.yourapp.web`
4. Enable "Sign in with Apple"
5. Click "Configure"
6. Add domains and return URLs:
   - Domains: `localhost`, `yourdomain.com`
   - Return URLs:
     ```
     http://localhost:3000/auth/callback/apple
     https://yourdomain.com/auth/callback/apple
     ```
7. Click "Continue" > "Register"

### Step 4: Create a Private Key
1. Go to "Keys" > "+" button
2. Fill in:
   - Key Name: "Sign in with Apple Key"
3. Enable "Sign in with Apple"
4. Click "Configure" > Select your App ID
5. Click "Continue" > "Register"
6. Download the `.p8` key file (you can only download once!)
7. Note the **Key ID** (e.g., `ABC123DEF4`)

### Step 5: Get Your Team ID
1. Go to "Membership" in your Apple Developer account
2. Copy your **Team ID** (e.g., `XYZ123ABC4`)

### Step 6: Create Client Secret
Apple requires a JWT token as the client secret. You'll need to generate this programmatically or use a tool.

**Option 1: Use a JWT Generator Tool**
- Visit: https://jwt.io/
- Use the following payload:
  ```json
  {
    "iss": "YOUR_TEAM_ID",
    "iat": 1234567890,
    "exp": 1234567890,
    "aud": "https://appleid.apple.com",
    "sub": "com.yourcompany.yourapp.web"
  }
  ```
- Sign with your `.p8` private key

**Option 2: Generate Programmatically (Node.js)**
```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('path/to/AuthKey_ABC123DEF4.p8');

const token = jwt.sign(
  {
    iss: 'YOUR_TEAM_ID',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 months
    aud: 'https://appleid.apple.com',
    sub: 'com.yourcompany.yourapp.web'
  },
  privateKey,
  {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: 'ABC123DEF4' // Your Key ID
    }
  }
);

console.log(token);
```

### Step 7: Add to .env.local
```env
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.yourapp.web
NEXT_PUBLIC_APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsImtpZCI6IkFCQzEyM0RFRjQifQ...
NEXT_PUBLIC_APPLE_TEAM_ID=XYZ123ABC4
NEXT_PUBLIC_APPLE_KEY_ID=ABC123DEF4
```

---

## Testing

### Test Google OAuth
1. Add credentials to `.env.local`
2. Restart your dev server: `npm run dev`
3. Click "Continue with Google" button
4. Complete Google authentication
5. You should be redirected back and logged in

### Test Apple OAuth
1. Add credentials to `.env.local`
2. Restart your dev server: `npm run dev`
3. Click "Continue with Apple" button
4. Complete Apple authentication
5. You should be redirected back and logged in

---

## Important Notes

### Google OAuth
- ✅ Works on localhost without HTTPS
- ✅ Redirect URIs must match exactly
- ✅ Client secret is safe to use in frontend for public clients

### Apple OAuth
- ⚠️ Requires HTTPS in production
- ⚠️ Client secret (JWT) expires after 6 months
- ⚠️ You need to regenerate the JWT token periodically
- ⚠️ Apple only provides user name on first sign-in

### Security
- 🔒 Never commit `.env.local` to git
- 🔒 Add `.env.local` to `.gitignore`
- 🔒 Use different credentials for development and production
- 🔒 Rotate secrets regularly

---

## Troubleshooting

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Solution: Check that your redirect URI in Google Console matches exactly

**Error: "invalid_client"**
- Solution: Verify your Client ID and Client Secret are correct

### Apple OAuth Issues

**Error: "invalid_client"**
- Solution: Regenerate your JWT client secret

**Error: "invalid_request"**
- Solution: Check that your return URLs are configured correctly in Apple Developer

**Error: "User name not provided"**
- Solution: Apple only provides name on first sign-in. Store it in your database.

---

## Next Steps

1. ✅ Get Google OAuth credentials
2. ✅ Get Apple OAuth credentials
3. ✅ Add credentials to `.env.local`
4. ✅ Restart dev server
5. ✅ Test both OAuth flows
6. ✅ Verify users are registered in your database
