const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// --- VULNERABLE ENDPOINT ---
app.get('/api/products/vulnerable', (req, res) => {
    const searchTerm = req.query.query || '';
    
    // THE VULNERABILITY: STRING CONCATENATION
    // This allows an attacker to "escape" the string and inject their own SQL.
    const sql = "SELECT * FROM products WHERE name LIKE '%" + searchTerm + "%'";
    
    console.log(`[VULNERABLE] Executing SQL: ${sql}`);
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message, executedSql: sql });
            return;
        }
        res.json({ data: rows, executedSql: sql });
    });
});

// --- SECURE ENDPOINT ---
app.get('/api/products/secure', (req, res) => {
    const searchTerm = req.query.query || '';
    
    // THE FIX: PREPARED STATEMENTS (PARAMETERIZED QUERIES)
    // The '?' placeholder ensures the input is treated ONLY as data, not code.
    const sql = "SELECT * FROM products WHERE name LIKE ?";
    const params = [`%${searchTerm}%`];
    
    console.log(`[SECURE] Executing SQL: ${sql} with params: ${params}`);
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message, executedSql: sql });
            return;
        }
        res.json({ data: rows, executedSql: sql });
    });
});

app.listen(port, () => {
    console.log(`
    🛡️  Cyber Security Project: SQL Injection Demo
    🚀 Server running at http://localhost:${port}
    ⚠️  Vulnerable endpoint: /api/products/vulnerable
    ✅ Secure endpoint: /api/products/secure
    `);
});
