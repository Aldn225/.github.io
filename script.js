/* ============================================================
   John Doe — Portfolio scripts
   Sticky nav, mobile menu, typed hero, canvas mesh background,
   scroll reveal, animated skill bars, stat counters,
   project filtering, contact form validation.
   ============================================================ */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Current year in footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('site-header');
  function onScrollHeader() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', function () {
    var open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navMenu.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Active nav link on scroll (scroll-spy) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function updateActiveLink() {
    var pos = window.scrollY + 120;
    var currentId = sections.length ? sections[0].id : null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) currentId = sections[i].id;
    }
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- Typed hero role ---------- */
  var typedEl = document.getElementById('typed-role');
  var roles = ['IT Support', 'Network Engineering', 'Web Development', 'System Uptime'];
  var roleIdx = 0, charIdx = 0, deleting = false;

  function typeTick() {
    var word = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      typedEl.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeTick, 1600);
        return;
      }
      setTimeout(typeTick, 75);
    } else {
      charIdx--;
      typedEl.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
      setTimeout(typeTick, 40);
    }
  }
  if (!prefersReducedMotion) typeTick();
  else typedEl.textContent = roles.join(' · ');

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Skill bars ---------- */
  var skills = document.querySelectorAll('.skill');
  function animateSkill(skill) {
    var level = skill.getAttribute('data-level');
    var fill = skill.querySelector('.skill-fill');
    fill.style.width = level + '%';
  }
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateSkill(entry.target);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skills.forEach(function (s) { skillObserver.observe(s); });
  } else {
    skills.forEach(animateSkill);
  }

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll('.stat-num');
  function animateStat(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    var duration = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (s) { statObserver.observe(s); });
  } else {
    stats.forEach(animateStat);
  }

  /* ---------- Project filtering ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');

      projectCards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !match);
        card.classList.remove('pop');
        if (match) {
          void card.offsetWidth; // restart animation
          card.classList.add('pop');
        }
      });
    });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  function setError(field, on) {
    field.classList.toggle('error', on);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name;
    var email = form.email;
    var message = form.message;
    var valid = true;

    [name, email, message].forEach(function (f) { setError(f, false); });
    status.textContent = '';
    status.className = 'form-status';

    if (!name.value.trim()) { setError(name, true); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, true); valid = false; }
    if (!message.value.trim()) { setError(message, true); valid = false; }

    if (!valid) {
      status.textContent = 'Please fill in the highlighted fields correctly.';
      status.classList.add('fail');
      return;
    }

    // Demo-only: no backend wired up — confirm locally.
    status.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] +
      '! Your message has been noted. I\'ll get back to you within one business day.';
    status.classList.add('success');
    form.reset();
  });

  /* ---------- Network-mesh background canvas ---------- */
  var canvas = document.getElementById('bg-canvas');
  var ctx = canvas.getContext('2d');
  var nodes = [];
  var mouse = { x: -9999, y: -9999 };
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seedNodes();
  }

  function seedNodes() {
    var count = Math.min(90, Math.floor(window.innerWidth / 16));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8
      });
    }
  }

  function drawMesh() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var linkDist = 130;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > window.innerWidth) n.vx *= -1;
      if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;

      // Mouse gentle attraction
      var dxm = mouse.x - n.x, dym = mouse.y - n.y;
      var dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 160 && dm > 0.001) {
        n.x += (dxm / dm) * 0.25;
        n.y += (dym / dm) * 0.25;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.fill();

      for (var j = i + 1; j < nodes.length; j++) {
        var m = nodes[j];
        var dx = n.x - m.x, dy = n.y - m.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          var alpha = (1 - dist / linkDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = 'rgba(52, 211, 153, ' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawMesh);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  if (!prefersReducedMotion) {
    resizeCanvas();
    drawMesh();
  } else {
    resizeCanvas();
  }
})();
