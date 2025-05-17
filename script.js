// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let darkMode = localStorage.getItem('darkMode') === 'true';

// Initialize theme
if (darkMode) {
  body.setAttribute('data-theme', 'dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="sr-only">Toggle Theme</span>';
} else {
  themeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="sr-only">Toggle Theme</span>';
}

// Theme toggle event
themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  if (darkMode) {
    body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="sr-only">Toggle Theme</span>';
  } else {
    body.removeAttribute('data-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="sr-only">Toggle Theme</span>';
  }
});

// Navigation
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    const targetId = this.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

// Scroll handling
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
  animateOnScroll('.timeline-item', 'visible');
  animateOnScroll('.skill-item', 'visible');
  animateSkillBars();
});

// Animation functions
function animateOnScroll(selector, className) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    if (elementPosition < screenPosition) {
      element.classList.add(className);
    }
  });
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  const skillsSection = document.getElementById('resume');
  const sectionPosition = skillsSection.getBoundingClientRect().top;
  const screenPosition = window.innerHeight / 2;
  if (sectionPosition < screenPosition) {
    skillBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }
}

// Portfolio filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');
    const filterValue = btn.dataset.filter;
    portfolioItems.forEach(item => {
      item.classList.remove('animate');
      if (filterValue === 'all' || item.dataset.category === filterValue) {
        item.style.display = 'block';
        setTimeout(() => {
          item.classList.add('animate');
        }, 50);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Initial portfolio animation
portfolioItems.forEach((item, index) => {
  setTimeout(() => {
    item.classList.add('animate');
  }, index * 100);
});

// Resume download
const downloadBtn = document.getElementById('downloadResume');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = './resume.pdf';
    link.download = 'Golla_Vara_Lakshman_Naidu_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    downloadBtn.innerHTML = '<i class="fas fa-check"></i> Download Started!';
    setTimeout(() => {
      downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Resume';
    }, 2000);
  });
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});
