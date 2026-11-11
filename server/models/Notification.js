const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'assignment'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseNotification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = new Proxy(MongooseNotification, {
  construct(target, args) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const { createModelInstance } = require('../localDb');
      return createModelInstance('notifications', args[0]);
    }
    return new target(...args);
  },
  get(target, prop) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const { Notification } = require('../localDb');
      return Notification[prop];
    }
    return target[prop];
  },
});
