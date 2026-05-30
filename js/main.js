/* =========================================================
   EDCA — main.js
   Scroll reveals + micro-interactions
   ========================================================= */

(function () {
  'use strict';

  /* -------- Mark as JS-enabled (enables reveal animations in CSS) -------- */
  document.documentElement.classList.add('js');

  /* -------- Nav Scroll State -------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* -------- Scroll reveal with IntersectionObserver --------
     Using IntersectionObserver instead of a scroll event listener is a massive 
     performance boost for production, as it offloads the visibility checks 
     to the browser's native engine. */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target); // Stop observing once revealed to save memory
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el) => io.observe(el));

    /* Immediately reveal anything already in viewport on load
       (fixes hero reveals that might not trigger observer) */
    window.addEventListener('load', () => {
      setTimeout(() => {
        reveals.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('is-in');
          }
        });
      }, 100);
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* -------- Smooth anchor scroll -------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* -------- Mobile burger toggle -------- */
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        links.style.position = 'absolute';
        links.style.top = '100%';
        links.style.left = '0';
        links.style.right = '0';
        links.style.flexDirection = 'column';
        links.style.background = 'var(--bg)';
        links.style.padding = '20px';
        links.style.borderTop = '1px solid var(--rule)';
      }
    });
  }

  /* -------- Subtle parallax on hero image --------
     Wrapped in a matchMedia check to ensure parallax only runs on desktop,
     saving battery and CPU on mobile devices. */
  const heroImg = document.querySelector('.hero__right img');
  if (heroImg && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < 900) {
        heroImg.style.transform = `translateY(${y * 0.08}px) scale(1.02)`;
      }
    }, { passive: true }); // passive: true ensures smooth scrolling is not blocked
  }

  /* -------- Sticker hover wiggle -------- */
  document.querySelectorAll('.hero__sticker').forEach((el) => {
    const initialRotation = el.classList.contains('hero__sticker--2') ? 4 : -6;
    el.addEventListener('mouseenter', () => {
      el.style.transform = `rotate(${initialRotation * -1}deg) scale(1.05)`;
      el.style.transition = 'transform 0.3s cubic-bezier(.22,.61,.36,1)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = `rotate(${initialRotation}deg) scale(1)`;
    });
  });

  /* -------- Dynamic year on footer -------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------- Stores map interactivity -------- */
  const mapPins = document.querySelectorAll('.city-pin');
  const cityNameBtns = document.querySelectorAll('.city-col__name');
  const cityCols = document.querySelectorAll('.city-col');

  function activateCity(cityKey) {
    // Update pins
    mapPins.forEach((pin) => {
      pin.classList.toggle('is-active', pin.dataset.city === cityKey);
    });
    // Update city columns
    cityCols.forEach((col) => {
      const isActive = col.dataset.city === cityKey;
      col.classList.toggle('is-active', isActive);
      col.classList.toggle('is-dimmed', cityKey !== null && !isActive);
    });
  }

  function clearActive() {
    mapPins.forEach((pin) => pin.classList.remove('is-active'));
    cityCols.forEach((col) => {
      col.classList.remove('is-active', 'is-dimmed');
    });
  }

  // Pin clicks
  mapPins.forEach((pin) => {
    pin.addEventListener('click', () => {
      const city = pin.dataset.city;
      const isAlreadyActive = pin.classList.contains('is-active');
      if (isAlreadyActive) {
        clearActive();
      } else {
        activateCity(city);
        // Scroll the matching city column into view on mobile
        const col = document.querySelector(`.city-col[data-city="${city}"]`);
        if (col && window.innerWidth < 800) {
          col.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pin.click();
      }
    });
  });

  // City name button clicks
  cityNameBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      const col = btn.closest('.city-col');
      const isAlreadyActive = col && col.classList.contains('is-active');
      if (isAlreadyActive) {
        clearActive();
      } else {
        activateCity(city);
      }
    });
  });

  /* -------- Custom Skate Cursor -------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    /* Isometric view — nose (upper-right corner of deck) is the hotspot */
    const NOSE_X   = 47;
    const NOSE_Y   = 6;
    const GRIND_PX = 48;
    const LERP     = 0.22;

    const cursorEl = document.createElement('div');
    cursorEl.id = 'skate-cursor';
    /* Board at ~31° angle (lower-left tail → upper-right nose), 56×46 px */
    cursorEl.innerHTML = `
      <svg class="skate-board" width="56" height="46" viewBox="0 0 56 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Inner wheels — drawn first so the deck overlaps them (behind effect) -->
        <g class="skate-wheel" data-tx="9" data-ty="26" transform="translate(9,26)">
          <circle r="4" fill="#b53368" stroke="#7a1f4a" stroke-width="0.4"/>
          <circle r="1.5" fill="#7a1540"/>
          <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#5a0828" stroke-width="0.7"/>
          <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#5a0828" stroke-width="0.7"/>
          <line x1="-2.5" y1="-2.5" x2="2.5" y2="2.5" stroke="#4a0020" stroke-width="0.6"/>
          <line x1="2.5" y1="-2.5" x2="-2.5" y2="2.5" stroke="#4a0020" stroke-width="0.6"/>
        </g>
        <g class="skate-wheel" data-tx="38" data-ty="9" transform="translate(38,9)">
          <circle r="4" fill="#b53368" stroke="#7a1f4a" stroke-width="0.4"/>
          <circle r="1.5" fill="#7a1540"/>
          <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#5a0828" stroke-width="0.7"/>
          <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#5a0828" stroke-width="0.7"/>
          <line x1="-2.5" y1="-2.5" x2="2.5" y2="2.5" stroke="#4a0020" stroke-width="0.6"/>
          <line x1="2.5" y1="-2.5" x2="-2.5" y2="2.5" stroke="#4a0020" stroke-width="0.6"/>
        </g>
        <!-- Deck side edge (thin wood strip for depth illusion) -->
        <polygon points="8,43 53,16 55,19 10,46" fill="#9a7030"/>
        <!-- Deck top face — maple wood color -->
        <polygon points="2,33 8,43 53,16 47,6" fill="#c8a05a"/>
        <!-- Grip tape layer — slightly inset leaving a maple border -->
        <polygon points="3,32 8,42 52,15 47,7" fill="#1c1c1c"/>
        <!-- EDCA brand rotated to follow the board's 31° axis -->
        <text x="28" y="27" text-anchor="middle"
              font-family="Bebas Neue,Impact,sans-serif"
              font-size="8.5" fill="#9E3E33" opacity="0.95"
              transform="rotate(-31,28,27)">EDCA</text>
        <!-- Outer wheels — drawn last so they appear in front of the deck -->
        <g class="skate-wheel" data-tx="17" data-ty="40" transform="translate(17,40)">
          <circle r="5" fill="#E05A8E" stroke="#b83d6e" stroke-width="0.5"/>
          <circle r="1.8" fill="#c03070"/>
          <line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#9a1f5a" stroke-width="0.9"/>
          <line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#9a1f5a" stroke-width="0.9"/>
          <line x1="-3.2" y1="-3.2" x2="3.2" y2="3.2" stroke="#8a1050" stroke-width="0.7"/>
          <line x1="3.2" y1="-3.2" x2="-3.2" y2="3.2" stroke="#8a1050" stroke-width="0.7"/>
        </g>
        <g class="skate-wheel" data-tx="45" data-ty="22" transform="translate(45,22)">
          <circle r="5" fill="#E05A8E" stroke="#b83d6e" stroke-width="0.5"/>
          <circle r="1.8" fill="#c03070"/>
          <line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#9a1f5a" stroke-width="0.9"/>
          <line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#9a1f5a" stroke-width="0.9"/>
          <line x1="-3.2" y1="-3.2" x2="3.2" y2="3.2" stroke="#8a1050" stroke-width="0.7"/>
          <line x1="3.2" y1="-3.2" x2="-3.2" y2="3.2" stroke="#8a1050" stroke-width="0.7"/>
        </g>
      </svg>
    `;
    document.body.appendChild(cursorEl);

    const boardEl   = cursorEl.querySelector('.skate-board');
    const wheelEls  = Array.from(cursorEl.querySelectorAll('.skate-wheel'));
    const wheelBase = wheelEls.map(w => ({
      tx: parseFloat(w.dataset.tx),
      ty: parseFloat(w.dataset.ty)
    }));

    let mx = 0, my = 0, cx = 0, cy = 0;
    let vx = 0, vy = 0;
    let wAngle = 0, boardTilt = 0, sparkClock = 0;
    let firstMove = true;

    function setWheelAngle(a) {
      wheelEls.forEach(function(el, i) {
        el.setAttribute('transform', `translate(${wheelBase[i].tx},${wheelBase[i].ty}) rotate(${a})`);
      });
    }

    function spawnSpark(sx, sy) {
      const s = document.createElement('div');
      s.className = 'skate-spark';
      const sz = 1.5 + Math.random() * 2.5;
      s.style.cssText = `width:${sz}px;height:${sz}px;left:${sx}px;top:${sy}px;`;
      document.body.appendChild(s);
      /* Sparks fly upward-ish with random spread — friction direction */
      const ang  = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      const dist = 8 + Math.random() * 24;
      const dx   = Math.cos(ang) * dist;
      const dy   = Math.sin(ang) * dist;
      const anim = s.animate(
        [{ opacity: 1, transform: 'translate(0,0) scale(1)' },
         { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(0.1)` }],
        { duration: 250 + Math.random() * 200, easing: 'ease-out', fill: 'forwards' }
      );
      anim.onfinish = () => s.remove();
    }

    /* Returns grind info if cursor is near an image edge, otherwise null */
    function detectGrind(x, y) {
      let best = null, bestD = GRIND_PX;
      document.querySelectorAll('img').forEach(function(img) {
        const r = img.getBoundingClientRect();
        if (r.width < 80 || r.height < 80) return; // skip nav logo and tiny images

        /* Horizontal edges (top / bottom of image) */
        if (x >= r.left - 20 && x <= r.right + 20) {
          const dT = Math.abs(y - r.top);
          const dB = Math.abs(y - r.bottom);
          if (dT < bestD) { bestD = dT; best = { axis: 'h', snap: r.top,    tilt: -7 }; }
          if (dB < bestD) { bestD = dB; best = { axis: 'h', snap: r.bottom, tilt:  7 }; }
        }

        /* Vertical edges (left / right of image) */
        if (y >= r.top - 20 && y <= r.bottom + 20) {
          const dL = Math.abs(x - r.left);
          const dR = Math.abs(x - r.right);
          if (dL < bestD) { bestD = dL; best = { axis: 'v', snap: r.left,  tilt: 0 }; }
          if (dR < bestD) { bestD = dR; best = { axis: 'v', snap: r.right, tilt: 0 }; }
        }
      });
      return best;
    }

    function tick() {
      /* Smooth cursor toward mouse */
      cx += (mx - cx) * LERP;
      cy += (my - cy) * LERP;

      const grind    = detectGrind(mx, my);
      const grinding = !!grind;
      cursorEl.classList.toggle('is-grinding', grinding);

      /* Apply magnetic pull toward edge */
      let rx = cx, ry = cy;
      let targetTilt = 0;
      if (grind) {
        if (grind.axis === 'h') ry += (grind.snap - cy) * 0.5;
        else                    rx += (grind.snap - cx) * 0.5;
        targetTilt = grind.tilt;
      }

      /* Lerp board tilt */
      boardTilt += (targetTilt - boardTilt) * 0.14;

      /* Position cursor div so the board nose (upper-right corner) sits at (rx, ry) */
      cursorEl.style.transform = `translate3d(${rx - NOSE_X}px,${ry - NOSE_Y}px,0)`;
      boardEl.style.transform  = `rotate(${boardTilt.toFixed(2)}deg)`;

      /* Wheel spin — faster during grind */
      const speed = Math.sqrt(vx * vx + vy * vy);
      wAngle = (wAngle + (grinding ? Math.max(speed, 3) * 2.5 : speed * 2)) % 360;
      setWheelAngle(wAngle.toFixed(1));

      /* Spark particles while actively grinding and moving */
      if (grinding && speed > 1.5) {
        sparkClock++;
        if (sparkClock % 4 === 0) {
          /* Spawn at front outer wheel screen position */
          spawnSpark(rx - NOSE_X + 45, ry - NOSE_Y + 22);
        }
      } else {
        sparkClock = 0;
      }

      requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', function(e) {
      if (firstMove) { cx = e.clientX; cy = e.clientY; firstMove = false; }
      vx = e.clientX - mx;
      vy = e.clientY - my;
      mx = e.clientX;
      my = e.clientY;
      cursorEl.classList.add('is-visible');
    }, { passive: true });

    document.addEventListener('mouseleave', function() { cursorEl.classList.remove('is-visible'); });
    document.addEventListener('mouseenter', function() { cursorEl.classList.add('is-visible'); });

    requestAnimationFrame(tick);
  }

})();
