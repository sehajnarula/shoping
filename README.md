# Shopping Backend API

A comprehensive Node.js backend for mobile shopping application with PostgreSQL database, payment gateway integration, and admin CRUD operations.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User, Admin, Super Admin)
  - Password hashing with bcrypt
  - Profile management

- **Product Management**
  - Full CRUD operations for products
  - Image upload support
  - Advanced filtering and search
  - Category management
  - Stock tracking

- **Order Management**
  - Order creation and tracking
  - Status management
  - Payment integration

- **Payment Gateway**
  - Stripe integration
  - Secure payment processing
  - Payment status tracking

- **Admin Panel**
  - Super admin CRUD operations
  - User management
  - Analytics and reporting

- **API Documentation**
  - Swagger/OpenAPI documentation
  - Interactive API testing
  - Comprehensive endpoint documentation

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **File Upload**: Multer
- **Payment**: Stripe
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopping-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=shopping_app
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb shopping_app
   
   # Run migrations (if using Sequelize CLI)
   npm run db:migrate
   
   # Seed data (optional)
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **User**: Can browse products, place orders, manage profile
- **Admin**: Can manage products, view orders, basic admin functions
- **Super Admin**: Full system access, user management, analytics

## 📁 Project Structure

```
src/
├── config/
│   ├── database.js      # Database configuration
│   └── swagger.js       # Swagger documentation config
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product management
│   ├── orderController.js   # Order management
│   └── paymentController.js # Payment processing
├── middleware/
│   ├── auth.js         # Authentication middleware
│   ├── errorHandler.js # Error handling
│   └── upload.js       # File upload middleware
├── models/
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   ├── Order.js        # Order model
│   └── index.js        # Model associations
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── products.js     # Product routes
│   ├── orders.js       # Order routes
│   ├── payments.js     # Payment routes
│   └── admin.js        # Admin routes
└── server.js           # Main server file
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run server` - Start server with custom nodemon config
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (drop, create, migrate, seed)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories` - Get product categories

### Orders (Coming Soon)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Payments (Coming Soon)
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Payment history

### Admin (Coming Soon)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/orders` - Get all orders

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection (Sequelize)

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | shopping_app |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@shoppingapp.com

## 🔄 Updates

Stay updated with the latest features and bug fixes by regularly pulling from the main branch.
