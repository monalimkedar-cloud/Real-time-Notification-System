const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/notification-system");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // who receives this notification
    },
    title: {
      type: String,
      required: true, // e.g. "New Message"
    },
    message: {
      type: String,
      required: true, // e.g. "John sent you a message"
    },
    type: {
      type: String,
      enum: ["message", "alert", "system", "promotion"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false, // false = unread
    },
    isDelivered: {
      type: Boolean,
      default: false, // false = user was offline
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { connectDB, Notification };