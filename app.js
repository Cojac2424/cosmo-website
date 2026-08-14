const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

// Prototype inquiry storage. The final live build will replace this with
// Supabase so inquiries are securely stored and available across devices.
const form = document.getElementById('inquiryForm');
const status = document.getElementById('formStatus');

form?.addEventListener('submit', (event) => {
  
  const data = Object.fromEntries(new FormData(form).entries());
  const inquiry = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    created_at: new Date().toISOString(),
    status: 'New',
    ...data
  };
  const existing = JSON.parse(localStorage.getItem('cosmo_inquiries') || '[]');
  existing.unshift(inquiry);
  localStorage.setItem('cosmo_inquiries', JSON.stringify(existing));
  status.textContent = 'Thank you — your inquiry has been received.';
  form.reset();
});
