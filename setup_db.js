const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Products Table
    db.run("DROP TABLE IF EXISTS products");
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        category TEXT,
        image_url TEXT
    )`);

    // Users Table (Hidden data for injection proof)
    db.run("DROP TABLE IF EXISTS users");
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        email TEXT,
        role TEXT
    )`);

    // Insert Products
    const products = [
        ['Secure Laptop', 'High-end laptop with encryption chip', 1200.00, 'Electronics', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
        ['Cyber Phone', 'Blockchain-enabled smartphone', 899.99, 'Electronics', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'],
        ['Encrypted Drive', '2TB SSD with physical keypad', 250.00, 'Accessories', 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=500&q=80'],
        ['Privacy Filter', 'Monitor screen filter for privacy', 45.00, 'Accessories', 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=500&q=80'],
        ['YubiKey 5', 'Multi-protocol hardware authenticator', 50.00, 'Security', 'https://images.unsplash.com/photo-1633265486231-979f73b63001?w=500&q=80']
    ];

    const productStmt = db.prepare("INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)");
    products.forEach(p => productStmt.run(p));
    productStmt.finalize();

    // Insert Sensitive Users (This is what attackers want!)
    const users = [
        ['admin', 'P@ssw0rd123!', 'admin@securecorp.com', 'SuperAdmin'],
        ['sushant_dev', 'CollegeProject2026', 'sushant@college.edu', 'User'],
        ['db_manager', 'sql_master_99', 'manager@db.com', 'Manager']
    ];

    const userStmt = db.prepare("INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)");
    users.forEach(u => userStmt.run(u));
    userStmt.finalize();

    console.log("Database initialized successfully!");
});

db.close();
