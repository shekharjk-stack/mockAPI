# Hotel Booking Mock API

A comprehensive mock API for hotel booking system with realistic scenarios for testing and development purposes.

## 🏨 Features

- **Hotel Search**: Search for hotels with various filters and scenarios
- **Pre-booking**: Price and availability recheck with realistic failure scenarios
- **Booking Confirmation**: Complete booking process with multiple outcome scenarios
- **Booking Cancellation**: Cancel bookings with refund calculations
- **Booking Modification**: Edit existing bookings with validation
- **JWT Authentication**: Secure token-based authentication with role-based access control
- **API Key Authentication**: Legacy API key support for backward compatibility
- **Role-Based Permissions**: Admin, travel agent, and guest user roles
- **Rate Limiting**: Configurable rate limiting for API protection
- **Comprehensive Mock Data**: Multiple hotels across different countries and price ranges
- **Realistic Scenarios**: Success/failure scenarios with weighted probabilities
- **Session Management**: Search session tracking and expiration handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. The API will be available at: `http://localhost:3000`

## 📋 API Endpoints

### 🔐 Authentication Endpoints

#### Login
**POST** `/api/auth/login`

Get JWT token for secure API access.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response:**
```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "permissions": ["read", "write", "delete"]
    }
  }
}
```

#### Get Demo Credentials
**GET** `/api/auth/demo-credentials`

Get demo login credentials for testing (no authentication required).

### 🏨 Hotel Booking Endpoints

#### 1. Hotel Search
**POST** `/api/hotel/search`

Search for available hotels with various scenarios.

**Request Body:**
```json
{
  "arrivalDate": "11/07/2025",
  "departureDate": "15/07/2025",
  "currency": "INR",
  "guestNationality": "IN",
  "destination": "Mumbai",
  "rooms": 1,
  "adults": 2,
  "children": 0
}
```

**Success Response:**
```json
{
  "arrivalDate": "11/07/2025",
  "departureDate": "15/07/2025",
  "currency": "INR",
  "guestNationality": "IN",
  "searchSessionId": "46LXWXfSP53FSv3_Vbm1UhmBqIRQT-y0cLP3ECyTVrM",
  "hotels": [...],
  "totalResults": 6,
  "searchScenario": "NORMAL_RESULTS",
  "error": null
}
```

**Search Scenarios:**
- `NORMAL_RESULTS`: Standard hotel results
- `LIMITED_RESULTS`: Only few hotels available
- `NO_RESULTS`: No hotels found
- `HIGH_DEMAND`: Increased prices due to high demand

### 2. Pre-book (Price & Availability Recheck)
**POST** `/api/hotel/prebook`

**Authentication:** Bearer Token or API Key required
**Permissions:** `read`

Revalidate price and availability before final booking.

**Request Body:**
```json
{
  "searchSessionId": "46LXWXfSP53FSv3_Vbm1UhmBqIRQT-y0cLP3ECyTVrM",
  "hotelId": 721069,
  "bookingKey": "_84PEw42-PVSvOrHfJqECQ",
  "rooms": 1
}
```

**Success Response:**
```json
{
  "status": "SUCCESS",
  "searchSessionId": "46LXWXfSP53FSv3_Vbm1UhmBqIRQT-y0cLP3ECyTVrM",
  "hotelId": 721069,
  "price": {
    "currency": "INR",
    "baseFare": 5278.60,
    "taxes": 586.51,
    "totalAmount": 5865.11
  },
  "room": {...},
  "cancellationPolicy": {...},
  "remarks": "Price confirmed. Proceed to booking within 15 minutes.",
  "expiresAt": "2025-01-29T10:15:00.000Z",
  "error": null
}
```

**Failure Scenarios:**
- `PRICE_CHANGED`: Hotel price has increased/decreased
- `ROOM_NOT_AVAILABLE`: Selected room sold out
- `BOOKING_LIMIT_EXCEEDED`: Hotel booking limit reached

### 3. Booking Confirmation
**POST** `/api/hotel/book`

**Authentication:** Bearer Token or API Key required
**Permissions:** `read`, `write`

Complete the booking process.

**Request Body:**
```json
{
  "searchSessionId": "46LXWXfSP53FSv3_Vbm1UhmBqIRQT-y0cLP3ECyTVrM",
  "hotelId": 721069,
  "bookingKey": "_84PEw42-PVSvOrHfJqECQ",
  "guestDetails": {
    "primaryGuest": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+91-9999999999"
    }
  },
  "agentRefNo": "ref123",
  "paymentMethod": "CREDIT_CARD"
}
```

**Success Response:**
```json
{
  "status": "CONFIRMED",
  "bookingId": "DA8609",
  "bookingCode": "REZFBAEFA5B",
  "agentRefNo": "ref123",
  "hotel": {...},
  "stayDetails": {...},
  "price": {...},
  "cancellationPolicy": "Free cancellation till 06/07/2025",
  "bookingStatus": "CONFIRMED",
  "voucherAvailable": true,
  "error": null
}
```

### 4. Booking Cancellation
**POST** `/api/hotel/cancel`

**Authentication:** Bearer Token or API Key required
**Permissions:** `read`, `write`

**Headers:** `x-api-key: DEMO_API_KEY`

Cancel an existing booking with refund calculation.

**Request Body:**
```json
{
  "bookingId": "DA8609",
  "cancellationReason": "Change in travel plans"
}
```

**Success Response:**
```json
{
  "status": "CANCELLED",
  "bookingId": "DA8609",
  "bookingCode": "REZFBAEFA5B",
  "refund": {
    "currency": "INR",
    "refundAmount": 5865.11,
    "refundStatus": "INITIATED"
  },
  "cancellationCharges": 0,
  "remarks": "Booking cancelled successfully. Refund will be processed within 7-10 business days.",
  "error": null
}
```

### 5. Booking Modification
**PUT** `/api/hotel/edit`

**Authentication:** Bearer Token or API Key required
**Permissions:** `read`, `write`

Modify an existing booking.

**Request Body:**
```json
{
  "bookingId": "DA8609",
  "modifications": {
    "guestDetails": {
      "primaryGuest": {
        "phone": "+91-8888888888"
      }
    },
    "specialRequests": "Late check-in requested"
  }
}
```

### 6. Get Booking Details
**GET** `/api/hotel/booking/:bookingId`

**Authentication:** Bearer Token or API Key required
**Permissions:** `read`

Retrieve booking information.

## 🎯 Mock Data Scenarios

### Hotel Search Scenarios
- **Normal Results**: Returns all available hotels
- **Limited Results**: Returns only 2 hotels (low availability)
- **No Results**: Returns empty results
- **High Demand**: Returns hotels with 30% price increase

### Pre-book Scenarios (Weighted Probabilities)
- **Success**: 70% - Normal successful pre-booking
- **Price Changed**: 15% - Price increased/decreased since search
- **Room Not Available**: 10% - Selected room sold out
- **Booking Limit**: 5% - Hotel booking limit exceeded

### Booking Scenarios (Weighted Probabilities)
- **Confirmed**: 85% - Successful booking confirmation
- **Room Not Available**: 8% - Room sold out during booking
- **Payment Failed**: 5% - Payment processing issues
- **Hotel Overbooked**: 2% - Hotel overbooked

### Cancellation Scenarios
- **Free Cancellation**: If within free cancellation period
- **Partial Refund**: 20% cancellation fee if after free period but before arrival
- **No Refund**: Non-refundable bookings or late cancellations

## 🔐 Authentication & Authorization

### Demo Users

The API includes three pre-configured demo users:

| Role | Username | Password | Permissions | API Key |
|------|----------|----------|-------------|---------|
| Admin | `admin` | `admin123` | read, write, delete | `DEMO_API_KEY` |
| Travel Agent | `agent` | `agent123` | read, write | `TEST_KEY_123` |
| Guest | `guest` | `guest123` | read | `GUEST_KEY_456` |

### Authentication Methods

1. **JWT Token (Recommended)**
   ```bash
   # Login to get token
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123"}'
   
   # Use token in requests
   curl -X POST http://localhost:3000/api/hotel/prebook \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{...}'
   ```

2. **API Key (Legacy)**
   ```bash
   curl -X POST http://localhost:3000/api/hotel/cancel \
     -H "x-api-key: DEMO_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{...}'
   ```

### Rate Limiting
- **Hotel Search**: 50 requests per 15 minutes (public endpoint)
- **Other Endpoints**: 100 requests per 15 minutes (authenticated users)

For detailed authentication documentation, see [JWT Authentication Guide](docs/JWT_AUTHENTICATION.md).

## 🔧 Configuration

### API Keys (Legacy Support)
The following API keys are accepted for backward compatibility:
- `DEMO_API_KEY`
- `TEST_KEY_123`  
- `GUEST_KEY_456`

### Environment Variables
Create a `.env` file for custom configuration:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRES_IN=24h
```

## 🏨 Sample Hotels

The API includes 6 pre-configured hotels:

1. **Gizemli Konak** (Istanbul, Turkey) - 3★ - ₹5,865
2. **Park Hyatt Washington** (Washington DC, US) - 5★ - ₹15,231
3. **Grand Plaza Mumbai** (Mumbai, India) - 4★ - ₹8,500
4. **Boutique Hotel Paris** (Paris, France) - 4★ - ₹12,751
5. **Tokyo Business Hotel** (Tokyo, Japan) - 3★ - ₹7,890
6. **Luxury Resort Bali** (Bali, Indonesia) - 5★ - ₹22,150

## 🧪 Testing Examples

### Example cURL Commands

**Get Demo Credentials:**
```bash
curl -X GET http://localhost:3000/api/auth/demo-credentials
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Search Hotels:**
```bash
curl -X POST http://localhost:3000/api/hotel/search \
  -H "Content-Type: application/json" \
  -d '{
    "arrivalDate": "15/08/2025",
    "departureDate": "18/08/2025",
    "currency": "INR",
    "guestNationality": "IN",
    "rooms": 1,
    "adults": 2,
    "children": 0
  }'
```

**Pre-book Hotel (with JWT):**
```bash
curl -X POST http://localhost:3000/api/hotel/prebook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "searchSessionId": "YOUR_SESSION_ID",
    "hotelId": 721069,
    "bookingKey": "YOUR_BOOKING_KEY",
    "rooms": 1
  }'
```

**Cancel Booking (with API Key):**
```bash
curl -X POST http://localhost:3000/api/hotel/cancel \
  -H "Content-Type: application/json" \
  -H "x-api-key: DEMO_API_KEY" \
  -d '{
    "bookingId": "DA8609",
    "cancellationReason": "Change in plans"
  }'
```

## 📊 Health Check

**GET** `/health`

Returns API status and basic information.

## 🚨 Error Handling

The API returns structured error responses:

```json
{
  "status": "ERROR",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

Common error codes:
- `MISSING_REQUIRED_FIELDS`
- `INVALID_DATE_FORMAT`
- `INVALID_SESSION`
- `HOTEL_NOT_FOUND`
- `BOOKING_NOT_FOUND`
- `MISSING_TOKEN` / `MISSING_API_KEY`
- `INVALID_TOKEN` / `INVALID_API_KEY`
- `INSUFFICIENT_PERMISSIONS`
- `RATE_LIMIT_EXCEEDED`

## 📝 Notes for Developers

1. **Session Management**: Search sessions expire after reasonable time periods
2. **Pre-book Expiry**: Pre-booking sessions expire after 15 minutes
3. **Realistic Scenarios**: Weighted probabilities ensure realistic testing scenarios
4. **Data Persistence**: All data is stored in-memory (resets on server restart)
5. **Mock Behavior**: Different endpoints have different success/failure rates to simulate real-world scenarios

## 🤝 Contributing

This is a mock API for development and testing purposes. Feel free to extend the scenarios, add more hotels, or customize the behavior based on your needs.

## 📄 License

MIT License - feel free to use this mock API for your projects.