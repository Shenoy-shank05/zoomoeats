# Zoomo Eats - Full Stack Food Delivery Application

A modern, full-stack food delivery application built with React frontend and NestJS backend, featuring real-time data, authentication, and a complete ordering system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
openssl rand -hex 32 > jwt.secret && echo "JWT_SECRET=$(cat jwt.secret)" >> .env
docker compose up -d db
npx prisma migrate dev --name init
npm run seed
npm run start:dev
```

### Frontend Setup
```bash
npm install
npm start
```

## 🏗️ Architecture

### Backend (NestJS + Prisma + PostgreSQL)
- **Port**: 3000
- **Database**: PostgreSQL (Docker)
- **ORM**: Prisma
- **Authentication**: JWT
- **API Documentation**: RESTful endpoints

### Frontend (React + Tailwind CSS)
- **Port**: 3001 (auto-assigned)
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Routing**: React Router
- **API Integration**: Custom API service

## 📁 Project Structure

```
zoomoeats11/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── restaurants/       # Restaurant management
│   │   ├── dishes/            # Menu items
│   │   ├── cart/              # Shopping cart
│   │   ├── orders/            # Order management
│   │   ├── payments/          # Payment processing
│   │   └── common/            # Shared utilities
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seeds/             # Database seeding
│   └── docker-compose.yml     # PostgreSQL setup
├── src/                       # React Frontend
│   ├── auth/                  # Authentication pages
│   ├── services/              # API integration
│   ├── context/               # React Context
│   └── components/            # React components
└── public/                    # Static assets
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update user profile

### Restaurants
- `GET /restaurants` - List all restaurants
- `GET /restaurants/:id` - Get restaurant details
- `POST /restaurants` - Create restaurant (protected)

### Dishes
- `GET /dishes?restaurantId=:id` - Get restaurant menu
- `POST /dishes` - Add dish (protected)

### Cart
- `GET /cart` - Get user cart (protected)
- `POST /cart/items` - Add item to cart (protected)
- `PATCH /cart/items/:id` - Update cart item (protected)
- `DELETE /cart/items/:id` - Remove cart item (protected)
- `DELETE /cart/items` - Clear cart (protected)

### Orders
- `GET /orders/mine` - Get user orders (protected)
- `GET /orders/:id` - Get order details (protected)
- `POST /orders` - Create order (protected)

### Payments
- `POST /payments/intent` - Create payment intent (protected)

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and profile data
- **Restaurant**: Restaurant information and settings
- **Dish**: Menu items with pricing and availability
- **Cart**: User shopping cart with items
- **Order**: Order history and status tracking
- **Address**: User delivery addresses

### Key Features
- JWT-based authentication
- Role-based access control (USER, ADMIN, DRIVER, MERCHANT)
- Real-time cart management
- Order status tracking
- Payment integration ready

## 🎨 Frontend Features

### Pages
- **Landing Page**: Hero section with restaurant discovery
- **Authentication**: Login/Signup with real backend integration
- **Restaurants**: Browse restaurants with search and filters
- **Menu**: Restaurant menu with add-to-cart functionality
- **Cart**: Shopping cart management
- **Profile**: User profile management
- **Checkout**: Order placement and payment

### Key Components
- Responsive design with dark/light mode
- Real-time data fetching from backend API
- Error handling and loading states
- Form validation and user feedback
- Modern UI with Tailwind CSS

## 🔧 Development

### Backend Development
```bash
cd backend
npm run start:dev    # Start in watch mode
npx prisma studio    # Database GUI
npm run seed         # Seed database
```

### Frontend Development
```bash
npm start           # Start React dev server
npm run build       # Build for production
```

### Database Management
```bash
npx prisma migrate dev --name <migration-name>  # Create migration
npx prisma generate                              # Generate Prisma client
npx prisma db push                              # Push schema changes
```

## 🚀 Production Deployment

### Backend
1. Build the application: `npm run build`
2. Set production environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Start: `npm run start:prod`

### Frontend
1. Build: `npm run build`
2. Serve static files from `build/` directory
3. Configure API base URL for production

## 🧪 Testing

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test restaurants endpoint
curl -X GET http://localhost:3000/restaurants
```

### Frontend Testing
- Navigate to `http://localhost:3001`
- Test user registration and login
- Browse restaurants and add items to cart
- Complete the checkout process

## 🔐 Environment Variables

### Backend (.env)
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=zoomo
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/zoomo?schema=public
JWT_SECRET=your-secret-key
PORT=3000
```

## 📦 Dependencies

### Backend
- NestJS framework with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- bcrypt for password hashing
- Class validation and transformation

### Frontend
- React 19 with modern hooks
- React Router for navigation
- Tailwind CSS for styling
- React Icons for UI elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the database schema
- Test endpoints with provided curl commands
- Ensure all services are running on correct ports

---

**Built with ❤️ using NestJS, React, and modern web technologies**
# zoomoeats
