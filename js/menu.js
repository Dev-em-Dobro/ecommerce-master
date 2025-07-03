// Menu hamburguer mobile
const botaoMenu = document.querySelector('.menu-hamburguer');
const cabecalho = document.querySelector('header');

if (botaoMenu && cabecalho) {
  botaoMenu.addEventListener('click', () => {
    cabecalho.classList.toggle('menu-ativo');
  });
}