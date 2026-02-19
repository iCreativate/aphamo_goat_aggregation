/**
 * Portal switcher – for users with multiple roles. Shows a dropdown to switch between portals.
 */
(function () {
  var ROLE_CONFIG = {
    learner: { url: '/learner-portal/', label: 'Learner Portal' },
    beneficiary: { url: '/beneficiary-portal/', label: 'Beneficiary Portal' },
    farmer: { url: '/goat-listing-portal/', label: 'Goat Listing Portal' }
  };

  function getCurrentPortal() {
    var path = window.location.pathname || '';
    if (path.indexOf('/learner-portal') >= 0) return 'learner';
    if (path.indexOf('/beneficiary-portal') >= 0) return 'beneficiary';
    if (path.indexOf('/goat-listing-portal') >= 0) return 'farmer';
    return null;
  }

  function init() {
    var auth = window.AphamoHubAuth;
    if (!auth) return;
    var user = auth.getCurrentUser();
    if (!user) return;
    var roles = auth.getRoles ? auth.getRoles(user) : (user.roles || (user.role ? [user.role] : []));
    if (roles.length < 2) return;

    var container = document.getElementById('portal-switcher');
    var select = document.getElementById('portal-switcher-select');
    if (!container || !select) return;

    var current = getCurrentPortal();
    var opts = [];
    Object.keys(ROLE_CONFIG).forEach(function (role) {
      if (roles.indexOf(role) < 0) return;
      var cfg = ROLE_CONFIG[role];
      if (role === current) return;
      opts.push({ value: cfg.url, label: cfg.label });
    });

    if (opts.length === 0) return;

    select.innerHTML = '<option value="">Other portals</option>';
    opts.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      var url = select.value;
      if (url) window.location.href = url;
    });

    container.hidden = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
