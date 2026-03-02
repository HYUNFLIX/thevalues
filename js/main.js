/* ===================================================
   THE VALUES - main.js
   Animations, Interactions, Typing Effects
   =================================================== */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('active');
    if (hamburger.classList.contains('active')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });
}

// ===== HERO TYPING ANIMATION =====
const phrases = [
  '자기 고유의 가치관을 가지게 하는 것',
  '더 나은 조직문화를 만들어 갑니다',
  'ESG 경영 전략을 실현합니다',
  'DEI 혁신을 이끌어 갑니다',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];
  const displayed = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  typedEl.textContent = displayed;

  if (isDeleting) {
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
      return;
    }
    setTimeout(type, 40);
  } else {
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 2200);
      return;
    }
    setTimeout(type, 65);
  }
}

// Start typing after a brief delay
if (typedEl) {
  setTimeout(type, 1000);
}

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 1.5;   // 1.5 ~ 5.5 px
    const left = Math.random() * 100;        // 0 ~ 100%
    const dur = Math.random() * 12 + 10;    // 10 ~ 22s
    const del = Math.random() * 15;         // 0 ~ 15s delay

    p.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${left}%;
      bottom: -10px;
      animation-duration: ${dur}s;
      animation-delay:    ${del}s;
    `;
    container.appendChild(p);
  }
}

createParticles();

// ===== SCROLL REVEAL (IntersectionObserver) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => {
  revealObserver.observe(el);
});

// Fallback: Check visibility after a short delay (accounts for layout shifts and initial painting)
setTimeout(() => {
  document.querySelectorAll('.reveal-up:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, 250);

// ===== NUMBER COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000; // ms
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== CONTACT FORM SUBMISSION =====
function handleSubmit(e) {
  e.preventDefault();

  const btn = e.target.querySelector('.form-submit');
  btn.textContent = '전송 중...';
  btn.disabled = true;

  // Simulate submission
  setTimeout(() => {
    btn.textContent = '문의 보내기 →';
    btn.disabled = false;
    e.target.reset();

    // Show toast
    showToast('✅ 문의가 접수되었습니다. 빠른 시일 내에 연락 드리겠습니다!');
  }, 1200);
}

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
      });
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.color = '#00C9A7';
        active.style.fontWeight = '700';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));
