require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB / LocalDB fallback
connectDB();

const app = express();

// --- CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://ecollect-go.vercel.app",
  "https://ecollect-go-1.onrender.com",
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    } else {
      return callback(null, true); // Allow during development
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// --- Middleware ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'e-Collect Go API is running',
    timestamp: new Date().toISOString(),
  });
});

// --- Routes ---
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/waste',         require('./routes/waste'));
app.use('/api/pickups',       require('./routes/pickups'));
app.use('/api/centers',       require('./routes/centers'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/recyclers',     require('./routes/recyclers'));
app.use('/api/logistics',     require('./routes/logistics'));
app.use('/api/notifications', require('./routes/notifications'));

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// --- Global error handler ---
app.use(errorHandler);

// --- Start ---
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
