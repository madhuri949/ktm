const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const dataDirectory = path.join(__dirname, 'data');
const bookingsFile = path.join(dataDirectory, 'test-rides.json');

fs.mkdirSync(dataDirectory, { recursive: true });
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, '[]');

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'KTM 390 Adventure API' });
});

app.post('/api/test-rides', (request, response) => {
    const { name, phone, city } = request.body || {};
    const cleanName = String(name || '').trim();
    const cleanPhone = String(phone || '').trim();
    const cleanCity = String(city || '').trim();

    if (!cleanName || !cleanPhone || !cleanCity) {
        return response.status(400).json({
            message: 'Name, phone, and city are required.'
        });
    }

    let bookings;

    try {

        const storedBookings = fs.readFileSync(bookingsFile, 'utf8')
            .replace(/^\uFEFF/, '');

        bookings = storedBookings.trim()
            ? JSON.parse(storedBookings)
            : [];

        if (!Array.isArray(bookings)) bookings = [];

    } catch (_error) {

        return response.status(500).json({
            message: 'Unable to read booking storage.'
        });

    }

    const booking = {
        id: `TR-${Date.now()}`,
        name: cleanName,
        phone: cleanPhone,
        city: cleanCity,
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    response.status(201).json({
        message: 'Test ride request received.',
        booking
    });
});

app.listen(PORT, () => {
    console.log(`KTM backend running at http://localhost:${PORT}`);
});
