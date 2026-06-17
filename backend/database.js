const sqlite3 = require('sqlite3').verbose();

// Create database file
const db = new sqlite3.Database('./ting.db');

// Create tables
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            service TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

});

module.exports = db;
