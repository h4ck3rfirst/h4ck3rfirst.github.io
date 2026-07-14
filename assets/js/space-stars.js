// assets/js/space-stars.js
document.addEventListener('DOMContentLoaded', () => {
  // Static scattered stars
  const staticContainer = document.createElement('div');
  staticContainer.className = 'static-stars';
  document.body.appendChild(staticContainer);

  function createStaticStar() {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3.5 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDelay = `-${Math.random() * 4}s`;
    staticContainer.appendChild(star);
  }

  for (let i = 0; i < 450; i++) createStaticStar();   // ~450 stars

  // Mouse-following canvas trail
  const canvas = document.createElement('canvas');
  canvas.id = 'star-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: 0, y: 0 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1.5;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.life = 70;
      this.color = `hsl(${190 + Math.random() * 70}, 100%, 95%)`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      this.size *= 0.975;
    }
    draw() {
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(5, 5, 25, 0.18)'; // nice trail effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }

  // Mouse movement → create stars
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    for (let i = 0; i < 7; i++) {  // density of trail
      particles.push(new Particle(mouse.x, mouse.y));
    }
  });

  animate();
});