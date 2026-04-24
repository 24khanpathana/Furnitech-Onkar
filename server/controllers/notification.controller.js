const Notification = require('../models/notification.model');

exports.getNotifications = async (_req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch notifications.', error: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update notification.', error: error.message });
  }
};
