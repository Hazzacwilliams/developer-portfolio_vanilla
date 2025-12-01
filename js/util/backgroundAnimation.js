/**
 * Canvas-based background animation for better performance
 * Replaces DOM-based dot animation with canvas rendering
 */
export function initBackgroundAnimation() {
    const canvas = document.createElement('canvas');
    canvas.className = 'background-dot__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const wrapper = document.querySelector('.background-dot__wrapper');
    if (!wrapper) return;

    // Replace wrapper content with canvas
    wrapper.innerHTML = '';
    wrapper.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let dots = [];
    const maxDots = 50; // Limit number of dots for performance

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dot class
    class Dot {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Start at random position
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.speed = 2 + Math.random() * 3;
            this.size = 4 + Math.random() * 4;
            this.color = {
                r: Math.random() * 255,
                g: Math.random() * 255,
                b: Math.random() * 255
            };
        }

        update() {
            this.y += this.speed;
            if (this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
            ctx.fill();
        }
    }

    // Initialize dots
    for (let i = 0; i < maxDots; i++) {
        dots.push(new Dot());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        dots.forEach(dot => {
            dot.update();
            dot.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation only if user prefers motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
        animate();
    }

    // Handle reduced motion preference changes
    prefersReducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            animate();
        }
    });

    // Cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
    };
}


