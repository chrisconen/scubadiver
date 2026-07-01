/* ─── Tour filter ─── */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tourCards = document.querySelectorAll('.tour-card');
  const featured = document.querySelector('.tour-featured');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Filter tour cards
      tourCards.forEach(card => {
        const cats = card.dataset.category;
        if (filter === 'all' || cats.includes(filter)) {
          card.style.display = '';
          card.style.opacity = '';
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });

      // Filter featured
      if (featured) {
        const fc = featured.dataset.category;
        if (filter === 'all' || fc.includes(filter)) {
          featured.style.display = '';
          featured.style.opacity = '';
        } else {
          featured.style.opacity = '0';
          setTimeout(() => featured.style.display = 'none', 300);
        }
      }
    });
  });
});
