/**
 * Hub auth – client-side sign-up/sign-in with role-based redirect.
 * Uses localStorage (demo/prototype; use a backend for production).
 */
(function () {
  var USERS_KEY = 'aphamo_hub_users';
  var SESSION_KEY = 'aphamo_hub_session';

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

  function setSession(user) {
    try {
      var roles = getRoles(user);
      var session = { name: user.name, email: user.email, role: roles[0] || 'learner', roles: roles };
      if (user.approvalStatus) session.approvalStatus = user.approvalStatus;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getPortalUrl(role) {
    if (role === 'admin') return '/admin-portal/';
    if (role === 'learner') return '/learner-portal/';
    if (role === 'beneficiary') return '/beneficiary-portal/';
    if (role === 'farmer') return '/goat-listing-portal/';
    return '/the-hub/';
  }

  function register(data) {
    var name = (data.name || '').trim();
    var email = (data.email || '').trim().toLowerCase();
    var roles = Array.isArray(data.roles) ? data.roles : (data.role ? [data.role] : []);
    var password = data.password || '';

    if (!email || !password || !name) {
      return { success: false, message: 'Please fill in name, email, and password.' };
    }
    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters.' };
    }
    roles = roles.map(function (r) { return String(r).toLowerCase(); }).filter(function (r) {
      return r === 'learner' || r === 'beneficiary' || r === 'farmer';
    });
    if (roles.length === 0) roles = ['learner'];

    var users = getUsers();
    if (users.some(function (u) { return (u.email || '').toLowerCase() === email; })) {
      return { success: false, message: 'An account with this email already exists. Sign in instead.' };
    }

    var user = { name: name, email: email, roles: roles, role: roles[0], password: password };
    user.approvalStatus = {};
    roles.forEach(function (r) { user.approvalStatus[r] = 'pending'; });
    users.push(user);
    if (!setUsers(users)) {
      return { success: false, message: 'Could not save account. Try again.' };
    }

    setSession(user);
    return { success: true, role: roles[0], redirectUrl: getPortalUrl(roles[0]) };
  }

  function login(email, password) {
    var em = (email || '').trim().toLowerCase();
    var pw = password || '';

    if (!em || !pw) {
      return { success: false, message: 'Please enter email and password.' };
    }

    var users = getUsers();
    var user = users.filter(function (u) { return (u.email || '').toLowerCase() === em; })[0];
    if (!user) {
      return { success: false, message: 'No account found with this email. Sign up first.' };
    }
    if (user.suspended) {
      return { success: false, message: 'Your account has been suspended. Contact an administrator.' };
    }
    if (user.password !== pw) {
      return { success: false, message: 'Incorrect password.' };
    }

    setSession(user);
    var roles = getRoles(user);
    var primaryRole = roles[0] || 'learner';
    return { success: true, role: primaryRole, roles: roles, redirectUrl: getPortalUrl(primaryRole) };
  }

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function signOut() {
    try {
      localStorage.removeItem(SESSION_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  function updatePassword(currentPassword, newPassword) {
    var session = getCurrentUser();
    if (!session || !session.email) {
      return { success: false, message: 'You must be signed in to change your password.' };
    }
    var pw = newPassword || '';
    if (pw.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters.' };
    }
    var users = getUsers();
    var user = users.filter(function (u) { return (u.email || '').toLowerCase() === (session.email || '').toLowerCase(); })[0];
    if (!user) {
      return { success: false, message: 'Account not found.' };
    }
    if (user.password !== (currentPassword || '')) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    user.password = pw;
    if (!setUsers(users)) {
      return { success: false, message: 'Could not update password. Try again.' };
    }
    return { success: true };
  }

  function updateProfile(data) {
    var session = getCurrentUser();
    if (!session || !session.email) {
      return { success: false, message: 'You must be signed in to update your profile.' };
    }
    var name = (data.name || '').trim();
    var email = (data.email || '').trim().toLowerCase();
    if (!name) {
      return { success: false, message: 'Name is required.' };
    }
    if (!email) {
      return { success: false, message: 'Email is required.' };
    }
    var users = getUsers();
    var user = users.filter(function (u) { return (u.email || '').toLowerCase() === (session.email || '').toLowerCase(); })[0];
    if (!user) {
      return { success: false, message: 'Account not found.' };
    }
    var oldEmail = (user.email || '').toLowerCase();
    if (email !== oldEmail && users.some(function (u) { return (u.email || '').toLowerCase() === email; })) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    user.name = name;
    user.email = email;
    if (!setUsers(users)) {
      return { success: false, message: 'Could not save profile. Try again.' };
    }
    setSession(user);
    return { success: true };
  }

  function hasRole(user, role) {
    if (!user) return false;
    var roles = getRoles(user);
    return roles.indexOf(String(role).toLowerCase()) >= 0;
  }

  function isApproved(user, role) {
    if (!user) return false;
    if (hasRole(user, 'admin')) return true;
    var status = (user.approvalStatus && user.approvalStatus[role]) || user.status || 'approved';
    return status === 'approved';
  }

  function ensureAdminExists() {
    var users = getUsers();
    var hasAdmin = users.some(function (u) { return hasRole(u, 'admin'); });
    if (hasAdmin) return;
    var admin = { name: 'Admin', email: 'admin@aphamo.co.za', roles: ['admin'], role: 'admin', password: 'Admin123!', approvalStatus: { admin: 'approved' } };
    users.push(admin);
    setUsers(users);
  }

  window.AphamoHubAuth = {
    register: register,
    login: login,
    getPortalUrl: getPortalUrl,
    getCurrentUser: getCurrentUser,
    signOut: signOut,
    updatePassword: updatePassword,
    updateProfile: updateProfile,
    hasRole: hasRole,
    getRoles: getRoles,
    isApproved: isApproved,
    ensureAdminExists: ensureAdminExists
  };
})();
