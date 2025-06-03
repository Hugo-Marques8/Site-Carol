document.addEventListener("DOMContentLoaded", function() {
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");
    const currentYearSpan = document.getElementById("currentYear");
    const header = document.querySelector("header");

    // Menu Hamburguer Toggle
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

    // Atualiza o ano no rodapé
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Active link no scroll
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("nav ul#menu li a"); // Renomeado para navLinks para clareza

    if (sections.length > 0 && navLinks.length > 0 && header) {
        const headerHeight = header.offsetHeight;

        const updateActiveLink = () => {
            let currentSectionId = "";
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (scrollPosition >= (sectionTop - (headerHeight + 70))) { // Aumentei um pouco o offset
                    currentSectionId = section.getAttribute("id");
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove("active-link");
                // Verifica se o href do link (removendo o '#') corresponde ao ID da seção atual
                if (link.getAttribute("href").substring(1) === currentSectionId) {
                    link.classList.add("active-link");
                }
            });

            // Caso especial para o link "Home" quando o scroll está no topo
            // ou nenhuma outra seção está "ativa" (currentSectionId permaneceu vazio)
            if (currentSectionId === "" && scrollPosition < (sections[0].offsetTop - (headerHeight + 70))) {
                const homeLink = document.querySelector("nav ul#menu li a[href='#home']");
                if (homeLink) {
                    navLinks.forEach(l => l.classList.remove("active-link")); // Garante que só home esteja ativo
                    homeLink.classList.add("active-link");
                }
            } else if (currentSectionId === "" && sections.length > 0 && scrollPosition < sections[0].offsetTop) {
                 // Se estiver acima da primeira seção, marca o link Home como ativo
                const homeLink = document.querySelector("nav ul#menu li a[href='#home']");
                if (homeLink) {
                    navLinks.forEach(l => l.classList.remove("active-link"));
                    homeLink.classList.add("active-link");
                }
            }
        };
        
        window.addEventListener("scroll", updateActiveLink);
        updateActiveLink(); // Chama uma vez para definir o estado inicial
    }


    // LÓGICA DO CARROSSEL DE MÚLTIPLOS SLIDES COM LOOPING (REVISADO)
    const carrosselMainWrapper = document.querySelector(".carrossel-main-wrapper");
    if (carrosselMainWrapper) {
        const carrosselWrapper = carrosselMainWrapper.querySelector(".carrossel-wrapper");
        const slides = carrosselWrapper ? Array.from(carrosselWrapper.children) : [];
        const nextBtn = carrosselMainWrapper.querySelector(".carrossel-btn.next");
        const prevBtn = carrosselMainWrapper.querySelector(".carrossel-btn.prev");
        const indicadoresContainer = carrosselMainWrapper.querySelector(".carrossel-indicadores");

        if (slides.length > 0 && carrosselWrapper && nextBtn && prevBtn) { // Adicionado checagens para elementos
            let currentIndex = 0; 
            let slidesPerView = getSlidesPerView();
            
            function getSlidesPerView() {
                // Garante que documentElement exista antes de tentar ler seu estilo
                if (document.documentElement) {
                    if (window.innerWidth <= 480) { 
                        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slides-to-show-mobile').trim()) || 1;
                    } else if (window.innerWidth <= 768) { 
                        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slides-to-show-tablet').trim()) || 2;
                    }
                    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slides-to-show-desktop').trim()) || 3;
                }
                return 3; // Fallback genérico se documentElement não estiver pronto
            }
            
            const maxStartIndex = () => Math.max(0, slides.length - slidesPerView);

            function setupCarouselDimensions() {
                slidesPerView = getSlidesPerView();
            }

            const createIndicadores = () => {
                if (!indicadoresContainer) return;
                indicadoresContainer.innerHTML = ''; 
                // Criar um indicador para cada slide individual
                slides.forEach((_, index) => {
                    const indicador = document.createElement("button");
                    indicador.classList.add("carrossel-indicador");
                    indicador.setAttribute("aria-label", `Ir para slide ${index + 1}`);
                    indicador.addEventListener("click", () => {
                        // Ao clicar no indicador, o slide clicado deve ser o início da visualização,
                        // respeitando o limite máximo de índice inicial.
                        applyTransform(Math.min(index, maxStartIndex()));
                    });
                    indicadoresContainer.appendChild(indicador);
                });
            };
            
            const updateIndicadoresVisuais = () => {
                if (!indicadoresContainer) return;
                const currentIndicadores = Array.from(indicadoresContainer.children);
                currentIndicadores.forEach((indicador, idx) => {
                    // O indicador ativo é aquele que corresponde ao primeiro slide visível (currentIndex)
                    if (idx === currentIndex) {
                        indicador.classList.add("active");
                    } else {
                        indicador.classList.remove("active");
                    }
                });
            };
            
            const applyTransform = (slideIndex) => {
                const safeIndex = Math.max(0, Math.min(slideIndex, maxStartIndex()));
                // A largura de cada "passo" de translação é 100% dividido pelo número de slides visíveis.
                // Multiplicamos pelo índice do slide que deve iniciar a visualização.
                const translatePercentage = safeIndex * (100 / slidesPerView); 
                carrosselWrapper.style.transform = `translateX(-${translatePercentage}%)`;
                currentIndex = safeIndex; // Atualiza o índice atual
                updateIndicadoresVisuais();
            };

            nextBtn.addEventListener("click", () => {
                let newStartIndex = currentIndex + 1;
                if (newStartIndex > maxStartIndex() || newStartIndex >= slides.length) { // Adicionado newStartIndex >= slides.length para loop correto
                    newStartIndex = 0; 
                }
                applyTransform(newStartIndex);
            });

            prevBtn.addEventListener("click", () => {
                let newStartIndex = currentIndex - 1;
                if (newStartIndex < 0) {
                    newStartIndex = maxStartIndex(); 
                }
                applyTransform(newStartIndex);
            });
            
            setupCarouselDimensions();
            createIndicadores(); // Criar indicadores após setup inicial
            applyTransform(0); 

            window.addEventListener('resize', () => {
                setupCarouselDimensions();
                createIndicadores(); // Recriar indicadores se slidesPerView mudar
                applyTransform(currentIndex); 
            });
        } else {
            // Opcional: esconder controles do carrossel se não houver slides ou elementos essenciais
            if(carrosselMainWrapper) carrosselMainWrapper.style.display = 'none';
        }
    }
});
