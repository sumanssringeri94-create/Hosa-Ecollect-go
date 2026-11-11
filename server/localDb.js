const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'local-database.json');

// Custom ObjectId class mimicking Mongoose ObjectId
class ObjectId {
  constructor(id) {
    this._id = id ? id.toString() : crypto.randomBytes(12).toString('hex');
  }
  toString() {
    return this._id;
  }
  toJSON() {
    return this._id;
  }
  equals(other) {
    if (!other) return false;
    return this._id === (other._id || other.toString());
  }
}

// In-memory state
let db = {
  users: [],
  wasteitems: [],
  pickups: [],
  centers: [],
  notifications: [],
};

// Save to disk
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save local database:', err.message);
  }
}

// Load from disk
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
      if (!db.notifications) db.notifications = [];
      if (!db.users || !db.users.some(u => u.role === 'recycler')) {
        // Re-seed if older schema lacks recycler/logistics
        initSeedData();
        return;
      }
      return;
    } catch (err) {
      console.warn('Could not read local DB file, reinitializing...');
    }
  }
  initSeedData();
}

// Seed Initial Data
function initSeedData() {
  const adminId = '507f191e810c19729de860ea';
  const priyaId = '507f1f77bcf86cd799439011';
  const rahulId = '507f191e810c19729de860eb';
  const greentechId = '507f191e810c19729de860ec';
  const ecowasteId = '507f191e810c19729de860ed';
  const swiftId = '507f191e810c19729de860ee';
  const greenmileId = '507f191e810c19729de860ef';

  const hashedAdminPassword = bcrypt.hashSync('Admin@123', 10);
  const hashedUserPassword = bcrypt.hashSync('Demo@123', 10);

  const users = [
    {
      _id: adminId,
      name: 'Admin User',
      email: 'admin@ecollectgo.com',
      password: hashedAdminPassword,
      city: 'Bengaluru',
      phone: '+91 99999 00000',
      role: 'admin',
      points: 0,
      totalItemsRecycled: 0,
      co2Saved: 0,
      level: 'Eco Starter',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: priyaId,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: hashedUserPassword,
      city: 'Bengaluru',
      phone: '+91 98765 43210',
      role: 'user',
      points: 680,
      totalItemsRecycled: 7,
      co2Saved: 5.6,
      level: 'Eco Warrior',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: rahulId,
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      password: hashedUserPassword,
      city: 'Mumbai',
      phone: '+91 91234 56789',
      role: 'user',
      points: 1200,
      totalItemsRecycled: 12,
      co2Saved: 11.2,
      level: 'Eco Warrior',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: greentechId,
      name: 'GreenTech Solutions',
      email: 'recycler@ecollectgo.com',
      password: hashedUserPassword,
      city: 'Bengaluru',
      phone: '+91 98765 22222',
      role: 'recycler',
      companyName: 'GreenTech Recyclers Pvt Ltd',
      companyAddress: 'Plot 45, Peenya Industrial Area, Phase 2, Bengaluru',
      wasteCategories: ['Laptop/PC', 'Mobile Phone', 'Battery', 'TV/Monitor'],
      isVerified: true,
      points: 0,
      totalItemsRecycled: 420,
      co2Saved: 850.4,
      level: 'Eco Champion',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: ecowasteId,
      name: 'EcoSafe Processors',
      email: 'ecosafe@recycler.com',
      password: hashedUserPassword,
      city: 'Bengaluru',
      phone: '+91 98765 33333',
      role: 'recycler',
      companyName: 'EcoSafe E-Waste Management LLP',
      companyAddress: '72, Whitefield Industrial Zone, Bengaluru',
      wasteCategories: ['Tablet', 'Charger/Cable', 'Printer', 'Other Electronics'],
      isVerified: true,
      points: 0,
      totalItemsRecycled: 310,
      co2Saved: 620.0,
      level: 'Eco Champion',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: swiftId,
      name: 'SwiftExpress Logistics',
      email: 'logistics@ecollectgo.com',
      password: hashedUserPassword,
      city: 'Bengaluru',
      phone: '+91 98765 44444',
      role: 'logistics',
      companyName: 'SwiftCollect Green Cargo',
      vehicleType: 'Electric Van (EV-400)',
      serviceArea: 'Bengaluru North & East',
      availability: 'available',
      points: 0,
      totalItemsRecycled: 180,
      co2Saved: 340.5,
      level: 'Eco Guardian',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: greenmileId,
      name: 'GreenMile Transit',
      email: 'greenmile@logistics.com',
      password: hashedUserPassword,
      city: 'Bengaluru',
      phone: '+91 98765 55555',
      role: 'logistics',
      companyName: 'GreenMile Urban Logistics',
      vehicleType: 'Eco Cargo Truck (3.5T)',
      serviceArea: 'Bengaluru South & Central',
      availability: 'available',
      points: 0,
      totalItemsRecycled: 145,
      co2Saved: 290.0,
      level: 'Eco Guardian',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const centers = [
    {
      _id: '607f1f77bcf86cd799439101',
      name: 'Saahas Zero Waste',
      address: '123 Indiranagar, 100 Feet Road',
      city: 'Bengaluru',
      phone: '+91 98765 11111',
      hours: '9 AM - 5 PM (Mon–Sat)',
      rating: 4.8,
      coordinates: { lat: 12.9784, lng: 77.6408 },
      accepts: ['Laptop/PC', 'Mobile Phone', 'Battery', 'Charger/Cable', 'Tablet'],
      capacity: 500,
      isActive: true,
    },
    {
      _id: '607f1f77bcf86cd799439102',
      name: 'GreenTech Recyclers',
      address: '456 Koramangala 5th Block',
      city: 'Bengaluru',
      phone: '+91 98765 22222',
      hours: '10 AM - 7 PM (Mon–Sun)',
      rating: 4.5,
      coordinates: { lat: 12.9352, lng: 77.6245 },
      accepts: ['TV/Monitor', 'Printer', 'Refrigerator', 'Washing Machine', 'Laptop/PC'],
      capacity: 800,
      isActive: true,
    },
    {
      _id: '607f1f77bcf86cd799439103',
      name: 'Attero Recycling Hub',
      address: '789 Whitefield Main Road',
      city: 'Bengaluru',
      phone: '+91 98765 33333',
      hours: '9 AM - 6 PM (Mon–Fri)',
      rating: 4.3,
      coordinates: { lat: 12.9698, lng: 77.7499 },
      accepts: ['Laptop/PC', 'Mobile Phone', 'Battery', 'TV/Monitor', 'Other Electronics'],
      capacity: 1200,
      isActive: true,
    },
    {
      _id: '607f1f77bcf86cd799439104',
      name: 'E-Parisaraa',
      address: '12 Electronic City Phase 1',
      city: 'Bengaluru',
      phone: '+91 98765 44444',
      hours: '8 AM - 8 PM (Mon–Sat)',
      rating: 4.6,
      coordinates: { lat: 12.8458, lng: 77.6692 },
      accepts: ['Laptop/PC', 'Mobile Phone', 'Tablet', 'Battery', 'Charger/Cable', 'Printer'],
      capacity: 600,
      isActive: true,
    },
  ];

  const wasteitems = [
    {
      _id: '707f1f77bcf86cd799439201',
      user: priyaId,
      category: 'Laptop/PC',
      itemName: 'Dell Inspiron 15',
      brand: 'Dell',
      condition: 'Not Working',
      quantity: 1,
      pointsEarned: 150,
      co2Saved: 1.2,
      status: 'recycled',
      pickup: '807f1f77bcf86cd799439301',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '707f1f77bcf86cd799439202',
      user: priyaId,
      category: 'Mobile Phone',
      itemName: 'iPhone 11',
      brand: 'Apple',
      condition: 'Damaged',
      quantity: 1,
      pointsEarned: 80,
      co2Saved: 0.7,
      status: 'recycled',
      pickup: '807f1f77bcf86cd799439301',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '707f1f77bcf86cd799439203',
      user: priyaId,
      category: 'Battery',
      itemName: 'AA Batteries',
      brand: 'Duracell',
      condition: 'Not Working',
      quantity: 6,
      pointsEarned: 180,
      co2Saved: 1.8,
      status: 'logged',
      pickup: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '707f1f77bcf86cd799439204',
      user: rahulId,
      category: 'TV/Monitor',
      itemName: 'LG 32-inch LED Monitor',
      brand: 'LG',
      condition: 'Not Working',
      quantity: 1,
      pointsEarned: 200,
      co2Saved: 3.0,
      status: 'pickup_requested',
      pickup: '807f1f77bcf86cd799439304',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const pickups = [
    {
      _id: '807f1f77bcf86cd799439301',
      user: priyaId,
      recycler: greentechId,
      logisticsPartner: swiftId,
      category: 'Laptop/PC',
      deviceName: 'Dell Inspiron 15 & iPhone 11',
      quantity: 2,
      weight: '3.2 kg',
      condition: 'Not Working',
      items: ['707f1f77bcf86cd799439201', '707f1f77bcf86cd799439202'],
      address: 'Flat 302, Green Palms, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      scheduledDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      timeSlot: '9 AM - 12 PM',
      status: 'completed',
      recyclerStatus: 'completed',
      logisticsStatus: 'delivered',
      receivedWeight: '3.1 kg',
      recoveredMaterials: '0.4kg Copper, 1.2kg Aluminum, 0.05g Gold trace, 1.1kg Plastic',
      processingNotes: 'Fully dismantled and sorted. Critical metals recovered.',
      pickupNotes: 'Collected on schedule from doorstep.',
      notes: 'Please call on arrival',
      adminNote: 'Verified and assigned successfully',
      pointsAwarded: 230,
      completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '807f1f77bcf86cd799439302',
      user: rahulId,
      recycler: greentechId,
      logisticsPartner: swiftId,
      category: 'Mobile Phone',
      deviceName: 'Samsung Galaxy S9 & iPad Air',
      quantity: 2,
      weight: '1.2 kg',
      condition: 'Damaged',
      items: [],
      address: '42, Sunset Boulevard, Bandra West',
      city: 'Bengaluru',
      pincode: '560001',
      scheduledDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      timeSlot: '12 PM - 3 PM',
      status: 'recycling_in_progress',
      recyclerStatus: 'processing',
      logisticsStatus: 'delivered',
      receivedWeight: '1.18 kg',
      recoveredMaterials: 'Lithium battery separated safely',
      processingNotes: 'Pre-shredding and battery isolation in progress',
      pickupNotes: 'Delivered to GreenTech facility',
      notes: 'Fragile screens',
      adminNote: 'Priority recycling approved',
      pointsAwarded: 0,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '807f1f77bcf86cd799439303',
      user: priyaId,
      recycler: ecowasteId,
      logisticsPartner: greenmileId,
      category: 'Battery',
      deviceName: 'Inverter Batteries (Lead Acid)',
      quantity: 2,
      weight: '9.0 kg',
      condition: 'Not Working',
      items: [],
      address: 'Flat 302, Green Palms, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      scheduledDate: new Date().toISOString(),
      timeSlot: '3 PM - 6 PM',
      status: 'collected',
      recyclerStatus: 'accepted',
      logisticsStatus: 'in_transit',
      receivedWeight: '',
      recoveredMaterials: '',
      processingNotes: '',
      pickupNotes: 'Loaded safely in acid-resistant bins. En route to EcoSafe.',
      notes: 'Heavy items, keep upright',
      adminNote: 'Dangerous goods handled by GreenMile',
      pointsAwarded: 0,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '807f1f77bcf86cd799439304',
      user: rahulId,
      recycler: greentechId,
      logisticsPartner: swiftId,
      category: 'TV/Monitor',
      deviceName: 'LG 32-inch LED Monitor',
      quantity: 1,
      weight: '4.8 kg',
      condition: 'Not Working',
      items: ['707f1f77bcf86cd799439204'],
      address: '15, Koramangala 4th Block',
      city: 'Bengaluru',
      pincode: '560034',
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      timeSlot: '9 AM - 12 PM',
      status: 'pickup_scheduled',
      recyclerStatus: 'accepted',
      logisticsStatus: 'accepted',
      receivedWeight: '',
      recoveredMaterials: '',
      processingNotes: '',
      pickupNotes: '',
      notes: 'Power adapter included',
      adminNote: 'Pickup scheduled for Friday',
      pointsAwarded: 0,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '807f1f77bcf86cd799439305',
      user: priyaId,
      recycler: null,
      logisticsPartner: null,
      category: 'Printer',
      deviceName: 'HP LaserJet Pro M404n',
      quantity: 1,
      weight: '7.5 kg',
      condition: 'Working',
      items: [],
      address: 'Flat 302, Green Palms, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      timeSlot: '12 PM - 3 PM',
      status: 'verified',
      recyclerStatus: 'pending',
      logisticsStatus: 'pending',
      receivedWeight: '',
      recoveredMaterials: '',
      processingNotes: '',
      pickupNotes: '',
      notes: 'Cartridges removed',
      adminNote: 'Verified by Admin. Awaiting partner assignment.',
      pointsAwarded: 0,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '807f1f77bcf86cd799439306',
      user: rahulId,
      recycler: null,
      logisticsPartner: null,
      category: 'Other Electronics',
      deviceName: 'Old Stereo System & Speakers',
      quantity: 3,
      weight: '6.2 kg',
      condition: 'Not Working',
      items: [],
      address: '15, Koramangala 4th Block',
      city: 'Bengaluru',
      pincode: '560034',
      scheduledDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      timeSlot: '3 PM - 6 PM',
      status: 'pending',
      recyclerStatus: 'pending',
      logisticsStatus: 'pending',
      receivedWeight: '',
      recoveredMaterials: '',
      processingNotes: '',
      pickupNotes: '',
      notes: 'All cords bundled together',
      adminNote: '',
      pointsAwarded: 0,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const notifications = [
    {
      _id: '907f1f77bcf86cd799439401',
      user: priyaId,
      title: 'Pickup Completed',
      message: 'Your pickup #807f1f77bcf86cd799439301 was processed. 230 points awarded!',
      type: 'success',
      read: true,
      link: '/user/my-pickups',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '907f1f77bcf86cd799439402',
      user: priyaId,
      title: 'Collection In Transit',
      message: 'GreenMile Transit has collected your Battery waste and is transporting it to EcoSafe.',
      type: 'info',
      read: false,
      link: '/user/track',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '907f1f77bcf86cd799439403',
      user: greentechId,
      title: 'New Recycling Assignment',
      message: 'You have been assigned pickup #807f1f77bcf86cd799439304 (LG 32-inch LED Monitor).',
      type: 'assignment',
      read: false,
      link: '/recycler/assigned',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '907f1f77bcf86cd799439404',
      user: swiftId,
      title: 'Upcoming Collection',
      message: 'Pickup scheduled for tomorrow at Koramangala 4th Block.',
      type: 'assignment',
      read: false,
      link: '/logistics/pickups',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '907f1f77bcf86cd799439405',
      user: adminId,
      title: 'New E-Waste Request',
      message: 'Rahul Verma submitted a pickup request for Other Electronics.',
      type: 'info',
      read: false,
      link: '/admin/pickups',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  db = { users, wasteitems, pickups, centers, notifications };
  saveDB();
}

loadDB();

// Helper to match queries
function matchQuery(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id' || key === 'user' || key === 'recycler' || key === 'logisticsPartner') {
      const docId = doc[key] ? doc[key].toString() : null;
      if (val === null) {
        if (doc[key] !== null && doc[key] !== undefined && doc[key] !== '') return false;
      } else if (val && typeof val === 'object' && val.$in) {
        const inIds = val.$in.map(v => (v ? v.toString() : ''));
        if (!inIds.includes(docId)) return false;
      } else {
        const qId = val ? val.toString() : null;
        if (docId !== qId) return false;
      }
    } else if (key === '$or') {
      const matchesOr = val.some(subQuery => matchQuery(doc, subQuery));
      if (!matchesOr) return false;
    } else if (val && typeof val === 'object') {
      if (val.$regex) {
        const re = new RegExp(val.$regex, val.$options || '');
        if (!re.test(doc[key] || '')) return false;
      } else if (val.$in) {
        const docVal = doc[key] ? doc[key].toString() : '';
        const inList = val.$in.map(v => (v ? v.toString() : ''));
        if (!inList.includes(docVal)) return false;
      } else if (val.$ne !== undefined) {
        const docVal = doc[key] ? doc[key].toString() : '';
        const neVal = val.$ne ? val.$ne.toString() : '';
        if (docVal === neVal) return false;
      }
    } else {
      const dVal = doc[key] !== undefined ? doc[key] : '';
      if (dVal !== val && String(dVal) !== String(val)) return false;
    }
  }
  return true;
}

// Helper to sort
function applySort(list, sortObj) {
  if (!sortObj) return list;
  const [field, dir] = Object.entries(sortObj)[0] || [];
  if (!field) return list;
  const order = dir === -1 || dir === 'desc' ? -1 : 1;
  return [...list].sort((a, b) => {
    let va = a[field];
    let vb = b[field];
    if (va > vb) return order;
    if (va < vb) return -order;
    return 0;
  });
}

function applySelect(doc, selectStr) {
  if (!selectStr || !doc) return doc;
  const clone = { ...doc };
  const fields = selectStr
    .split(' ')
    .map(s => s.trim())
    .filter(Boolean);
  if (fields.length === 0) return doc;

  // Handle +field (e.g. +password): keep all default fields plus the requested field
  const plusFields = fields.filter(f => f.startsWith('+'));
  if (plusFields.length === fields.length) {
    return clone;
  }

  if (fields[0].startsWith('-')) {
    for (const f of fields) {
      delete clone[f.slice(1)];
    }
    return clone;
  } else {
    const result = { _id: doc._id };
    for (const f of fields) {
      const fieldName = f.startsWith('+') ? f.slice(1) : f;
      if (doc[fieldName] !== undefined) result[fieldName] = doc[fieldName];
    }
    return result;
  }
}

// Helper for populate
function applyPopulate(doc, path, selectStr) {
  if (!doc) return doc;
  const clone = { ...doc };
  if (path === 'items') {
    const itemIds = Array.isArray(clone.items) ? clone.items : [];
    clone.items = itemIds
      .map(id => {
        const item = db.wasteitems.find(
          w => (w._id ? w._id.toString() : '') === (id ? id.toString() : '')
        );
        return item ? applySelect({ ...item }, selectStr) : null;
      })
      .filter(Boolean);
  } else if (path === 'user') {
    const userId = clone.user ? clone.user.toString() : '';
    const user = db.users.find(u => (u._id ? u._id.toString() : '') === userId);
    clone.user = user ? applySelect({ ...user }, selectStr) : null;
  } else if (path === 'recycler') {
    const recyclerId = clone.recycler ? clone.recycler.toString() : '';
    const r = db.users.find(u => (u._id ? u._id.toString() : '') === recyclerId);
    clone.recycler = r ? applySelect({ ...r }, selectStr) : null;
  } else if (path === 'logisticsPartner') {
    const partnerId = clone.logisticsPartner ? clone.logisticsPartner.toString() : '';
    const p = db.users.find(u => (u._id ? u._id.toString() : '') === partnerId);
    clone.logisticsPartner = p ? applySelect({ ...p }, selectStr) : null;
  } else if (path === 'pickup') {
    const pickupId = clone.pickup ? clone.pickup.toString() : '';
    const p = db.pickups.find(x => (x._id ? x._id.toString() : '') === pickupId);
    clone.pickup = p ? applySelect({ ...p }, selectStr) : null;
  }
  return clone;
}

// Base Model Class
class LocalModel {
  constructor(collectionName, data) {
    this._collection = collectionName;
    Object.assign(this, data);
    if (!this._id) {
      this._id = new ObjectId().toString();
    }
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const list = db[this._collection];
    const index = list.findIndex(d => (d._id ? d._id.toString() : '') === this._id.toString());
    const raw = { ...this };
    delete raw._collection;
    if (index >= 0) {
      list[index] = raw;
    } else {
      raw.createdAt = raw.createdAt || new Date().toISOString();
      list.push(raw);
    }
    saveDB();
    return this;
  }

  async deleteOne() {
    const list = db[this._collection];
    const index = list.findIndex(d => (d._id ? d._id.toString() : '') === this._id.toString());
    if (index >= 0) {
      list.splice(index, 1);
      saveDB();
    }
    return { acknowledged: true, deletedCount: 1 };
  }

  toObject() {
    const obj = { ...this };
    delete obj._collection;
    return obj;
  }

  toJSON() {
    return this.toObject();
  }
}

// Query Builder for Chaining
class QueryBuilder {
  constructor(collectionName, filter = {}, isSingle = false) {
    this._collection = collectionName;
    this._filter = filter;
    this._isSingle = isSingle;
    this._sort = null;
    this._limit = null;
    this._skip = 0;
    this._select = null;
    this._populates = [];
  }

  sort(sortObj) {
    this._sort = sortObj;
    return this;
  }

  skip(n) {
    this._skip = n;
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  select(str) {
    this._select = str;
    return this;
  }

  populate(path, selectStr) {
    this._populates.push({ path, selectStr });
    return this;
  }

  _execute() {
    const list = db[this._collection] || [];
    let results = list.filter(doc => matchQuery(doc, this._filter));

    if (this._sort) {
      results = applySort(results, this._sort);
    }

    if (this._skip > 0) {
      results = results.slice(this._skip);
    }

    if (this._limit && this._limit > 0) {
      results = results.slice(0, this._limit);
    }

    if (this._isSingle) {
      let doc = results[0] ? { ...results[0] } : null;
      if (!doc) return null;
      for (const pop of this._populates) {
        doc = applyPopulate(doc, pop.path, pop.selectStr);
      }
      doc = applySelect(doc, this._select);
      return createModelInstance(this._collection, doc);
    }

    return results.map(d => {
      let doc = { ...d };
      for (const pop of this._populates) {
        doc = applyPopulate(doc, pop.path, pop.selectStr);
      }
      doc = applySelect(doc, this._select);
      return createModelInstance(this._collection, doc);
    });
  }

  then(resolve, reject) {
    try {
      resolve(this._execute());
    } catch (err) {
      reject(err);
    }
  }
}

function createModelInstance(collectionName, data) {
  if (!data) return null;
  const instance = new LocalModel(collectionName, data);

  if (collectionName === 'users') {
    instance.comparePassword = async function (pass) {
      return bcrypt.compare(pass, this.password);
    };
    instance.updateLevel = function () {
      if (this.points >= 5000) this.level = 'Eco Champion';
      else if (this.points >= 2000) this.level = 'Eco Guardian';
      else if (this.points >= 800) this.level = 'Eco Warrior';
      else if (this.points >= 200) this.level = 'Eco Starter';
      else this.level = 'Beginner';
    };
  }

  return instance;
}

// User Model Interface
const UserModel = {
  create: async data => {
    const user = {
      _id: new ObjectId().toString(),
      points: 0,
      totalItemsRecycled: 0,
      co2Saved: 0,
      level: 'Eco Starter',
      isActive: true,
      role: 'user',
      companyName: '',
      companyAddress: '',
      wasteCategories: [],
      isVerified: false,
      serviceArea: '',
      vehicleType: '',
      availability: 'available',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(user);
    saveDB();
    return createModelInstance('users', user);
  },
  findOne: filter => new QueryBuilder('users', filter, true),
  findById: id => new QueryBuilder('users', { _id: id }, true),
  find: (filter = {}) => new QueryBuilder('users', filter, false),
  countDocuments: async (filter = {}) => {
    return db.users.filter(doc => matchQuery(doc, filter)).length;
  },
  findByIdAndUpdate: async (id, update, options = {}) => {
    const list = db.users;
    const index = list.findIndex(u => (u._id ? u._id.toString() : '') === (id ? id.toString() : ''));
    if (index === -1) return null;
    let doc = { ...list[index] };
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        doc[k] = (Number(doc[k]) || 0) + Number(v);
      }
    }
    for (const [k, v] of Object.entries(update)) {
      if (k !== '$inc' && k !== '$set') {
        doc[k] = v;
      }
    }
    if (update.$set) {
      for (const [k, v] of Object.entries(update.$set)) {
        doc[k] = v;
      }
    }
    doc.updatedAt = new Date().toISOString();
    list[index] = doc;
    saveDB();
    return createModelInstance('users', doc);
  },
  deleteMany: async () => {
    db.users = [];
    saveDB();
    return { acknowledged: true };
  },
  aggregate: async (pipeline = []) => {
    let result = db.users;
    for (const stage of pipeline) {
      if (stage.$group) {
        let totalPoints = 0;
        let totalCO2 = 0;
        for (const u of db.users) {
          totalPoints += Number(u.points) || 0;
          totalCO2 += Number(u.co2Saved) || 0;
        }
        return [{ _id: null, totalPoints, totalCO2 }];
      }
    }
    return result;
  },
};

// WasteItem Model Interface
const WasteItemModel = {
  getCategoryMeta: category => {
    const meta = {
      'Laptop/PC': { points: 150, co2: 1.2 },
      'Mobile Phone': { points: 80, co2: 0.7 },
      'Tablet': { points: 100, co2: 0.9 },
      'TV/Monitor': { points: 200, co2: 3.0 },
      'Battery': { points: 30, co2: 0.3 },
      'Charger/Cable': { points: 20, co2: 0.1 },
      'Printer': { points: 120, co2: 1.0 },
      'Refrigerator': { points: 300, co2: 5.0 },
      'Washing Machine': { points: 250, co2: 4.0 },
      'Other Electronics': { points: 50, co2: 0.5 },
    };
    return meta[category] || { points: 50, co2: 0.5 };
  },
  create: async data => {
    const item = {
      _id: new ObjectId().toString(),
      status: 'logged',
      quantity: 1,
      pickup: null,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.wasteitems.push(item);
    saveDB();
    return createModelInstance('wasteitems', item);
  },
  find: (filter = {}) => new QueryBuilder('wasteitems', filter, false),
  findById: id => new QueryBuilder('wasteitems', { _id: id }, true),
  countDocuments: async (filter = {}) => {
    return db.wasteitems.filter(doc => matchQuery(doc, filter)).length;
  },
  findByIdAndUpdate: async (id, update) => {
    const list = db.wasteitems;
    const index = list.findIndex(w => (w._id ? w._id.toString() : '') === (id ? id.toString() : ''));
    if (index === -1) return null;
    let doc = { ...list[index], ...update, updatedAt: new Date().toISOString() };
    list[index] = doc;
    saveDB();
    return createModelInstance('wasteitems', doc);
  },
  updateMany: async (filter, update) => {
    let count = 0;
    for (let i = 0; i < db.wasteitems.length; i++) {
      if (matchQuery(db.wasteitems[i], filter)) {
        db.wasteitems[i] = { ...db.wasteitems[i], ...update, updatedAt: new Date().toISOString() };
        count++;
      }
    }
    saveDB();
    return { acknowledged: true, modifiedCount: count };
  },
  deleteMany: async () => {
    db.wasteitems = [];
    saveDB();
    return { acknowledged: true };
  },
  aggregate: async (pipeline = []) => {
    const counts = {};
    for (const item of db.wasteitems) {
      const cat = item.category || 'Other';
      counts[cat] = (counts[cat] || 0) + (Number(item.quantity) || 1);
    }
    return Object.entries(counts)
      .map(([cat, count]) => ({ _id: cat, count }))
      .sort((a, b) => b.count - a.count);
  },
};

// Pickup Model Interface
const PickupModel = {
  create: async data => {
    const pickup = {
      _id: new ObjectId().toString(),
      status: 'pending',
      items: [],
      recycler: null,
      logisticsPartner: null,
      recyclerStatus: 'pending',
      logisticsStatus: 'pending',
      receivedWeight: '',
      recoveredMaterials: '',
      processingNotes: '',
      pickupNotes: '',
      notes: '',
      adminNote: '',
      pointsAwarded: 0,
      completedAt: null,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.pickups.push(pickup);
    saveDB();
    return createModelInstance('pickups', pickup);
  },
  find: (filter = {}) => new QueryBuilder('pickups', filter, false),
  findById: id => new QueryBuilder('pickups', { _id: id }, true),
  countDocuments: async (filter = {}) => {
    return db.pickups.filter(doc => matchQuery(doc, filter)).length;
  },
  findByIdAndUpdate: async (id, update) => {
    const list = db.pickups;
    const index = list.findIndex(p => (p._id ? p._id.toString() : '') === (id ? id.toString() : ''));
    if (index === -1) return null;
    let doc = { ...list[index] };
    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    for (const [k, v] of Object.entries(update)) {
      if (k !== '$set') {
        doc[k] = v;
      }
    }
    doc.updatedAt = new Date().toISOString();
    list[index] = doc;
    saveDB();
    return createModelInstance('pickups', doc);
  },
  updateMany: async (filter, update) => {
    let count = 0;
    for (let i = 0; i < db.pickups.length; i++) {
      if (matchQuery(db.pickups[i], filter)) {
        db.pickups[i] = { ...db.pickups[i], ...update, updatedAt: new Date().toISOString() };
        count++;
      }
    }
    saveDB();
    return { acknowledged: true, modifiedCount: count };
  },
  deleteMany: async () => {
    db.pickups = [];
    saveDB();
    return { acknowledged: true };
  },
};

// Center Model Interface
const CenterModel = {
  find: (filter = {}) => new QueryBuilder('centers', filter, false),
  insertMany: async (docs = []) => {
    for (const d of docs) {
      db.centers.push({
        _id: new ObjectId().toString(),
        isActive: true,
        ...d,
      });
    }
    saveDB();
    return db.centers;
  },
  deleteMany: async () => {
    db.centers = [];
    saveDB();
    return { acknowledged: true };
  },
};

// Notification Model Interface
const NotificationModel = {
  create: async data => {
    const notification = {
      _id: new ObjectId().toString(),
      type: 'info',
      read: false,
      link: '',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.notifications.push(notification);
    saveDB();
    return createModelInstance('notifications', notification);
  },
  find: (filter = {}) => new QueryBuilder('notifications', filter, false),
  findById: id => new QueryBuilder('notifications', { _id: id }, true),
  countDocuments: async (filter = {}) => {
    return db.notifications.filter(doc => matchQuery(doc, filter)).length;
  },
  findByIdAndUpdate: async (id, update) => {
    const list = db.notifications;
    const index = list.findIndex(n => (n._id ? n._id.toString() : '') === (id ? id.toString() : ''));
    if (index === -1) return null;
    let doc = { ...list[index], ...update, updatedAt: new Date().toISOString() };
    list[index] = doc;
    saveDB();
    return createModelInstance('notifications', doc);
  },
  updateMany: async (filter, update) => {
    let count = 0;
    for (let i = 0; i < db.notifications.length; i++) {
      if (matchQuery(db.notifications[i], filter)) {
        db.notifications[i] = { ...db.notifications[i], ...update, updatedAt: new Date().toISOString() };
        count++;
      }
    }
    saveDB();
    return { acknowledged: true, modifiedCount: count };
  },
  deleteMany: async () => {
    db.notifications = [];
    saveDB();
    return { acknowledged: true };
  },
};

module.exports = {
  User: UserModel,
  WasteItem: WasteItemModel,
  Pickup: PickupModel,
  Center: CenterModel,
  Notification: NotificationModel,
  ObjectId,
  saveDB,
  loadDB,
  createModelInstance,
};
