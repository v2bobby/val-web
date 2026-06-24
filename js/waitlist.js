// REEP — waitlist form (demo signup page)
// No backend yet: captures the email visually and shows a success state.
// Swap this for a real POST to your waitlist provider before launch.

function handleWaitlistSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById('waitlistEmail');
  const nameInput = document.getElementById('waitlistName');
  const roleSelect = document.getElementById('waitlistRole');
  const errorEl = document.getElementById('waitlistError');
  const form = document.getElementById('waitlistForm');
  const successState = document.getElementById('waitlistSuccess');

  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    errorEl.textContent = 'Enter a valid email address to join the waitlist.';
    errorEl.style.display = 'block';
    emailInput.focus();
    return false;
  }

  errorEl.style.display = 'none';

  // No backend yet — this is where a real submission would go:
  // fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email, name, role }) })

  const successEmailEl = document.getElementById('successEmail');
  if (successEmailEl) successEmailEl.textContent = email;

  form.style.display = 'none';
  successState.style.display = 'block';
  successState.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return false;
}

function resetWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  const successState = document.getElementById('waitlistSuccess');
  const emailInput = document.getElementById('waitlistEmail');
  const nameInput = document.getElementById('waitlistName');

  if (emailInput) emailInput.value = '';
  if (nameInput) nameInput.value = '';
  form.style.display = 'block';
  successState.style.display = 'none';
}
