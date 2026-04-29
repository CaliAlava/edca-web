/* =========================================================
   EDCA — main.js
   Scroll reveals + micro-interactions
   ========================================================= */

(function () {
  'use strict';

  /* -------- Mark as JS-enabled (enables reveal animations in CSS) -------- */
  document.documentElement.classList.add('js');

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

})();
