# Zoomo Eats Backend

A production-ready NestJS backend for the Zoomo Eats food delivery application.

## Features

- **Authentication**: JWT-based auth with signup/login
- **User Management**: Profile management and user data
- **Restaurant Management**: CRUD operations for restaurants
- **Menu Management**: Dish management with categories
- **Cart System**: Add/remove items, quantity management
- **Order Management**: Order creation, tracking, and history
- **Payment Integration**: Stripe-ready payment processing
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker support for easy deployment

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Generate JWT secret
openssl rand -hex 32 > jwt.secret && echo JWT_SECRET=$(cat jwt.secret) >> .env

# Start database with Docker
docker compose up -d db

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database
npm run seed

# Start development server
npm run start:dev
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update user profile

### Restaurants
- `GET /restaurants` - List restaurants (with filters)
- `GET /restaurants/:id` - Get restaurant details with menu
- `POST /restaurants` - Create restaurant (admin)

### Dishes
- `GET /dishes?restaurantId=:id` - Get dishes by restaurant
- `GET /dishes/:id` - Get dish details
- `POST /dishes` - Create dish (admin)

### Cart
- `GET /cart` - Get user's cart
- `POST /cart/items` - Add item to cart
- `PATCH /cart/items/:id` - Update item quantity
- `DELETE /cart/items/:id` - Remove item from cart
- `DELETE /cart/items` - Clear cart

### Orders
- `GET /orders/mine` - Get user's orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create new order

### Payments
- `POST /payments/intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment

## Environment Variables

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=zoomo
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/zoomo?schema=public
JWT_SECRET=your-jwt-secret-here
```

## Database Schema

The application uses PostgreSQL with the following main entities:
- Users (with roles: USER, ADMIN, DRIVER, MERCHANT)
- Restaurants
- Dishes
- Cart & CartItems
- Orders & OrderItems
- Addresses

## Development

```bash
# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run database migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

## Docker Deployment

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down
```

## Frontend Integration

This backend is designed to work with the React frontend. Key integration points:

1. **Authentication**: Store JWT token from login/signup responses
2. **API Calls**: Use base URL `http://localhost:3000` for development
3. **Headers**: Include `Authorization: Bearer <token>` for protected routes
4. **Cart Management**: Use server as source of truth for cart state
5. **Order Flow**: Create order → payment intent → confirm payment

## Production Considerations

- Set strong JWT secrets
- Configure CORS for your frontend domain
- Set up proper database backups
- Configure logging and monitoring
- Use environment-specific configurations
- Set up CI/CD pipelines
- Configure rate limiting
- Add input sanitization
- Set up SSL/TLS certificates
