try {
    // الاتصال بالباك إند المباشر على Vercel
    const url = brand 
      ? `https://covers-store-server.vercel.app/api/covers?brand=${brand}`
      : 'https://covers-store-server.vercel.app/api/covers';

    const response = await fetch(url);
    const covers = await response.json();

    if (covers.length === 0) {
      container.innerHTML = '<p>لا توجد جرابات متوفرة لهذه الماركة حالياً.</p>';
      return;
    }

    // عرض الجرابات
    container.innerHTML = covers.map(cover => `
      <div class="card">
        <img src="${cover.imageUrl || 'https://via.placeholder.com/200'}" alt="${cover.title}">
        <h3>${cover.title}</h3>
        <div class="brand">الماركة: ${cover.brand} (${cover.modelName})</div>
        <div class="price">${cover.price} جنيه</div>
      </div>
    `).join('');

  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
    container.innerHTML = '<p>حدث خطأ في الاتصال بالسيرفر.</p>';
  }
}

// تشغيل الجلب لأول مرة عند فتح الصفحة
fetchCovers();