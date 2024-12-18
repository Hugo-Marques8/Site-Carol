// Seleciona os elementos
const buguer = document.getElementById('buguer');
const menu = document.getElementById('menu');

// Função para alternar a visibilidade do menu
buguer.addEventListener('click', function() {
  // Verifica se o menu está visível
  if (menu.style.display === 'block') {
    menu.style.display = 'none'; // Esconde o menu
  } else {
    menu.style.display = 'block'; // Exibe o menu
  }
});