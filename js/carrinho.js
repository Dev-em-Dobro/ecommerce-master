// Função para ler o carrinho do localStorage (ou criar vazio)
function obterCarrinho() {
  const armazenado = localStorage.getItem('carrinho');
  return armazenado ? JSON.parse(armazenado) : [];
}

// Função para salvar o carrinho no localStorage
function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function removerDoCarrinho(produtoId) {
    const carrinho = obterCarrinho();
    const carrinhoAtualizado = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(carrinhoAtualizado);
}

// Atualiza o número exibido ao lado do carrinho
function atualizarContadorCarrinho() {
  const carrinho = obterCarrinho();
  const total = carrinho.reduce((soma, item) => soma + (item.quantidade || 1), 0);
  document.getElementById('contador-carrinho').textContent = total;
}

// Função para renderizar a tabela do carrinho
function renderizarTabelaCarrinho() {
  const carrinho = obterCarrinho();
  const corpoTabela = document.querySelector('#modal-1-content table tbody');
  if (!corpoTabela) return;
  corpoTabela.innerHTML = '';
  carrinho.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.imagem || './assets/images/camiseta_roxa.jpg'}" alt="${item.nome}" /></td>
      <td>${item.nome}</td>
      <td>R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
      <td><input type="number" value="${item.quantidade}" min="1" data-id="${item.id}" class="input-quantidade" /></td>
      <td><strong>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong></td>
      <td><button class="btn-deletar" data-id="${item.id}">Deletar</button></td>
    `;
    corpoTabela.appendChild(tr);
  });
}

// Chama ao carregar a página
renderizarTabelaCarrinho();

// Função para atualizar o valor total do carrinho
function atualizarTotalCarrinho() {
  const carrinho = obterCarrinho();
  const total = carrinho.reduce((soma, item) => soma + (item.preco * (item.quantidade || 1)), 0);
  const totalSpan = document.getElementById('total-carrinho');
  if (totalSpan) {
    totalSpan.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

// Atualiza tabela, contador e total juntos
function atualizarCarrinhoETabela() {
  atualizarContadorCarrinho();
  renderizarTabelaCarrinho();
  atualizarTotalCarrinho();
}

// Ao carregar a página, já exibe o count correto
atualizarContadorCarrinho();

const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

// Adiciona o listener em todos os botões ".adicionar-ao-carrinho"
botoesAdicionarAoCarrinho.forEach(botao => {
  botao.addEventListener('click', evento => {
    
    const elementoProduto = evento.target.closest('.produto');
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector('.nome').textContent;
    const produtoPreco = parseFloat(
      elementoProduto.querySelector('.preco')
          .textContent
          .replace('R$', '')
          .replace('.', '')
          .replace(',', '.')
    );
    const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');

    // Carrega o carrinho
    const carrinho = obterCarrinho();
    // Procura se já existe o produto
    const existente = carrinho.find(item => item.id === produtoId);
    if (existente) {
      existente.quantidade = (existente.quantidade || 1) + 1;
    } else {
      carrinho.push({
        id: produtoId,
        nome: produtoNome,
        preco: produtoPreco,
        quantidade: 1,
        imagem: produtoImagem
      });
    }
    salvarCarrinho(carrinho);
    atualizarCarrinhoETabela();
  });
});

// Evento para deletar produto do carrinho
// Usa delegação de eventos para pegar qualquer botão de deletar
const corpoTabela = document.querySelector('#modal-1-content table tbody');
corpoTabela.addEventListener('click', function(evento) {
  if (evento.target.classList.contains('btn-deletar')) {
    const id = evento.target.getAttribute('data-id');
    removerDoCarrinho(id);
    atualizarCarrinhoETabela();
  }
});

// Evento para atualizar quantidade do produto no carrinho
corpoTabela.addEventListener('input', function(evento) {
  if (evento.target.classList.contains('input-quantidade')) {
    const id = evento.target.getAttribute('data-id');
    let novaQuantidade = parseInt(evento.target.value, 10);
    if (isNaN(novaQuantidade) || novaQuantidade < 1) novaQuantidade = 1;
    const carrinho = obterCarrinho();
    const item = carrinho.find(item => item.id === id);
    if (item) {
      item.quantidade = novaQuantidade;
      salvarCarrinho(carrinho);
      atualizarCarrinhoETabela();
    }
  }
});

// Menu hamburguer mobile
const botaoMenu = document.querySelector('.menu-hamburguer');
const cabecalho = document.querySelector('header');

if (botaoMenu && cabecalho) {
  botaoMenu.addEventListener('click', () => {
    cabecalho.classList.toggle('menu-ativo');
  });
}
