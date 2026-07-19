/* Tiny Tastes — interactions */
(function () {
  'use strict';

  /* footer year */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- weekly menu board ---- */
  var dataEl = document.getElementById('week-data');
  var tabsEl = document.querySelector('.day-tabs');
  var stageEl = document.querySelector('.day-stage');

  function tagClass(t) {
    return 'tag tag-' + String(t || '').toLowerCase();
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  if (dataEl && tabsEl && stageEl) {
    var week = JSON.parse(dataEl.textContent).days;

    function renderDay(idx) {
      var day = week[idx];
      var items = day.dishes.map(function (d) {
        return '<div class="menu-item"><div class="mi-main"><h4>' + esc(d.t) +
          '</h4><p>' + esc(d.i) + '</p></div>' +
          (d.tag ? '<span class="' + tagClass(d.tag) + '">' + esc(d.tag) + '</span>' : '') +
          '</div>';
      }).join('');
      stageEl.innerHTML =
        '<p class="day-head">On <b>' + esc(day.name) + '</b> you can expect</p>' +
        '<div class="menu-list">' + items + '</div>' +
        '<p class="daily-note">The buffet changes with the day and the season — this is a guide, not a promise. Follow us on Instagram for what\u2019s hot right now.</p>';
      tabsEl.querySelectorAll('.day-tab').forEach(function (b, i) {
        b.classList.toggle('active', i === idx);
        b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    }

    // JS getDay: 0=Sun..6=Sat  ->  our array: 0=Mon..6=Sun
    var jsDay = new Date().getDay();
    var todayIdx = (jsDay + 6) % 7;

    week.forEach(function (day, i) {
      var btn = document.createElement('button');
      btn.className = 'day-tab' + (i === todayIdx ? ' today' : '');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.textContent = day.short;
      btn.addEventListener('click', function () { renderDay(i); });
      tabsEl.appendChild(btn);
    });
    renderDay(todayIdx);
  }

  /* ---- scroll reveals ---- */
  var items = document.querySelectorAll('.reveal, .reveal-up');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
