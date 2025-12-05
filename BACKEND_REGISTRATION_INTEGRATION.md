# Backend Database Registration Integration

## Overview
This document explains how user registration data from AWS Cognito is synchronized with your backend database.

## Implementation Summary

### 1. **API Client** (`lib/api-client.ts`)
Created a dedicated API client for backend communication with the following functions:

- **`registerUserInDatabase(payload)`**: Registers/updates user in the backend database
  - Endpoint: `POST http://193.203.161.174:3007/api/web/auth/register`
  - Payload: `{ fullname, email, user_id }`
  - Returns: `{ success, message, data }`

- **`formatCognitoUserId(userId, provider)`**: Formats Cognito user IDs with provider prefix
  - Examples:
    - `cognito_abc123` for email/password registration
    - `google_114455667788990011223` for Google sign-in
    - `apple_xyz789` for Apple sign-in

### 2. **AuthStore Updates** (`stores/AuthStore.ts`)

#### A. Email/Password Registration
When a user registers with email/password:
1. User is registered in AWS Cognito
2. Cognito returns a `userId`
3. User is immediately registered in backend database with:
   - `fullname`: From registration form
   - `email`: From registration form
   - `user_id`: Formatted as `cognito_{userId}`

#### B. Social Login (Google/Apple)
When a user signs in with Google or Apple:
1. User authenticates with the social provider
2. Cognito creates/updates the user
3. On successful login, `updateUserFromAmplify()` is called
4. User data is extracted from JWT token including:
   - Email
   - Full name (from `name`, `given_name`, or `family_name`)
   - Provider (detected from `identities` array or `cognito:username` prefix)
5. User is registered/updated in backend database with:
   - `fullname`: Extracted from JWT token
   - `email`: Extracted from JWT token
   - `user_id`: Formatted as `{provider}_{userId}` (e.g., `google_114455667788990011223`)

## Flow Diagrams

### Email/Password Registration Flow
```
User fills registration form
    ↓
Submit to Cognito (awsSignUp)
    ↓
Cognito creates user → Returns userId
    ↓
Register in backend database
    ↓
Auto-login (if email verification not required)
    ↓
User is logged in
```

### Social Login Flow
```
User clicks "Sign in with Google/Apple"
    ↓
Redirect to Cognito Hosted UI
    ↓
User authenticates with social provider
    ↓
Cognito creates/updates user
    ↓
Redirect back to app
    ↓
updateUserFromAmplify() called
    ↓
Extract user data from JWT token
    ↓
Register/update in backend database
    ↓
User is logged in
```

## Error Handling

### Database Registration Failures
- If backend registration fails, the user is **still registered in Cognito**
- Error is logged to console but doesn't block the authentication flow
- This ensures users can always authenticate even if the backend is temporarily unavailable

### Retry Logic
- The backend registration is called on **every login** for social providers
- This acts as a retry mechanism if the initial registration failed
- Your backend API should handle duplicate registrations gracefully (upsert logic)

## API Payload Format

### Request to Backend
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "user_id": "google_114455667788990011223"
}
```

### Expected Response (Success)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    // User data from your database
  }
}
```

### Expected Response (Error)
```json
{
  "success": false,
  "message": "Error message here"
}
```

## User ID Format Examples

| Authentication Method | User ID Format | Example |
|----------------------|----------------|---------|
| Email/Password | `cognito_{cognitoUserId}` | `cognito_abc123def456` |
| Google Sign-In | `google_{googleUserId}` | `google_114455667788990011223` |
| Apple Sign-In | `apple_{appleUserId}` | `apple_xyz789abc123` |

## Testing

### Test Email/Password Registration
1. Open your app
2. Click "Register" or "Sign Up"
3. Fill in the form with:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPass123!"
4. Submit the form
5. Check browser console for logs:
   - "User successfully registered in database"
6. Verify in your backend database that the user was created

### Test Google Sign-In
1. Open your app
2. Click "Sign in with Google"
3. Complete Google authentication
4. Check browser console for logs:
   - "JWT payload" (should show Google user data)
   - "Provider from token: google"
   - "User successfully registered/updated in database"
5. Verify in your backend database that the user was created with `google_` prefix

### Test Apple Sign-In
1. Open your app
2. Click "Sign in with Apple"
3. Complete Apple authentication
4. Check browser console for logs:
   - "JWT payload" (should show Apple user data)
   - "Provider from token: apple"
   - "User successfully registered/updated in database"
5. Verify in your backend database that the user was created with `apple_` prefix

## Console Logs

When debugging, you'll see these console logs:

```
Raw user from AWS: { userId: "...", ... }
Session tokens: { idToken: "...", ... }
ID Token exists: true
JWT payload: { email: "...", name: "...", ... }
Email from token: user@example.com
Provider from token: google
Normalized user: { id: "...", email: "...", name: "...", provider: "google" }
User successfully registered/updated in database: { ... }
```

## Backend API Requirements

Your backend API should:

1. **Accept POST requests** to `/api/web/auth/register`
2. **Handle duplicate registrations** (upsert logic recommended)
3. **Return proper JSON responses** with `success` and `message` fields
4. **Store the user_id** exactly as provided (with provider prefix)
5. **Be idempotent** - calling the same registration multiple times should not cause errors

### Recommended Backend Logic
```javascript
// Pseudo-code for backend
async function registerUser(req, res) {
  const { fullname, email, user_id } = req.body;
  
  // Check if user already exists
  const existingUser = await db.findUserByUserId(user_id);
  
  if (existingUser) {
    // Update existing user
    await db.updateUser(user_id, { fullname, email });
    return res.json({ success: true, message: "User updated" });
  } else {
    // Create new user
    await db.createUser({ fullname, email, user_id });
    return res.json({ success: true, message: "User created" });
  }
}
```

## Troubleshooting

### Issue: User not registered in database
**Solution**: Check browser console for error messages. Verify:
- Backend API is running and accessible
- API endpoint URL is correct in `config/api.ts`
- Backend accepts the payload format

### Issue: Duplicate users created
**Solution**: Ensure your backend implements upsert logic based on `user_id`

### Issue: Wrong provider prefix
**Solution**: Check JWT token payload in console logs. Verify provider detection logic in `updateUserFromAmplify()`

## Security Considerations

1. **JWT Token**: The JWT token from Cognito is trusted and not verified in the frontend (AWS already verified it)
2. **User ID Format**: The provider prefix helps identify authentication method
3. **Email Verification**: Cognito handles email verification before allowing login
4. **Error Handling**: Database failures don't expose sensitive information to users

## Future Enhancements

1. Add retry logic with exponential backoff for database registration
2. Queue failed registrations for later processing
3. Add user profile sync (update user data on every login)
4. Implement webhook for Cognito post-authentication trigger
5. Add analytics tracking for registration sources
