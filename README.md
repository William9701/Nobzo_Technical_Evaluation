# Blog REST API

A full-featured Blog REST API built with Node.js, Express, TypeScript, MongoDB, and JWT authentication. This API demonstrates clean architecture, proper authentication/authorization, input validation, and best practices for building production-ready REST APIs.

## 📚 Interactive API Documentation

**Swagger UI Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

👉 **For reviewers**: Visit the Swagger UI to interactively test all API endpoints without any additional setup. You can authenticate, create posts, and test all features directly from your browser!

## Features

- **🔐 Authentication & Authorization**: JWT-based authentication with role-based access control
- **👥 User Management**: Register and login with secure password hashing
- **📝 Post Management**: Full CRUD operations with soft delete functionality
- **🔍 Advanced Filtering**: Search, pagination, tag filtering, and status-based queries
- **🔗 Data Relationships**: MongoDB references between Users and Posts
- **✅ Input Validation**: Request validation using express-validator
- **❌ Error Handling**: Centralized error handling with custom error classes
- **📘 TypeScript**: Full TypeScript support for type safety
- **📖 API Documentation**: Interactive Swagger/OpenAPI documentation
- **🐳 Docker Support**: Containerized application with Docker and Docker Compose

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **API Documentation**: Swagger/OpenAPI with swagger-jsdoc & swagger-ui-express
- **Containerization**: Docker & Docker Compose

## Project Structure

```
src/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, validation, error handling)
├── models/          # Mongoose models
├── routes/          # API routes
└── server.ts        # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn
- Docker & Docker Compose (optional)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/William9701/Nobzo_Technical_Evaluation.git
cd Nobzo_Technical_Evaluation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blog-api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running on your system
mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name blog-mongo mongo:7
```

### 5. Run the application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker only

```bash
# Build the image
docker build -t blog-api .

# Run the container
docker run -d -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/blog-api \
  -e JWT_SECRET=your-secret-key \
  --name blog-api \
  blog-api
```

## 📖 API Documentation

Once the server is running, you can access the **interactive Swagger documentation** at:

**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

The Swagger UI provides:
- ✅ Interactive testing of all endpoints
- ✅ Built-in authentication (click "Authorize" button and paste your JWT token)
- ✅ Request/response examples
- ✅ Schema definitions
- ✅ No additional tools needed (Postman, curl, etc.)

### Quick Start with Swagger:
1. Navigate to [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
2. Use `POST /api/auth/register` to create a user
3. Copy the returned JWT token
4. Click the "Authorize" button (🔓) at the top
5. Paste: `Bearer YOUR_TOKEN_HERE` (include "Bearer " prefix)
6. Now you can test all protected endpoints!

## API Endpoints

### Authentication

#### Register a new user
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "657abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "657abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Posts

#### Create a post (Auth Required)
```bash
POST /api/posts
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "status": "published",
  "tags": ["nodejs", "express", "mongodb"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "657def456...",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is the content of my blog post...",
    "status": "published",
    "tags": ["nodejs", "express", "mongodb"],
    "author": {
      "_id": "657abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Get all posts (with filtering & pagination)
```bash
# Get all published posts
GET /api/posts

# With pagination
GET /api/posts?page=1&limit=10

# Search by title or content
GET /api/posts?search=nodejs

# Filter by tag
GET /api/posts?tag=express

# Filter by author
GET /api/posts?author=657abc123...

# Filter by status (Auth Required)
GET /api/posts?status=draft
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "657def456...",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": "This is the content...",
      "status": "published",
      "tags": ["nodejs", "express"],
      "author": {
        "_id": "657abc123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get a single post by slug
```bash
GET /api/posts/my-first-blog-post
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "657def456...",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is the content of my blog post...",
    "status": "published",
    "tags": ["nodejs", "express", "mongodb"],
    "author": {
      "_id": "657abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Update a post (Auth Required - Author Only)
```bash
PUT /api/posts/657def456...
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Blog Post Title",
  "status": "published"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "657def456...",
    "title": "Updated Blog Post Title",
    "slug": "updated-blog-post-title",
    "content": "This is the content...",
    "status": "published",
    "tags": ["nodejs", "express"],
    "author": {
      "_id": "657abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### Delete a post (Auth Required - Author Only)
```bash
DELETE /api/posts/657def456...
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Authorization Rules

- **Public users**: Can only view published posts
- **Authenticated users**:
  - Can create posts
  - Can view all published posts
  - Can view their own draft posts
  - Can filter by status
- **Post authors**: Can update and delete their own posts only

## Data Models

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  createdAt: Date
}
```

### Post Model
```typescript
{
  title: string
  slug: string (unique, auto-generated)
  content: string
  author: ObjectId (ref: User)
  status: 'draft' | 'published' (default: 'draft')
  tags: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create post (replace YOUR_TOKEN)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Post","content":"Test content","tags":["test"]}'

# Get all posts
curl http://localhost:3000/api/posts

# Get posts with search
curl "http://localhost:3000/api/posts?search=test&page=1&limit=5"
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

### Code Quality

The project follows TypeScript strict mode and uses:
- ESLint for code linting
- Prettier for code formatting
- Type-safe Mongoose schemas

## Production Considerations

1. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template
2. **JWT Secret**: Use a strong, random secret in production
3. **Database**: Use MongoDB Atlas or a managed database service
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Logging**: Add proper logging (Winston, Morgan)
7. **Monitoring**: Use monitoring tools (PM2, New Relic)

## License

ISC

## Author

Built for Nobzo Technical Evaluation

---

For questions or issues, please open an issue in the repository.
