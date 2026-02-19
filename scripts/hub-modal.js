/**
 * The Hub – popup modal: open on link click, close on backdrop/Escape/close btn, login/register toggle
 */
(function () {
  var modal = document.getElementById('hub-modal');
  if (!modal) return;

  var backdrop = modal.querySelector('.hub-modal__backdrop');
  var closeBtn = modal.querySelector('.hub-modal__close');
  var section = modal.querySelector('.learner-hub');
  var panelLogin = modal.querySelector('#hub-modal-panel-login') || modal.querySelector('.learner-hub__panel--login');
  var panelRegister = modal.querySelector('#hub-modal-panel-register') || modal.querySelector('.learner-hub__panel--register');

  function openModal() {
    modal.classList.add('hub-modal--open');
    document.body.classList.add('hub-modal-open');
    modal.setAttribute('aria-hidden', 'false');
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('hub-modal--open');
    document.body.classList.remove('hub-modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('a[href="/the-hub/"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('hub-modal--open')) closeModal();
  });

  if (section) {
    var btnSignUp = modal.querySelector('#hub-modal-show-signup') || modal.querySelector('#learner-show-signup');
    var btnSignIn = modal.querySelector('#hub-modal-show-login') || modal.querySelector('#learner-show-login');
    function showLogin() {
      if (section) section.classList.remove('learner-hub--register');
      if (section) section.classList.add('learner-hub--login');
      if (panelLogin) panelLogin.classList.remove('learner-hub__panel--hidden');
      if (panelRegister) panelRegister.classList.add('learner-hub__panel--hidden');
    }
    function showRegister() {
      if (section) section.classList.remove('learner-hub--login');
      if (section) section.classList.add('learner-hub--register');
      if (panelLogin) panelLogin.classList.add('learner-hub__panel--hidden');
      if (panelRegister) panelRegister.classList.remove('learner-hub__panel--hidden');
    }
    if (btnSignUp) btnSignUp.addEventListener('click', showRegister);
    if (btnSignIn) btnSignIn.addEventListener('click', showLogin);
  }

  var loginForm = modal.querySelector('#hub-modal-login-form') || modal.querySelector('#learner-login-form');
  var registerForm = modal.querySelector('#hub-modal-register-form') || modal.querySelector('#learner-register-form');
  var auth = window.AphamoHubAuth;

  if (loginForm && auth) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!loginForm.checkValidity()) { loginForm.reportValidity(); return; }
      var emailEl = loginForm.querySelector('#hub-modal-login-email') || loginForm.querySelector('#login-email') || document.getElementById('hub-modal-login-email') || document.getElementById('login-email');
      var pwEl = loginForm.querySelector('#hub-modal-login-password') || loginForm.querySelector('#login-password') || document.getElementById('hub-modal-login-password') || document.getElementById('login-password');
      var roleEl = loginForm.querySelector('#hub-modal-login-role') || loginForm.querySelector('#login-role') || document.getElementById('hub-modal-login-role') || document.getElementById('login-role');
      var email = emailEl ? emailEl.value.trim() : '';
      var password = pwEl ? pwEl.value : '';
      var result = auth.login(email, password);
      if (result.success) {
        var role = roleEl && roleEl.value ? roleEl.value : null;
        if (role === 'admin') {
          var sessUser = auth.getCurrentUser();
          if (!auth.hasRole(sessUser, 'admin')) {
            auth.signOut();
            alert('You do not have admin access.');
            return;
          }
        }
        var url = role ? auth.getPortalUrl(role) : result.redirectUrl;
        window.location.href = url;
        return;
      }
      alert(result.message || 'Sign-in failed.');
    });
  }

  if (registerForm && auth) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pwEl = modal.querySelector('#hub-modal-register-password') || modal.querySelector('#register-password');
      var cfEl = modal.querySelector('#hub-modal-register-confirm') || modal.querySelector('#register-confirm');
      if (pwEl && cfEl && pwEl.value !== cfEl.value) {
        cfEl.setCustomValidity('Passwords do not match');
        registerForm.reportValidity();
        return;
      }
      if (cfEl) cfEl.setCustomValidity('');
      if (!registerForm.checkValidity()) { registerForm.reportValidity(); return; }
      var nameEl = modal.querySelector('#hub-modal-register-name') || modal.querySelector('#register-name');
      var emailEl = modal.querySelector('#hub-modal-register-email') || modal.querySelector('#register-email');
      var roleChecks = registerForm.querySelectorAll('input[name="roles"]:checked');
      if (roleChecks.length === 0) roleChecks = registerForm.querySelectorAll('input[name="role"]:checked');
      var roles = Array.prototype.map.call(roleChecks, function (c) { return c.value; });
      if (roles.length === 0) {
        var errEl = modal.querySelector('#hub-modal-register-roles-error') || document.getElementById('register-roles-error');
        if (errEl) { errEl.hidden = false; errEl.textContent = 'Select at least one role.'; }
        return;
      }
      var errEl = modal.querySelector('#hub-modal-register-roles-error') || document.getElementById('register-roles-error');
      if (errEl) errEl.hidden = true;
      var name = nameEl ? nameEl.value : '';
      var email = emailEl ? emailEl.value : '';
      var password = pwEl ? pwEl.value : '';
      var result = auth.register({ name: name, email: email, roles: roles, password: password });
      if (result.success) {
        window.location.href = result.redirectUrl;
        return;
      }
      alert(result.message || 'Registration failed.');
    });
  }
})();
