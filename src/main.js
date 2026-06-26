import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.0.42/+esm'

// Initialize Premium Lenis Smooth Scroll
let lenisInstance = null;
try {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
} catch (e) {
  console.warn("Lenis smooth scroll failed to initialize:", e);
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Hamburger Menu & Navigation Toggle ---
  const navButtons = document.querySelectorAll('.hamburger.w-nav-button');
  const navMenu = document.querySelector('.nav-menu.w-nav-menu');

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!navMenu) return;

      const isOpen = btn.classList.contains('w--open');
      if (isOpen) {
        btn.classList.remove('w--open');
        navMenu.classList.remove('w--open');
        document.body.classList.remove('menu-open');
      } else {
        btn.classList.add('w--open');
        navMenu.classList.add('w--open');
        document.body.classList.add('menu-open');
      }
    });
  });

  // Close mobile nav menu when a link inside it is clicked
  if (navMenu) {
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('w--open'));
        navMenu.classList.remove('w--open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // --- Header Navigation Dropdown ---
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.w-dropdown-toggle');
    const list = dropdown.querySelector('.w-dropdown-list');

    if (toggle && list) {
      // Desktop hover behavior (widths > 991px)
      dropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth > 991) {
          dropdown.classList.add('w--open');
          list.classList.add('w--open');
        }
      });

      dropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > 991) {
          dropdown.classList.remove('w--open');
          list.classList.remove('w--open');
        }
      });

      // Mobile / Touch click behavior (widths <= 991px)
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('w--open');

          // Close other dropdowns first
          dropdowns.forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('w--open');
              const otherList = d.querySelector('.w-dropdown-list');
              if (otherList) otherList.classList.remove('w--open');
            }
          });

          if (isOpen) {
            dropdown.classList.remove('w--open');
            list.classList.remove('w--open');
          } else {
            dropdown.classList.add('w--open');
            list.classList.add('w--open');
          }
        }
      });
    }
  });

  // Close dropdowns when clicking anywhere outside
  document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('w--open');
      const list = dropdown.querySelector('.w-dropdown-list');
      if (list) list.classList.remove('w--open');
    });
  });

  // --- FAQ Accordion ---
  const faqWraps = document.querySelectorAll('.faq-wrap');
  faqWraps.forEach(wrap => {
    const question = wrap.querySelector('.faq-question');
    const answer = wrap.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = wrap.classList.contains('is-open');

        // Collapse all other FAQ answers first
        faqWraps.forEach(otherWrap => {
          if (otherWrap !== wrap) {
            otherWrap.classList.remove('is-open');
            const otherAnswer = otherWrap.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.height = '0px';
          }
        });

        // Toggle this accordion
        if (isOpen) {
          wrap.classList.remove('is-open');
          answer.style.height = '0px';
        } else {
          wrap.classList.add('is-open');
          answer.style.height = `${answer.scrollHeight}px`;
        }
      });
    }
  });

  // --- Pricing Monthly/Annual Tab Switches ---
  const tabLinks = document.querySelectorAll('.w-tab-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabMenu = link.closest('.w-tab-menu');
      if (!tabMenu) return;

      const menuLinks = tabMenu.querySelectorAll('.w-tab-link');
      menuLinks.forEach(l => l.classList.remove('w--current'));
      link.classList.add('w--current');

      const tabTarget = link.getAttribute('data-w-tab');
      const tabContainer = tabMenu.parentElement;
      if (!tabContainer) return;

      const tabContent = tabContainer.querySelector('.w-tab-content');
      if (!tabContent) return;

      const tabPanes = tabContent.querySelectorAll('.w-tab-pane');
      tabPanes.forEach(pane => {
        if (pane.getAttribute('data-w-tab') === tabTarget) {
          pane.classList.add('w--tab-active');
        } else {
          pane.classList.remove('w--tab-active');
        }
      });
    });
  });

  // --- Testimonial Slider / Carousel Navigation ---
  const sliders = document.querySelectorAll('.w-slider');
  sliders.forEach(slider => {
    const mask = slider.querySelector('.w-slider-mask');
    const slides = slider.querySelectorAll('.w-slide');
    const leftArrow = slider.querySelector('.w-slider-arrow-left');
    const rightArrow = slider.querySelector('.w-slider-arrow-right');
    const slideNav = slider.querySelector('.w-slider-nav');

    if (!mask || slides.length === 0) return;

    let currentIndex = 0;

    // Dynamic Dot Creation if container is empty
    if (slideNav && slideNav.children.length === 0) {
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `w-slider-dot ${idx === 0 ? 'w-active' : ''}`;
        dot.setAttribute('data-index', idx);
        slideNav.appendChild(dot);
      });
    }

    const dots = slideNav ? slideNav.querySelectorAll('.w-slider-dot') : [];

    const updateSlider = (index) => {
      if (index < 0 || index >= slides.length) return;
      currentIndex = index;

      const targetSlide = slides[currentIndex];
      if (targetSlide) {
        mask.scrollTo({
          left: targetSlide.offsetLeft,
          behavior: 'smooth'
        });
      }

      // Update dot active styling
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('w-active');
        } else {
          dot.classList.remove('w-active');
        }
      });
    };

    if (leftArrow) {
      leftArrow.addEventListener('click', (e) => {
        e.preventDefault();
        const target = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider(target);
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener('click', (e) => {
        e.preventDefault();
        const target = (currentIndex + 1) % slides.length;
        updateSlider(target);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(dot.getAttribute('data-index'), 10);
        updateSlider(index);
      });
    });

    // Mobile Touch Scroll Sync with active dot
    let scrollTimeout;
    mask.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const maskWidth = mask.clientWidth;
        const scrollPosition = mask.scrollLeft;
        const index = Math.round(scrollPosition / maskWidth);
        if (index !== currentIndex && index >= 0 && index < slides.length) {
          currentIndex = index;
          dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
              dot.classList.add('w-active');
            } else {
              dot.classList.remove('w-active');
            }
          });
        }
      }, 100);
    });
  });
  // --- Glass-morphism Header Scroll Logic for Home Page ---
  const headerBlock = document.querySelector('.home-page .header-block');
  if (headerBlock) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        headerBlock.classList.add('glass-active');
      } else {
        headerBlock.classList.remove('glass-active');
      }
    });
  }
});
