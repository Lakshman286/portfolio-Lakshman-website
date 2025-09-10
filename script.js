// Loading functionality
    document.addEventListener('DOMContentLoaded', function() {
      // Minimum display time for loading screen (3 seconds)
      const minLoadTime = 3000;
      const loadStartTime = Date.now();
      
      function hideLoadingScreen() {
        const elapsedTime = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(function() {
          document.body.classList.add('loaded');
          
          // Remove loading screen from DOM after fade out completes
          setTimeout(function() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
              loadingScreen.remove();
            }
          }, 500); // Match the CSS transition time
        }, remainingTime);
      }
      
      // Check if all resources are loaded
      if (document.readyState === 'complete') {
        hideLoadingScreen();
      } else {
        window.addEventListener('load', hideLoadingScreen);
      }
      
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

      // Smooth scrolling + Active link on click
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();

          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      // Highlight nav link based on scroll position
      const sections = document.querySelectorAll('main section[id]');
      window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollY >= sectionTop - 100) {
            currentSectionId = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
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

      // Set current year in footer
      document.getElementById('currentYear').textContent = new Date().getFullYear();

      // Form submission handling
      const contactForm = document.getElementById('contactForm');
      const formMessage = document.getElementById('formMessage');

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
            headers: {
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
            formMessage.className = 'form-message success';
            contactForm.reset();
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          formMessage.textContent = 'There was an error sending your message. Please try again later.';
          formMessage.className = 'form-message error';
          console.error('Form submission error:', error);
        } finally {
          submitBtn.disabled = false;
          btnText.textContent = originalText;

          setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
          }, 5000);
        }
      });

      // Portfolio filtering
      const filterButtons = document.querySelectorAll('.filter-btn');
      const portfolioItems = document.querySelectorAll('.portfolio-item');

      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          const filterValue = button.getAttribute('data-filter');

          portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });

      // Animate skill bars on scroll
      const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-progress-bar');
        skillBars.forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
        });
      };

      const skillsSection = document.querySelector('#resume');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      if (skillsSection) {
        observer.observe(skillsSection);
      }
      
      // Resume download link (replace with actual path)
      document.getElementById('downloadResume')?.addEventListener('click', () => {
        // This is a placeholder - replace with your actual resume URL
        alert("Resume download functionality would be implemented here with a real PDF file.");
      });
    });
