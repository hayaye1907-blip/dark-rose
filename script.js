document.addEventListener('DOMContentLoaded', () => {

  let cart = [];
  const cartCount = document.getElementById('cart-count');
  const cartOpen = document.getElementById('cart-open');
  const cartPanel = document.getElementById('cart-panel');
  const cartPanelClose = document.getElementById('cart-panel-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsEl = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotalPrice = document.getElementById('cart-total-price');

  const overlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalName = document.getElementById('modal-name');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalCartBtn = document.getElementById('modal-cart-btn');

  let selectedSize = null;

  // カートパネルを開く
  cartOpen.addEventListener('click', (e) => {
    e.preventDefault();
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
  });

  // カートパネルを閉じる
  cartPanelClose.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  });

  cartOverlay.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  });

  // カート表示を更新
  function updateCartPanel() {
    cartCount.textContent = cart.length;
    cartCount.classList.toggle('visible', cart.length > 0);

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">カートに商品がありません</p>';
      cartFooter.style.display = 'none';
      return;
    }

    cartFooter.style.display = 'block';

    let total = 0;
    cartItemsEl.innerHTML = cart.map(item => {
      total += parseInt(item.price.toString().replace(/[^0-9]/g, ''));
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-size">SIZE : ${item.size || '-'}</p>
          </div>
          <p class="cart-item-price">¥${parseInt(item.price.toString().replace(/[^0-9]/g, '')).toLocaleString()}</p>
        </div>
      `;
    }).join('');

    cartTotalPrice.textContent = '¥' + total.toLocaleString();
  }

  // サイズボタンのクリック
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
    });
  });

  // 商品カードをクリックしてモーダルを開く
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('cart-btn')) return;

      modalImg.src = card.dataset.img;
      modalImg.alt = card.dataset.name;
      modalName.textContent = card.dataset.name;
      modalPrice.textContent = card.dataset.price;
      modalDesc.textContent = card.dataset.desc;

      modalCartBtn.dataset.name = card.dataset.name;
      modalCartBtn.dataset.price = card.dataset.price;
      modalCartBtn.textContent = 'ADD TO CART';
      modalCartBtn.classList.remove('added');

      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      selectedSize = null;

      overlay.classList.add('active');
    });
  });

  // モーダルを閉じる
  modalClose.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  // カートに追加（カード上のボタン）
  document.querySelectorAll('.product-card .cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.push({ name: btn.dataset.name, price: btn.dataset.price, size: '-' });
      btn.textContent = 'ADDED';
      btn.classList.add('added');
      updateCartPanel();
    });
  });

  // カートに追加（モーダル内のボタン）
  modalCartBtn.addEventListener('click', () => {
    if (!selectedSize) {
      modalCartBtn.textContent = 'SELECT A SIZE';
      setTimeout(() => { modalCartBtn.textContent = 'ADD TO CART'; }, 1500);
      return;
    }

    cart.push({
      name: modalCartBtn.dataset.name,
      price: modalCartBtn.dataset.price,
      size: selectedSize
    });

    modalCartBtn.textContent = `ADDED  /  ${selectedSize}`;
    modalCartBtn.classList.add('added');
    updateCartPanel();
  });

});
// スクロール時に要素をフェードイン
  const scrollElements = document.querySelectorAll(
    '.product-card, .section-title, .footer-inner'
  );

  scrollElements.forEach(el => {
    el.classList.add('scroll-hidden');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('scroll-visible');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  scrollElements.forEach(el => {
    observer.observe(el);
  });
