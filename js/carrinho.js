// Função para ler o carrinho do localStorage (ou criar vazio)
function getCart() {
  const stored = localStorage.getItem('cart');
  return stored ? JSON.parse(stored) : [];
}

// Função para salvar o carrinho no localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
}

// Atualiza o número exibido ao lado do carrinho
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.getElementById('contador-carrinho').textContent = total;
}

// Função para renderizar a tabela do carrinho
function renderCartTable() {
  const cart = getCart();
  const tbody = document.querySelector('#modal-1-content table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.image || './assets/images/camiseta_roxa.jpg'}" alt="${item.name}" /></td>
      <td>${item.name}</td>
      <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
      <td><input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="input-quantidade" /></td>
      <td><strong>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</strong></td>
      <td><button class="btn-deletar" data-id="${item.id}">Deletar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Chama ao carregar a página
renderCartTable();

// Função para atualizar o valor total do carrinho
function updateCartTotal() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const totalSpan = document.getElementById('total-carrinho');
  if (totalSpan) {
    totalSpan.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

// Atualiza tabela, contador e total juntos
function updateCartAndTable() {
  updateCartCount();
  renderCartTable();
  updateCartTotal();
}

// Ao carregar a página, já exibe o count correto
updateCartCount();

const btnsAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

// Adiciona o listener em todos os botões “.add-to-cart”
btnsAdicionarAoCarrinho.forEach(btn => {
  btn.addEventListener('click', event => {
    
    const card = event.target.closest('.produto');
    const productId = card.dataset.id;
    const productName = card.querySelector('.nome').textContent;
    const productPrice = parseFloat(
      card.querySelector('.preco')
          .textContent
          .replace('R$', '')
          .replace('.', '')
          .replace(',', '.')
    );
    const productImage = card.querySelector('img').getAttribute('src');

    // Carrega o carrinho
    const cart = getCart();
    // Procura se já existe o produto
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
        image: productImage
      });
    }
    saveCart(cart);
    updateCartAndTable();
  });
});

// Evento para deletar produto do carrinho
// Usa delegação de eventos para pegar qualquer botão de deletar
const tbody = document.querySelector('#modal-1-content table tbody');
tbody.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn-deletar')) {
    const id = event.target.getAttribute('data-id');
    removeFromCart(id);
    updateCartAndTable();
  }
});

// Evento para atualizar quantidade do produto no carrinho
tbody.addEventListener('input', function(event) {
  if (event.target.classList.contains('input-quantidade')) {
    const id = event.target.getAttribute('data-id');
    let novaQuantidade = parseInt(event.target.value, 10);
    if (isNaN(novaQuantidade) || novaQuantidade < 1) novaQuantidade = 1;
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity = novaQuantidade;
      saveCart(cart);
      updateCartAndTable();
    }
  }
});
