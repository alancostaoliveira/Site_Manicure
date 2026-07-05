/**
 * Script Principal - Projeto Manicure Cristiane Oliveira
 * Contém lógica para Carrossel, Dark Mode, Validação de Formulário e Menu Mobile
 */

// --- 1. CONFIGURAÇÃO DO CARROSSEL (EFEITO INTERATIVO 1) ---
let carouselTrack = null;
let prevBtn = null;
let nextBtn = null;
let slides = [];
let slideGap = 0;
let autoplayInterval = 4000; // ms
let autoplayTimer = null;
let resumeTimer = null;
let isPaused = false;
let currentIndex = 0;

function initCarousel() {
    carouselTrack = document.querySelector('.carousel-slide');
    prevBtn = document.querySelector('.prev');
    nextBtn = document.querySelector('.next');
    if (!carouselTrack) return;

    slides = Array.from(carouselTrack.querySelectorAll('.slide'));
    const trackStyles = window.getComputedStyle(carouselTrack);
    slideGap = parseFloat(trackStyles.gap || '0');

    createDots();
    carouselTrack.addEventListener('scroll', onScroll);
    window.addEventListener('resize', () => createDots());

    // Prev/Next buttons pause autoplay briefly
    if (prevBtn) prevBtn.addEventListener('click', () => { pauseAutoplay(); changeSlide(-1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { pauseAutoplay(); changeSlide(1); });

    // Touch / Swipe support
    let startX = 0;
    let isTouch = false;
    carouselTrack.addEventListener('touchstart', (e) => {
        isTouch = true;
        startX = e.touches[0].clientX;
        pauseAutoplay();
    }, {passive: true});

    carouselTrack.addEventListener('touchend', (e) => {
        if (!isTouch) return;
        const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
        const diff = startX - endX;
        const threshold = 40; // px
        if (Math.abs(diff) > threshold) {
            changeSlide(Math.sign(diff));
        }
        isTouch = false;
        resumeAutoplay(2000);
    });

    // Mouse hover/focus pause
    carouselTrack.addEventListener('mouseenter', pauseAutoplay);
    carouselTrack.addEventListener('mouseleave', () => resumeAutoplay(500));
    carouselTrack.addEventListener('focusin', pauseAutoplay);
    carouselTrack.addEventListener('focusout', () => resumeAutoplay(500));

    // Pause when document hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseAutoplay(); else resumeAutoplay(500);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { pauseAutoplay(); changeSlide(-1); }
        if (e.key === 'ArrowRight') { pauseAutoplay(); changeSlide(1); }
    });

    // Ensure starting position and dots
    currentIndex = 0;
    setIndex(0);

    // Start autoplay if multiple slides
    startAutoplay();
}

function changeSlide(direction) {
    // direction: 1 or -1
    if (!carouselTrack || slides.length === 0) return;
    const next = (currentIndex + direction + slides.length) % slides.length;
    setIndex(next);
}

function setIndex(idx) {
    if (!carouselTrack || slides.length === 0) return;
    currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
    const left = currentIndex * (slides[0].clientWidth + slideGap);
    carouselTrack.scrollTo({ left, behavior: 'smooth' });
    updateActiveDot();
}

function startAutoplay() {
    if (autoplayTimer || isPaused || slides.length <= 1) return;
    autoplayTimer = setInterval(() => {
        changeSlide(1);
    }, autoplayInterval);
}

function pauseAutoplay() {
    isPaused = true;
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
    if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
    }
}

function resumeAutoplay(delay = 1000) {
    isPaused = false;
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
        startAutoplay();
    }, delay);
}

function createDots() {
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!dotsContainer || slides.length === 0) return;
    // Rebuild dots to account for size changes
    dotsContainer.innerHTML = '';
    slides.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.className = 'dot';
        btn.setAttribute('aria-label', `Ir para slide ${idx + 1}`);
        btn.addEventListener('click', () => {
            pauseAutoplay();
            setIndex(idx);
            resumeAutoplay(3000);
        });
        dotsContainer.appendChild(btn);
    });
    updateActiveDot();
}

let scrollTimer = null;
function onScroll() {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        if (!carouselTrack || slides.length === 0) return;
        const step = slides[0].clientWidth + slideGap;
        const nearest = Math.round(carouselTrack.scrollLeft / step);
        currentIndex = Math.max(0, Math.min(nearest, slides.length - 1));
        updateActiveDot();
    }, 80);
}

function updateActiveDot() {
    const dots = document.querySelectorAll('.carousel-dots .dot');
    if (!dots.length || !carouselTrack) return;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

window.addEventListener('DOMContentLoaded', initCarousel);

// --- 2. DARK MODE TOGGLE (EFEITO INTERATIVO 2) ---
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = darkModeToggle.querySelector('.icon');
        const isDark = document.body.classList.contains('dark-mode');

        // Altera o ícone dinamicamente
        if (icon) icon.textContent = isDark ? '☀️' : '🌙';

        // Persistência da preferência do usuário
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Aplicar tema salvo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('.icon');
            if (icon) icon.textContent = '☀️';
        }
    }
});

// --- 3. VALIDAÇÃO DE FORMULÁRIO (REQUISITO OBRIGATÓRIO) ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Limpar mensagens de erro anteriores
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

        // Validação do Nome
        if (name.value.trim().length < 3) {
            document.getElementById('nameError').textContent = 'O nome deve ter pelo menos 3 caracteres.';
            isValid = false;
        }

        // Validação do E-mail (Regex simples)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            document.getElementById('emailError').textContent = 'Por favor, insira um e-mail válido.';
            isValid = false;
        }

        // Validação da Mensagem
        if (message.value.trim().length < 10) {
            document.getElementById('messageError').textContent = 'A mensagem deve conter pelo menos 10 caracteres.';
            isValid = false;
        }

        // Se tudo estiver correto
        if (isValid) {
            const successDiv = document.getElementById('successMessage');
            if (successDiv) {
                successDiv.classList.remove('hidden');
                successDiv.style.color = 'green';
                successDiv.style.marginTop = '15px';
                contactForm.reset();

                // Ocultar mensagem de sucesso após 5 segundos
                setTimeout(() => {
                    successDiv.classList.add('hidden');
                }, 5000);
            }
        }
    });
}

// --- 4. MENU MOBILE (MENU HAMBÚRGUER) ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Ativa/desativa a visibilidade do menu
        mobileMenu.classList.toggle('open'); // Ativa/desativa a animação do ícone
    });
}
