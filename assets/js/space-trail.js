document.addEventListener("DOMContentLoaded", () => {
    const bg = document.querySelector('.space-bg');
    if (!bg) return;

    document.addEventListener("mousemove", (e) => {
        // 1. Smooth background parallax shift
        const moveX = (window.innerWidth / 2 - e.clientX) * 0.02;
        const moveY = (window.innerHeight / 2 - e.clientY) * 0.02;
        bg.style.transform = `translate(${moveX}px, ${moveY}px)`;

        // 2. Performance boundary control for mouse trail density
        if (Math.random() > 0.15) return;

        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = `${e.clientX + window.scrollX}px`;
        star.style.top = `${e.clientY + window.scrollY}px`;

        const size = Math.random() * 4 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const starX = Math.cos(angle) * distance;
        const starY = Math.sin(angle) * distance;

        star.style.setProperty("--mx", `${starX}px`);
        star.style.setProperty("--my", `${starY}px`);

        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1500);
    });
});
