// Tailwind script initialization
function initializeTailwind() {
  tailwind.config = {
    content: [],
    theme: {
      extend: {
        colors: {
          accent: '#00D4FF'
        }
      }
    }
  }
}

// Modal controls
function showWaitlistModal() {
  document.getElementById('waitlistModal').classList.remove('hidden')
  document.getElementById('waitlistModal').classList.add('flex')
}

function hideWaitlistModal() {
  const modal = document.getElementById('waitlistModal')
  modal.classList.add('hidden')
  modal.classList.remove('flex')
}

// Demo form submission
function handleSubmit(e) {
  e.preventDefault()
  const email = document.getElementById('email').value
  if (email) {
    alert("✅ Thank you! You're now on the VaultLane early access list.\n\nA confirmation has been sent to " + email)
    hideWaitlistModal()
    // In production this would POST to your backend
  }
}

// Smooth scroll and micro-interactions
document.addEventListener('DOMContentLoaded', () => {
  initializeTailwind()
  console.log('%c🚀 VaultLane Landing Page initialized – premium tech experience ready', 'color:#00D4FF; font-family:monospace;')
})