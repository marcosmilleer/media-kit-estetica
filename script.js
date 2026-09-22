// Estado da Aplicação
let currentPage = 0;
const totalPages = 6;

// Inicialização dos Ícones do Lucide
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initDots();
    updatePage();
    setupBeforeAfterSlider();
    setupSwipeGestures();
});

// Renderiza os pontos de paginação do rodapé
function initDots() {
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[#D4AF37] w-4' : 'bg-[#38282E]'}`;
        dotsContainer.appendChild(dot);
    }
}

// Navegação para página específica
function goToPage(index) {
    if (index < 0 || index >= totalPages) return;
    currentPage = index;
    updatePage();
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updatePage();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        updatePage();
    }
}

// Atualiza visualização das páginas, botões e abas
function updatePage() {
    // Páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, idx) => {
        page.classList.toggle('active', idx === currentPage);
    });

    // Abas
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, idx) => {
        tab.classList.toggle('active', idx === currentPage);
        if (idx === currentPage) {
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    // Contador e Pontos
    document.getElementById('page-counter').innerText = `${currentPage + 1} de ${totalPages}`;
    
    const dots = document.getElementById('dots-container').children;
    Array.from(dots).forEach((dot, idx) => {
        if (idx === currentPage) {
            dot.className = 'w-4 h-1.5 rounded-full bg-[#D4AF37] transition-all duration-300';
        } else {
            dot.className = 'w-1.5 h-1.5 rounded-full bg-[#38282E] transition-all duration-300';
        }
    });

    // Estado dos Botões
    document.getElementById('prev-btn').disabled = currentPage === 0;
    document.getElementById('next-btn').disabled = currentPage === totalPages - 1;
}

// Lógica de Deslizar (Swipe) no Celular
function setupSwipeGestures() {
    const slider = document.getElementById('slider');
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            nextPage(); // Arrastou pra esquerda
        } else if (touchEndX - touchStartX > threshold) {
            prevPage(); // Arrastou pra direita
        }
    }
}

// Lógica do Slider Antes e Depois (Página 5)
function setupBeforeAfterSlider() {
    const container = document.getElementById('before-after-slider');
    const beforeImage = document.getElementById('before-image');
    const beforeImgElement = document.getElementById('before-img-element');
    const handle = document.getElementById('slider-handle');

    if (!container || !beforeImage || !handle) return;

    function setSliderWidth() {
        if (container) {
            beforeImgElement.style.width = `${container.offsetWidth}px`;
        }
    }
    setSliderWidth();
    window.addEventListener('resize', setSliderWidth);

    let isDragging = false;

    function move(x) {
        const rect = container.getBoundingClientRect();
        let position = x - rect.left;
        if (position < 0) position = 0;
        if (position > rect.width) position = rect.width;

        const percentage = (position / rect.width) * 100;
        beforeImage.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    }

    container.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        move(e.clientX);
    });

    container.addEventListener('touchstart', () => isDragging = true, { passive: true });
    window.addEventListener('touchend', () => isDragging = false, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        move(e.touches[0].clientX);
    }, { passive: true });
}

// Função para copiar e-mail
function copyEmail() {
    const email = "contato@sofiaestetica.com";
    navigator.clipboard.writeText(email).then(() => {
        showToast("E-mail copiado com sucesso!");
    });
}

// Exibe a notificação Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    toastMsg.innerText = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2500);
}

// Navegação pelas setas do teclado
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
});