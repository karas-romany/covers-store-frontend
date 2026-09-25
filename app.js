const API_URL = "https://covers-store-server.vercel.app/api/covers";
const SETTINGS_URL = "https://covers-store-server.vercel.app/api/settings";

let allCovers = [];

document.addEventListener("DOMContentLoaded", async () => {
  const isMaintenanceMode = await checkMaintenance();
  if (!isMaintenanceMode) {
    fetchCovers();
  }
});

// فحص وضع الصيانة
async function checkMaintenance() {
  try {
    const res = await fetch(SETTINGS_URL);
    const settings = await res.json();
    
    if (settings && settings.isMaintenance) {
      showMaintenanceOverlay();
      return true;
    }
  } catch (error) {
    console.error("Error checking settings:", error);
  }
  return false;
}

// عرض واجهة التعديل والملاحة الفاخرة
function showMaintenanceOverlay() {
  document.body.innerHTML = `
    <div class="maintenance-overlay">
      <div class="maintenance-card">
        <div class="gear-icon">⚙️</div>
        <h2>الموقع تحت الصيانة والتطوير</h2>
        <p class="animated-text">نعمل حالياً على إضافة جرابات وتحديثات جديدة وفاخرة لك...</p>
        <div class="maintenance-bar"><span></span></div>
      </div>
    </div>
  `;
}

// جلب الجرابات
async function fetchCovers(brand = "") {
  const container = document.getElementById("covers-container");
  if (!container) return;
  container.innerHTML = '<div class="loading">جاري تحميل الجرابات...</div>';

  try {
    const url = brand ? `${API_URL}?brand=${encodeURIComponent(brand)}` : API_URL;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="no-data">لا توجد جرابات متاحة حالياً.</p>';
      allCovers = [];
      return;
    }

    allCovers = data;
    renderCovers(allCovers);
  } catch (error) {
    console.error("Error fetching covers:", error);
    container.innerHTML = '<p class="error-msg">حدث خطأ أثناء جلب البيانات. حاول مرة أخرى.</p>';
  }
}

function renderCovers(covers) {
  const container = document.getElementById("covers-container");
  container.innerHTML = "";

  if (covers.length === 0) {
    container.innerHTML = '<p class="no-data">لا توجد نتائج تطابق بحثك.</p>';
    return;
  }

  covers.forEach((cover) => {
    const card = document.createElement("div");
    card.className = "cover-card";
    card.innerHTML = `
      <div class="card-info">
        <span class="brand-badge">${cover.brand || 'عام'}</span>
        <h3>${cover.title || 'جراب مميز'}</h3>
        <p class="model-name">${cover.modelName || ''}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterByBrand(brand) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  document.getElementById("search-input").value = "";
  fetchCovers(brand === 'all' ? '' : brand);
}

function handleSearch() {
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const filteredCovers = allCovers.filter(cover => {
    const titleMatch = (cover.title || "").toLowerCase().includes(query);
    const modelMatch = (cover.modelName || "").toLowerCase().includes(query);
    const brandMatch = (cover.brand || "").toLowerCase().includes(query);
    return titleMatch || modelMatch || brandMatch;
  });
  renderCovers(filteredCovers);
}