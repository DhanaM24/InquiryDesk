require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/inquiries', require('./routes/inquiries'));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(require('./middleware/errorHandler'));

module.exports = app;
