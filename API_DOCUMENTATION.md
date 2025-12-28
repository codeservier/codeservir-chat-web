# API Documentation - codeservir

Complete API reference for the codeservir platform.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Chatbot Endpoints

### Create Chatbot

Create a new AI chatbot.

**Endpoint:** `POST /chatbot/create`

**Request Body:**

```json
{
  "ownerName": "John Doe",
  "businessName": "Acme Corporation",
  "websiteUrl": "https://example.com",
  "contactNumber": "+1234567890",
  "contactEmail": "contact@example.com",
  "businessAddress": "123 Main St, City, Country",
  "businessDescription": "We provide amazing services...",
  "primaryColor": "#4F46E5",
  "secondaryColor": "#10B981"
}
```

**Response:**

```json
{
  "success": true,
  "chatbot": {
    "id": "cb_abc123def456",
    "businessName": "Acme Corporation",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "embedCode": "<script>...</script>",
  "message": "Chatbot created successfully!"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid input
- `500` - Server error

---

### Get Chatbot Details

Get full chatbot information.

**Endpoint:** `GET /chatbot/:chatbotId`

**Parameters:**
- `chatbotId` (path) - Chatbot ID

**Response:**

```json
{
  "success": true,
  "chatbot": {
    "id": "cb_abc123def456",
    "ownerName": "John Doe",
    "businessName": "Acme Corporation",
    "websiteUrl": "https://example.com",
    "contactNumber": "+1234567890",
    "contactEmail": "contact@example.com",
    "businessAddress": "123 Main St",
    "businessDescription": "We provide...",
    "primaryColor": "#4F46E5",
    "secondaryColor": "#10B981",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "status": "active"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Chatbot not found
- `500` - Server error

---

### Get Chatbot Configuration

Get widget configuration (used by widget.js).

**Endpoint:** `GET /chatbot/:chatbotId/config`

**Parameters:**
- `chatbotId` (path) - Chatbot ID

**Response:**

```json
{
  "success": true,
  "config": {
    "id": "cb_abc123def456",
    "businessName": "Acme Corporation",
    "primaryColor": "#4F46E5",
    "secondaryColor": "#10B981",
    "greeting": "Hi! I'm the AI assistant for Acme Corporation..."
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Chatbot not found

---

### Get Chat Statistics

Get usage statistics for a chatbot.

**Endpoint:** `GET /chatbot/:chatbotId/stats`

**Parameters:**
- `chatbotId` (path) - Chatbot ID

**Response:**

```json
{
  "success": true,
  "stats": {
    "chatCount": 523,
    "chatLimit": 1000,
    "planType": "free",
    "lastChatAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Chatbot not found

---

## Chat Endpoints

### Send Message

Process a chat message.

**Endpoint:** `POST /chat`

**Request Body:**

```json
{
  "chatbotId": "cb_abc123def456",
  "sessionId": "session_xyz789",
  "message": "What are your business hours?"
}
```

**Response (Success):**

```json
{
  "success": true,
  "response": "Our business hours are Monday-Friday, 9 AM to 5 PM.",
  "sessionId": "session_xyz789"
}
```

**Response (Limit Exceeded):**

```json
{
  "success": false,
  "error": "LIMIT_EXCEEDED",
  "message": "Your free chat limit is over. Please upgrade...",
  "sessionId": "session_xyz789"
}
```

**Status Codes:**
- `200` - Success
- `402` - Payment required (limit exceeded)
- `404` - Chatbot not found
- `500` - Server error

---

### Create Session

Create a new chat session.

**Endpoint:** `POST /chat/session`

**Request Body:** None

**Response:**

```json
{
  "success": true,
  "sessionId": "session_abc123xyz789"
}
```

**Status Codes:**
- `200` - Success

---

### Get Chat History

Get chat history for a chatbot (admin).

**Endpoint:** `GET /chat/:chatbotId/history`

**Parameters:**
- `chatbotId` (path) - Chatbot ID
- `limit` (query, optional) - Number of messages (default: 50)

**Response:**

```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "chatbotId": "cb_abc123",
      "sessionId": "session_xyz",
      "userMessage": "Hello",
      "botResponse": "Hi! How can I help?",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Payment Endpoints

### Get Plans

Get available subscription plans.

**Endpoint:** `GET /payment/plans`

**Response:**

```json
{
  "success": true,
  "plans": {
    "basic": {
      "name": "Basic",
      "price": 999,
      "chatLimit": 100000,
      "currency": "INR"
    },
    "pro": {
      "name": "Pro",
      "price": 1999,
      "chatLimit": 1000000,
      "currency": "INR"
    },
    "premium": {
      "name": "Premium",
      "price": 5999,
      "chatLimit": 100000000,
      "currency": "INR"
    }
  }
}
```

**Status Codes:**
- `200` - Success

---

### Create Payment Order

Create a Razorpay order.

**Endpoint:** `POST /payment/create-order`

**Request Body:**

```json
{
  "chatbotId": "cb_abc123",
  "planType": "basic"
}
```

**Response:**

```json
{
  "success": true,
  "order": {
    "orderId": "order_xyz123",
    "amount": 99900,
    "currency": "INR",
    "keyId": "rzp_test_abc123"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid plan type
- `500` - Server error

---

### Verify Payment

Verify and process payment.

**Endpoint:** `POST /payment/verify`

**Request Body:**

```json
{
  "chatbotId": "cb_abc123",
  "planType": "basic",
  "orderId": "order_xyz123",
  "paymentId": "pay_abc123",
  "signature": "signature_hash",
  "amount": 99900
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment verified and subscription activated"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid signature
- `500` - Server error

---

### Get Subscription

Get active subscription details.

**Endpoint:** `GET /payment/subscription/:chatbotId`

**Parameters:**
- `chatbotId` (path) - Chatbot ID

**Response:**

```json
{
  "success": true,
  "subscription": {
    "planType": "basic",
    "chatLimit": 100000,
    "chatCount": 523,
    "remainingChats": 99477,
    "price": 999,
    "startedAt": "2024-01-01T00:00:00.000Z",
    "isActive": true
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - No active subscription

---

### Get Payment History

Get payment transaction history.

**Endpoint:** `GET /payment/history/:chatbotId`

**Parameters:**
- `chatbotId` (path) - Chatbot ID

**Response:**

```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "chatbotId": "cb_abc123",
      "transactionId": "pay_xyz123",
      "amount": 999,
      "currency": "INR",
      "status": "success",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Widget Endpoints

### Get Widget Script

Get the chat widget JavaScript.

**Endpoint:** `GET /widget.js`

**Response:** JavaScript file

**Usage:**

```html
<script
  src="http://localhost:5000/widget.js"
  data-chatbot-id="cb_abc123"
  async
></script>
```

---

### Get Embed Page

Get mobile embed page.

**Endpoint:** `GET /embed/:chatbotId`

**Parameters:**
- `chatbotId` (path) - Chatbot ID

**Response:** HTML page

**Usage:**

```javascript
// React Native
<WebView source={{ uri: 'http://localhost:5000/embed/cb_abc123' }} />

// Flutter
WebView(initialUrl: 'http://localhost:5000/embed/cb_abc123')
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `LIMIT_EXCEEDED` | Chat limit reached |
| `NOT_FOUND` | Resource not found |
| `INVALID_INPUT` | Invalid request data |
| `INTERNAL_ERROR` | Server error |
| `PAYMENT_FAILED` | Payment processing failed |
| `INVALID_SIGNATURE` | Payment signature verification failed |

---

## Rate Limiting

- **Default:** 100 requests per 15 minutes per IP
- **Chat endpoint:** 50 requests per minute per chatbot
- **Headers:**
  - `X-RateLimit-Limit` - Request limit
  - `X-RateLimit-Remaining` - Remaining requests
  - `X-RateLimit-Reset` - Reset timestamp

---

## Authentication

Currently, no authentication is required for public endpoints.

For future admin endpoints, JWT tokens will be used:

```
Authorization: Bearer <token>
```

---

## CORS

Allowed origins:
- `http://localhost:3000` (development)
- Your production frontend domain

---

## Webhooks (Future)

### Payment Webhook

**Endpoint:** `POST /webhooks/payment`

Razorpay will send payment events here.

---

## SDK Examples

### JavaScript

```javascript
// Create chatbot
const response = await fetch('http://localhost:5000/api/chatbot/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ownerName: 'John Doe',
    businessName: 'Acme Corp',
    websiteUrl: 'https://example.com',
    contactEmail: 'john@example.com',
    businessDescription: 'We sell widgets',
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981'
  })
});

const data = await response.json();
console.log(data.chatbot.id);
```

### Python

```python
import requests

# Send chat message
response = requests.post('http://localhost:5000/api/chat', json={
    'chatbotId': 'cb_abc123',
    'sessionId': 'session_xyz',
    'message': 'Hello'
})

data = response.json()
print(data['response'])
```

### cURL

```bash
# Create chatbot
curl -X POST http://localhost:5000/api/chatbot/create \
  -H "Content-Type: application/json" \
  -d '{
    "ownerName": "John Doe",
    "businessName": "Acme Corp",
    "websiteUrl": "https://example.com",
    "contactEmail": "john@example.com",
    "businessDescription": "We sell widgets",
    "primaryColor": "#4F46E5",
    "secondaryColor": "#10B981"
  }'
```

---

## Testing

### Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "codeservir API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Chatbot",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/chatbot/create",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"ownerName\": \"Test\",\n  \"businessName\": \"Test Business\",\n  \"websiteUrl\": \"https://example.com\",\n  \"contactEmail\": \"test@example.com\",\n  \"businessDescription\": \"Test\",\n  \"primaryColor\": \"#4F46E5\",\n  \"secondaryColor\": \"#10B981\"\n}"
        }
      }
    }
  ]
}
```

---

## Support

For API issues:
- Check response error messages
- Review request format
- Verify environment variables
- Check server logs

---

**API Version:** 1.0.0  
**Last Updated:** 2024-01-01
