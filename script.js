document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Update icon based on theme
  if (currentTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="sr-only">Toggle Theme</span>';
  }
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    themeToggle.innerHTML = newTheme === 'dark' 
      ? '<i class="fas fa-sun"></i><span class="sr-only">Toggle Theme</span>'
      : '<i class="fas fa-moon"></i><span class="sr-only">Toggle Theme</span>';
  });
  
  // Smooth scrolling for navigation
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth'
      });
      
      // Update active nav link
      document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
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
      behavior: 'smooth'
    });
  });
  
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Form submission handling
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  
  contactForm.addEventListener('submit', async (e) => {
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
          'Accept': 'application/json'
        }
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
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
      }, 5000);
    }
  });

  // Animate title underline when in view
  const titles = document.querySelectorAll('.title');

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  titles.forEach(title => titleObserver.observe(title));

  
  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      // Filter portfolio items
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
  
  // Intersection Observer for skill bars animation
  const skillsSection = document.querySelector('#resume');
  const observer = new IntersectionObserver((entries) => {
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
});

// Add to script.js
document.getElementById('downloadResume')?.addEventListener('click', () => {
  // Replace with your actual resume URL
  window.open('path/to/your/resume.pdf', '_blank');
});
