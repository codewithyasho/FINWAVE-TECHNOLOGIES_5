/* ===================================================
   FINWAVE TECHNOLOGIES SOLUTION — SCRIPT.JS
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =======================================
     1. PRELOADER
     ======================================= */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });

  /* =======================================
     2. NAVBAR — Scroll Behaviour
     ======================================= */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    // Scrolled class for shadow
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Back to top
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  /* =======================================
     3. HAMBURGER MENU
     ======================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('mobile-open');
  });

  // Close on nav link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('mobile-open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('mobile-open');
    }
  });

  /* =======================================
     4. AOS-LIKE INTERSECTION OBSERVER
     ======================================= */
  const aosElements = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  aosElements.forEach(el => aosObserver.observe(el));

  /* =======================================
     5. COUNTER ANIMATION
     ======================================= */
  const counters = document.querySelectorAll('.count-num, .stat-number');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = (target / duration) * 16;
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* =======================================
     6. TESTIMONIALS SLIDER
     ======================================= */
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.t-dot');
  if (track) {
    let currentSlide = 0;
    let slideTimer;
    let isMobile = window.innerWidth < 900;

    const getSlideWidth = () => {
      if (!isMobile) {
        // Show 2 on desktop
        return track.parentElement.offsetWidth / 2 + 10;
      }
      return track.parentElement.offsetWidth;
    };

    const goToSlide = (index) => {
      const maxSlides = isMobile ? 4 : 3;
      currentSlide = Math.max(0, Math.min(index, maxSlides - 1));
      const offset = currentSlide * getSlideWidth();
      track.style.transform = `translateX(-${offset}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    };

    const startSlider = () => {
      clearInterval(slideTimer);
      slideTimer = setInterval(() => {
        const maxSlides = isMobile ? 4 : 3;
        goToSlide((currentSlide + 1) % maxSlides);
      }, 4500);
    };

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-i')));
        startSlider();
      });
    });

    // Touch swipe for testimonials
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        startSlider();
      }
    });

    window.addEventListener('resize', () => {
      isMobile = window.innerWidth < 900;
      goToSlide(0);
    });

    startSlider();
  }

  /* =======================================
     7. BACK TO TOP
     ======================================= */
  const backToTopBtn = document.getElementById('backToTop');
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =======================================
     8. CONTACT FORM
     ======================================= */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let isValid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#EF4444';
        setTimeout(() => field.style.borderColor = '', 2000);
      }
    });

    if (!isValid) return;

    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.style.borderColor = '#EF4444';
      setTimeout(() => email.style.borderColor = '', 2000);
      return;
    }

    // Redirecting to WhatsApp
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.textContent = 'Redirecting to WhatsApp...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Construct WhatsApp message URL
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const emailVal = email.value.trim();
    const phoneVal = document.getElementById('phone').value.trim() || 'Not provided';
    const serviceVal = document.getElementById('service').value || 'Not selected';
    const msgVal = document.getElementById('message').value.trim() || 'No message';

    const text = `*New Lead from Fintech Website* 🚀\n\n` +
      `*Name:* ${fname} ${lname}\n` +
      `*Email:* ${emailVal}\n` +
      `*Phone:* ${phoneVal}\n` +
      `*Service:* ${serviceVal}\n` +
      `*Message:* ${msgVal}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=918459997466&text=${encodeURIComponent(text)}`;

    await new Promise(r => setTimeout(r, 800));

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Reset button states and show success screen
    btnSpan.textContent = 'Send Message';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';

    form.style.display = 'none';
    formSuccess.style.display = 'flex';
  });

  // Reset form functionality
  const resetBtn = document.getElementById('resetFormBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = '';
      formSuccess.style.display = 'none';
    });
  }

  // Remove error border on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });

  /* =======================================
     9. SMOOTH SCROLL for anchor links
     ======================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =======================================
     10. NAVBAR DROPDOWN — Touch Support
     ======================================= */
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dd => {
    const link = dd.querySelector('.nav-link');
    link.addEventListener('click', (e) => {
      if (window.innerWidth >= 900) {
        const menu = dd.querySelector('.dropdown-menu');
        if (menu) {
          e.preventDefault();
          const isOpen = menu.style.opacity === '1';
          menu.style.opacity = isOpen ? '' : '1';
          menu.style.visibility = isOpen ? '' : 'visible';
          menu.style.transform = isOpen ? '' : 'translateX(-50%) translateY(0)';
        }
      }
    });
  });

  document.addEventListener('click', (e) => {
    dropdowns.forEach(dd => {
      if (!dd.contains(e.target)) {
        const menu = dd.querySelector('.dropdown-menu');
        if (menu) {
          menu.style.opacity = '';
          menu.style.visibility = '';
          menu.style.transform = '';
        }
      }
    });
  });

  /* =======================================
     11. PARALLAX HERO BLOBS
     ======================================= */
  const blob1 = document.querySelector('.hero-blob-1');
  const blob2 = document.querySelector('.hero-blob-2');

  window.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    if (blob1) blob1.style.transform = `translate(${x}px, ${y}px)`;
    if (blob2) blob2.style.transform = `translate(${-x * 0.7}px, ${-y * 0.7}px)`;
  });

  /* =======================================
     12. TYPING EFFECT for hero title 
     ======================================= */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '1';
    heroTitle.style.animation = 'fadeInUp 0.8s ease 0.3s both';
  }

  /* =======================================
     13. WHY SECTION BAR ANIMATION
     ======================================= */
  const bars = document.querySelectorAll('.wc-bar');
  const whySection = document.querySelector('.why-section');

  if (whySection) {
    const barObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.transition = 'height 0.6s ease';
          }, i * 80);
        });
      }
    }, { threshold: 0.3 });
    barObserver.observe(whySection);
  }

  /* =======================================
     14. PRODUCT CARDS HOVER TILT
     ======================================= */
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* =======================================
     15. FEATURE CARD GLOW EFFECT
     ======================================= */
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  /* =======================================
     16. INITIAL SCROLL TRIGGER
     ======================================= */
  // Trigger scroll to set initial navbar state
  onScroll();

  /* =======================================
     17. MOBILE: Testimonials full width
     ======================================= */
  const adjustTestimonials = () => {
    const cards = document.querySelectorAll('.testimonial-card');
    if (window.innerWidth >= 900) {
      cards.forEach(c => c.style.minWidth = `calc(50% - 0.625rem)`);
    } else {
      cards.forEach(c => c.style.minWidth = '100%');
    }
  };
  adjustTestimonials();
  window.addEventListener('resize', adjustTestimonials);

  console.log('%cFINWAVE Technologies Solution 🚀', 'color: #0E6FFF; font-size: 18px; font-weight: bold;');
  console.log('%cBuilt with ❤️ for Future-Ready Businesses', 'color: #0A2472; font-size: 12px;');

});

const chatBtn = document.getElementById("chatbot-btn");
const chatContainer = document.getElementById("chatbot-container");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");


chatBtn.addEventListener("click", () => {
    chatContainer.classList.toggle("hidden");
    // Hide red dot once user opens the chat
    const redDot = document.getElementById("chatbot-red-dot");
    if (redDot) redDot.classList.add("dot-hidden");
  });
  
  closeChat.addEventListener("click", () => {
    chatContainer.classList.add("hidden");
  });

sendBtn.onclick = sendMessage;
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  callAPI(text);
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBody.appendChild(msg);

  chatBody.scrollTop = chatBody.scrollHeight;
}

async function callAPI(userMessage) {
  try {
    const response = await fetch("https://yashodeep2006-finewavetech-api.hf.space/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userMessage,
      }),
    });

    const data = await response.json();

    addMessage(data.answer || "Sorry for inconvenience, server is currently down, kindly contact to connect@smiragroup.in", "bot");

  } catch (error) {
    addMessage("Sorry for inconvenience, server is currently down, kindly contact to connect@smiragroup.in", "bot");
    console.error(error);
  }
}