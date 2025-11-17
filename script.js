// Scroll animations
const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
};

document.addEventListener('DOMContentLoaded', function () {

  // Initialize scroll animations
  animateOnScroll();

  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="sr-only">Toggle Theme</span>';
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    themeToggle.innerHTML =
      newTheme === 'dark'
        ? '<i class="fas fa-sun"></i><span class="sr-only">Toggle Theme</span>'
        : '<i class="fas fa-moon"></i><span class="sr-only">Toggle Theme</span>';
  });

  // Smooth scrolling + Active nav link
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const updateActiveNavLink = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        updateActiveNavLink();
        scrollTimeout = null;
      }, 100);
    }
  });

  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Contact form
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText.textContent;

      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          formMessage.textContent = 'Message sent successfully!';
          formMessage.className = 'form-message success';
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        formMessage.textContent = 'Error sending message. Try again later.';
        formMessage.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = originalText;

        setTimeout(() => {
          formMessage.textContent = '';
          formMessage.className = 'form-message';
        }, 5000);
      }
    });
  }

  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Skill bar animations
  const animateSkillBars = () => {
    const bars = document.querySelectorAll('.skill-progress-bar');
    bars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0';
      bar.style.transition = 'width 0s';

      setTimeout(() => {
        bar.style.width = width;
        bar.style.transition = 'width 1.5s ease-in-out';
      }, 100);
    });
  };

  const skillsSection = document.querySelector('#resume');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars();
          skillsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    skillsObserver.observe(skillsSection);
  }

  // ================================
  //  🔥 REAL RESUME PDF DOWNLOAD
  // ================================
  const downloadResumeBtn = document.getElementById('downloadResume');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      const resumePath = "documents/resume.pdf"; // your actual PDF file path

      const link = document.createElement('a');
      link.href = resumePath;
      link.download = "Lakshman_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  const addLoadingAnimations = () => {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .timeline-item');
    animatedElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
  };

  addLoadingAnimations();
});

window.addEventListener('load', () => {
  animateOnScroll();
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) animateOnScroll();
});
