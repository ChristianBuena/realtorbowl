document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // 2. Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-toggle');
  const navRow = document.querySelector('.header-nav-row');
  if (menuBtn && navRow) {
    menuBtn.addEventListener('click', () => {
      navRow.classList.toggle('mobile-open');
    });
    navRow.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navRow.classList.remove('mobile-open');
      });
    });
  }

  // 3. Index nav active state on scroll
  const sections = document.querySelectorAll('[data-section-id]');
  const indexNavLinks = document.querySelectorAll('.index-nav a');

  function updateActiveSection() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('data-section-id');
      const link = document.querySelector(`.index-nav a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
      }
    });
  }
  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();

  // 4. Form handler
  const form = document.getElementById('signup-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!firstName || !lastName || !email) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      const btn = form.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'SENDING...';
      formStatus.style.display = 'none';

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'SUBMIT';
        showStatus('Thank you! Your registration has been received. We\'ll be in touch soon with draft details.', 'success');
        form.reset();
      }, 1200);
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';
  }
});
