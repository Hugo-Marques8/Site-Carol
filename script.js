document.addEventListener("DOMContentLoaded", function() {
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");
    const currentYearSpan = document.getElementById("currentYear");
    const header = document.querySelector("header");

    // Menu Hamburguer Toggle (mantido como antes)
    if (burger && menu) {
        burger.addEventListener("click", function (event) {
            event.stopPropagation();
            menu.classList.toggle("active");
            const isExpanded = menu.classList.contains("active");
            burger.setAttribute("aria-expanded", isExpanded.toString());
            burger.innerHTML = isExpanded ? "close" : "menu";
        });

        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    burger.setAttribute("aria-expanded", "false");
                    burger.innerHTML = "menu";
                }
            });
        });

        document.addEventListener("click", function(event) {
            if (menu.classList.contains("active") && !menu.contains(event.target) && !burger.contains(event.target)) {
                menu.classList.remove("active");
                burger.setAttribute("aria-expanded", "false");
                burger.innerHTML = "menu";
            }
        });

        if (burger) {
            burger.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    burger.click();
                }
            });
        }
    }

    // Atualiza o ano no rodapé (mantido como antes)
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Active link no scroll (mantido como antes)
    const sections = document.querySelectorAll("main section[id]");
    const navLi = document.querySelectorAll("nav ul#menu li a");

    if (sections.length > 0 && navLi.length > 0 && header) {
        window.addEventListener("scroll", () => {
            let current = "";
            const headerHeight = header.offsetHeight;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - (headerHeight + 40))) {
                    current = section.getAttribute("id");
                }
            });

            navLi.forEach((a) => {
                a.classList.remove("active-link");
                if (a.getAttribute("href").includes(current)) {
                    a.classList.add("active-link");
                }
            });
            if (window.pageYOffset < (sections[0].offsetTop - (headerHeight + 40) )) {
                 navLi.forEach((a) => a.classList.remove("active-link"));
                 const homeLink = document.querySelector("nav ul#menu li a[href='#home']");
                 if(homeLink) homeLink.classList.add("active-link");
            }
        });
    }


    // LÓGICA DO CARROSSEL DE MÚLTIPLOS SLIDES COM LOOPING
    const carrosselMainWrapper = document.querySelector(".carrossel-main-wrapper");
    if (carrosselMainWrapper) {
        const carrosselWrapper = carrosselMainWrapper.querySelector(".carrossel-wrapper");
        const slides = Array.from(carrosselWrapper.children);
        const nextBtn = carrosselMainWrapper.querySelector(".carrossel-btn.next");
        const prevBtn = carrosselMainWrapper.querySelector(".carrossel-btn.prev");
        const indicadoresContainer = carrosselMainWrapper.querySelector(".carrossel-indicadores");

        if (slides.length > 0) {
            let currentIndex = 0; // O índice do primeiro slide atualmente visível
            let slidesPerView = getSlidesPerView(); // Função para obter slides por view baseado na tela

            // Função para determinar quantos slides mostrar (mantida como antes)
            function getSlidesPerView() {
                if (window.innerWidth <= 768 && window.innerWidth > 480) { // Tablet
                    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slides-to-show-tablet').trim()) || 2;
                } else if (window.innerWidth <= 480) { // Mobile
                    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slides-to-show-mobile').trim()) || 1;
                }
                return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slides-to-show-desktop').trim()) || 3;
            }

            // Função para configurar as dimensões do carrossel (mantida como antes)
            function setupCarouselDimensions() {
                slidesPerView = getSlidesPerView();
                // A largura dos slides é definida pelo CSS, o JS apenas recalcula a posição.
            }

            // Cria os indicadores (mantido como antes, mas com ajuste para total de "páginas" se desejar)
            // Para loop infinito, os indicadores podem representar cada slide individualmente ou cada "página"
            // Por simplicidade, faremos os indicadores para cada slide, mas a navegação é por "grupo".
            indicadoresContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const indicador = document.createElement("button");
                indicador.classList.add("carrossel-indicador");
                indicador.setAttribute("aria-label", `Ir para slide ${index + 1}`);
                indicador.addEventListener("click", () => {
                    goToSlide(index); // Ao clicar no indicador, vai para aquele slide
                });
                indicadoresContainer.appendChild(indicador);
            });
            const indicadores = Array.from(indicadoresContainer.children);

            const updateIndicadores = () => {
                indicadores.forEach(indicador => indicador.classList.remove("active"));
                // O indicador ativo é o do primeiro slide visível
                if (indicadores[currentIndex]) {
                    indicadores[currentIndex].classList.add("active");
                }
            };

            const goToSlide = (index) => {
                const totalSlides = slides.length;
                const maxPossibleIndex = totalSlides - slidesPerView; // Último índice que pode ser o começo de um "grupo" visível

                let targetIndex = index;

                // Lógica de LOOPING para o próximo slide
                // Se o índice-alvo for maior que o último índice que pode iniciar um grupo visível,
                // e ainda há slides para "passar" que não foram vistos no último grupo completo,
                // ou se já passamos de todos os slides e queremos voltar para o início.
                if (targetIndex > maxPossibleIndex && totalSlides > slidesPerView) {
                    targetIndex = 0; // Volta para o início do carrossel
                } else if (targetIndex >= totalSlides) { // Caso excepcional onde totalSlides <= slidesPerView
                    targetIndex = 0; // Volta para o início
                }

                // Lógica de LOOPING para o slide anterior
                if (targetIndex < 0) {
                    // Se o índice-alvo é menor que zero, vai para o início do último "grupo" visível
                    targetIndex = maxPossibleIndex;
                    if (targetIndex < 0) targetIndex = 0; // Fallback se slidesPerView for maior que totalSlides
                }

                // Calcula o deslocamento percentual
                const translatePercentage = targetIndex * (100 / slidesPerView);
                carrosselWrapper.style.transform = `translateX(-${translatePercentage}%)`;
                
                currentIndex = targetIndex;
                updateIndicadores();
            };

            if (nextBtn && prevBtn) {
                nextBtn.addEventListener("click", () => {
                    goToSlide(currentIndex + 1); // Tenta ir para o próximo slide
                });

                prevBtn.addEventListener("click", () => {
                    goToSlide(currentIndex - 1); // Tenta ir para o slide anterior
                });
            }
            
            setupCarouselDimensions(); // Configura dimensões iniciais
            goToSlide(0); // Garante que o carrossel comece no primeiro slide

            // Recalcula e reajusta no redimensionamento (mantido como antes)
            window.addEventListener('resize', () => {
                setupCarouselDimensions();
                goToSlide(currentIndex);
            });
        }
    }
});