// Waitlist Page Javascript Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Countdown Timer Logic ---
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');

  if (daysEl && hoursEl && minsEl) {
    // Generate/retrieve a target timestamp in localStorage for consistency across reloads
    let targetTime = localStorage.getItem('waitlist_target_time');
    if (!targetTime) {
      // 32 Days, 24 Hours (effectively 33 Days) from now
      const thirtyThreeDaysMs = (32 * 24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000);
      targetTime = Date.now() + thirtyThreeDaysMs;
      localStorage.setItem('waitlist_target_time', targetTime.toString());
    } else {
      targetTime = parseInt(targetTime, 10);
    }

    function updateCountdown() {
      const now = Date.now();
      let diff = targetTime - now;

      // If time has elapsed, reset target time to 32 days in the future to keep it looking active
      if (diff <= 0) {
        const thirtyThreeDaysMs = (32 * 24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000);
        targetTime = Date.now() + thirtyThreeDaysMs;
        localStorage.setItem('waitlist_target_time', targetTime.toString());
        diff = thirtyThreeDaysMs;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      daysEl.textContent = days.toString().padStart(2, '0');
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minsEl.textContent = mins.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
  }

  // --- 2. Form Submission Handling ---
  const emailForm = document.getElementById('email-form');
  const successMsg = document.getElementById('form-success-msg');
  const failMsg = document.getElementById('form-fail-msg');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('email-2');
      if (!emailInput || !emailInput.value) {
        if (failMsg) failMsg.style.display = 'block';
        return;
      }

      // Simple mock successful submission
      console.log(`Submitting waitlist email: ${emailInput.value}`);
      
      // Toggle form visibility and success message
      emailForm.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      if (failMsg) {
        failMsg.style.display = 'none';
      }
    });
  }

  // --- 3. Mobile Navigation Menu Toggle ---
  const menuTrigger = document.getElementById('mobile-menu-trigger');
  const menuPanel = document.getElementById('mobile-menu-panel');

  if (menuTrigger && menuPanel) {
    const openImg = menuTrigger.querySelector('.menu-mobile-img.open');
    const closeImg = menuTrigger.querySelector('.menu-mobile-img.close');

    menuTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = menuPanel.style.display === 'none';
      
      if (isHidden) {
        // Open the menu
        menuPanel.style.display = 'block';
        setTimeout(() => {
          menuPanel.style.opacity = '1';
          menuPanel.style.transform = 'translateY(0)';
        }, 10);
        if (openImg) openImg.style.display = 'none';
        if (closeImg) closeImg.style.display = 'block';
      } else {
        // Close the menu
        menuPanel.style.opacity = '0';
        menuPanel.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          menuPanel.style.display = 'none';
        }, 300);
        if (openImg) openImg.style.display = 'block';
        if (closeImg) closeImg.style.display = 'none';
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuPanel.contains(e.target) && !menuTrigger.contains(e.target)) {
        if (menuPanel.style.display === 'block') {
          menuPanel.style.opacity = '0';
          menuPanel.style.transform = 'translateY(-20px)';
          setTimeout(() => {
            menuPanel.style.display = 'none';
          }, 300);
          if (openImg) openImg.style.display = 'block';
          if (closeImg) closeImg.style.display = 'none';
        }
      }
    });
  }

  // --- 4. Dynamic Style Injection for Marquees and Custom Hover Effects ---
  const style = document.createElement('style');
  style.textContent = `
    /* Marquee Scroll Animation */
    .marquee-wrapper.comming-soon {
      display: flex;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
    }
    .marquee-half {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: 100%;
      flex-shrink: 0;
      animation: marquee-scroll-left 25s linear infinite;
    }
    .circle-comming {
      flex-shrink: 0;
      margin: 0 24px;
    }
    .comming-soon-header {
      white-space: nowrap;
    }
    @keyframes marquee-scroll-left {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    /* Button Text Vertical Sliding Hover Effect */
    .form-button, .get-this-template-button {
      position: relative;
      overflow: hidden;
    }
    .button-text-animation-wrapper {
      display: flex;
      flex-direction: column;
      height: 22px; /* Text bounding box */
      overflow: hidden;
      position: relative;
      align-items: center;
      justify-content: flex-start;
    }
    .button-text {
      height: 22px;
      line-height: 22px;
      transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .form-button:hover .button-text,
    .get-this-template-button:hover .button-text {
      transform: translateY(-22px);
    }

    /* Success / Fail Custom Alert Styling */
    .w-form-done {
      background-color: #121315 !important;
      border: 1px solid #282a2e !important;
      border-radius: 8px !important;
      color: #00ff66 !important;
      padding: 20px !important;
      font-weight: 500 !important;
      margin-top: 15px !important;
    }
    .w-form-fail {
      background-color: #201314 !important;
      border: 1px solid #481e22 !important;
      border-radius: 8px !important;
      color: #ff4d4d !important;
      padding: 20px !important;
      font-weight: 500 !important;
      margin-top: 15px !important;
    }
  `;
  document.head.appendChild(style);
});
