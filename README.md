# Gym Management Application - Backend

A scalable, production-ready backend system for managing gyms, owners, members, and membership plans using Node.js, Express, MongoDB, and Cloudinary.

## Features

- **Complete CRUD Operations** for all entities (Gyms, Owners, Members, Plans)
- **JWT Authentication** for secure owner login
- **Role-based Access Control** (RBAC) via JWT tokens
- **Soft Delete** implementation for data preservation
- **Cloudinary Integration** for image uploads
- **Advanced Dashboard APIs** with aggregation pipelines
- **Pagination & Search** functionality
- **Input Validation** using express-validator
- **Error Handling** with custom middleware
- **MVC Architecture** for clean separation of concerns

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT + bcryptjs
- **Image Storage:** Cloudinary
- **File Upload:** Multer
- **Validation:** express-validator

## Project Structure

```
gym_backend/
├── src/
│   ├── config/           # Database and service configurations
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/      # Request handlers
│   │   ├── GymController.js
│   │   ├── OwnerController.js
│   │   ├── MemberController.js
│   │   ├── PlanController.js
│   │   ├── GymOwnerMappingController.js
│   │   └── DashboardController.js
│   ├── models/          # Mongoose schemas
│   │   ├── Gym.js
│   │   ├── Owner.js
│   │   ├── Member.js
│   │   ├── Plan.js
│   │   └── GymOwnerMapping.js
│   ├── routes/          # API endpoints
│   │   ├── gymRoutes.js
│   │   ├── ownerRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── planRoutes.js
│   │   ├── gymOwnerMappingRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/        # Business logic
│   │   ├── GymService.js
│   │   ├── OwnerService.js
│   │   ├── MemberService.js
│   │   ├── PlanService.js
│   │   ├── GymOwnerMappingService.js
│   │   └── DashboardService.js
│   ├── middlewares/     # Custom middleware
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── utils/           # Utility functions
│   │   ├── jwtUtils.js
│   │   ├── cloudinaryUtils.js
│   │   ├── multerConfig.js
│   │   ├── AppError.js
│   │   └── catchAsync.js
│   └── index.js        # Application entry point
├── uploads/            # Local file uploads (temporary)
├── .env.example        # Environment variables template
└── package.json        # Dependencies

```

## Installation

1. **Clone the repository:**
```bash
cd gym_backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/gym_management

JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Ensure MongoDB is running:**
```bash
mongod
```

5. **Start the server:**
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Root Endpoint
```
GET /
```

### Gym Endpoints
```
POST   /api/v1/gyms              # Create gym
GET    /api/v1/gyms              # Get all gyms (with pagination/search)
GET    /api/v1/gyms/:id          # Get single gym
PUT    /api/v1/gyms/:id          # Update gym
DELETE /api/v1/gyms/:id          # Soft delete gym
```

### Owner Endpoints
```
POST   /api/v1/owners/register   # Register owner (with photo upload)
POST   /api/v1/owners/login      # Login owner
GET    /api/v1/owners/profile    # Get owner profile (requires auth)
GET    /api/v1/owners            # Get all owners
PUT    /api/v1/owners/:id        # Update owner (with photo upload)
DELETE /api/v1/owners/:id        # Soft delete owner
```

### Plan Endpoints
```
POST   /api/v1/plans             # Create plan
GET    /api/v1/plans             # Get all plans (with pagination)
GET    /api/v1/plans/:id         # Get single plan
PUT    /api/v1/plans/:id         # Update plan
DELETE /api/v1/plans/:id         # Soft delete plan
```

### Member Endpoints
```
POST   /api/v1/members                          # Create member (with photo)
GET    /api/v1/members                          # Get all members (pagination/search)
GET    /api/v1/members/:id                      # Get single member
PUT    /api/v1/members/:id                      # Update member (with photo)
DELETE /api/v1/members/:id                      # Soft delete member
GET    /api/v1/members/expiring/plans           # Get members with expiring plans
GET    /api/v1/members/status/active            # Get active members
GET    /api/v1/members/status/expired           # Get expired members
```

### Gym-Owner Mapping Endpoints
```
POST   /api/v1/gym-owner-mappings                   # Create mapping
GET    /api/v1/gym-owner-mappings/:id               # Get single mapping
GET    /api/v1/gym-owner-mappings/owner/:ownerId    # Get mappings by owner
GET    /api/v1/gym-owner-mappings/gym/:gymId        # Get mappings by gym
DELETE /api/v1/gym-owner-mappings/:id               # Delete mapping
```

### Dashboard Endpoints
```
GET /api/v1/dashboard/summary           # Dashboard summary
GET /api/v1/dashboard/members-insights  # Member insights
GET /api/v1/dashboard/revenue-insights  # Revenue analytics
GET /api/v1/dashboard/gym-stats         # Gym-wise statistics
GET /api/v1/dashboard/recent-activity   # Recent activity
```

## API Usage Examples

### 1. Register Owner
```bash
curl -X POST http://localhost:5000/api/v1/owners/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "phone": "9876543210",
    "address": "123 Gym Street"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Owner registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Gym Street",
    "photo_url": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login Owner
```bash
curl -X POST http://localhost:5000/api/v1/owners/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Create Gym
```bash
curl -X POST http://localhost:5000/api/v1/gyms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "FitLife Gym",
    "address": "456 Main Street, City",
    "phone": "0123456789"
  }'
```

### 4. Create Plan
```bash
curl -X POST http://localhost:5000/api/v1/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "3 Month Plan",
    "price": 3000,
    "validity": 90
  }'
```

### 5. Create Member
```bash
curl -X POST http://localhost:5000/api/v1/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "phone": "9876543210",
    "address": "123 Member Ave",
    "gym_id": "507f1f77bcf86cd799439012",
    "plan_id": "507f1f77bcf86cd799439013",
    "plan_start_date": "2024-04-07"
  }'
```

### 6. Get Members with Expiring Plans (within 7 days)
```bash
curl -X GET "http://localhost:5000/api/v1/members/expiring/plans?page=1&limit=10" \
  -H "Content-Type: application/json"
```

### 7. Get Dashboard Summary
```bash
curl -X GET http://localhost:5000/api/v1/dashboard/summary \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalGyms": 5,
    "totalOwners": 10,
    "totalMembers": 150,
    "totalPlans": 6
  }
}
```

### 8. Get Revenue Insights
```bash
curl -X GET http://localhost:5000/api/v1/dashboard/revenue-insights \
  -H "Content-Type: application/json"
```

### 9. Get Member Insights
```bash
curl -X GET http://localhost:5000/api/v1/dashboard/members-insights \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activeMembers": 120,
    "expiredMembers": 20,
    "expiringMembers": 10
  }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to use:
1. Register or login to get a token
2. Include the token in Authorization header for protected routes:
```bash
Authorization: Bearer <your_jwt_token>
```

### Protected Routes:
```
GET /api/v1/owners/profile
```

## Pagination & Search

### Pagination Query Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page

### Search Query Parameters:
- `search` - Search term (searches name, email, phone fields)

### Example:
```bash
GET /api/v1/members?page=2&limit=20&search=john&gymId=507f1f77bcf86cd799439012
```

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "stack": "Stack trace (only in development)"
}
```

Common HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid auth)
- `404` - Not Found
- `500` - Internal Server Error

## Input Validation

The API validates all inputs using `express-validator`. Examples:

### Owner Password Validation:
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain at least one number

### Email Validation:
- Must be a valid email format
- Must be unique in the database

## Soft Delete

All entities support soft delete. Records are marked with `isDeleted: true` instead of being permanently removed. This allows for:
- Data recovery
- Audit trails
- Referential integrity

## Image Upload with Cloudinary

The API supports image uploads for:
1. **Owner Profile Photos** - `/api/v1/owners/register` and `/api/v1/owners/:id`
2. **Member Photos** - `/api/v1/members` and `/api/v1/members/:id`

### Upload Example (with multer):
```bash
curl -X POST http://localhost:5000/api/v1/members \
  -F "name=John Doe" \
  -F "phone=9876543210" \
  -F "gym_id=507f1f77bcf86cd799439012" \
  -F "plan_id=507f1f77bcf86cd799439013" \
  -F "photo=@/path/to/photo.jpg"
```

## Best Practices Implemented

✅ **MVC Architecture** - Clean separation of concerns
✅ **Error Handling** - Comprehensive error middleware
✅ **Input Validation** - All inputs validated before processing
✅ **Security** - Password hashing, JWT tokens, SQL injection prevention (parameterized queries)
✅ **Scalability** - Modular structure, service layer, aggregation pipelines
✅ **Code Quality** - Clean code, meaningful variable names, consistent formatting
✅ **Database** - Indexes, relationships, soft deletes
✅ **Async/Await** - Modern async patterns with proper error handling
✅ **Pagination** - Efficient data retrieval
✅ **Logging** - Ready for integration with logging services

## Future Enhancements

- [ ] Add caching with Redis
- [ ] Implement rate limiting
- [ ] Add request/response logging
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment integration
- [ ] Generate membership cards/QR codes
- [ ] Member attendance tracking
- [ ] Advanced analytics and reporting

## License

ISC

## Support

For issues and questions, please contact the development team.

---

**Note:** Change `JWT_SECRET` to a strong random string in production!
