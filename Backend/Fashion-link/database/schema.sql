-- Fashion Link Database Schema
-- MySQL setup for fashion_link_dev database

-- Create database (run this separately if needed)
-- CREATE DATABASE fashion_link_dev;

-- ==========================
-- Users Table
-- ==========================
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'client',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- Products Table
-- ==========================
CREATE TABLE IF NOT EXISTS Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productName VARCHAR(255) NOT NULL,
  brand VARCHAR(150),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  colour VARCHAR(50),
  size VARCHAR(20),
  description TEXT,
  stock_quantity INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- Artisans Table
-- ==========================
CREATE TABLE IF NOT EXISTS Artisans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  bio TEXT,
  specialization VARCHAR(255),
  phone VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- Clients Table
-- ==========================
CREATE TABLE IF NOT EXISTS Clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- Orders Table
-- ==========================
CREATE TABLE IF NOT EXISTS Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserId INT,
  ClientId INT,
  order_number VARCHAR(100) UNIQUE,
  total_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (ClientId) REFERENCES Clients(id) ON DELETE CASCADE
);

-- ==========================
-- Order Items Table
-- ==========================
CREATE TABLE IF NOT EXISTS OrderItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  OrderId INT,
  ProductId INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (OrderId) REFERENCES Orders(id) ON DELETE CASCADE,
  FOREIGN KEY (ProductId) REFERENCES Products(id) ON DELETE CASCADE
);

-- ==========================
-- Artisan Products Table (many-to-many)
-- ==========================
CREATE TABLE IF NOT EXISTS ArtisanProducts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ArtisanId INT,
  ProductId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(ArtisanId, ProductId),
  FOREIGN KEY (ArtisanId) REFERENCES Artisans(id) ON DELETE CASCADE,
  FOREIGN KEY (ProductId) REFERENCES Products(id) ON DELETE CASCADE
);

-- ==========================
-- Search History Table (optional)
-- ==========================
CREATE TABLE IF NOT EXISTS SearchHistories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserId INT,
  search_term VARCHAR(255),
  result_count INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE
);

-- ==========================
-- Recommendations Table (optional)
-- ==========================
CREATE TABLE IF NOT EXISTS Recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserId INT,
  ProductId INT,
  score DECIMAL(5, 2),
  reason VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (ProductId) REFERENCES Products(id) ON DELETE CASCADE
);

-- ==========================
-- Indexes for Performance
-- ==========================
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_products_category ON Products(category);
CREATE INDEX idx_products_brand ON Products(brand);
CREATE INDEX idx_orders_userid ON Orders(UserId);
CREATE INDEX idx_orders_status ON Orders(status);
CREATE INDEX idx_orderitems_orderid ON OrderItems(OrderId);
CREATE INDEX idx_artisanproducts_artisanid ON ArtisanProducts(ArtisanId);
CREATE INDEX idx_searchhistories_userid ON SearchHistories(UserId);
CREATE INDEX idx_recommendations_userid ON Recommendations(UserId);
