# Test Order Functionality

## 🧪 Overview

The Test Order functionality allows users to create test orders without going through the actual payment process. This is useful for testing the complete order flow, validating form data, and ensuring proper integration with the backend API.

## 🔄 Test Order Flow

### **1. User Interaction**
1. **User fills flyer form** with all required details
2. **Clicks "Test Order" button** (yellow button with test tube icon)
3. **System validates form** data
4. **Creates test order** and sends to backend
5. **Shows success message** with order details

### **2. Backend Integration**
1. **Frontend sends FormData** to `/api/test-order`
2. **API forwards request** to backend at `http://193.203.161.174:3007/api/orders`
3. **Backend processes order** and returns response
4. **Frontend displays result** to user

## 🛠️ Technical Implementation

### **Frontend: Test Order Function**

**Location**: `components/orer-form/flyer-form.tsx` lines 440-545

```typescript
const handleTestOrder = async () => {
  // 1. Authentication check
  if (!authStore.user?.id) {
    toast.error("Please sign in to create a test order.");
    authStore.handleAuthModal();
    return;
  }

  // 2. Form validation
  const { valid, errors } = flyerFormStore.validateForm();
  if (!valid) {
    toast.error(errors.join("\n"));
    return;
  }

  // 3. Create FormData for file uploads
  const formData = new FormData();
  
  // Add JSON data
  const apiBody = mapToApiRequest(flyerFormStore.flyerFormDetail, {
    userId: authStore.user.id,
    flyerId: flyer?.id ?? flyerFormStore.flyerFormDetail.flyerId,
    categoryId: flyer?.category ?? flyerFormStore.flyerFormDetail.categoryId,
    subtotal: totalDisplay,
    image_url: image || ""
  });
  
  formData.append('data', JSON.stringify(apiBody));

  // 4. Add files (images, logos, etc.)
  if (image instanceof File) {
    formData.append('image', image);
  }
  
  // Add venue logo, DJ images, host image, sponsor images
  // ... (file handling logic)

  // 5. Send to test-order API
  const response = await fetch("/api/test-order", {
    method: "POST",
    body: formData,
  });

  // 6. Handle response
  if (response.ok) {
    const result = await response.json();
    toast.success("Test order created successfully!");
    if (result.orderId) {
      toast.success(`Order ID: ${result.orderId}`);
    }
  }
};
```

### **Backend API: Test Order Route**

**Location**: `app/api/test-order/route.ts`

```typescript
export async function POST(req: NextRequest) {
  try {
    // Handle both JSON and FormData
    const contentType = req.headers.get("content-type");
    let body: any;
    let headers: Record<string, string> = {};

    if (contentType?.includes("multipart/form-data")) {
      // Handle FormData with files
      const formData = await req.formData();
      const backendFormData = new FormData();
      
      // Copy all form data to backend FormData
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          backendFormData.append(key, value);
        } else {
          backendFormData.append(key, value);
        }
      }
      
      body = backendFormData;
    } else {
      // Handle JSON
      body = await req.json();
      headers["Content-Type"] = "application/json";
    }

    // Forward to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/orders`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    // Handle backend response
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Backend API error", details: errorText },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
```

## 🎨 User Interface

### **Test Order Button**
- **Color**: Yellow outline with yellow text
- **Icon**: TestTube icon from Lucide React
- **State**: Shows loading spinner with "Testing..." during submission
- **Position**: Left of the main "Checkout Now" button

```typescript
<Button
  type="button"
  variant="outline"
  disabled={isSubmitting}
  className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
  onClick={handleTestOrder}
>
  {isSubmitting ? (
    <span className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      Testing...
    </span>
  ) : (
    <span className="flex items-center gap-2">
      <TestTube className="w-4 h-4" />
      Test Order
    </span>
  )}
</Button>
```

## 📁 Data Structure

### **FormData Contents**

The test order sends the following data to the backend:

#### **JSON Data** (as 'data' field):
```typescript
{
  userId: string,
  flyerId: string,
  categoryId: string,
  subtotal: number,
  image_url: string,
  eventDetails: {
    presenting: string,
    mainTitle: string,
    date: Date,
    flyerInfo: string,
    addressAndPhone: string,
    venueLogo: File | null
  },
  djsOrArtists: Array<{
    name: string,
    image: File | null
  }>,
  host: {
    name: string,
    image: File | null
  },
  sponsors: {
    sponsor1: File | null,
    sponsor2: File | null,
    sponsor3: File | null
  },
  extras: {
    storySizeVersion: boolean,
    customFlyer: boolean,
    animatedFlyer: boolean,
    instagramPostSize: boolean
  },
  deliveryTime: string,
  customNote: string
}
```

#### **File Uploads**:
- `image`: Main flyer image
- `venueLogo`: Venue logo file
- `djImage_0`, `djImage_1`: DJ/Artist images
- `hostImage`: Host image
- `sponsor_sponsor1`, `sponsor_sponsor2`, `sponsor_sponsor3`: Sponsor images

## 🔧 Backend Integration

### **API Endpoint**
- **URL**: `http://193.203.161.174:3007/api/orders`
- **Method**: POST
- **Content-Type**: multipart/form-data (for file uploads)

### **Expected Response**
```typescript
{
  success: boolean,
  orderId?: string,
  message?: string,
  error?: string
}
```

## 🧪 Testing Scenarios

### **Test Case 1: Successful Test Order**
```typescript
// Fill form with valid data
// Click "Test Order"
// Expected: Success toast with order ID
```

### **Test Case 2: Validation Errors**
```typescript
// Submit form with missing required fields
// Expected: Error toast listing validation issues
```

### **Test Case 3: Authentication Required**
```typescript
// Try test order without being logged in
// Expected: "Please sign in to create a test order" + auth modal opens
```

### **Test Case 4: File Uploads**
```typescript
// Upload images, logos, etc.
// Expected: Files properly sent to backend
```

### **Test Case 5: Backend Errors**
```typescript
// Backend returns error
// Expected: Error toast with backend error details
```

## 🎯 Use Cases

### **Development & Testing**
1. **Form Validation**: Test all form field validations
2. **File Uploads**: Verify image upload functionality
3. **API Integration**: Test backend communication
4. **Data Structure**: Validate order data format

### **Quality Assurance**
1. **End-to-End Testing**: Complete order flow without payment
2. **User Experience**: Test form completion process
3. **Error Handling**: Verify error scenarios
4. **Performance**: Test large file uploads

### **Demo & Presentation**
1. **Product Demos**: Show complete order flow
2. **Client Presentations**: Demonstrate functionality
3. **Training**: Teach users the order process
4. **Testing Environments**: Safe testing without real payments

## 🔒 Security Considerations

### **Data Protection**
- **Authentication**: Requires user to be logged in
- **Validation**: All form data is validated before submission
- **File Security**: File types and sizes should be validated

### **API Security**
- **Backend URL**: Configurable backend API URL
- **Error Handling**: Sensitive errors not exposed to users
- **Request Limiting**: Consider rate limiting for test orders

## 📱 User Experience

### **Success Flow**
1. **User fills form** → **Clicks Test Order**
2. **Loading state** → **"Testing..." spinner**
3. **Success notification** → **"Test order created successfully!"**
4. **Order ID display** → **Shows order ID if provided**

### **Error Handling**
1. **Validation errors** → **Detailed error messages**
2. **Authentication errors** → **Login prompt**
3. **Backend errors** → **User-friendly error messages**
4. **Network errors** → **"Please try again" message**

## 🔄 Differences from Real Orders

### **Test Order vs Real Order**

| Feature | Test Order | Real Order |
|---------|------------|------------|
| **Payment** | No payment required | Stripe checkout |
| **Backend** | Test endpoint | Production endpoint |
| **Notifications** | Test notifications | Real order confirmations |
| **Order Status** | Test status | Real order tracking |
| **Email** | No emails sent | Order confirmation emails |

### **Benefits of Test Orders**
- **No Cost**: Free testing without payment
- **Instant Feedback**: Immediate results
- **Safe Testing**: No real transactions
- **Full Validation**: Complete form testing
- **File Upload Testing**: Verify image uploads work

## 🚀 Future Enhancements

### **Potential Improvements**
1. **Test Data Generation**: Auto-fill form with test data
2. **Batch Testing**: Test multiple orders at once
3. **Test Reports**: Generate test execution reports
4. **Mock Backend**: Test without real backend
5. **Performance Testing**: Measure submission times

### **Advanced Features**
1. **Test Scenarios**: Predefined test cases
2. **Error Simulation**: Test error handling
3. **Load Testing**: Multiple concurrent test orders
4. **Integration Tests**: Automated test suite

This test order functionality provides a comprehensive testing solution for the flyer ordering system, ensuring quality and reliability before going live with real payments.
