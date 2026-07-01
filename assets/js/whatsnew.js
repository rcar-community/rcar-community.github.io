document.addEventListener('DOMContentLoaded', function () {
  const config = document.getElementById('whatsnew-config');
  const itemsPerPage = config ? parseInt(config.dataset.itemsPerPage, 10) : 10;  let visibleCount = itemsPerPage;
  let currentCategory = 'All';
  let currentProduct = 'All';

  const allItems = Array.from(document.querySelectorAll('.whatsnew-item'));
  const moreBtn = document.getElementById('wn-more-btn');

  function getFiltered() {
    return allItems.filter(function (item) {
      const categoryMatch = currentCategory === 'All' || item.dataset.category === currentCategory;
      const productMatch = currentProduct === 'All' || item.dataset.product === currentProduct;
      return categoryMatch && productMatch;
    });
  }

  function render() {
    const filtered = getFiltered();
    allItems.forEach(i => i.style.display = 'none');
    filtered.slice(0, visibleCount).forEach(i => i.style.display = '');
    if (moreBtn) {
      moreBtn.style.display = filtered.length > visibleCount ? '' : 'none';
    }
  }

  // フィルタボタン
  document.querySelectorAll('.wn-filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const filterType = this.dataset.filter;
      // 同じグループのボタンのactiveを外す
      document.querySelectorAll(`.wn-filter-btn[data-filter="${filterType}"]`)
        .forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      if (filterType === 'category') {
        currentCategory = this.dataset.category;
      } else if (filterType === 'product') {
        currentProduct = this.dataset.category;
      }
      visibleCount = itemsPerPage;
      render();
    });
  });

  // moreボタン
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      visibleCount += itemsPerPage;
      render();
    });
  }

  render();
});
