# Quick Reference: Backend Registration Integration

## What Was Implemented

✅ **Automatic database registration** when users register via Cognito  
✅ **Social login support** (Google & Apple) with automatic database sync  
✅ **Provider-prefixed user IDs** (e.g., `google_`, `cognito_`, `apple_`)  
✅ **Error handling** that doesn't block authentication  
✅ **Retry mechanism** on every login for social providers  

## Files Modified/Created

1. **Created**: `lib/api-client.ts` - API client for backend communication
2. **Modified**: `stores/AuthStore.ts` - Added database registration logic
3. **Created**: `BACKEND_REGISTRATION_INTEGRATION.md` - Full documentation

## How It Works

### Email/Password Registration
```
User registers → Cognito creates user → Backend API called → User logged in
```

### Social Login (Google/Apple)
```
User signs in → Cognito authenticates → Backend API called → User logged in
```

## API Endpoint Used

```
POST http://193.203.161.174:3007/api/web/auth/register

Payload:
{
  "fullname": "User Name",
  "email": "user@example.com",
  "user_id": "provider_userId"
}
```

## User ID Formats

- **Email/Password**: `cognito_abc123`
- **Google**: `google_114455667788990011223`
- **Apple**: `apple_xyz789`

## Testing Checklist

- [ ] Register with email/password
- [ ] Check console logs for "User successfully registered in database"
- [ ] Verify user in backend database
- [ ] Test Google sign-in
- [ ] Test Apple sign-in
- [ ] Verify provider prefixes in database

## Console Logs to Watch

```
✓ User successfully registered in database
✗ Failed to register user in database
```

## Important Notes

⚠️ **Database failures don't block login** - Users can still authenticate even if backend is down  
⚠️ **Social logins retry on every login** - Acts as automatic retry mechanism  
⚠️ **Backend must handle duplicates** - Implement upsert logic in your API  

## Need Help?

See `BACKEND_REGISTRATION_INTEGRATION.md` for detailed documentation.
