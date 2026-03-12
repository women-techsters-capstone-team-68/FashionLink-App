# 👗 FashionLink

FashionLink is a fashion marketplace platform designed to connect users with fashion products and services in a structured digital environment. The platform enables users to discover fashion items, manage products, and interact with vendors through a secure and scalable backend system.

This project was developed as part of the **Women Techsters Fellowship–Group 68** collaboration project.


# Project Overview

FashionLink demonstrates the implementation of a backend system that powers a fashion marketplace. The backend handles authentication, database management and API endpoints that support the platform's functionality.

The system was designed with scalability, security, and maintainability in mind.
# Project structure 
FashionLink-App/ │ ├── config/ 
 Configuration files │   ├── index.js            
Express app setup │   └── config.js          
Database info: development, test, production │ ├── database/               
SQL scripts │   ├── schema.sql │   └── seed.sql │ ├── models/                  
Sequelize models │   ├── artisanprofile.js │   ├── clients.js │   ├── measurement.js │   ├── order.js │   ├── product.js │   ├── tasks.js │   ├── user.js │   └── index.js │ ├── routes/                 
Express routes │   ├── artisan.routes.js │   ├── auth.routes.js │   ├── clients.routes.js │   ├── dashboard.routes.js │   ├── orders.routes.js │   ├── products.routes.js │   ├── search.routes.js │   ├── users.routes.js │   └── index.js │ ├── scripts/                
 Utility scripts │   └── newman-run.js        # Runs Postman collections via Newman │ ├── seeders/                 
Database seeders │   ├── 20260214000001-seed-users.js │   ├── 20250215000001-seed-products.js │   ├── 20260227000001-seed-clients.js │   ├── 20260227000002-seed-artisan-profiles.js │   └── 20260227000003-seed-orders.js │
├── src/ │   ├── controllers/         # Route controllers │   │   ├── artisans.controller.js │   │   ├── auth.controller.js │   │   ├── clients.controller.js │   │   ├── dashboard.controller.js │   │   ├── orders.controller.js │   │   ├── products.controller.js │   │   ├── search.controller.js │   │   └── users.controller.js │   │ │   ├── middlewares/         # Middleware for authentication and roles │   │   ├── auth.middleware.js │   │   └── role.middleware.js │   │ │   ├── services/         
AI integrations │   │   ├── avatar.service.js │   │   ├── recommendation.service.js │   │   └── search.service.js │   │ │   
├── app.js               # Express app entry │   └── server.js            # Server setup and launch │ ├── .gitignore ├── package.json ├── package-lock.json ├── postman_collection.json ├── postman_environment.json ├── products_data.json ├── verify-products.js 
└── README.md             

# My Role – Backend Developer

As a Backend Developer, my responsibilities included building and managing the server-side architecture of the application.

### Key Contributions
- Designed and structured the MySQL relational database
- Built RESTful APIs using Express.js
- Implemented bcrypt password hashing for secure password storage and JWT authentication for protected API routes.
- Developed and tested multiple API endpoints
- Used Sequelize CLI for database models and migrations
- Ensured proper connection between the API and database
- Successfully deployed the backend on Render

# 🛠️ Technologies Used

Backend Technologies

- Node.js
- Express.js
- MySQL
- Sequelize CLI
- JSON Web Token (JWT)

Tools

- Git
- GitHub
- Postman (API testing)
- Render (Deployment)

---

#  Authentication

Authentication was implemented using **JWT (JSON Web Tokens)** to secure protected routes.
Features include:

- User login authentication
- Token generation
- Protected API routes
- Authorization validation


# API Endpoints
Base URL
https://fashionlink-app.onrender.com

### Authentication
- `POST /auth/register` – Create new user  
- `POST /auth/login` – User login (returns JWT token)  

### Product Management
- `GET /products` – Retrieve products  
- `POST /products` – Create new product  
- `PUT /products/:id` – Update product  

### Orders
- `GET /orders` – Retrieve orders  
- `POST /orders` – Create new order  
- `PUT /orders/:id` – Update order  

### Search & Recommendations
- `GET /search` – Search products or artisans  
- AI-powered recommendations via `search.service.js`  

(More endpoints available in the routes folder.)


#  Database

The application uses **MySQL** as the relational database.

Sequelize CLI was used for:

- Model generation
- Database migrations
- Database relationships
- Schema management

Example tables include:

- Users
- Products
- Orders

# Deployment

The backend application was deployed using **Render**, providing reliable hosting for the server and API endpoints.


# Installation

To run this project locally:https://fashionlink-app.onrender.com

### 1️⃣ Clone the repository
https://github.com/women-techsters-capstone-team-68/FashionLink-App.git

# Highlights
-Fully structured MVC architecture
-Database seeding & migration with Sequelize
-AI-powered search using OpenRouter
-Secure JWT + bcrypt authentication
-Fully documented Postman collection for testing
# Collaboration
This project was developed in collaboration with Women Techsters Fellowship – Group 68, where I contributed primarily as Backend Developer.
# Future Improvements
-Payment gateway integration
-Dashboard analytics enhancements
-Improved AI recommendation system
-Better logging & monitoring for production
# Contact
Ani Promise Amarachi
Email: amarachipromise21@yahoo.com
GitHub: https://github.com/amarachi-promise

