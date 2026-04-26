const { Notification } = require("./db");
const { isUserOnline, sendToUser } = require("./socketManager");

const sendNotification = async (userId, title, message, type = "system") => {
  try {
    const online = isUserOnline(userId);

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      isDelivered: online,
    });

    if (online) {
      sendToUser(userId, {
        _id: notification._id,
        title,
        message,
        type,
        createdAt: notification.createdAt,
      });
      console.log(`Notification sent to online user: ${userId}`);
    } else {
      console.log(`User ${userId} is offline. Notification queued in DB.`);
    }

    return notification;
  } catch (error) {
    console.error("Failed to send notification:", error.message);
  }
};

const deliverQueuedNotifications = async (userId) => {
  try {
    const pending = await Notification.find({ userId, isDelivered: false });

    for (const notif of pending) {
      sendToUser(userId, {
        _id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        createdAt: notif.createdAt,
      });
      notif.isDelivered = true;
      await notif.save();
    }

    if (pending.length > 0) {
      console.log(`Delivered ${pending.length} queued notifications to ${userId}`);
    }
  } catch (error) {
    console.error("Failed to deliver queued notifications:", error.message);
  }
};

module.exports = { sendNotification, deliverQueuedNotifications };