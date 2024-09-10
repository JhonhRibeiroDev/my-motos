const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Cria as tabelas
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            email TEXT,
            phone TEXT,
            points INTEGER DEFAULT 0,
            referred_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (referred_by) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS motorcycles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            year INTEGER NOT NULL,
            engine_capacity INTEGER,
            color TEXT,
            vin TEXT,
            purchase_date DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            motorcycle_id INTEGER NOT NULL,
            service_name TEXT NOT NULL,
            description TEXT,
            mileage INTEGER,
            service_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            cost REAL,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS mechanics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            specialty TEXT,
            years_of_experience INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS service_mechanics (
            service_id INTEGER NOT NULL,
            mechanic_id INTEGER NOT NULL,
            FOREIGN KEY (service_id) REFERENCES services(id),
            FOREIGN KEY (mechanic_id) REFERENCES mechanics(id),
            PRIMARY KEY (service_id, mechanic_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            referrer_id INTEGER NOT NULL,
            referred_id INTEGER NOT NULL,
            referral_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (referrer_id) REFERENCES users(id),
            FOREIGN KEY (referred_id) REFERENCES users(id)
        )
    `);
});

module.exports = db;
