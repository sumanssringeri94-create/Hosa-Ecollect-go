import {
  INITIAL_CATEGORIES,
  INITIAL_RECYCLERS,
  INITIAL_LOGISTICS,
  INITIAL_REQUESTS,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
  RECENT_AUDIT_LOGS,
} from '../data/mockData';

const STORAGE_KEYS = {
  REQUESTS: 'ecg_demo_requests',
  RECYCLERS: 'ecg_demo_recyclers',
  LOGISTICS: 'ecg_demo_logistics',
  USERS: 'ecg_demo_users',
  CATEGORIES: 'ecg_demo_categories',
  NOTIFICATIONS: 'ecg_demo_notifications',
  AUDIT_LOGS: 'ecg_demo_audit_logs',
};

// Safe JSON get with fallback
const getFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// Initialize if empty
export const initializeDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    saveToStorage(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECYCLERS)) {
    saveToStorage(STORAGE_KEYS.RECYCLERS, INITIAL_RECYCLERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGISTICS)) {
    saveToStorage(STORAGE_KEYS.LOGISTICS, INITIAL_LOGISTICS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    saveToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, RECENT_AUDIT_LOGS);
  }
};

// Reset everything to pristine factory state
export const resetDemoData = () => {
  saveToStorage(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  saveToStorage(STORAGE_KEYS.RECYCLERS, INITIAL_RECYCLERS);
  saveToStorage(STORAGE_KEYS.LOGISTICS, INITIAL_LOGISTICS);
  saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  saveToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  saveToStorage(STORAGE_KEYS.AUDIT_LOGS, RECENT_AUDIT_LOGS);
};

// ─── REQUESTS API ──────────────────────────────────────────────
export const storageService = {
  getRequests: () => getFromStorage(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS),

  getRequestById: (id) => {
    const all = storageService.getRequests();
    return all.find((r) => r.id === id) || null;
  },

  createRequest: (requestData) => {
    const all = storageService.getRequests();
    const newId = `ECG-${Math.floor(8900 + all.length + Math.random() * 50 + 1)}`;
    const nowStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const newRequest = {
      id: newId,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      assignedRecyclerId: null,
      assignedRecyclerName: null,
      assignedLogisticsId: null,
      assignedLogisticsName: null,
      ...requestData,
      timeline: [
        {
          stage: 'Request Submitted',
          date: nowStr,
          status: 'completed',
          note: 'Request created by user. Awaiting admin verification.',
        },
        { stage: 'Admin Verified', date: 'Pending', status: 'upcoming', note: 'Manifest review in progress.' },
        { stage: 'Recycler & Logistics Assigned', date: 'Pending', status: 'upcoming', note: 'Admin assignment.' },
        { stage: 'Pickup Scheduled', date: 'Pending', status: 'upcoming', note: 'Date & time slot assignment.' },
        { stage: 'Collected', date: 'Pending', status: 'upcoming', note: 'Logistics collection.' },
        { stage: 'Recycling in Progress', date: 'Pending', status: 'upcoming', note: 'Facility processing.' },
        { stage: 'Completed & Certified', date: 'Pending', status: 'upcoming', note: 'Final recycling certificate.' },
      ],
    };

    const updated = [newRequest, ...all];
    saveToStorage(STORAGE_KEYS.REQUESTS, updated);

    // Audit log
    storageService.addAuditLog('New Request Submitted', newId, requestData.userName || 'Citizen User');

    // Add admin notification
    storageService.addNotification({
      recipientRole: 'admin',
      recipientId: 'user-admin',
      title: `New Pickup Request: ${newId}`,
      message: `${requestData.userName} logged ${requestData.deviceName} (${requestData.weight}kg) in ${requestData.city}.`,
      type: 'info',
    });

    return newRequest;
  },

  updateRequestStatus: (id, newStatus, note = '', actor = 'Admin') => {
    const all = storageService.getRequests();
    const nowStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const updated = all.map((req) => {
      if (req.id !== id) return req;

      // Update timeline stages
      const stagesOrder = [
        'Request Submitted',
        'Admin Verified',
        'Recycler & Logistics Assigned',
        'Pickup Scheduled',
        'Collected',
        'Recycling in Progress',
        'Completed & Certified',
      ];

      const stageIndexMap = {
        submitted: 0,
        verified: 1,
        assigned: 2,
        scheduled: 3,
        collected: 4,
        in_recycling: 5,
        completed: 6,
        rejected: -1,
      };

      const targetIdx = stageIndexMap[newStatus];

      const newTimeline = req.timeline.map((item, idx) => {
        if (targetIdx === -1) {
          return { ...item, status: 'rejected' };
        }
        if (idx < targetIdx) {
          return { ...item, status: 'completed' };
        }
        if (idx === targetIdx) {
          return {
            ...item,
            status: 'completed',
            date: nowStr,
            note: note || item.note,
          };
        }
        return { ...item, status: 'upcoming' };
      });

      return {
        ...req,
        status: newStatus,
        timeline: newTimeline,
      };
    });

    saveToStorage(STORAGE_KEYS.REQUESTS, updated);
    storageService.addAuditLog(`Status updated to ${newStatus}`, id, actor);

    return updated.find((r) => r.id === id);
  },

  assignPartners: (id, { recyclerId, recyclerName, logisticsId, logisticsName, pickupDate, timeSlot, notes }) => {
    const all = storageService.getRequests();
    const nowStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const updated = all.map((req) => {
      if (req.id !== id) return req;

      const newTimeline = [...req.timeline];
      // Mark assigned & scheduled
      if (newTimeline[1]) newTimeline[1] = { ...newTimeline[1], status: 'completed', date: newTimeline[1].date === 'Pending' ? nowStr : newTimeline[1].date };
      if (newTimeline[2]) {
        newTimeline[2] = {
          stage: 'Recycler & Logistics Assigned',
          status: 'completed',
          date: nowStr,
          note: `Assigned to ${recyclerName} and ${logisticsName}.`,
        };
      }
      if (newTimeline[3]) {
        newTimeline[3] = {
          stage: 'Pickup Scheduled',
          status: 'current',
          date: pickupDate ? `${pickupDate} (${timeSlot || 'Slot booked'})` : nowStr,
          note: notes || 'Pickup timing confirmed by logistics fleet.',
        };
      }

      return {
        ...req,
        status: 'assigned',
        assignedRecyclerId: recyclerId,
        assignedRecyclerName: recyclerName,
        assignedLogisticsId: logisticsId,
        assignedLogisticsName: logisticsName,
        preferredDate: pickupDate || req.preferredDate,
        preferredTime: timeSlot || req.preferredTime,
        adminNotes: notes || req.adminNotes,
        timeline: newTimeline,
      };
    });

    saveToStorage(STORAGE_KEYS.REQUESTS, updated);
    storageService.addAuditLog(`Assigned partners to ${id}`, id, 'Admin');

    // Notify Recycler
    storageService.addNotification({
      recipientRole: 'recycler',
      recipientId: recyclerId,
      title: `New Assignment: ${id}`,
      message: `Pickup ${id} has been routed to your facility. Expected collection date: ${pickupDate}.`,
      type: 'info',
    });

    // Notify Logistics
    storageService.addNotification({
      recipientRole: 'logistics',
      recipientId: logisticsId,
      title: `Pickup Mission Dispatched: ${id}`,
      message: `Pickup from Indiranagar ready for pickup scheduling.`,
      type: 'info',
    });

    return updated.find((r) => r.id === id);
  },

  updateRecyclingData: (id, recyclingData, markComplete = false) => {
    const all = storageService.getRequests();
    const nowStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const updated = all.map((req) => {
      if (req.id !== id) return req;

      const currentRecycling = req.recyclingData || {};
      const newStatus = markComplete ? 'completed' : req.status === 'collected' ? 'in_recycling' : req.status;

      let newTimeline = [...req.timeline];
      if (markComplete) {
        newTimeline = newTimeline.map((item, idx) => {
          if (idx <= 6) return { ...item, status: 'completed' };
          return item;
        });
        if (newTimeline[6]) {
          newTimeline[6] = {
            stage: 'Completed & Certified',
            status: 'completed',
            date: nowStr,
            note: `Recovery certified. ${recyclingData?.certificateId || 'ECG-CERT-' + Math.floor(1000 + Math.random() * 9000)} generated.`,
          };
        }
      }

      return {
        ...req,
        status: newStatus,
        timeline: newTimeline,
        recyclingData: {
          ...currentRecycling,
          ...recyclingData,
          lastUpdated: nowStr,
        },
      };
    });

    saveToStorage(STORAGE_KEYS.REQUESTS, updated);
    storageService.addAuditLog(`Recycling ops updated: ${id}`, id, 'Recycler');
    return updated.find((r) => r.id === id);
  },

  // ─── RECYCLERS API ──────────────────────────────────────────────
  getRecyclers: () => getFromStorage(STORAGE_KEYS.RECYCLERS, INITIAL_RECYCLERS),

  createRecycler: (data) => {
    const all = storageService.getRecyclers();
    const newRecycler = {
      id: `rec-${all.length + 1}`,
      verified: true,
      activeJobsCount: 0,
      totalProcessedTonnes: 0.0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0],
      ...data,
    };
    const updated = [newRecycler, ...all];
    saveToStorage(STORAGE_KEYS.RECYCLERS, updated);
    return newRecycler;
  },

  updateRecycler: (id, data) => {
    const all = storageService.getRecyclers();
    const updated = all.map((r) => (r.id === id ? { ...r, ...data } : r));
    saveToStorage(STORAGE_KEYS.RECYCLERS, updated);
    return updated.find((r) => r.id === id);
  },

  verifyRecycler: (id, verifiedStatus) => {
    return storageService.updateRecycler(id, { verified: verifiedStatus });
  },

  // ─── LOGISTICS API ──────────────────────────────────────────────
  getLogistics: () => getFromStorage(STORAGE_KEYS.LOGISTICS, INITIAL_LOGISTICS),

  createLogistics: (data) => {
    const all = storageService.getLogistics();
    const newPartner = {
      id: `log-${all.length + 1}`,
      status: 'Active',
      available: true,
      assignedPickupsCount: 0,
      completedTrips: 0,
      rating: 5.0,
      ...data,
    };
    const updated = [newPartner, ...all];
    saveToStorage(STORAGE_KEYS.LOGISTICS, updated);
    return newPartner;
  },

  updateLogistics: (id, data) => {
    const all = storageService.getLogistics();
    const updated = all.map((l) => (l.id === id ? { ...l, ...data } : l));
    saveToStorage(STORAGE_KEYS.LOGISTICS, updated);
    return updated.find((l) => l.id === id);
  },

  // ─── USERS API ──────────────────────────────────────────────────
  getUsers: () => getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS),

  toggleUserStatus: (id) => {
    const all = storageService.getUsers();
    const updated = all.map((u) => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    });
    saveToStorage(STORAGE_KEYS.USERS, updated);
    return updated.find((u) => u.id === id);
  },

  // ─── CATEGORIES API ─────────────────────────────────────────────
  getCategories: () => getFromStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),

  saveCategories: (cats) => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, cats);
    return cats;
  },

  // ─── NOTIFICATIONS & AUDIT ──────────────────────────────────────
  getNotifications: (role, recipientId) => {
    const all = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!role && !recipientId) return all;
    return all.filter((n) => n.recipientRole === role || (recipientId && n.recipientId === recipientId));
  },

  markNotificationAsRead: (id) => {
    const all = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  markAllNotificationsAsRead: (role) => {
    const all = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = all.map((n) => (n.recipientRole === role ? { ...n, read: true } : n));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  addNotification: (notif) => {
    const all = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif,
    };
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...all]);
  },

  getAuditLogs: () => getFromStorage(STORAGE_KEYS.AUDIT_LOGS, RECENT_AUDIT_LOGS),

  addAuditLog: (action, target, actor) => {
    const all = getFromStorage(STORAGE_KEYS.AUDIT_LOGS, RECENT_AUDIT_LOGS);
    const newLog = {
      id: `aud-${Date.now()}`,
      action,
      target,
      actor,
      time: 'Just now',
    };
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...all.slice(0, 20)]);
  },
};
