// ===========================
// GLOBAL VARIABLES
// ===========================
let currentLang = 'en';
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

// ===========================
// CANVAS SETUP & RESIZE
// ===========================
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===========================
// PARTICLE SYSTEM
// ===========================
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 69, 0, 0.4)';
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Draw connections between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 69, 0, ${0.2 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw geometric grid lines
    ctx.strokeStyle = 'rgba(255, 69, 0, 0.08)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i < canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i < canvas.height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawConnections();

    animationId = requestAnimationFrame(animate);
}

// Start animation
initParticles();
animate();

// Reinitialize particles on resize
window.addEventListener('resize', () => {
    initParticles();
});

// ===========================
// SMOOTH SCROLL NAVIGATION
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMobile = document.getElementById('nav-mobile');
            const hamburger = document.getElementById('hamburger');
            if (navMobile.classList.contains('active')) {
                navMobile.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// ===========================
// MOBILE MENU TOGGLE
// ===========================
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        hamburger.classList.remove('active');
        navMobile.classList.remove('active');
    }
});

// ===========================
// SCROLL REVEAL ANIMATIONS
// ===========================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// ===========================
// PARALLAX EFFECT ON HERO
// ===========================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    const heroOverlay = document.querySelector('.hero-overlay');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }

    if (heroOverlay && scrolled < window.innerHeight) {
        heroOverlay.style.opacity = 0.3 + (scrolled / window.innerHeight) * 0.7;
    }
});

// ===========================
// HEADER SCROLL BEHAVIOR
// ===========================
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===========================
// LANGUAGE TOGGLE
// ===========================
const langButtons = document.querySelectorAll('.lang-btn');
const translatableElements = document.querySelectorAll('[data-en][data-az]');

function switchLanguage(lang) {
    currentLang = lang;

    // Update button states
    langButtons.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update content
    translatableElements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Smooth transition
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';

            setTimeout(() => {
                element.textContent = text;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200);
        }
    });

    // Store preference
    localStorage.setItem('preferredLanguage', lang);
}

// Language button click handlers
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchLanguage(btn.dataset.lang);
    });
});

// Add transition styles to translatable elements
translatableElements.forEach(element => {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});

// Load saved language preference
const savedLang = localStorage.getItem('preferredLanguage');
if (savedLang && (savedLang === 'en' || savedLang === 'az')) {
    switchLanguage(savedLang);
}

// ===========================
// BUTTON GLOW EFFECTS
// ===========================
const glowButtons = document.querySelectorAll('.hero-cta, .capability-card, .mission-card, .vision-card, .contact-item');

glowButtons.forEach(button => {
    button.addEventListener('mouseenter', function (e) {
        this.style.transition = 'all 0.3s ease';
    });
});

// ===========================
// INTERSECTION OBSERVER FOR BETTER PERFORMANCE
// ===========================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===========================
// PREVENT FOUC (Flash of Unstyled Content)
// ===========================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
});

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for animation frames
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply optimizations
const optimizedScrollHandler = throttle(() => {
    revealOnScroll();
    updateActiveNav();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// ===========================
// PRELOAD CRITICAL RESOURCES
// ===========================
window.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations
    setTimeout(() => {
        revealOnScroll();
        updateActiveNav();
    }, 100);
});

// ===========================
// CONSOLE BRANDING
// ===========================
console.log(
    '%cBLACKYARD%c\nEngineering Security. Fortifying the Future.',
    'font-size: 24px; font-weight: bold; color: #ff4500; text-shadow: 0 0 10px rgba(255, 69, 0, 0.5);',
    'font-size: 14px; color: #ff8c42; margin-top: 10px;'
);

// ===========================
// ERROR HANDLING
// ===========================
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// ===========================
// ACCESSIBILITY ENHANCEMENTS
// ===========================
// Skip to main content
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations
    cancelAnimationFrame(animationId);
    particles = [];
}

prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        cancelAnimationFrame(animationId);
        particles = [];
    } else {
        initParticles();
        animate();
    }
});
