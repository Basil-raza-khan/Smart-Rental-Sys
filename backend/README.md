# SmartRent Backend

Repository scaffold created by script. Files are placeholders (no implementation).

🔄 Additional Files & Documentation
Since you have all the main code files, let me provide you with:

API Testing Examples
Postman Collection Setup
Database Seeding Script
Additional Utility Functions
–

📮 API Testing Examples
Create a test file: API_EXAMPLES.md
# SmartRent API Testing Examples
## 🔐 Authentication Examples
###
1. Signup (Tenant)
```bash
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "tenant",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
Signup (Landlord)
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "landlord"
}


Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "password123"
}
Response:

{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant"
    }
  }
}
–

🏠 Property Examples
Create Property (Landlord)
POST http://localhost:5000/api/v1/properties
Authorization: Bearer <landlord_token>
Content-Type: application/json
{
  "title": "Luxury Downtown Apartment",
  "description": "Beautiful 2-bedroom apartment in the heart of downtown with stunning city views",
  "address": {
    "street": "456 Park Avenue",
    "city": "New York",
    "state": "NY",
    "zipCode": "10022",
    "country": "USA"
  },
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "rent": 3500,
  "deposit": 7000,
  "amenities": ["WiFi", "Parking", "Gym", "Pool", "Security"],
  "images": ["https://example.com/image1.jpg"]
}
Get All Properties (Public)
GET http://localhost:5000/api/v1/properties
Get Properties with Filters
GET http://localhost:5000/api/v1/properties?city=New York&minRent=2000&maxRent=5000&bedrooms=2&status=available
Get Landlord’s Properties
GET http://localhost:5000/api/v1/properties/landlord/my-properties
Authorization: Bearer <landlord_token>
Update Property
PATCH http://localhost:5000/api/v1/properties/<property_id>
Authorization: Bearer <landlord_token>
Content-Type: application/json
{
  "rent": 3800,
  "status": "available"
}
–

📅 Booking Examples
Create Booking (Tenant)
POST http://localhost:5000/api/v1/bookings
Authorization: Bearer <tenant_token>
Content-Type: application/json
{
  "property": "<property_id>",
  "startDate": "2024-02-01",
  "endDate": "2024-08-01",
  "notes": "Looking forward to moving in!"
}
Get All Bookings (Tenant sees their bookings)
GET http://localhost:5000/api/v1/bookings
Authorization: Bearer <tenant_token>
Approve Booking (Landlord)
PATCH http://localhost:5000/api/v1/bookings/<booking_id>/status
Authorization: Bearer <landlord_token>
Content-Type: application/json
{
  "status": "approved"
}
Reject Booking (Landlord)
PATCH http://localhost:5000/api/v1/bookings/<booking_id>/status
Authorization: Bearer <landlord_token>
Content-Type: application/json
{
  "status": "rejected",
  "rejectionReason": "Property is no longer available for the requested dates"
}
–

🔧 Maintenance Examples
Create Maintenance Request (Tenant)
POST http://localhost:5000/api/v1/maintenance
Authorization: Bearer <tenant_token>
Content-Type: application/json
{
  "property": "<property_id>",
  "title": "Leaking Kitchen Faucet",
  "description": "The kitchen faucet has been leaking for the past two days",
  "category": "plumbing",
  "priority": "high"
}
Update Maintenance Status (Landlord)
PATCH http://localhost:5000/api/v1/maintenance/<maintenance_id>
Authorization: Bearer <landlord_token>
Content-Type: application/json
{
  "status": "in-progress",
  "scheduledDate": "2024-01-25",
  "estimatedCost": 150,
  "notes": "Plumber scheduled for Friday"
}
Complete Maintenance (Landlord)
PATCH http://localhost:5000/api/v1/maintenance/<maintenance_id>
Authorization: Bearer <landlord_token>
Content-Type: application/json
{
  "status": "completed",
  "actualCost": 175,
  "notes": "Faucet replaced successfully"
}
–

⭐ Review Examples
Create Review (Tenant)
POST http://localhost:5000/api/v1/reviews
Authorization: Bearer <tenant_token>
Content-Type: application/json
{
  "property": "<property_id>",
  "rating": 5,
  "comment": "Excellent property! The landlord was very responsive and the apartment exceeded expectations."
}
Reply to Review (Landlord)
PATCH http://localhost:5000/api/v1/reviews/<review_id>/reply
Authorization: Bearer <landlord_token>
Content-Type: application/json
{
  "landlordReply": "Thank you for the wonderful review! It was a pleasure having you as a tenant."
}
Get All Reviews for a Property
GET http://localhost:5000/api/v1/reviews?property=<property_id>
–

👥 User Management Examples (Admin Only)
Get All Users
GET http://localhost:5000/api/v1/users
Authorization: Bearer <admin_token>
Get Users by Role
GET http://localhost:5000/api/v1/users?role=tenant
Authorization: Bearer <admin_token>
Create User (Admin)
POST http://localhost:5000/api/v1/users
Authorization: Bearer <admin_token>
Content-Type: application/json
{
  "name": "Admin User",
  "email": "admin@smartrent.com",
  "password": "admin123",
  "role": "admin"
}
Deactivate User
PATCH http://localhost:5000/api/v1/users/<user_id>/deactivate
Authorization: Bearer <admin_token>
Activate User
PATCH http://localhost:5000/api/v1/users/<user_id>/activate
Authorization: Bearer <admin_token>
–

🔍 Query Parameters
Properties
status
Filter by status (available, occupied, maintenance, unavailable)
city
Filter by city name
minRent
Minimum rent amount
maxRent
Maximum rent amount
bedrooms
Number of bedrooms
propertyType
Type of property
landlord
Filter by landlord ID
Bookings
status
Filter by status (pending, approved, rejected, active, completed, cancelled)
tenant
Filter by tenant ID
landlord
Filter by landlord ID
property
Filter by property ID
Maintenance
status
Filter by status (pending, in-progress, completed, cancelled)
priority
Filter by priority (low, medium, high, urgent)
category
Filter by category
tenant
Filter by tenant ID
landlord
Filter by landlord ID
property
Filter by property ID
Reviews
property
Filter by property ID
tenant
Filter by tenant ID
landlord
Filter by landlord ID
minRating
Minimum rating
maxRating
Maximum rating
–

❌ Error Response Format
{
  "success": false,
  "message": "Error message here",
  "details": []
}
Common Error Codes
400
Bad Request (validation errors)
401
Unauthorized (invalid/missing token)
403
Forbidden (insufficient permissions)
404
Not Found
500
Internal Server Error

--
-
## 🌱 Database Seeding Script
### **Create file: `src/utils/seed.js`**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/user-model');
const Property = require('../models/property-model');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};
const seedData = async () => {
  try {
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing data');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartrent.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin'
    });
    const landlord1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: hashedPassword,
      phone: '5551234567',
      role: 'landlord'
    });
    const landlord2 = await User.create({
      name: 'Michael Chen',
      email: 'michael@example.com',
      password: hashedPassword,
      phone: '5559876543',
      role: 'landlord'
    });
    const tenant1 = await User.create({
      name: 'Emily Davis',
      email: 'emily@example.com',
      password: hashedPassword,
      phone: '5552468135',
      role: 'tenant'
    });
    const tenant2 = await User.create({
      name: 'James Wilson',
      email: 'james@example.com',
      password: hashedPassword,
      phone: '5553691470',
      role: 'tenant'
    });
    console.log('✅ Created users');
    const properties = [
      {
        landlord: landlord1._id,
        title: 'Luxury Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views',
        address: {
          street: '456 Park Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          country: 'USA'
        },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        rent: 3500,
        deposit