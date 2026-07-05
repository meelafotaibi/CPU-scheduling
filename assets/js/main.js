// Advanced CPU Scheduler UI Controller
class CPUSchedulerUI {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.isSimulating = false;
        this.processes = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.preloadAnimations();
    }

    setupEventListeners() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="toggleTheme"]')) {
                this.toggleTheme();
            }
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollTo(anchor.getAttribute('href'));
            });
        });

        // Navigation scroll effect
        window.addEventListener('scroll', this.throttle(() => {
            this.updateNavigation();
        }, 16));

        // Interactive elements
        this.setupInteractiveElements();

        // Form interactions
        this.setupFormInteractions();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateNavigation() {
        const nav = document.querySelector('nav');
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.glass-card, .hero, section').forEach(el => {
            observer.observe(el);
        });
    }

    setupParallaxEffects() {
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrolled = window.scrollY;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }, 16));
        }
    }

    setupInteractiveElements() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', this.createRipple);
        });

        // Add hover effects to cards
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addCardHoverEffect(e.currentTarget);
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeCardHoverEffect(e.currentTarget);
            });
        });

        // Toggle buttons (Algorithms, Modes, Views)
        document.querySelectorAll('.toggle-btn, .mode-btn, .mode-tab, .class-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleToggle(e.currentTarget);
            });
        });

        // Code tabs
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCodeTab(e.currentTarget);
            });
        });
    }

    createRipple(e) {
        const button = e.currentTarget.closest('.btn');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addCardHoverEffect(card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        this.removeCardHoverEffect(card);

        const listener = (e) => {
            const x = (e.clientX - centerX) / 10;
            const y = (e.clientY - centerY) / 10;
            card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(10px)`;
        };

        card._cardMouseMoveListener = listener;
        card.addEventListener('mousemove', listener);
    }

    removeCardHoverEffect(card) {
        card.style.transform = '';
        if (card._cardMouseMoveListener) {
            card.removeEventListener('mousemove', card._cardMouseMoveListener);
            delete card._cardMouseMoveListener;
        }
    }

    handleToggle(btn) {
        const group = btn.parentElement;
        group.querySelectorAll('.toggle-btn, .mode-btn, .mode-tab, .class-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Add visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }

    switchCodeTab(tab) {
        const container = tab.closest('.code-card');
        container.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Simulate content switching
        const viewer = container.querySelector('.code-viewer');
        viewer.style.opacity = '0.5';
        setTimeout(() => {
            viewer.style.opacity = '1';
        }, 200);
    }

    setupFormInteractions() {
        // Enhanced input focus effects
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', (e) => {
                e.target.parentElement.classList.remove('focused');
            });
        });
    }

    preloadAnimations() {
        // Add CSS for dynamic animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease-out;
            }
            
            .focused {
                transform: translateY(-2px);
                transition: transform 0.2s ease;
            }
            
            .nav-links a.active {
                color: var(--primary);
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }

    // Utility functions
    throttle(func, limit) {
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

    debounce(func, wait) {
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CPUSchedulerUI();

    // Add loading completion effect
    document.body.classList.add('loaded');

    // Stagger card animations
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}