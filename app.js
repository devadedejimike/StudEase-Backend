const express = require('express');
const cors = require('cors');
const ticketRouter = require('./routes/ticketRoutes');
const authRouter = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tickets', ticketRouter);
app.use('/api/v1/admin', adminRouter);

module.exports = app;
