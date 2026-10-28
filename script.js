
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// إعدادات Firebase الخاصة بمشروع Velora
const firebaseConfig = {
  apiKey: "AIzaSyC3cGX_eZXa11EbOrHtsS7KwMi_FZYnUT4",
  authDomain: "velora-89ee1.firebaseapp.com",
  projectId: "velora-89ee1",
  storageBucket: "velora-89ee1.firebasestorage.app",
  messagingSenderId: "844313456077",
  appId: "1:844313456077:web:2a52c2006548f5ae892884",
  measurementId: "G-Q9CRKMTGWX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// القوالب
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

const grid = document.getElementById("templateGrid");
const searchInput = document.getElementById("searchInput");
const count = document.getElementById("templateCount");
const modal = document.getElementById("requestModal");
const requestForm = document.getElementById("requestForm");
const requestResult = document.getElementById("requestResult");

let currentCategory = "all";

// عرض القوالب
function renderTemplates() {
  if (!grid || !searchInput || !count) return;

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

  count.textContent = `${filtered.length} قوالب`;

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
          <button type="button" class="btn btn-dark"
            data-template-id="${item.id}">
            اطلبي هذا القالب ↗
          </button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-template-id]").forEach(button => {
    button.addEventListener("click", () => {
      openForm(button.dataset.templateId);
    });
  });
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

searchInput?.addEventListener("input", renderTemplates);

// فتح نموذج الطلب
function openForm(templateId = "") {
  modal?.classList.add("show");

  const selected = templates.find(
    item => item.id === Number(templateId)
  );

  const projectInput = document.getElementById("project");

  if (selected && projectInput) {
    projectInput.value = selected.name;
  }

  if (requestResult) {
    requestResult.textContent = "";
  }
}

function closeForm() {
  modal?.classList.remove("show");
}

window.openForm = openForm;
window.closeForm = closeForm;

window.toggleLanguage = function () {
  alert("الترجمة الإنجليزية الكاملة سنضيفها لاحقًا.");
};

modal?.addEventListener("click", event => {
  if (event.target === modal) {
    closeForm();
  }
});

// حفظ الطلب في Firebase أولًا ثم فتح واتساب
requestForm?.addEventListener("submit", async event => {
  event.preventDefault();

  const submitButton = requestForm.querySelector(
    'button[type="submit"]'
  );

  const form = new FormData(requestForm);

  const project = String(form.get("project") || "").trim();
  const category = String(form.get("category") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const details = String(form.get("details") || "").trim();

  if (!project || !category || !details) {
    requestResult.textContent =
      "يرجى تعبئة اسم المشروع ونوع المشروع والتفاصيل.";
    return;
  }

  const message = `طلب تصميم موقع جديد - Velora

اسم المشروع: ${project}
نوع المشروع: ${category}
رقم العميل: ${phone || "غير محدد"}

تفاصيل المشروع:
${details}`;

  const whatsappURL =
    "https://wa.me/962791734396?text=" +
    encodeURIComponent(message);

  submitButton.disabled = true;
  submitButton.textContent = "جارٍ حفظ الطلب...";
  requestResult.textContent =
    "جارٍ حفظ طلبك، يرجى الانتظار...";

  try {
    // لن نفتح واتساب إلا بعد نجاح الحفظ
    await addDoc(collection(db, "orders"), {
      project,
      category,
      phone,
      details,
      status: "new",
      createdAt: serverTimestamp()
    });

    requestResult.textContent =
      "تم حفظ الطلب بنجاح! جارٍ فتح واتساب لإكمال الإرسال.";

    submitButton.textContent = "تم حفظ الطلب";

    // الانتقال إلى واتساب بعد نجاح Firebase
    window.location.href = whatsappURL;

  } catch (error) {
    console.error("Firebase save error:", error);

    requestResult.textContent =
      "تعذّر حفظ الطلب في قاعدة البيانات. لم نفتح واتساب. حاولي مرة أخرى.";

    submitButton.disabled = false;
    submitButton.textContent = "إعادة المحاولة";
  }
});

renderTemplates();
