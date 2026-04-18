require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'komodo_sailing',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDatabase = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS komodo_sailing`);
    await connection.query(`USE komodo_sailing`);

    await connection.query(`CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) DEFAULT 'Admin',
      role VARCHAR(20) DEFAULT 'admin',
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      price VARCHAR(100) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description TEXT,
      itinerary JSON,
      image TEXT,
      gallery JSON,
      featured BOOLEAN DEFAULT FALSE,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(50) NOT NULL,
      package_id INT,
      package_name VARCHAR(255) NOT NULL,
      travel_date DATE NOT NULL,
      number_of_guests INT DEFAULT 1,
      notes TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      rating INT NOT NULL,
      comment TEXT NOT NULL,
      package_id INT,
      package_name VARCHAR(255),
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      url TEXT NOT NULL,
      caption VARCHAR(255),
      alt VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      category VARCHAR(100) DEFAULT 'Uncategorized',
      status VARCHAR(20) DEFAULT 'draft',
      read_time INT DEFAULT 5,
      author VARCHAR(100) DEFAULT 'Admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY DEFAULT 1,
      site_name VARCHAR(255),
      site_description TEXT,
      logo TEXT,
      hero_image TEXT,
      contact_email VARCHAR(255),
      contact_phone VARCHAR(50),
      whatsapp VARCHAR(50),
      address TEXT,
      social_media JSON,
      seo JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  } finally {
    connection.release();
  }
};

module.exports = { pool, initDatabase };