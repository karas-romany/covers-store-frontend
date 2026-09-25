// رابط الباك إند المباشر على Vercel
const API_URL = "https://covers-store-server.vercel.app/api/covers";

document.addEventListener("DOMContentLoaded", () => {
  fetchCovers();
});

// جلب الجرابات من السيرفر
async function fetchCovers(brand = "") {
  const container = document.getElementById("covers-container");
  container.innerHTML = '<div class="loading">جاري تحميل الجرابات...</div>';

  try {
    const url = brand ? `${API_URL}?brand=${encodeURIComponent(brand)}` : API_URL;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="no-data">لا توجد جرابات متاحة حالياً.</p>';
      return;
    }

    renderCovers(data);
  } catch (error) {
    console.error("Error fetching covers:", error);
    container.innerHTML = '<p class="error-msg">حدث خطأ أثناء جلب البيانات. حاول مرة أخرى.</p>';
  }
}

// عرض الكروت بدون أسعار
function renderCovers(covers) {
  const container = document.getElementById("covers-container");
  container.innerHTML = "";

  covers.forEach((cover) => {
    const card = document.createElement("div");
    card.className = "cover-card";

    const defaultImg = "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80";

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${cover.imageUrl || defaultImg}" alt="${cover.title || 'جراب موبايل'}" onerror="this.src='${defaultImg}'" />
      </div>
      <div class="card-info">
        <span class="brand-badge">${cover.brand || 'عام'}</span>
        <h3>${cover.title || 'جراب مميز'}</h3>
        <p class="model-name">${cover.modelName || ''}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// التصفية حسب الماركة
function filterByBrand(brand) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  
  event.target.classList.add("active");
  fetchCovers(brand === 'all' ? '' : brand);
}