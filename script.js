// 粒子背景动画
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = ['#00f5ff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 3)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 初始化粒子
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// 连接线
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = '#00f5ff';
                ctx.globalAlpha = 0.1 * (1 - distance / 120);
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
}

animate();

// 窗口大小调整
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.work-card, .skill-category').forEach(el => {
    observer.observe(el);
});

// 技能条动画
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    const progress = item.querySelector('.skill-progress');
                    const level = item.dataset.level;
                    progress.style.width = level + '%';
                }, index * 200);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skills-container').forEach(el => {
    skillObserver.observe(el);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 导航栏滚动效果
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(10, 10, 15, 0.98)';
    } else {
        nav.style.background = 'rgba(10, 10, 15, 0.9)';
    }
    
    lastScroll = currentScroll;
});

// 鼠标跟随光效
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.work-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

console.log('🦞 AI Portfolio loaded successfully!');

// 复制邮箱功能
function copyEmail(element, email) {
    navigator.clipboard.writeText(email).then(() => {
        const linkText = element.querySelector('.link-text');
        const originalText = linkText.textContent;
        linkText.textContent = 'Email地址已复制！';
        element.style.color = '#00f5ff';

        setTimeout(() => {
            linkText.textContent = originalText;
            element.style.color = '';
        }, 2000);
    }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const linkText = element.querySelector('.link-text');
        const originalText = linkText.textContent;
        linkText.textContent = 'Email地址已复制！';
        setTimeout(() => {
            linkText.textContent = originalText;
        }, 2000);
    });
}

// 复制小红书号功能
function copyXHS(element, xhsId) {
    navigator.clipboard.writeText(xhsId).then(() => {
        const linkText = element.querySelector('.link-text');
        linkText.textContent = '已复制到剪贴板';
        element.style.color = '#ff2442';

        setTimeout(() => {
            linkText.textContent = '小红书';
            element.style.color = '';
        }, 2000);
    }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = xhsId;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const linkText = element.querySelector('.link-text');
        linkText.textContent = '已复制到剪贴板';
        setTimeout(() => {
            linkText.textContent = '小红书';
        }, 2000);
    });
}
