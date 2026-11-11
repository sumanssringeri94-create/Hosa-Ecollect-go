const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WasteItem',
      },
    ],
    recycler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    logisticsPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    deviceName: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    weight: {
      type: String,
      trim: true,
      default: '',
    },
    condition: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    status: {
      type: String,
      enum: [
        'pending',
        'verified',
        'assigned',
        'pickup_scheduled',
        'collected',
        'recycling_in_progress',
        'completed',
        'rejected',
      ],
      default: 'pending',
    },
    recyclerStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'processing', 'completed'],
      default: 'pending',
    },
    logisticsStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in_transit', 'delivered'],
      default: 'pending',
    },
    receivedWeight: {
      type: String,
      trim: true,
      default: '',
    },
    recoveredMaterials: {
      type: String,
      trim: true,
      default: '',
    },
    processingNotes: {
      type: String,
      trim: true,
      default: '',
    },
    pickupNotes: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    adminNote: {
      type: String,
      trim: true,
      default: '',
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const MongoosePickup = mongoose.models.Pickup || mongoose.model('Pickup', pickupSchema);

module.exports = new Proxy(MongoosePickup, {
  construct(target, args) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const { createModelInstance } = require('../localDb');
      return createModelInstance('pickups', args[0]);
    }
    return new target(...args);
  },
  get(target, prop) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const { Pickup } = require('../localDb');
      return Pickup[prop];
    }
    return target[prop];
  },
});
