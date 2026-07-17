/* ===================================================
   CONFIGURAÇÕES
=================================================== */

// Coloque aqui a data em que vocês começaram a namorar (Formato: ANO-MÊS-DIA)
const DATA_NAMORO = new Date('2026-06-27T00:00:00');

// Texto que será digitado na capa
const TEXTO = 'Você é um anjo? Parece ter vindo de uma galáxia bem distante...✨💖';

/* ===================================================
   ELEMENTOS
=================================================== */

const openingSection = document.getElementById('opening');
const appSection = document.getElementById('app');
const openLetterButton = document.getElementById('openLetter');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const typingEl = document.getElementById('typing');
const music = document.getElementById('music');
const transitionContainer = document.getElementById('ship-transition');

/* ===================================================
   EVENTO UNIFICADO: TRANSIÇÃO DA NAVE AO ABRIR
=================================================== */

if (openLetterButton) {
    openLetterButton.addEventListener('click', () => {
        
        // 1. Toca a música imediatamente após o clique
        if (music) {
            music.play().catch(error => console.log("Erro ao tocar áudio:", error));
        }

        // 2. Ativa a transição da nave cruzando a tela
        if (transitionContainer) {
            transitionContainer.classList.add('active');
        }

        // 3. Aguarda o pico do flash branco (900ms) para fazer a troca de telas por trás dele
        setTimeout(() => {
            
            // Esconde a tela do envelope
            if (openingSection) {
                openingSection.style.display = 'none';
            }

            // Revela o site principal
            if (appSection) {
                appSection.style.display = 'block';
            }

            // Inicia o efeito de digitação no momento exato em que o site aparece
            iniciarDigitacao();

        }, 900); // Executa no ápice do clarão branco

        // 4. Remove a classe de transição após o efeito acabar para limpar a tela
        setTimeout(() => {
            if (transitionContainer) {
                transitionContainer.classList.remove('active');
            }
        }, 2000); // Tempo total para a nave sumir completamente
    });
}

/* ===================================================
   TEXTO DIGITANDO
=================================================== */

function iniciarDigitacao() {
    if (!typingEl) return;
    
    let i = 0;
    typingEl.textContent = '';

    const intervalo = setInterval(() => {
        typingEl.textContent += TEXTO[i];
        i++;

        if (i >= TEXTO.length) {
            clearInterval(intervalo);
        }
    }, 45);
}

/* ===================================================
   CONTADOR
=================================================== */

function atualizarContador() {
    const agora = new Date();
    const diff = agora - DATA_NAMORO;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = dias;
    if (hoursEl) hoursEl.textContent = horas;
    if (minutesEl) minutesEl.textContent = minutos;
    if (secondsEl) secondsEl.textContent = segundos;
}

atualizarContador();
setInterval(atualizarContador, 1000);

/* ===================================================
   CARTINHAS
=================================================== */

document.querySelectorAll('.letter').forEach(carta => {
    carta.addEventListener('click', () => {
        carta.classList.toggle('open');
    });
});

/* ===================================================
   EFEITO SWIPE DA GALERIA (ESTILO INSTAGRAM)
=================================================== */

const track = document.getElementById('galleryTrack');
const dots = document.querySelectorAll('.dot');

if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // --- 1. Sincronização automática dos pontinhos (Dots) ---
    const observerOptions = {
        root: track,
        threshold: 0.5 // Ativa o ponto quando 50% da foto se sobressair
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const cards = Array.from(track.children);
                const index = cards.indexOf(entry.target);
                
                dots.forEach((dot, idx) => {
                    if (idx === index) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Monitora cada slide individualmente
    Array.from(track.children).forEach((card) => {
        observer.observe(card);
    });

    // --- 2. Suporte para arrastar com Mouse no Desktop ---
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.scrollBehavior = 'auto'; // Desativa transição para movimentação livre
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
        if (!isDown) return;
        isDown = false;
        snapScroll();
    });

    track.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        snapScroll();
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.3; // Sensibilidade de arraste
        track.scrollLeft = scrollLeft - walk;
    });

    // Força a imagem a travar no ponto certo (snapping) ao soltar o mouse
    function snapScroll() {
        track.style.scrollBehavior = 'smooth';
        const cardWidth = track.clientWidth;
        const currentScroll = track.scrollLeft;
        
        const nearestSlide = Math.round(currentScroll / cardWidth);
        track.scrollLeft = nearestSlide * cardWidth;
    }
}

/* ===================================================
   CHUVA DE GIRASSÓIS E CORAÇÕES AO CLICAR NO BOTÃO FINAL
=================================================== */

const loveButton = document.getElementById('loveButton');

if (loveButton) {
    loveButton.addEventListener('click', () => {
        // Lista de emojis que vão cair (foco em girassóis e corações)
        const emojis = ['🌻', '❤️', '🌻', '💖', '🌻', '✨', '💛'];
        
        // Dispara 60 partículas na tela
        for (let i = 0; i < 60; i++) {
            // Usa o setTimeout para criar um efeito de fluxo contínuo
            setTimeout(() => {
                const particle = document.createElement('div');
                
                // Reutiliza a classe 'heart' que você já tem no CSS para aplicar a animação de queda
                particle.className = 'heart'; 
                
                // Escolhe um emoji aleatório da nossa lista
                particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                
                // Define uma posição horizontal aleatória (de 0% a 100% da largura da tela)
                particle.style.left = Math.random() * 100 + 'vw';
                
                // Define um tamanho aleatório (entre 20px e 40px)
                particle.style.fontSize = Math.random() * 20 + 20 + 'px';
                
                // Define uma velocidade de queda aleatória (entre 2 e 4.5 segundos)
                const duracao = Math.random() * 2.5 + 2; 
                particle.style.animationDuration = duracao + 's';
                
                // Adiciona a partícula ao corpo do site
                document.body.appendChild(particle);
                
                // Remove a partícula do site assim que a animação termina
                setTimeout(() => {
                    particle.remove();
                }, duracao * 1000);
                
            }, i * 60); // Cria um espacinho de tempo (60ms) entre a queda de cada emoji
        }
    });
}

/* ===================================================
   GERADOR DE ESTRELAS NO FUNDO (CÉU ESTRELADO)
=================================================== */

function createStarrySky() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    const numberOfStars = 120; // Quantidade de estrelas na tela

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Posição aleatória na tela (de 0 a 100%)
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Tamanhos variados para efeito de profundidade (entre 1px e 3px)
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Velocidade da piscada aleatória (entre 2 e 5 segundos)
        const duration = Math.random() * 3 + 2;
        star.style.animationDuration = duration + 's';

        // Atraso aleatório para que elas não pisquem todas juntas no mesmo segundo
        const delay = Math.random() * 5;
        star.style.animationDelay = delay + 's';

        starsContainer.appendChild(star);
    }
}

// Inicializa o céu estrelado assim que a página carregar
window.addEventListener('DOMContentLoaded', createStarrySky);