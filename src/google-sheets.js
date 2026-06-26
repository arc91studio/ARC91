// Replace this URL with the Web App URL you get from Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_oqTgNjMfFGF7ND8rfZhhXIT0ydNGiNlfNtJeTv6i3W_SYxqQFgTC3oTZM1ybhSuB/exec';
const formsToHandle = ['wf-form-Name', 'newsletter-form', 'wf-form-UX-Audit'];

// We use { capture: true } to intercept the form submission BEFORE Webflow's scripts can hijack it
document.addEventListener('submit', async (e) => {
  const form = e.target;
  
  if (!form || !form.id || !formsToHandle.includes(form.id)) {
    return; // Not a form we want to handle
  }

  // Prevent Webflow from handling it
  e.preventDefault();
  e.stopImmediatePropagation();

  // Show loading state on button
  const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
  const originalBtnText = submitBtn ? (submitBtn.value || submitBtn.innerText) : 'Submit';
  const waitText = submitBtn && submitBtn.getAttribute('data-wait') ? submitBtn.getAttribute('data-wait') : 'Please wait...';

  if (submitBtn) {
    if (submitBtn.tagName === 'INPUT') submitBtn.value = waitText;
    else submitBtn.innerText = waitText;
  }

  // Gather form data
  const formData = new FormData(form);

  // Determine form type based on ID
  const formType = form.id === 'newsletter-form' ? 'Newsletter Subscription' :
                   form.id === 'wf-form-UX-Audit' ? 'UX Audit Request' : 'Contact Form';

  // Map Webflow field names to the expected parameters in our Google Apps Script
  const email = formData.get('Newsletter-Email') || formData.get('Email') || formData.get('Email-2') || '';
  const firstName = formData.get('First-Name') || formData.get('Name') || '';
  const lastName = formData.get('Last-Name') || '';
  const message = formData.get('field') || formData.get('Message') || '';

  // URLSearchParams automatically sets the Content-Type to application/x-www-form-urlencoded
  const payload = new URLSearchParams();
  payload.append('formType', formType);
  payload.append('firstName', firstName);
  payload.append('lastName', lastName);
  payload.append('email', email);
  payload.append('message', message);

  // Find Webflow's default success/error message blocks
  const formWrapper = form.closest('.w-form') || form.parentElement;
  const successMsg = formWrapper.querySelector('.w-form-done') || formWrapper.querySelector('.success-message');
  const errorMsg = formWrapper.querySelector('.w-form-fail') || formWrapper.querySelector('.error-message');

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: payload
    });

    if (response.ok || response.type === 'opaque') {
      form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
      if (errorMsg) errorMsg.style.display = 'none';
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    if (errorMsg) errorMsg.style.display = 'block';
    if (successMsg) successMsg.style.display = 'none';
    if (submitBtn) {
      if (submitBtn.tagName === 'INPUT') submitBtn.value = originalBtnText;
      else submitBtn.innerText = originalBtnText;
    }
  }
}, { capture: true }); // Crucial for bypassing Webflow
