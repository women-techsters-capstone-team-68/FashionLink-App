-- Fashion Link Database Seed Data
-- Sample data for development and testing

-- ==========================
-- Insert Sample Users
-- ==========================
INSERT INTO Users (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@fashionlink.com', '$2a$10$YourHashedPasswordHere', 'admin'),
(2, 'John Client', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'client'),
(3, 'Jane Designer', 'jane@fashionlink.com', '$2a$10$YourHashedPasswordHere', 'designer');

-- ==========================
-- Insert Sample Products
-- ==========================
INSERT INTO Products (id, productName, brand, category, price, colour, size, description, stock_quantity) VALUES
(1, 'Elegant Evening Dress', 'LuxeFashion', 'Dresses', 150.00, 'Black', 'M', 'A stunning black evening dress perfect for special occasions', 25),
(2, 'Casual Cotton Shirt', 'BasicWear', 'Shirts', 45.00, 'Blue', 'L', 'Comfortable everyday cotton shirt', 50),
(3, 'Designer Handbag', 'PremiumBags', 'Accessories', 250.00, 'Red', 'One Size', 'Premium leather handbag', 10),
(4, 'Skinny Jeans', 'DenimCo', 'Pants', 75.00, 'Dark Blue', '32', 'Classic skinny fit jeans', 40),
(5, 'Silk Scarf', 'ArtisticWear', 'Accessories', 35.00, 'Multicolor', 'One Size', 'Beautiful hand-painted silk scarf', 15);

-- ==========================
-- Insert Sample Artisans
-- ==========================
INSERT INTO Artisans (id, name, email, bio, specialization, phone) VALUES
(1, 'Maria Costureira', 'maria@artisans.com', 'Master seamstress with 20 years of experience', 'Custom Tailoring', '555-0101'),
(2, 'David Designer', 'david@artisans.com', 'Fashion designer specializing in evening wear', 'Evening Gowns', '555-0102'),
(3, 'Sofia Accessories', 'sofia@artisans.com', 'Handcrafted accessories and jewelry maker', 'Accessories', '555-0103');

-- ==========================
-- Insert Sample Clients
-- ==========================
INSERT INTO Clients (id, name, email, phone, address, city, state, postal_code) VALUES
(1, 'Sarah Thompson', 'sarah.t@email.com', '555-1001', '123 Fashion Ave', 'New York', 'NY', '10001'),
(2, 'Michael Brown', 'mbrown@email.com', '555-1002', '456 Style Street', 'Los Angeles', 'CA', '90001'),
(3, 'Emma Wilson', 'emma.w@email.com', '555-1003', '789 Trend Lane', 'Chicago', 'IL', '60601');

-- ==========================
-- Insert Sample Orders
-- ==========================
INSERT INTO Orders (id, UserId, ClientId, order_number, total_amount, status, shipping_address) VALUES
(1, 2, 1, 'ORD-001-2026', 425.00, 'completed', '123 Fashion Ave, New York, NY 10001'),
(2, 2, 2, 'ORD-002-2026', 155.00, 'processing', '456 Style Street, Los Angeles, CA 90001'),
(3, 2, 3, 'ORD-003-2026', 250.00, 'pending', '789 Trend Lane, Chicago, IL 60601');

-- ==========================
-- Insert Sample Order Items
-- ==========================
INSERT INTO OrderItems (id, OrderId, ProductId, quantity, unit_price) VALUES
(1, 1, 1, 1, 150.00),
(2, 1, 3, 1, 250.00),
(3, 1, 5, 1, 25.00),
(4, 2, 2, 1, 45.00),
(5, 2, 4, 1, 110.00),
(6, 3, 3, 1, 250.00);

-- ==========================
-- Link Artisans to Products
-- ==========================
INSERT INTO ArtisanProducts (id, ArtisanId, ProductId) VALUES
(1, 1, 1),   -- Maria makes the Evening Dress
(2, 2, 1),   -- David also specializes in Evening Gowns
(3, 3, 3),   -- Sofia makes the Handbag
(4, 3, 5);   -- Sofia makes the Scarf

-- ==========================
-- Insert Sample Search History
-- ==========================
INSERT INTO SearchHistories (id, UserId, search_term, result_count) VALUES
(1, 2, 'evening dress', 5),
(2, 2, 'black dresses', 3),
(3, 2, 'accessories', 12);

-- ==========================
-- Insert Sample Recommendations
-- ==========================
INSERT INTO Recommendations (id, UserId, ProductId, score, reason) VALUES
(1, 2, 3, 9.5, 'Based on previous purchases'),
(2, 2, 5, 8.8, 'Trending in your category'),
(3, 2, 4, 7.5, 'Frequently bought together');
