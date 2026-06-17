const cors = require("cors");
const express = require("express");
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./database');

const app = express()
app.use(cors());
app.use(express.json());
// ===== MIDDLEWARE =====
app.use(express.json());

app.use(session({
    secret: "ting_secret_key",
    resave: false,
    saveUninitialized: false
}));

// ===== HOME =====
app.get('/', (req, res) => {
    res.send('TING.COM API IS RUNNING ✔');
});

// ===== REGISTER =====
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hash],
        (err) => {
            if (err) return res.status(400).json({ error: "User exists or error" });

            res.json({ message: "User registered ✔" });
        }
    );
});

// ===== LOGIN =====
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: "User not found" });
            }

            const ok = bcrypt.compareSync(password, user.password);

            if (!ok) {
                return res.status(400).json({ error: "Wrong password" });
            }

            req.session.user = {
                id: user.id,
                username: user.username
            };

            res.json({ message: "Login successful ✔" });
        }
    );
});

// ===== CURRENT USER =====
app.get('/api/me', (req, res) => {
    if (!req.session.user) {
        return res.json({ loggedIn: false });
    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });
});

// ===== LOGOUT =====
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out ✔" });
});

// ===== BOOKINGS =====
app.post('/api/bookings', (req, res) => {
    const { name, service } = req.body;

    db.run(
        "INSERT INTO bookings (name, service) VALUES (?, ?)",
        [name, service],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Booking saved ✔",
                id: this.lastID
            });
        }
    );
});

// ===== GET BOOKINGS =====
app.get('/api/bookings', (req, res) => {
    db.all("SELECT * FROM bookings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(rows);
    });
});

// ===== START SERVER (DEPLOY READY) =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("TING.COM running on port " + PORT);
});
