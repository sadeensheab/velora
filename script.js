
const templates = [
  {
    id: 1,
    category: "restaurant",
    type: "مطاعم",
    name: "مطعم لونا",
    title: "Taste The Difference",
    description: "قالب أنيق للمطاعم والمقاهي وقوائم الطعام.",
    image: "photo-1414235077428-338989a2e8c0"
  },
  {
    id: 2,
    category: "realestate",
    type: "عقارات",
    name: "فيستا للعقارات",
    title: "Modern Living Spaces",
    description: "اعرضي العقارات والصور بطريقة فاخرة.",
    image: "photo-1600210492486-724fe5c67fb0"
  },
  {
    id: 3,
    category: "clinic",
    type: "عيادات",
    name: "عيادة نورا",
    title: "Your Health, Our Priority",
    description: "قالب للخدمات الطبية والتخصصات.",
    image: "photo-1629909613654-28e377c37b09"
  },
  {
    id: 4,
    category: "fashion",
    type: "متاجر",
    name: "دار أورا",
    title: "Wear Your Story",
    description: "تصميم أنيق لمتاجر الأزياء والعلامات التجارية.",
    image: "photo-1483985988355-763728e1935b"
  },
  {
    id: 5,
    category: "business",
    type: "شركات",
    name: "أطلس للأعمال",
    title: "Ideas Into Impact",
    description: "اعرضي خدمات شركتك وأعمالك.",
    image: "photo-1486406146926-c627a92ad1ab"
  },
  {
    id: 6,
    category: "business",
    type: "شركات",
    name: "ستوديو الإبداع",
    title: "Made With Intention",
    description: "قالب احترافي للمشاريع الإبداعية.",
    image: "photo-1497366754035-f200968a6e72"
  }
];

// عناصر الصفحة
const grid = document.getElementById("templateGrid");
const searchInput = document.getElementById("searchInput");
const count = document.getElementById("templateCount");

let currentCategory = "all";

// عرض القوالب
function renderTemplates() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = templates.filter(item => {
    const categoryMatch =
      currentCategory === "all" ||
      item.category === currentCategory;

    const searchText =
      `${item.name} ${item.title} ${item.type} ${item.description}`
        .toLowerCase();

    return categoryMatch && searchText.includes(query);
  });

  count.textContent =
    `${String(filtered.length).padStart(2, "0")} قوالب`;

  if (filtered.length === 0) {
    grid.innerHTML = "<p>ما لقينا قوالب مطابقة لبحثك.</p>";
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="template-card">
      <div class="card-image"
        style="background-image:
        linear-gradient(0deg,#17191499,transparent),
        url('https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=80')">

        <span class="card-number">
          VELORA / ${String(item.id).padStart(2, "0")}
        </span>

        <h3>${item.title}</h3>
      </div>

      <div class="card-body">
        <span class="card-category">${item.type}</span>
        <h4>${item.name}</h4>
        <p>${item.description}</p>

        <div class="card-actions">
          <button
            class="btn btn-dark"
            onclick="openForm('${item.id}')">
            اطلبي هذا القالب ↗
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// تصنيفات القوالب
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")
      ?.classList.remove("active");

    button.classList.add("active");
    currentCategory = button.dataset.category;

    renderTemplates();
  });
});

// البحث
searchInput.addEventListener("input", renderTemplates);

// فتح نموذج الطلب
function openForm(templateId = "") {
  document.getElementById("requestModal").classList.add("show");

  const selected = templates.find(
    item => item.id === Number(templateId)
  );

  if (selected) {
    document.getElementById("project").value = selected.name;
  }
}

// إغلاق نموذج الطلب
function closeForm() {
  document.getElementById("requestModal").classList.remove("show");
}

// إغلاق النموذج عند الضغط خارجه
document.getElementById("requestModal").addEventListener("click", event => {
  if (event.target.id === "requestModal") {
    closeForm();
  }
});

// إرسال طلب العميل إلى واتساب
document.getElementById("requestForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = new FormData(event.target);

  const project = form.get("project").trim();
  const category = form.get("category");
  const phone = form.get("phone") || "غير محدد";
  const details = form.get("details").trim();

  const message = `طلب تصميم موقع جديد - Velora

اسم المشروع: ${project}
نوع المشروع: ${category}
رقم العميل: ${phone}

تفاصيل المشروع:
${details}`;

  // رقم واتساب Velora بصيغة دولية
  const WHATSAPP_NUMBER = "962791734396";

  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank");
});

// زر اللغة: مؤقت إلى أن نضيف الترجمة الكاملة
function toggleLanguage() {
  alert("الترجمة الإنجليزية الكاملة ستكون في المرحلة التالية.");
}

// تشغيل القوالب عند فتح الصفحة
renderTemplates();
