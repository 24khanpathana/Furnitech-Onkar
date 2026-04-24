const crypto = require('crypto');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { createToken, hashPassword, verifyPassword, hashResetCode } = require('../utils/auth');
const { sendPasswordResetEmail } = require('../utils/email');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  branch: user.branch,
  mobileNumber: user.mobileNumber,
  email: user.email,
  role: user.role,
  approved: user.approved,
  createdAt: user.createdAt,
});

const issueAuthResponse = (user, res) => {
  const token = createToken({
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
  });

  res.json({
    token,
    user: sanitizeUser(user),
  });
};

exports.signupWorker = async (req, res) => {
  try {
    const { name, branch, mobileNumber, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      branch,
      mobileNumber,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role: 'worker',
      approved: false,
    });

    await Notification.create({
      type: 'worker-signup',
      title: 'New worker signup request',
      message: `${name} has requested access from ${branch}.`,
      metadata: {
        userId: user._id,
        email: user.email,
      },
    });

    res.status(201).json({
      message: 'Signup request sent to admin for approval.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(400).json({ message: 'Unable to create worker signup request.', error: error.message });
  }
};

exports.loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), role: 'worker' });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.approved) {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    issueAuthResponse(user, res);
  } catch (error) {
    res.status(500).json({ message: 'Unable to login worker.', error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    issueAuthResponse(admin, res);
  } catch (error) {
    res.status(500).json({ message: 'Unable to login admin.', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

exports.getPendingWorkers = async (_req, res) => {
  try {
    const users = await User.find({ role: 'worker', approved: false }).sort({ createdAt: -1 });
    res.json(users.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch pending workers.', error: error.message });
  }
};

exports.reviewWorker = async (req, res) => {
  try {
    const { action } = req.body;
    const worker = await User.findOne({ _id: req.params.id, role: 'worker' });

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found.' });
    }

    if (action === 'accept') {
      worker.approved = true;
      await worker.save();
      await Notification.create({
        type: 'worker-approved',
        title: 'Worker approved',
        message: `${worker.name} has been approved.`,
        metadata: { userId: worker._id, email: worker.email },
      });
      return res.json({ message: 'Worker approved successfully.', user: sanitizeUser(worker) });
    }

    if (action === 'reject') {
      await Notification.create({
        type: 'worker-rejected',
        title: 'Worker rejected',
        message: `${worker.name} has been rejected.`,
        metadata: { userId: worker._id, email: worker.email },
      });
      await worker.deleteOne();
      return res.json({ message: 'Worker rejected successfully.' });
    }

    res.status(400).json({ message: 'Invalid review action.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to review worker request.', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), role: 'worker' });

    if (!user) {
      return res.json({ message: 'If the email exists, a reset code has been generated.' });
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetCodeHash = hashResetCode(resetCode);
    user.resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail({ user, resetCode }).catch(() => null);

    const response = {
      message: 'A password reset code has been generated for this worker account.',
    };

    if (!process.env.BREVO_API_KEY) {
      response.devResetCode = resetCode;
      response.note = 'Brevo is not configured, so the reset code is returned for local development.';
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Unable to process forgot password request.', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), role: 'worker' });

    if (
      !user ||
      !user.resetCodeHash ||
      !user.resetCodeExpiry ||
      user.resetCodeExpiry.getTime() < Date.now() ||
      user.resetCodeHash !== hashResetCode(code)
    ) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    user.passwordHash = hashPassword(newPassword);
    user.resetCodeHash = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to reset password.', error: error.message });
  }
};
