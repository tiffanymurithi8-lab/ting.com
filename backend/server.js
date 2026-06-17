const express = require("express");
const cors = require("cors");

const app = express();

// Middleware (VERY IMPORTANT)
app.use(cors());
app.use(express.json());

// Simple in-memory storage (no database needed)
let bookings = [];

// Home route
app.get("/", (req, res) => {
    res.send("TING.COM WORKING ✔");
});

// POST booking
app.post("/api/bookings", (req, res) => {
    const { name, service } = req.body;

    if (!name || !service) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const booking = {
        id: bookings.length + 1,
        name,
        service
    };

    bookings.push(booking);

    res.json({
        message: "Booking saved ✔",
        id: booking.id
    });
});

// GET bookings (optional testing)
app.get("/api/bookings", (req, res) => {
    res.json(bookings);
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`TING.COM running on port ${PORT}`);
});
