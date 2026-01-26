require("dotenv").config();
const { pool } = require("../connection");

const migrations = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* ENUMS */
CREATE TYPE product_status AS ENUM ('available', 'reserved', 'sold');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'canceled', 'refunded');
CREATE TYPE delivery_status AS ENUM ('pending', 'scheduled', 'delivered');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');

/* USERS */
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(30),
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

/* ADMINS */
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'owner',
  created_at TIMESTAMP DEFAULT now()
);

/* COLLECTIONS */
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(120) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  launch_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

/* CONDITIONS */
CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(80) NOT NULL,
  description TEXT
);

/* SIZES */
CREATE TABLE sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(50) NOT NULL
);

/* PRODUCTS */
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  brand VARCHAR(100),
  price NUMERIC(10,2) NOT NULL,
  status product_status DEFAULT 'available',
  condition_id UUID REFERENCES conditions(id),
  size_id UUID REFERENCES sizes(id),
  created_at TIMESTAMP DEFAULT now()
);

/* IMAGES */
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INT DEFAULT 0
);

/* MEASUREMENTS */
CREATE TABLE product_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  key VARCHAR(50),
  value VARCHAR(50)
);

/* ORDERS */
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status order_status DEFAULT 'pending',
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(20),
  payment_provider VARCHAR(50),
  external_payment_id VARCHAR(120),
  created_at TIMESTAMP DEFAULT now(),
  paid_at TIMESTAMP
);

/* ORDER ITEMS */
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  price NUMERIC(10,2) NOT NULL
);

/* DELIVERIES */
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  notes TEXT,
  delivery_fee NUMERIC(10,2),
  status delivery_status DEFAULT 'pending'
);

/* NOTIFICATIONS */
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50),
  title VARCHAR(150),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

/* INDEXES */
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user ON orders(user_id);`;

const runMigrations = async () => {
  console.log("Running migrations...");

  try {
    await pool.query(migrations);
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error.message);
    throw error;
  } finally {
    await pool.end();
  }
};

runMigrations().catch(() => process.exit(1));
