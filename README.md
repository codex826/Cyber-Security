# Project Report: SQL Injection Demonstration

## 1. Objective
To demonstrate the risks associated with SQL Injection (SQLi) vulnerabilities in web applications and provide a robust solution using Parameterized Queries (Prepared Statements).

## 2. Methodology
We built a modern "SecureMart" e-commerce catalog using the following stack:
- **Frontend**: Vanilla HTML5, CSS3 (Modern Dark Theme), and JavaScript.
- **Backend**: Node.js with Express.js.
- **Database**: SQLite (relational database).

### Key Features
- **Security Toggle**: Switch between "Vulnerable" and "Secure" modes to see real-time differences.
- **SQL Console**: A real-time terminal window on the page showing the exact SQL query being executed.
- **Data Leak Demo**: An attacker can not only bypass product filters but also extract sensitive user account data (usernames, passwords) from a separate `users` table.

## 3. Vulnerability Explanation
### The Vulnerable Code
In the vulnerable mode, the application uses **String Concatenation** to build the SQL query:
```javascript
const sql = "SELECT * FROM products WHERE name LIKE '%" + searchTerm + "%'";
```
This is dangerous because an attacker can input specific characters (like `'`) to "close" the search string and start writing their own SQL commands.

### The Secure Fix
In secure mode, we use **Prepared Statements**:
```javascript
const sql = "SELECT * FROM products WHERE name LIKE ?";
const params = [`%${searchTerm}%`];
db.all(sql, params, (err, rows) => { ... });
```
This treats user input strictly as **data** and never as part of the SQL command, neutralizing the attack.

## 4. Presentation / Demonstration Steps

### Step 1: Normal Search
Type `Laptop` into the search bar. Both modes work correctly and show the "Secure Laptop".

### Step 2: Bypass / Reveal All
Type `' OR 1=1 --` in **Vulnerable Mode**.
- **Result**: The query becomes `SELECT * FROM products WHERE name LIKE '%' OR 1=1 --%'`.
- **Effect**: Since `1=1` is always true, the database returns **all products** in the database, even those that wouldn't normally show.

### Step 3: Extract Sensitive Data (The "Wow" Factor)
Type the following payload in **Vulnerable Mode**:
`' UNION SELECT id, username, password, email, role, 'leak' FROM users --`
- **Result**: The UI will display **user accounts and passwords** from a completely different table! This proves an attacker can take over the entire system.

### Step 4: Verify the Fix
Switch the toggle to **Security: ON**. Try the same payloads.
- **Result**: The search will return "No matches found".
- **Reason**: The database is looking for a product literally named `' OR 1=1 --`, which doesn't exist. The injection has been neutralized.
