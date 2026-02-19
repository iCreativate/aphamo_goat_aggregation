/**
 * Admin data – courses, approvals, payments, progress. Uses localStorage (prototype).
 */
(function () {
  var COURSES_KEY = 'aphamo_admin_courses';
  var USERS_KEY = 'aphamo_hub_users';
  var PAYMENTS_KEY = 'aphamo_payments';
  var PROGRESS_KEY = 'aphamo_progress';
  var LISTINGS_KEY = 'aphamo_goat_listings';

  function getCourses() {
    try {
      var raw = localStorage.getItem(COURSES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setCourses(courses) {
    try {
      localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getRoles(user) {
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles.map(function (r) { return String(r).toLowerCase(); });
    }
    if (user.role) return [String(user.role).toLowerCase()];
    return [];
  }

  function hasRole(user, role) {
    return getRoles(user).indexOf(String(role).toLowerCase()) >= 0;
  }

  function getStatus(user, role) {
    var key = 'approval_' + role;
    if (user[key]) return user[key];
    if (user.approvalStatus && user.approvalStatus[role]) return user.approvalStatus[role];
    return user.status || 'approved';
  }

  window.AphamoAdminData = {
    getCourses: getCourses,
    addCourse: function (course) {
      var courses = getCourses();
      var id = 'c_' + Date.now();
      courses.push({
        id: id,
        title: course.title || '',
        description: course.description || '',
        videoUrl: course.videoUrl || '',
        materials: course.materials || [],
        locked: !!course.locked,
        published: !!course.published,
        createdAt: new Date().toISOString(),
        modules: course.modules || [],
        quizzes: course.quizzes || [],
        assessments: course.assessments || [],
        assignments: course.assignments || [],
        tests: course.tests || []
      });
      return setCourses(courses) ? id : null;
    },
    updateCourse: function (id, updates) {
      var courses = getCourses();
      var idx = courses.findIndex(function (c) { return c.id === id; });
      if (idx < 0) return false;
      if (updates.title !== undefined) courses[idx].title = updates.title;
      if (updates.description !== undefined) courses[idx].description = updates.description;
      if (updates.videoUrl !== undefined) courses[idx].videoUrl = updates.videoUrl;
      if (updates.materials !== undefined) courses[idx].materials = updates.materials;
      if (updates.locked !== undefined) courses[idx].locked = !!updates.locked;
      if (updates.published !== undefined) courses[idx].published = !!updates.published;
      if (updates.modules !== undefined) courses[idx].modules = updates.modules;
      if (updates.quizzes !== undefined) courses[idx].quizzes = updates.quizzes;
      if (updates.assessments !== undefined) courses[idx].assessments = updates.assessments;
      if (updates.assignments !== undefined) courses[idx].assignments = updates.assignments;
      if (updates.tests !== undefined) courses[idx].tests = updates.tests;
      return setCourses(courses);
    },
    deleteCourse: function (id) {
      var courses = getCourses().filter(function (c) { return c.id !== id; });
      return setCourses(courses);
    },
    getUsersByRole: function (role) {
      return getUsers().filter(function (u) {
        if (hasRole(u, 'admin')) return false;
        return hasRole(u, role);
      });
    },
    getPendingByRole: function (role) {
      return getUsers().filter(function (u) {
        if (hasRole(u, 'admin')) return false;
        if (!hasRole(u, role)) return false;
        return getStatus(u, role) === 'pending';
      });
    },
    approveUser: function (email, role) {
      var users = getUsers();
      var user = users.find(function (u) { return (u.email || '').toLowerCase() === (email || '').toLowerCase(); });
      if (!user) return false;
      user.approvalStatus = user.approvalStatus || {};
      user.approvalStatus[role] = 'approved';
      if (user['approval_' + role] !== undefined) user['approval_' + role] = 'approved';
      return setUsers(users);
    },
    rejectUser: function (email, role) {
      var users = getUsers();
      var user = users.find(function (u) { return (u.email || '').toLowerCase() === (email || '').toLowerCase(); });
      if (!user) return false;
      user.approvalStatus = user.approvalStatus || {};
      user.approvalStatus[role] = 'rejected';
      return setUsers(users);
    },
    getNonAdminUsers: function () {
      return getUsers().filter(function (u) { return !hasRole(u, 'admin'); });
    },
    addUser: function (data) {
      var name = (data.name || '').trim();
      var email = (data.email || '').trim().toLowerCase();
      var roles = Array.isArray(data.roles) ? data.roles : (data.role ? [data.role] : []);
      var password = data.password || '';

      if (!email || !password || !name) return { success: false, message: 'Name, email, and password are required.' };
      if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };
      roles = roles.map(function (r) { return String(r).toLowerCase(); }).filter(function (r) {
        return r === 'learner' || r === 'beneficiary' || r === 'farmer';
      });
      if (roles.length === 0) roles = ['learner'];

      var users = getUsers();
      if (users.some(function (u) { return (u.email || '').toLowerCase() === email; })) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      var user = { name: name, email: email, roles: roles, role: roles[0], password: password };
      user.approvalStatus = {};
      var autoApprove = !!data.autoApprove;
      roles.forEach(function (r) { user.approvalStatus[r] = autoApprove ? 'approved' : 'pending'; });
      users.push(user);
      return setUsers(users) ? { success: true } : { success: false, message: 'Could not save user.' };
    },
    deleteUser: function (email) {
      var users = getUsers();
      var filtered = users.filter(function (u) {
        return (u.email || '').toLowerCase() !== (email || '').toLowerCase();
      });
      if (filtered.length === users.length) return false;
      return setUsers(filtered);
    },
    suspendUser: function (email) {
      var users = getUsers();
      var user = users.find(function (u) { return (u.email || '').toLowerCase() === (email || '').toLowerCase(); });
      if (!user || hasRole(user, 'admin')) return false;
      user.suspended = true;
      return setUsers(users);
    },
    unsuspendUser: function (email) {
      var users = getUsers();
      var user = users.find(function (u) { return (u.email || '').toLowerCase() === (email || '').toLowerCase(); });
      if (!user) return false;
      user.suspended = false;
      return setUsers(users);
    },

    getPayments: function () {
      try {
        var raw = localStorage.getItem(PAYMENTS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    },
    setPayments: function (payments) {
      try {
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
        return true;
      } catch (e) { return false; }
    },
    recordPayment: function (email, courseId, amount) {
      var payments = this.getPayments();
      var em = (email || '').toLowerCase();
      if (payments.some(function (p) { return (p.email || '').toLowerCase() === em && p.courseId === courseId; })) return false;
      payments.push({ email: em, courseId: courseId || null, amount: amount || 0, date: new Date().toISOString() });
      return this.setPayments(payments);
    },
    getLearnersWithPayments: function (courseId) {
      var payments = this.getPayments();
      var learners = this.getUsersByRole('learner').filter(function (u) { return !u.suspended; });
      var paidEmails = {};
      payments.forEach(function (p) {
        if (!courseId || p.courseId === courseId) paidEmails[(p.email || '').toLowerCase()] = true;
      });
      return learners.filter(function (u) { return paidEmails[(u.email || '').toLowerCase()]; });
    },
    getLearnersWithoutPayments: function (courseId) {
      var paid = this.getLearnersWithPayments(courseId);
      var paidSet = {};
      paid.forEach(function (u) { paidSet[(u.email || '').toLowerCase()] = true; });
      return this.getUsersByRole('learner').filter(function (u) {
        return !u.suspended && !paidSet[(u.email || '').toLowerCase()];
      });
    },
    hasPaid: function (email, courseId) {
      var payments = this.getPayments();
      var em = (email || '').toLowerCase();
      return payments.some(function (p) {
        if ((p.email || '').toLowerCase() !== em) return false;
        if (!courseId) return true;
        return p.courseId === courseId || !p.courseId;
      });
    },

    getProgress: function () {
      try {
        var raw = localStorage.getItem(PROGRESS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    },
    setProgress: function (progress) {
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        return true;
      } catch (e) { return false; }
    },
    saveProgress: function (email, courseId, percent, modulesCompleted) {
      var progress = this.getProgress();
      var em = (email || '').toLowerCase();
      var idx = progress.findIndex(function (p) { return (p.email || '').toLowerCase() === em && p.courseId === courseId; });
      var entry = { email: em, courseId: courseId, percent: percent || 0, modulesCompleted: modulesCompleted || 0, lastUpdated: new Date().toISOString() };
      if (idx >= 0) progress[idx] = entry;
      else progress.push(entry);
      return this.setProgress(progress);
    },
    getProgressForUser: function (email) {
      return this.getProgress().filter(function (p) { return (p.email || '').toLowerCase() === (email || '').toLowerCase(); });
    },
    getAllProgressSummary: function () {
      var progress = this.getProgress();
      var learners = this.getUsersByRole('learner').filter(function (u) {
        var s = (u.approvalStatus && u.approvalStatus.learner) || 'approved';
        return s === 'approved' && !u.suspended;
      });
      var userMap = {};
      learners.forEach(function (u) {
        var em = (u.email || '').toLowerCase();
        userMap[em] = { email: em, name: u.name || em, courses: [], avgPercent: 0 };
      });
      progress.forEach(function (p) {
        var em = (p.email || '').toLowerCase();
        if (!userMap[em]) userMap[em] = { email: em, name: em, courses: [], avgPercent: 0 };
        userMap[em].courses.push({ courseId: p.courseId, percent: p.percent, modulesCompleted: p.modulesCompleted });
      });
      Object.keys(userMap).forEach(function (em) {
        var c = userMap[em].courses;
        userMap[em].avgPercent = c.length ? Math.round(c.reduce(function (s, x) { return s + x.percent; }, 0) / c.length) : 0;
      });
      return Object.keys(userMap).map(function (em) { return userMap[em]; });
    },

    getAnalytics: function () {
      var users = getUsers().filter(function (u) { return !hasRole(u, 'admin') && !u.suspended; });
      var learners = users.filter(function (u) { return hasRole(u, 'learner'); });
      var farmers = users.filter(function (u) { return hasRole(u, 'farmer'); });
      var beneficiaries = users.filter(function (u) { return hasRole(u, 'beneficiary'); });
      var paidLearners = this.getLearnersWithPayments();
      var unpaidLearners = this.getLearnersWithoutPayments();
      return {
        totalUsers: users.length,
        learners: learners.length,
        farmers: farmers.length,
        beneficiaries: beneficiaries.length,
        learnersPaid: paidLearners.length,
        learnersUnpaid: unpaidLearners.length,
        paidLearners: paidLearners,
        unpaidLearners: unpaidLearners
      };
    },

    getListings: function () {
      try {
        var raw = localStorage.getItem(LISTINGS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },
    setListings: function (listings) {
      try {
        localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
        return true;
      } catch (e) {
        return false;
      }
    },
    addListing: function (data) {
      var listings = this.getListings();
      var id = 'lst_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
      var listing = {
        id: id,
        farmerEmail: (data.farmerEmail || '').toLowerCase().trim(),
        farmerName: data.farmerName || '',
        title: (data.title || '').trim(),
        breed: (data.breed || '').trim(),
        quantity: typeof data.quantity === 'number' ? data.quantity : parseInt(data.quantity, 10) || 0,
        price: (data.price || '').trim(),
        location: (data.location || '').trim(),
        description: (data.description || '').trim(),
        photoUrls: Array.isArray(data.photoUrls) ? data.photoUrls : (data.photoUrl ? [data.photoUrl] : []),
        status: 'pending',
        listingRating: null,
        criteriaMeets: null,
        adminNotes: '',
        createdAt: new Date().toISOString(),
        approvedAt: null,
        approvedBy: null
      };
      listings.push(listing);
      return this.setListings(listings) ? id : null;
    },
    updateListing: function (id, updates) {
      var listings = this.getListings();
      var idx = listings.findIndex(function (l) { return l.id === id; });
      if (idx < 0) return false;
      if (updates.status !== undefined) listings[idx].status = updates.status;
      if (updates.listingRating !== undefined) listings[idx].listingRating = updates.listingRating;
      if (updates.criteriaMeets !== undefined) listings[idx].criteriaMeets = updates.criteriaMeets;
      if (updates.adminNotes !== undefined) listings[idx].adminNotes = updates.adminNotes;
      if (updates.approvedAt !== undefined) listings[idx].approvedAt = updates.approvedAt;
      if (updates.approvedBy !== undefined) listings[idx].approvedBy = updates.approvedBy;
      return this.setListings(listings);
    },
    getListingsByStatus: function (status) {
      return this.getListings().filter(function (l) { return l.status === status; });
    },
    getListingsByFarmer: function (email) {
      var em = (email || '').toLowerCase();
      return this.getListings().filter(function (l) { return (l.farmerEmail || '').toLowerCase() === em; });
    }
  };
})();
