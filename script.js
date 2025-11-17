/* ============================
   PAGE LOADER
============================ */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.body.classList.add("loaded");
    }, 500);
});

/* ============================
   NAVBAR LINK ACTIVATION
============================ */
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    document.querySelectorAll("section").forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;

        if (top >= offset && top < offset + height) {
            currentSection = sec.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(currentSection)) {
            link.classList.add("active");
        }
    });
});

/* Smooth scroll on nav click */
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(link.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

/* ============================
   DARK MODE TOGGLE
============================ */
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");

        if (currentTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    });
}

/* Load saved theme */
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
}

/* ============================
   PORTFOLIO FILTERING
============================ */
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        portfolioItems.forEach(item => {
            item.style.display = "none";

            if (filter === "all" || item.getAttribute("data-category") === filter) {
                item.style.display = "block";
                item.classList.add("fade-in");
            }
        });
    });
});

/* ============================
   SKILL BAR ANIMATION (B + C)
============================ */
const skillBars = document.querySelectorAll(".skill-progress-bar");
let skillsAnimated = false;

function animateSkills() {
    const resumeSection = document.getElementById("resume");

    if (!resumeSection) return;

    const pos = resumeSection.getBoundingClientRect().top;

    if (pos < window.innerHeight - 100 && !skillsAnimated) {
        skillsAnimated = true;

        skillBars.forEach(bar => {
            const value = bar.getAttribute("data-percent");
            bar.style.width = value + "%";
        });
    }
}

window.addEventListener("scroll", animateSkills);

/* ============================
   CONTACT ITEM COPY-TO-CLIPBOARD
============================ */
const contactItems = document.querySelectorAll(".contact-item");

contactItems.forEach(item => {
    item.addEventListener("click", () => {
        const text = item.getAttribute("data-copy");
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            item.classList.add("copied");
            item.style.borderColor = "var(--primary-color)";

            setTimeout(() => {
                item.classList.remove("copied");
                item.style.borderColor = "";
            }, 1000);
        });
    });
});

/* ============================
   SCROLL TO TOP BUTTON
============================ */
const scrollTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* Year in footer */
document.getElementById("currentYear").textContent = new Date().getFullYear();
