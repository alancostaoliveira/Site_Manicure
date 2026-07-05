/**
 * Script Principal - Projeto Manicure Cristiane Oliveira
 * Contém lógica para Carrossel, Dark Mode, Validação de Formulário e Menu Mobile
 */

// --- 1. CONFIGURAÇÃO DO CARROSSEL (EFEITO INTERATIVO 1) ---
const slides = document.getElementsByClassName("slide");

if (slides.length > 0) {
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = i === 0 ? "block" : "none";
    }

    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
}

function changeSlide() {
    // Carrossel fixo no primeiro slide.
}

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
