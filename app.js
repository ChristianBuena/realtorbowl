document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Sticky Header Scroll Effect
  // ==========================================
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScrollHeader = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initialize on load
  }

  // ==========================================
  // 2. Mobile Navigation Toggle Menu
  // ==========================================
  const menuBtn = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.header-nav-row');
  
  if (menuBtn && mobileNav) {
    const toggleMenu = () => {
      const isOpen = mobileNav.classList.toggle('mobile-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      
      // Animate hamburger bar states
      const spans = menuBtn.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('mobile-open');
        document.body.style.overflow = '';
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ==========================================
  // 3. Scroll Active Section Tracker
  // ==========================================
  const sections = document.querySelectorAll('section[data-section-id]');
  const indexNav = document.querySelector('.index-nav');
  const indexNavLinks = document.querySelectorAll('.index-nav a');
  const headerLinks = document.querySelectorAll('.header-nav ul li a');

  // List of sections that have light backgrounds (to change dot color)
  const lightSections = ['how-it-works', 'realtor-bowl'];

  function updateActiveNavOnScroll() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let currentSectionId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('data-section-id');
      }
    });

    if (currentSectionId) {
      // 1. Update side dot navigation active states
      indexNavLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        if (targetId === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // 2. Update desktop header navigation active states
      headerLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        // Supports relative paths for internal subpages (e.g. index.html#how-it-works)
        const parsedTargetId = targetId.includes('.html') ? targetId.split('#')[1] : targetId;
        
        if (parsedTargetId === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // 3. Update side dot background theme (on-light vs on-dark)
      if (indexNav) {
        if (lightSections.includes(currentSectionId)) {
          indexNav.classList.add('on-light');
        } else {
          indexNav.classList.remove('on-light');
        }
      }
    }
  }

  if (sections.length > 0) {
    window.addEventListener('scroll', updateActiveNavOnScroll);
    updateActiveNavOnScroll(); // Initialize on load
  }

  // Handle smooth scroll clicks on dot indicators and scroll arrows
  const scrollIndicators = document.querySelectorAll('.scroll-indicator');
  scrollIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const targetSelector = indicator.getAttribute('data-target');
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 4. Scroll-Triggered Reveal Animations
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of element is in viewport
      rootMargin: '0px 0px -50px 0px' // Offset slightly to trigger just before coming into view
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 5. Contact Lead Form Submission
  // ==========================================
  const signupForm = document.getElementById('signup-form');
  const formStatus = document.getElementById('form-status');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstNameInput = document.getElementById('first-name');
      const lastNameInput = document.getElementById('last-name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput ? phoneInput.value.trim() : '';

      // Basic local validation checks
      if (!firstName || !lastName || !email) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Submission button UI states
      const submitBtn = signupForm.querySelector('.form-submit-btn');
      const btnText = submitBtn.querySelector('span');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      submitBtn.disabled = true;
      btnText.textContent = 'REGISTERING...';
      if (btnSpinner) btnSpinner.style.display = 'block';
      if (formStatus) formStatus.style.display = 'none';

      // =========================================================================
      // DYNAMIC ENDPOINT CONFIGURATION:
      // To wire this static page up to a live email handler service (e.g. FormSubmit)
      // replace the simulated timeout below with this live fetch request:
      //
      // fetch('https://formsubmit.co/ajax/michael@zeropoints.com', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: `${firstName} ${lastName}`,
      //     email: email,
      //     phone: phone,
      //     _subject: "Realtor Bowl League Registration Submission"
      //   })
      // })
      // .then(response => response.json())
      // .then(data => {
      //    if (data.success === 'true') {
      //      showStatus('Thank you! Your registration has been received. We\'ll be in touch soon with draft details.', 'success');
      //      signupForm.reset();
      //    } else {
      //      showStatus('Something went wrong. Please check details and try again.', 'error');
      //    }
      // })
      // .catch(err => showStatus('Connection error. Please try again later.', 'error'))
      // .finally(() => {
      //    submitBtn.disabled = false;
      //    btnText.textContent = 'SUBMIT REGISTRATION';
      //    if (btnSpinner) btnSpinner.style.display = 'none';
      // });
      // =========================================================================

      // Simulated AJAX call for premium experience
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'SUBMIT REGISTRATION';
        if (btnSpinner) btnSpinner.style.display = 'none';
        
        showStatus('🎉 Thank you! Your registration has been received. We\'ll be in touch soon with draft details.', 'success');
        signupForm.reset();
      }, 1500);
    });
  }

  function showStatus(msg, type) {
    if (formStatus) {
      // Provide appropriate layout SVGs in status bar for clean visuals
      const iconSuccess = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      const iconError = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      
      const icon = type === 'success' ? iconSuccess : iconError;
      
      formStatus.innerHTML = `${icon} <span>${msg}</span>`;
      formStatus.className = 'form-status ' + type;
      formStatus.style.display = 'flex';
    }
  }

});
