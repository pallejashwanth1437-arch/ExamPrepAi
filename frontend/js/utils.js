// Utility helper functions

/**
 * Initializes floating background particles in a container.
 */
export function initParticles() {
  const el = document.getElementById('particles');
  if (!el) return;
  
  // Clear any existing particles
  el.innerHTML = '';
  
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${4 + Math.random() * 4}s;
    `;
    el.appendChild(p);
  }
}
