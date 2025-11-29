# EC2 Deployment Guide - Fixing Cognito Cookie Issues

## Problem
AWS Cognito tries to set secure cookies (HTTPS only) on HTTP EC2 instance, causing login failures.

## Quick Fix Solutions

### Option 1: Update AWS Cognito App Client (Recommended)

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool: `ap-southeast-2_1tWWnrkxi`
3. Go to "App integration" → "App client settings"
4. Find your app client: `2rrjp79uvfvje1ip5c70c4e1gk`
5. Click "Edit"
6. Under "Auth session configuration", **uncheck** "Set to require HTTPS"
7. Save changes
8. Wait 5-10 minutes for changes to propagate

### Option 2: Set Up HTTPS with SSL (Production Recommended)

1. **Get a Domain Name**
   - Purchase from Route 53 or other registrar

2. **Request SSL Certificate**
   - Go to AWS Certificate Manager (ACM)
   - Request a public certificate for your domain
   - Validate via DNS records

3. **Set Up Application Load Balancer**
   ```bash
   # Create ALB
   aws elbv2 create-load-balancer \
     --name grodify-alb \
     --subnets subnet-xxxxx subnet-yyyyy \
     --security-groups sg-xxxxx \
     --scheme internet-facing \
     --type application

   # Create HTTPS listener
   aws elbv2 create-listener \
     --load-balancer-arn arn:aws:elasticloadbalancing:... \
     --protocol HTTPS \
     --port 443 \
     --certificates CertificateArn=arn:aws:acm:... \
     --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
   ```

4. **Update Cognito Callback URLs**
   - Add HTTPS URLs in Cognito app client settings
   - Example: `https://yourdomain.com/`

5. **Point Domain to ALB**
   - Create Route 53 record pointing to ALB

### Option 3: Use Environment Variables

Add these to your EC2 environment:

```bash
# In .env.local or EC2 environment
NEXT_PUBLIC_COGNITO_USER_POOL_ID=ap-southeast-2_1tWWnrkxi
NEXT_PUBLIC_COGNITO_CLIENT_ID=2rrjp79uvfvje1ip5c70c4e1gk
NEXT_PUBLIC_AWS_REGION=ap-southeast-2
NODE_ENV=production
```

### Option 4: Code Changes (Already Implemented)

The code now automatically detects HTTP environments and configures Amplify accordingly:

```typescript
// In lib/aws-config.ts
cookieStorage: {
  secure: false, // Allow cookies on HTTP
  sameSite: 'lax',
  path: '/',
  expires: 365,
}
```

## Deployment Steps

### 1. Build and Deploy
```bash
# Build the application
npm run build

# Deploy to EC2
scp -r build/* user@15.134.207.129:/path/to/app/

# Or use PM2 for process management
pm2 start npm --name "grodify" -- start
```

### 2. Set Environment Variables on EC2
```bash
# SSH into EC2
ssh -i your-key.pem user@15.134.207.129

# Set environment variables
export NODE_ENV=production
export NEXT_PUBLIC_COGNITO_USER_POOL_ID=ap-southeast-2_1tWWnrkxi
export NEXT_PUBLIC_COGNITO_CLIENT_ID=2rrjp79uvfvje1ip5c70c4e1gk
export NEXT_PUBLIC_AWS_REGION=ap-southeast-2

# Add to .bashrc for persistence
echo 'export NODE_ENV=production' >> ~/.bashrc
echo 'export NEXT_PUBLIC_COGNITO_USER_POOL_ID=ap-southeast-2_1tWWnrkxi' >> ~/.bashrc
```

### 3. Verify Configuration
```bash
# Check if app is running
curl http://15.134.207.129:3001

# Check browser console for:
# "Configuring Amplify with: { isHttp: true, hostname: '15.134.207.129', ... }"
```

## Testing

1. **Clear Browser Cookies**
   - Open DevTools → Application → Storage → Cookies
   - Clear all cookies for your domain

2. **Test Login**
   - Navigate to your app
   - Try to sign in
   - Check console for configuration logs

3. **Verify No Cookie Errors**
   - Should NOT see "Cookie rejected because non-HTTPS" errors
   - Should see successful authentication

## Security Notes

⚠️ **HTTP is not secure for production**. The cookie fix allows development but:

- Cookies can be intercepted
- Authentication tokens are vulnerable
- Use HTTPS for production applications

## Troubleshooting

### Still Getting Cookie Errors?
1. Clear browser cache and cookies
2. Restart the application
3. Wait 5-10 minutes for Cognito changes to propagate
4. Check browser console for configuration logs

### Login Not Working?
1. Verify Cognito User Pool ID and Client ID
2. Check network tab for API calls
3. Ensure Cognito app client allows HTTP (Option 1)

### Production Deployment?
1. Always use HTTPS
2. Set up SSL certificate
3. Update Cognito callback URLs to HTTPS
4. Enable "Require HTTPS" in Cognito settings
