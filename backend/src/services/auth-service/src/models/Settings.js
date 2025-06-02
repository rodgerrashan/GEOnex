const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },

  system: {
    distanceUnit: {
      type: String,
      enum: ['CM', 'FEET'],
      default: 'CM',
    },
    coordinatesUnit: {
      type: String,
      enum: ['DEGREES'],
      default: 'DEGREES',
    },
    baseStationCoordinates: {
      type: String,
      enum: ['AUTO', 'MANUAL'],
      default: 'AUTO',
    },
    longitude: {
      type: String,
      default: '', // assuming string, adjust if numeric and nullable
    },
    latitude: {
      type: String,
      default: '',
    },
  },

  device: {
    samplingInterval: {
      type: String,
      enum: ['1s', '2s', '5s'],
      default: '1s',
    },
    rtkCorrectionSource: {
      type: String,
      enum: ['BASE', 'NTRIP'],
      default: 'BASE',
    },
    ntripCredentials: {
      url: { type: String, default: '' },
      username: { type: String, default: '' },
      password: { type: String, default: '' },
    },
  },

  network: {
    mqttUrlType: {
      type: String,
      enum: ['Default', 'Custom'],
      default: 'Default',
    },
    customMqttUrl: {
      type: String,
      default: '',
    },
  },

  map: {
    accuracyCircles: {
      type: String,
      enum: ['Show', 'Hide'],
      default: 'Show',
    },
    provider: {
      type: String,
      default: 'OpenStreetMap',
    },
    theme: {
      type: String,
      enum: ['Light', 'Dark'],
      default: 'Light',
    },
  },

  account: {
    notifications: {
      type: String,
      enum: ['ON', 'OFF'],
      default: 'ON',
    },
  },

}, { timestamps: true });


const Settings = mongoose.models.Settings || mongoose.model('Settings',SettingsSchema);
module.exports = Settings;