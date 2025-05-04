const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let darkMode = localStorage.getItem('darkMode') === 'true';

if (darkMode) {
  body.setAttribute('data-theme', 'dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="sr-only">Toggle Theme</span>';
} else {
  themeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="sr-only">Toggle Theme</span>';
}

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

document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    const targetId = this.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

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

portfolioItems.forEach((item, index) => {
  setTimeout(() => {
    item.classList.add('animate');
  }, index * 100);
});

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `form-alert form-alert-${type}`;
  alertDiv.textContent = message;
  const form = document.getElementById('contactForm');
  form.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      if (!formData.name || !formData.email) {
        throw new Error('Please fill in name and email fields');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const scriptUrl = 'https://script.google.com/macros/s/AKfycbxbj80WY2OSHYB3IkPT_XmI4rfJi0PQIJ9hu9IunY2Ur5HoT386enfz1D8QxAPbak8w/exec';
      const initialResponse = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        redirect: 'manual'
      });

      let result;
      if (initialResponse.status === 302 || initialResponse.status === 0) {
        const redirectUrl = initialResponse.headers.get('Location') || scriptUrl.replace('exec', 'dev');
        const finalResponse = await fetch(redirectUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        result = await finalResponse.json();
      } else {
        result = await initialResponse.json();
      }

      console.log('Form submission response:', result); // Log full response for debugging

      if (!result.success) {
        throw new Error(result.error || 'Form submission failed');
      }

      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      submitBtn.style.backgroundColor = '#10b981';
      this.reset();
      showAlert('Message sent successfully!', 'success');
    } catch (error) {
      submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
      submitBtn.style.backgroundColor = '#ef4444';
      let userMessage = error.message.includes('Failed to fetch') 
        ? 'Network error. Please try again later.'
        : error.message;
      if (error.message.match(/Sheet.*not found/)) {
        userMessage = 'The Google Spreadsheet is missing the "FormSubmissions" sheet. Please contact the administrator to ensure the sheet exists in the spreadsheet (ID: your-spreadsheet-id-here) or create it manually.';
      }
      showAlert(userMessage, 'error');
      console.error('Submission error:', error);
    } finally {
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '#2563eb';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

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

document.getElementById('currentYear').textContent = new Date().getFullYear();