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

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: false,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
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

  if (existingAdmin.email !== email) {
    existingAdmin.email = email;
  }
  existingAdmin.approved = true;
  if (!existingAdmin.passwordHash) {
    existingAdmin.passwordHash = hashPassword(password);
  }
  await existingAdmin.save();
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
