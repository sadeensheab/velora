
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

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

let language = "ar";
let currentCategory = "all";

const templates = [
  {
    id: 1, category: "restaurant",
    type: { ar: "مطاعم", en: "Restaurants" },
    name: { ar: "مطعم لونا", en: "Luna Restaurant" },
    title: "Taste The Difference",
    description: {
      ar: "قالب أنيق للمطاعم والمقاهي وقوائم الطعام.",
      en: "An elegant template for restaurants, cafes, and menus."
    },
    image: "photo-1414235077428-338989a2e8c0"
  },
  {
    id: 2, category: "realestate",
    type: { ar: "عقارات", en: "Real Estate" },
    name: { ar: "فيستا للعقارات", en: "Vista Real Estate" },
    title: "Modern Living Spaces",
    description: {
      ar: "اعرضي العقارات والصور بطريقة فاخرة.",
      en: "Showcase properties and photos in a luxurious style."
    },
    image: "photo-1600210492486-724fe5c67fb0"
  },
  {
    id: 3, category: "clinic",
    type: { ar: "عيادات", en: "Clinics" },
    name: { ar: "عيادة نورا", en: "Nora Clinic" },
    title: "Your Health, Our Priority",
    description: {
      ar: "قالب للخدمات الطبية والتخصصات.",
      en: "A template for medical services and specialties."
    },
    image: "photo-1629909613654-28e377c37b09"
  },
  {
    id: 4, category: "fashion",
    type: { ar: "متاجر", en: "Fashion" },
    name: { ar: "دار أورا", en: "Aura Boutique" },
    title: "Wear Your Story",
    description: {
      ar: "تصميم أنيق لمتاجر الأزياء والعلامات التجارية.",
      en: "An elegant design for fashion stores and brands."
    },
    image: "photo-1483985988355-763728e1935b"
  },
  {
    id: 5, category: "business",
    type: { ar: "شركات", en: "Business" },
    name: { ar: "أطلس للأعمال", en: "Atlas Business" },
    title: "Ideas Into Impact",
    description: {
      ar: "اعرضي خدمات شركتك وأعمالك.",
      en: "Showcase your company's services and work."
    },
    image: "photo-1486406146926-c627a92ad1ab"
  },
  {
    id: 6, category: "business",
    type: { ar: "شركات", en: "Business" },
    name: { ar: "ستوديو الإبداع", en: "Creative Studio" },
    title: "Made With Intention",
    description: {
      ar: "قالب احترافي للمشاريع الإبداعية.",
      en: "A professional template for creative projects."
    },
    image: "photo-1497366754035-f200968a6e72"
  }
];

const $ = (selector) => document.querySelector(selector);
const grid = $("#templateGrid");
const searchInput = $("#searchInput");
const count = $("#templateCount");
const modal = $("#requestModal");
const requestForm = $("#requestForm");
const requestResult = $("#requestResult");

const text = {
  ar: {
    nav: ["الرئيسية", "القوالب", "تواصل معنا"],
    eyebrow: "أفكارك تستحق موقعًا مميزًا",
    heroTitle: 'حوّلي فكرتك إلى <span>موقع إلكتروني رائع</span>',
    heroDesc: "اختاري التصميم الذي يناسبك، وأرسلي طلبك بسهولة. نحن هنا لمساعدتك في تحويل فكرتك إلى واقع.",
    explore: "اكتشفي القوالب",
    order: "اطلبي تصميمك",
    benefits: ["✦ تصاميم عصرية", "✦ سهولة تقديم الطلب", "✦ تواصل مباشر"],
    gallery: "معرض التصاميم",
    choose: "اختاري قالبك المفضل",
    galleryDesc: "تصفحي التصاميم واختاري ما يناسب مشروعك.",
    search: "ابحثي عن قالب...",
    all: "الكل",
    categories: ["مطاعم", "عقارات", "عيادات", "متاجر", "شركات"],
    noResults: "ما لقينا قوالب مطابقة لبحثك.",
    requestTemplate: "اطلبي هذا القالب ↗",
    howEyebrow: "خطوات بسيطة",
    howTitle: "كيف تطلبي موقعك؟",
    steps: [
      ["اختاري قالبك", "تصفحي القوالب واختاري التصميم الأقرب لفكرتك."],
      ["أرسلي التفاصيل", "عبّي نموذج الطلب بمعلومات مشروعك."],
      ["احفظي طلبك", "سيحاول الموقع حفظ تفاصيل الطلب في قاعدة البيانات."],
      ["تواصلي معنا", "بعد نجاح الحفظ، يمكنك متابعة الطلب عبر واتساب."]
    ],
    contactEyebrow: "لديك فكرة مختلفة؟",
    contactTitle: "خلينا نبني موقعك الخاص",
    contactDesc: "احكي لنا عن مشروعك، وابدئي طلب تصميمك.",
    orderNow: "اطلبي تصميمك الآن ↗",
    rights: "© 2026 Velora. جميع الحقوق محفوظة.",
    modalTitle: "خلينا نصمم موقعك",
    modalDesc: "عبّي معلومات مشروعك حتى نجهز طلبك.",
    project: "اسم المشروع",
    projectPlaceholder: "مثال: متجري الإلكتروني",
    category: "نوع المشروع",
    chooseCategory: "اختاري نوع الموقع",
    options: ["موقع أعمال", "متجر إلكتروني", "معرض أعمال", "موقع مطعم", "نوع آخر"],
    phone: "رقم واتساب (اختياري)",
    details: "احكي لنا عن فكرتك",
    detailsPlaceholder: "شو حابة يكون موجود بموقعك؟",
    submit: "تجهيز طلب الموقع",
    required: "يرجى تعبئة اسم المشروع ونوع المشروع والتفاصيل.",
    saving: "جارٍ حفظ الطلب...",
    wait: "جارٍ حفظ طلبك، يرجى الانتظار...",
    saved: "تم حفظ الطلب بنجاح! جارٍ فتح واتساب لإكمال الإرسال.",
    failed: "تعذّر حفظ الطلب في قاعدة البيانات. لم نفتح واتساب. حاولي مرة أخرى.",
    rateLimit: "تم إرسال طلب قبل قليل. يرجى الانتظار 60 ثانية قبل إرسال طلب جديد من هذا المتصفح.",
    invalidLength: "تأكدي من طول البيانات: اسم المشروع حتى 120 حرفًا، رقم الهاتف حتى 40 حرفًا، والتفاصيل حتى 2000 حرف.",
    retry: "إعادة المحاولة",
    savedButton: "تم حفظ الطلب",
    count: (n) => `${n} قوالب`
  },
  en: {
    nav: ["Home", "Templates", "Contact Us"],
    eyebrow: "Your ideas deserve a remarkable website",
    heroTitle: 'Turn your idea into a <span>beautiful website</span>',
    heroDesc: "Choose a design that suits you and submit your request with ease. We're here to bring your idea to life.",
    explore: "Explore Templates",
    order: "Order Your Design",
    benefits: ["✦ Modern Designs", "✦ Easy Ordering", "✦ Direct Communication"],
    gallery: "DESIGN GALLERY",
    choose: "Choose Your Favorite Template",
    galleryDesc: "Browse the designs and find the right fit for your project.",
    search: "Search templates...",
    all: "All",
    categories: ["Restaurants", "Real Estate", "Clinics", "Stores", "Business"],
    noResults: "No templates match your search.",
    requestTemplate: "Request This Template ↗",
    howEyebrow: "Simple Steps",
    howTitle: "How to Get Your Website",
    steps: [
      ["Choose a Template", "Browse the templates and choose the design that fits your idea."],
      ["Share Your Details", "Fill out the request form with your project information."],
      ["Save Your Request", "The website will save your request details to the database."],
      ["Contact Us", "Once saved successfully, you can continue via WhatsApp."]
    ],
    contactEyebrow: "Have a Different Idea?",
    contactTitle: "Let's Build Your Website",
    contactDesc: "Tell us about your project and start your design request.",
    orderNow: "Order Your Design Now ↗",
    rights: "© 2026 Velora. All rights reserved.",
    modalTitle: "Let's Design Your Website",
    modalDesc: "Fill in your project details to prepare your request.",
    project: "Project Name",
    projectPlaceholder: "Example: My Online Store",
    category: "Project Type",
    chooseCategory: "Choose a website type",
    options: ["Business Website", "Online Store", "Portfolio", "Restaurant Website", "Other"],
    phone: "WhatsApp Number (Optional)",
    details: "Tell Us About Your Idea",
    detailsPlaceholder: "What would you like to include on your website?",
    submit: "Prepare Request",
    required: "Please enter the project name, type, and details.",
    saving: "Saving your request...",
    wait: "Saving your request, please wait...",
    saved: "Request saved successfully! Opening WhatsApp to continue.",
    failed: "Could not save your request. WhatsApp was not opened. Please try again.",
    rateLimit: "A request was sent recently. Please wait 60 seconds before sending another request from this browser.",
    invalidLength: "Please check the field lengths: project name up to 120 characters, phone up to 40, and details up to 2000.",
    retry: "Try Again",
    savedButton: "Request Saved",
    count: (n) => `${n} templates`
  }
};

function setText(selector, value, html = false) {
  const element = $(selector);
  if (element) {
    if (html) element.innerHTML = value;
    else element.textContent = value;
  }
}

function applyLanguage() {
  const t = text[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  setText(".nav-actions button", language === "ar" ? "English" : "العربية");

  document.querySelectorAll("nav a").forEach((el, i) => {
    el.textContent = t.nav[i];
  });

  setText(".hero-content .eyebrow", t.eyebrow);
  setText(".hero-content h1", t.heroTitle, true);
  setText(".hero-content > p:not(.eyebrow)", t.heroDesc);
  setText(".hero-buttons a", t.explore);
  setText(".hero-buttons button", t.order);

  document.querySelectorAll(".benefits span").forEach((el, i) => {
    el.textContent = t.benefits[i];
  });

  setText(".section-heading .eyebrow", t.gallery);
  setText(".section-heading h2", t.choose);
  setText(".section-heading > div > p:last-child", t.galleryDesc);

  if (searchInput) {
    searchInput.placeholder = t.search;
    searchInput.setAttribute("aria-label", t.search);
  }

  const filterButtons = document.querySelectorAll(".filter");
  const filterLabels = [t.all, ...t.categories];

  filterButtons.forEach((el, i) => {
    if (filterLabels[i]) el.textContent = filterLabels[i];
  });

  setText(".how-section .eyebrow", t.howEyebrow);
  setText(".how-section h2", t.howTitle);

  document.querySelectorAll(".steps article").forEach((el, i) => {
    el.querySelector("h3").textContent = t.steps[i][0];
    el.querySelector("p").textContent = t.steps[i][1];
  });

  setText(".contact .eyebrow", t.contactEyebrow);
  setText(".contact h2", t.contactTitle);
  setText(".contact div > p:last-child", t.contactDesc);
  setText(".contact button", t.orderNow);
  setText("footer p", t.rights);

  setText("#requestTitle", t.modalTitle);
  setText(".modal-box > p", t.modalDesc);

  // اختيار تسميات الحقول الظاهرة حتى لا تتأثر بخانة مكافحة الروبوتات المخفية
  const labels = [
    $("#requestForm label[for='project']"),
    $("#requestForm label[for='category']"),
    $("#requestForm label[for='phone']"),
    $("#requestForm label[for='details']")
  ];

  [t.project, t.category, t.phone, t.details].forEach((value, i) => {
    if (labels[i]) labels[i].textContent = value;
  });

  const projectInput = $("#project");
  const categorySelect = $("#category");
  const phoneInput = $("#phone");
  const detailsInput = $("#details");

  if (projectInput) projectInput.placeholder = t.projectPlaceholder;
  if (phoneInput) phoneInput.placeholder = "962...";
  if (detailsInput) detailsInput.placeholder = t.detailsPlaceholder;

  if (categorySelect) {
    categorySelect.options[0].textContent = t.chooseCategory;

    t.options.forEach((value, i) => {
      if (categorySelect.options[i + 1]) {
        categorySelect.options[i + 1].textContent = value;
      }
    });
  }

  const submit = requestForm?.querySelector('button[type="submit"]');
  if (submit && !submit.disabled) submit.textContent = t.submit;

  renderTemplates();
}

window.toggleLanguage = function () {
  language = language === "ar" ? "en" : "ar";
  applyLanguage();
};

function renderTemplates() {
  if (!grid || !searchInput || !count) return;

  const query = searchInput.value.trim().toLowerCase();

  const filtered = templates.filter(item => {
    const categoryMatch =
      currentCategory === "all" || item.category === currentCategory;

    const searchText = [
      item.name[language],
      item.title,
      item.type[language],
      item.description[language]
    ].join(" ").toLowerCase();

    return categoryMatch && searchText.includes(query);
  });

  count.textContent = text[language].count(filtered.length);

  if (filtered.length === 0) {
    grid.innerHTML = `<p>${text[language].noResults}</p>`;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="template-card">
      <div class="card-image" style="background-image:
        linear-gradient(0deg,#17191499,transparent),
        url('https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=80')">
        <span class="card-number">VELORA / ${String(item.id).padStart(2, "0")}</span>
        <h3>${item.title}</h3>
      </div>
      <div class="card-body">
        <span class="card-category">${item.type[language]}</span>
        <h4>${item.name[language]}</h4>
        <p>${item.description[language]}</p>
        <div class="card-actions">
          <button type="button" class="btn btn-dark" data-template-id="${item.id}">
            ${text[language].requestTemplate}
          </button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-template-id]").forEach(button => {
    button.addEventListener("click", () => openForm(button.dataset.templateId));
  });
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    $(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    currentCategory = button.dataset.category;
    renderTemplates();
  });
});

searchInput?.addEventListener("input", renderTemplates);

function openForm(templateId = "") {
  modal?.classList.add("show");

  const selected = templates.find(item => item.id === Number(templateId));
  const projectInput = $("#project");

  if (selected && projectInput) {
    projectInput.value = selected.name[language];
  }

  // إعادة ضبط خانة مكافحة الروبوتات عند فتح النموذج
  const honeypotInput = $("#companySite");
  if (honeypotInput) honeypotInput.value = "";

  if (requestResult) requestResult.textContent = "";
}

function closeForm() {
  modal?.classList.remove("show");
}

window.openForm = openForm;
window.closeForm = closeForm;

modal?.addEventListener("click", event => {
  if (event.target === modal) closeForm();
});

requestForm?.addEventListener("submit", async event => {
  event.preventDefault();

  const submitButton = requestForm.querySelector('button[type="submit"]');
  const form = new FormData(requestForm);

  const project = String(form.get("project") || "").trim();
  const category = String(form.get("category") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const details = String(form.get("details") || "").trim();
  const honeypot = String(form.get("company_site_url") || "").trim();
  const t = text[language];

  // إذا عبّى الروبوت الخانة المخفية، نوقف الإرسال
  if (honeypot) {
    requestResult.textContent = "";
    return;
  }

  if (!project || !category || !details) {
    requestResult.textContent = t.required;
    return;
  }

  // مطابقة حدود البيانات مع قواعد Firestore
  const allowedCategories = ["business", "store", "portfolio", "restaurant", "other"];

  if (
    project.length > 120 ||
    phone.length > 40 ||
    details.length > 2000 ||
    !allowedCategories.includes(category)
  ) {
    requestResult.textContent = t.invalidLength;
    return;
  }

  // حد بسيط: انتظار 60 ثانية بين الطلبات الناجحة من نفس المتصفح
  const cooldownKey = "velora_last_successful_order";
  const cooldownMs = 60 * 1000;
  let lastOrderTime = 0;

  try {
    lastOrderTime = Number(localStorage.getItem(cooldownKey) || 0);
  } catch (error) {
    console.warn("Could not read local cooldown:", error);
  }

  const remainingMs = cooldownMs - (Date.now() - lastOrderTime);

  if (lastOrderTime > 0 && remainingMs > 0) {
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    requestResult.textContent = `${t.rateLimit} (${remainingSeconds}s)`;
    return;
  }

  const categoryLabels = {
    business: { ar: "موقع أعمال", en: "Business Website" },
    store: { ar: "متجر إلكتروني", en: "Online Store" },
    portfolio: { ar: "معرض أعمال", en: "Portfolio" },
    restaurant: { ar: "موقع مطعم", en: "Restaurant Website" },
    other: { ar: "نوع آخر", en: "Other" }
  };

  const categoryName = categoryLabels[category]?.[language] || category;

  const message = language === "ar"
    ? `طلب تصميم موقع جديد - Velora

اسم المشروع: ${project}
نوع المشروع: ${categoryName}
رقم العميل: ${phone || "غير محدد"}

تفاصيل المشروع:
${details}`
    : `New Website Design Request - Velora

Project Name: ${project}
Project Type: ${categoryName}
Customer Phone: ${phone || "Not provided"}

Project Details:
${details}`;

  const whatsappURL =
    "https://wa.me/962791734396?text=" + encodeURIComponent(message);

  submitButton.disabled = true;
  submitButton.textContent = t.saving;
  requestResult.textContent = t.wait;

  try {
    await addDoc(collection(db, "orders"), {
      project,
      category,
      phone,
      details,
      status: "new",
      createdAt: serverTimestamp()
    });

    // تسجيل وقت نجاح الطلب حتى نمنع الإرسال المتكرر السريع من نفس المتصفح
    try {
      localStorage.setItem(cooldownKey, String(Date.now()));
    } catch (error) {
      console.warn("Could not save local cooldown:", error);
    }

    requestResult.textContent = t.saved;
    submitButton.textContent = t.savedButton;
    window.location.href = whatsappURL;

  } catch (error) {
    console.error("Firebase save error:", error);
    requestResult.textContent = t.failed;
    submitButton.disabled = false;
    submitButton.textContent = t.retry;
  }
});

applyLanguage();
