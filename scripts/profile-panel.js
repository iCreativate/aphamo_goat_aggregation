/**
 * Profile & settings panel – shared across beneficiary, learner, and goat-listing portals.
 * Requires hub-auth.js. Call AphamoProfilePanel.init() after DOM ready and when panel is shown.
 */
(function () {
  var PROFILE_PHOTO_KEY = 'aphamo_profile_photo';
  var PROFILE_SETTINGS_KEY = 'aphamo_profile_settings';

  function getPhotoKey(email) {
    return PROFILE_PHOTO_KEY + '_' + (email || '').replace(/[^a-z0-9]/gi, '');
  }

  function getSettingsKey(email) {
    return PROFILE_SETTINGS_KEY + '_' + (email || '').replace(/[^a-z0-9]/gi, '');
  }

  function populateProfile(auth) {
    if (!auth || !auth.getCurrentUser) return;
    var user = auth.getCurrentUser();
    var nameEl = document.getElementById('profile-name');
    var emailEl = document.getElementById('profile-email');
    var nameInput = document.getElementById('profile-name-input');
    var emailInput = document.getElementById('profile-email-input');
    var avatarImg = document.getElementById('profile-avatar');
    var avatarPlaceholder = document.getElementById('profile-avatar-placeholder');
    if (user) {
      var name = user.name || user.email || 'User';
      var email = user.email || '';
      if (nameEl) nameEl.textContent = name;
      if (emailEl) emailEl.textContent = email;
      if (nameInput) nameInput.value = name;
      if (emailInput) emailInput.value = email;
      var photo = null;
      try {
        photo = localStorage.getItem(getPhotoKey(email));
      } catch (e) {}
      if (avatarImg && avatarPlaceholder) {
        if (photo) {
          avatarImg.src = photo;
          avatarImg.style.display = '';
          avatarPlaceholder.style.display = 'none';
          avatarImg.alt = name;
        } else {
          avatarImg.src = '';
          avatarImg.style.display = 'none';
          avatarPlaceholder.style.display = '';
          avatarPlaceholder.textContent = (name.charAt(0) || '?').toUpperCase();
        }
      }
    } else {
      if (nameEl) nameEl.textContent = '—';
      if (emailEl) emailEl.textContent = '—';
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (avatarImg && avatarPlaceholder) {
        avatarImg.src = '';
        avatarImg.style.display = 'none';
        avatarPlaceholder.style.display = '';
        avatarPlaceholder.textContent = '?';
      }
    }
  }

  function loadSettings(auth) {
    if (!auth || !auth.getCurrentUser) return;
    var user = auth.getCurrentUser();
    var email = (user && user.email) || '';
    try {
      var raw = localStorage.getItem(getSettingsKey(email));
      var settings = raw ? JSON.parse(raw) : {};
      var notif = document.getElementById('setting-email-notifications');
      var digest = document.getElementById('setting-activity-digest');
      if (notif) notif.checked = settings.emailNotifications !== false;
      if (digest) digest.checked = !!settings.activityDigest;
    } catch (e) {}
  }

  function saveSettings(auth) {
    if (!auth || !auth.getCurrentUser) return;
    var user = auth.getCurrentUser();
    var email = (user && user.email) || '';
    var notif = document.getElementById('setting-email-notifications');
    var digest = document.getElementById('setting-activity-digest');
    var settings = {
      emailNotifications: notif ? notif.checked : true,
      activityDigest: digest ? !!digest.checked : false
    };
    try {
      localStorage.setItem(getSettingsKey(email), JSON.stringify(settings));
    } catch (e) {}
  }

  var initDone = false;

  function init(auth) {
    auth = auth || window.AphamoHubAuth;
    if (!auth) return;

    populateProfile(auth);
    loadSettings(auth);

    if (initDone) return;
    initDone = true;

    var photoInput = document.getElementById('profile-photo-input');
    if (photoInput) {
      photoInput.addEventListener('change', function () {
        var file = photoInput.files && photoInput.files[0];
        if (!file || !file.type.match(/^image\//)) return;
        var reader = new FileReader();
        reader.onload = function () {
          var dataUrl = reader.result;
          var user = auth.getCurrentUser();
          var email = (user && user.email) || '';
          try {
            localStorage.setItem(getPhotoKey(email), dataUrl);
          } catch (e) {
            return;
          }
          var avatarImg = document.getElementById('profile-avatar');
          var avatarPlaceholder = document.getElementById('profile-avatar-placeholder');
          if (avatarImg && avatarPlaceholder) {
            avatarImg.src = dataUrl;
            avatarImg.style.display = '';
            avatarPlaceholder.style.display = 'none';
            avatarImg.alt = (user && user.name) || 'Profile';
          }
        };
        reader.readAsDataURL(file);
      });
    }

    var profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameInput = document.getElementById('profile-name-input');
        var emailInput = document.getElementById('profile-email-input');
        if (!nameInput || !emailInput) return;
        var result = auth.updateProfile({
          name: nameInput.value.trim(),
          email: emailInput.value.trim().toLowerCase()
        });
        if (result.success) {
          populateProfile(auth);
          var nameEl = document.getElementById('profile-name');
          var emailEl = document.getElementById('profile-email');
          if (nameEl) nameEl.textContent = nameInput.value.trim() || '—';
          if (emailEl) emailEl.textContent = emailInput.value.trim() || '—';
          var dashboardName = document.getElementById('portal-dashboard-name');
          if (dashboardName) dashboardName.textContent = nameInput.value.trim() || 'User';
          alert('Profile updated successfully.');
        } else {
          alert(result.message || 'Could not update profile.');
        }
      });
    }

    var passwordForm = document.getElementById('profile-password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var current = document.getElementById('profile-current-password');
        var newPw = document.getElementById('profile-new-password');
        var confirm = document.getElementById('profile-confirm-password');
        if (!current || !newPw || !confirm) return;
        if (newPw.value !== confirm.value) {
          alert('New password and confirm password do not match.');
          return;
        }
        var result = auth.updatePassword(current.value, newPw.value);
        if (result.success) {
          passwordForm.reset();
          alert('Password updated successfully.');
        } else {
          alert(result.message || 'Could not update password.');
        }
      });
    }

    var notif = document.getElementById('setting-email-notifications');
    var digest = document.getElementById('setting-activity-digest');
    function persistSettings() {
      saveSettings(auth);
    }
    if (notif) notif.addEventListener('change', persistSettings);
    if (digest) digest.addEventListener('change', persistSettings);
  }

  function refresh() {
    init(window.AphamoHubAuth);
  }

  window.AphamoProfilePanel = {
    init: init,
    refresh: refresh,
    populateProfile: function () { populateProfile(window.AphamoHubAuth); }
  };
})();
