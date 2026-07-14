// assets/js/planet.js
document.addEventListener('DOMContentLoaded', () => {
  const planetContainer = document.createElement('div');
  planetContainer.style.position = 'fixed';
  planetContainer.style.bottom = '15%';
  planetContainer.style.right = '8%';
  planetContainer.style.width = '120px';
  planetContainer.style.height = '120px';
  planetContainer.style.zIndex = '-1';
  planetContainer.style.opacity = '0.85';
  planetContainer.style.pointerEvents = 'none';
  document.body.appendChild(planetContainer);

  // Planet with rings + glow
  planetContainer.innerHTML = `
    <div class="planet" style="
      width: 100%; height: 100%; 
      background: radial-gradient(circle at 40% 40%, #4a9eff, #1e3a8a 70%, #0f172a);
      border-radius: 50%;
      box-shadow: 
        0 0 40px #60a5fa,
        inset 30px 20px 40px rgba(255,255,255,0.3),
        inset -20px -30px 50px rgba(0,0,0,0.8);
      animation: orbit 25s linear infinite;
      position: relative;
    ">
      <!-- Rings -->
      <div style="
        position: absolute; top: 35%; left: -20%; 
        width: 140%; height: 25%; 
        background: transparent;
        border: 3px solid rgba(180, 220, 255, 0.4);
        border-radius: 50%;
        transform: rotate(-25deg);
        box-shadow: 0 0 20px rgba(180, 220, 255, 0.6);
      "></div>
    </div>
  `;

  // Pulse animation
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes orbit {
      from { transform: rotate(0deg) translate(8px) rotate(0deg); }
      to   { transform: rotate(360deg) translate(8px) rotate(-360deg); }
    }
    .planet:hover { 
      box-shadow: 0 0 60px #93c5fd; 
      transform: scale(1.1); 
    }
  `;
  document.head.appendChild(style);
});