// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
});

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Mobile Menu Toggle with Sidebar
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const sidebarClose = document.querySelector('.sidebar-close');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
});

const closeSidebar = () => {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
};

sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar when clicking on links
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Progress Indicator
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced Animate Skill Bars on Scroll
const skillBars = document.querySelectorAll('.skill-progress');
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        const rect = bar.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 200);
        }
    });
};

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// Animate Numbers
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                number.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(number);
    });
};

// Initialize number animation
window.addEventListener('load', animateNumbers);

// Toast Notification helper
const showToast = (message, iconClass = 'fa-check-circle') => {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
};

// Resume Button Interaction
const resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
        showToast('Feel free to message me to request the latest PDF resume!', 'fa-file-alt');
    });
}

// Contact Form Handling with FormSubmit AJAX
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        
        // Set loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Check if browsing as raw local file
            if (window.location.protocol === 'file:') {
                showToast('Email sending requires a web server (localhost or hosted website). Browsing as file:// is blocked by email providers.', 'fa-info-circle');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                return;
            }

            const formData = new FormData(contactForm);
            const response = await fetch('https://formsubmit.co/ajax/munachisonjeze@gmail.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok && data.success !== 'false') {
                showToast('Message sent! Mitchell will get back to you soon.', 'fa-check-circle');
                contactForm.reset();
            } else {
                showToast(data.message || 'Could not send message. Please contact directly via email.', 'fa-exclamation-circle');
            }
        } catch (error) {
            showToast('Network error. Please reach me at munachisonjeze@gmail.com', 'fa-envelope');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = 'var(--text-color)';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// Typing Effect for Hero Text (Optional)
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add scroll reveal animation
const revealElements = () => {
    const reveals = document.querySelectorAll('.skill-card, .project-card, .stat-item');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize scroll reveal
window.addEventListener('scroll', revealElements);
window.addEventListener('load', () => {
    // Set initial state for scroll reveal
    document.querySelectorAll('.skill-card, .project-card, .stat-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    revealElements();
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

console.log('Portfolio loaded successfully! 🚀');