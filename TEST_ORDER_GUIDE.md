# Test Order Implementation Guide

## 🚀 Implementation Complete

The test order functionality has been successfully implemented and integrated with your backend API. Here's how to use it:

## 📋 How to Test

### 1. Quick Test (No Files)
1. Navigate to `/test-order` in your browser
2. Click the yellow "Quick Test Order" button
3. Check browser console for logs
4. Look for success/error toast notifications

### 2. Test with Files
1. On the same test page, click "Test with Files" button
2. This sends mock image files to test file upload functionality
3. Monitor console logs for file upload details

### 3. Full Form Test
1. Navigate to any flyer page (e.g., `/flyers`)
2. Fill out the complete flyer form
3. Upload real images (flyer, venue logo, DJ images, etc.)
4. Click the yellow "Test Order" button next to "Checkout Now"
5. Monitor the browser console for detailed logs

## 🔍 What to Check

### In Browser Console:
- Look for "Submitting test order with FormData" logs
- Check "Forwarding test order to backend" logs
- Verify "Backend response status" is 200
- Look for "Backend success response" with order data

### Toast Notifications:
- ✅ "Test order created successfully!"
- 📋 "Order ID: [ORDER_ID]"
- ❌ Error messages if something fails

### Backend Verification:
- Check your backend API logs
- Verify orders are created in database
- Confirm files are uploaded to correct location

## 📡 API Endpoint Details

### Frontend Test Route:
- **URL**: `/api/test-order`
- **Method**: POST
- **Content-Type**: multipart/form-data

### Backend API:
- **URL**: `http://193.203.161.174:3007/api/orders`
- **Method**: POST
- **Content-Type**: multipart/form-data

### Data Format (matching Postman):
```
presenting: "XYZ Events"
event_title: "Summer Party 2025"
event_date: "2025-12-01"
flyer_info: "Special flyer for summer party"
address_phone: "123 Main St, 555-1234"
djs: [{"name":"DJ Mike"},{"name":"DJ Anna"}]
host: {"name":"John Host"}
sponsors: [{},{},{}]
story_size_version: "true"
custom_flyer: "false"
animated_flyer: "true"
instagram_post_size: "false"
delivery_time: "5 Hours"
custom_notes: "Please make it colorful"
flyer_is: "1"
user_id: "12345"
user_email: "user@example.com"
```

### File Uploads:
- `image`: Main flyer image
- `venue_logo`: Venue logo file
- `dj_0`, `dj_1`: DJ/Artist images
- `host`: Host image
- `sponsor_0`, `sponsor_1`, `sponsor_2`: Sponsor images

## 🛠️ Troubleshooting

### Common Issues:

1. **"Please sign in to create a test order"**
   - Make sure you're logged in
   - Check authentication store

2. **Backend connection error**
   - Verify backend API is running
   - Check CORS settings
   - Confirm API URL is correct

3. **File upload errors**
   - Check file size limits
   - Verify file types are allowed
   - Ensure proper field names

4. **FormData format errors**
   - Check browser console for field names
   - Verify all required fields are present
   - Ensure JSON strings are properly formatted

### Debug Steps:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Perform test order
5. Look for these logs:
   - "Submitting test order with FormData"
   - "Forwarding test order to backend"
   - "Backend response status"
   - "Backend success response"

## 📝 Test Results

When successful, you should see:
- Toast: "Test order created successfully!"
- Toast: "Order ID: [ORDER_ID]"
- Console: Backend response with order data
- Database: New order record created

## 🎯 Next Steps

1. **Verify all test scenarios pass**
2. **Check file uploads work correctly**
3. **Test with various form data combinations**
4. **Verify error handling works**
5. **Test with different user accounts**

## 📞 Support

If you encounter issues:
1. Check browser console logs
2. Verify backend API is accessible
3. Check network tab in DevTools
4. Review backend logs
5. Ensure all environment variables are set

The test order functionality is now ready for use! 🎉
