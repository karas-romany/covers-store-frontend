// دالة إظهار حالة التحميل الاحترافية
function showLoading() {
  const grid = document.getElementById('covers-grid');
  grid.innerHTML = `
    <div class="loading">
      <div class="modern-spinner"></div>
      <div class="loading-text">جاري استعراض أفضل الجرابات...</div>
    </div>
  `;
}

// دالة عرض الجرابات في الصفحة
function renderCovers(covers) {
  const grid = document.getElementById('covers-grid');
  
  if (!covers || covers.length === 0) {
    grid.innerHTML = '<div class="no-data">عذراً، لا توجد جرابات متاحة حالياً.</div>';
    return;
  }

  grid.innerHTML = covers.map(cover => `
    <div class="cover-card">
      <div>
        <span class="brand-badge">${cover.brand || 'عام'}</span>
        <h3>${cover.title}</h3>
        <p class="model-name">📱 ${cover.model}</p>
      </div>
      <a href="tel:01270275811" class="card-order-btn">📞 اطلب الآن</a>
    </div>
  `).join('');
}