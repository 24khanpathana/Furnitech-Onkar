require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const notificationRoutes = require('./routes/notification.routes');
const User = require('./models/user.model');
const { hashPassword } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 5000;

const parseAllowedOrigins = () => {
  const rawOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  const normalized = rawOrigins.map((value) => {
    if (/^https?:\/\//i.test(value)) {
      return value.replace(/\/+$/, '');
    }
    return `https://${value.replace(/\/+$/, '')}`;
  });

  return new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    ...normalized,
  ]);
};

const allowedOrigins = parseAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ''))) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: false,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'ok',
    database: dbStatusMap[dbState] || 'unknown',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: 'Unexpected server error.', error: err.message });
});

const ensureAdminUser = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@onkar.local').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const existingAdmin = await User.findOne({ role: 'admin' });

  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Onkar Admin',
      branch: process.env.ADMIN_BRANCH || 'Head Office',
      mobileNumber: process.env.ADMIN_MOBILE || '9999999999',
      email,
      passwordHash: hashPassword(password),
      role: 'admin',
      approved: true,
    });
    console.log(`Admin account created for ${email}`);
    return;
  }

  existingAdmin.name = process.env.ADMIN_NAME || existingAdmin.name;
  existingAdmin.branch = process.env.ADMIN_BRANCH || existingAdmin.branch;
  existingAdmin.mobileNumber = process.env.ADMIN_MOBILE || existingAdmin.mobileNumber;
  existingAdmin.email = email;
  existingAdmin.passwordHash = hashPassword(password);
  existingAdmin.approved = true;
  await existingAdmin.save();
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
    await ensureAdminUser();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});

mongoose.connection.on('reconnected', async () => {
  console.log('MongoDB reconnected.');
  await ensureAdminUser();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDatabase();
});
