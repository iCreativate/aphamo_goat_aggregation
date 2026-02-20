/**
 * Mobile hamburger menu – toggles nav dropdown, closes on link click or Escape.
 * Include this script on every page that has .menu-trigger and .nav.
 */
(function () {
  function initMenu() {
    var trigger = document.querySelector('.menu-trigger');
    var nav = document.querySelector('.nav');
    if (!trigger || !nav) return;

    trigger.setAttribute('aria-expanded', 'false');

    function closeMenu() {
      nav.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open menu');
    }

    function openMenu() {
      nav.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-label', 'Close menu');
    }

    function toggleMenu() {
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking a nav link (so user can navigate)
    var links = nav.querySelectorAll('.nav__link, .nav__sublink');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        closeMenu();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();
