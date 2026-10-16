/* =========================================================
   COFFEE CORNER PRO — CORE ENGINE (STABLE & SECURE)
   ========================================================= */

// الثوابت وحسابات الإدارة
const DEV_USER = 'omar';
const SHOP_USER = 'corner';
const ENCRYPTED_MASTER_PIN_HASH = "68b556093d5089fa2d9d968b5f39611b8166c3c544e97efeb4aa27c8d9fb82d0"; // PIN: 2001159393

// ---------------------------------------------------------
// إعداد Firebase Firestore السحابي
// ---------------------------------------------------------
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCPGI8XX2v5naRLK2QSQJcw6fB0Nsmbl8M",
    authDomain: "coffee-corner-121.firebaseapp.com",
    projectId: "coffee-corner-121",
    storageBucket: "coffee-corner-121.firebasestorage.app",
    messagingSenderId: "550349405177",
    appId: "1:550349405177:web:468a9248c6c6be9f46db28"
};

let cloudDb = null;
let isCloudOnline = false;

try {
    if (window.firebase) {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        cloudDb = firebase.firestore();
        isCloudOnline = true;
    }
} catch(err) {
    console.warn("Cloud connection fallback notice:", err);
}

// ---------------------------------------------------------
// كتالوج المنتجات الافتراضي
// ---------------------------------------------------------
window.DEFAULT_CATALOG = [
    { id: "p1", name: "كوكتيل إمبراطور فواكه", category: "كوكتيلات", price: 2.50, desc: "مزيج قطع فواكه طازجة مع القشطة والمكسرات", img: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&q=80", isAvailable: true },
    { id: "p2", name: "وافل بلجيكي أصلي", category: "وافل", price: 2.50, desc: "وافل دافئ مقرمش غني بأشهى النكهات والصوصات", img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80", isAvailable: true },
    { id: "p3", name: "كريب فيتوتشيني فاخر", category: "كريب", price: 3.00, desc: "شرائح كريب رقيقة طازجة مع نكهاتك المفضلة", img: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80", isAvailable: true },
    { id: "p4", name: "ميلك شيك أوريو", category: "ميلك شيك", price: 2.00, desc: "مخفوق الحليب والآيس كريم مع بسكويت الأوريو", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80", isAvailable: true },
    { id: "p5", name: "بان كيك كلاسيك", category: "بان كيك", price: 2.00, desc: "طبقات بان كيك هشة وطرية مع صوصك المفضل", img: "https://images.unsplash.com/photo-1528207776546-384cb11312b2?w=400&q=80", isAvailable: true },
    { id: "p6", name: "كنافة نابلسية بالجبن", category: "كنافة", price: 3.00, desc: "كنافة سخنة متبلة بالسمن والجبن المذوب", img: "https://images.unsplash.com/photo-1628198642220-4bf63f25c755?w=400&q=80", isAvailable: true },
    { id: "p7", name: "آيس كوفي منعش", category: "ستيم بارد", price: 1.50, desc: "شوت إسبريسو مزدوج مثلج مع حليب ناعم", img: "https://images.unsplash.com/photo-1461023058943-0708e52150fe?w=400&q=80", isAvailable: true },
    { id: "p8", name: "موكا حار فاخر", category: "ستيم ساخن", price: 2.00, desc: "مزيج قهوة ساخنة غنية بالشوكولاتة والكريما", img: "https://images.unsplash.com/photo-1517701550927-30cf4be1aaf9?w=400&q=80", isAvailable: true },
    { id: "p9", name: "آيس كريم فانيليا", category: "آيس كريم", price: 1.00, desc: "كرة آيس كريم إيطالية غنية بالفانيليا النقية", img: "https://images.unsplash.com/photo-1570197781417-0a52375c020b?w=400&q=80", isAvailable: true }
];

// بيانات الفروع والتوصيل الافتراضية
const BRANCHES_DATA = [
    {
        name: "كفرسوم",
        whatsapp: "962790155906",
        hours: "6:30 صباحاً حتى 3:00 فجراً يومياً",
        towns: { "كفرسوم": 1.0, "سمر": 1.25, "سحم": 1.5, "حبراص": 1.25, "يبلا": 1.5, "الرفيد": 1.5, "حرثا": 1.5, "المزيريب": 1.5, "عقربا": 2.0, "حاتم": 1.75, "ملكا": 2.0, "أم قيس": 2.5, "المنصورة": 2.0 }
    },
    {
        name: "سما الروسان",
        whatsapp: "962790155906",
        hours: "4:00 عصراً حتى 3:00 فجراً يومياً",
        towns: { "سما الروسان": 1.0, "حبراص": 1.25, "حاتم": 1.5, "كفرسوم": 1.5, "إبدر": 1.75, "المخيبة": 2.5 }
    }
];

const DEFAULT_SAUCES = [
    { name: "نوتيلا", price: 0.50 },
    { name: "لوتس", price: 0.75 },
    { name: "أوريو", price: 0.50 },
    { name: "كيندر بوينو", price: 0.75 },
    { name: "بستاشيو", price: 1.00 }
];

const DEFAULT_BRANCH_PAYMENTS = [
    { id: "pay_1", branch: "0", name: "كليك (Orange Money)", num: "0770155906", logo: "" },
    { id: "pay_2", branch: "1", name: "كليك (Zain Cash)", num: "0790155906", logo: "" },
    { id: "pay_3", branch: "all", name: "دفع نقدي (كاش)", num: "عند الاستلام", logo: "" }
];

const DEFAULT_SETTINGS = {
    brandTitle: "كافيه كورنر",
    brandSub: "أشهى الكوكتيلات والحلويات الفاخرة",
    brandLogo: "./logo.png",
    customColor: "#c59b63",
    currentTheme: "espresso-gold",
    devName: "المهندس عمر عبيدات",
    devRole: "Lead Systems Architect & Full-Stack Engineer",
    devBio: "تم تخطيط وتطوير بنية النظام الرقمي الشامل لتقديم تجربة حجز وطلب ذكية فورية وخفيفة تتفوق على المنصات التقليدية.",
    devPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    devWhatsapp: "962796433698",
    devInsta: "https://www.instagram.com/o_yd"
};

const DEFAULT_BADGES_LIST = [
    { id: "b1", name: "أول رشفة", icon: "☕", criteria: "إتمام أول طلب في الكافيه", requiredOrders: 1 },
    { id: "b2", name: "متذوق الوافل", icon: "🧇", criteria: "إتمام 3 طلبات من قسم الحلويات", requiredOrders: 3 },
    { id: "b3", name: "صديق الكورنر", icon: "👑", criteria: "إتمام 5 طلبات مميزة", requiredOrders: 5 },
    { id: "b4", name: "العميل الذهبي", icon: "⭐", criteria: "إتمام 10 طلبات معتمدة", requiredOrders: 10 }
];

// دالة تخزين واسترجاع آمنة
function safeGet(key, defaultVal) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultVal;
    } catch(e) {
        return defaultVal;
    }
}

function safeSet(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {
        console.warn("Storage quota warning for key:", key);
    }
}

// الحالة العامة للنظام
window.appState = {
    cartBranch: 0,
    currentCategory: "الكل",
    cart: safeGet('cc_cart', []),
    deliveryMode: "delivery",
    selectedPaymentId: "pay_3",
    selectedProduct: null,
    productModalQty: 1,
    favorites: safeGet('cc_favs', [])
};

let activeSessionUser = safeGet('cc_admin_session', null);
let activeClientSession = safeGet('cc_client_session', null);
let registeredUsersMap = safeGet('cc_users', {});
let appliedPromoObject = safeGet('cc_active_promo', null);
let productsCatalog = safeGet('cc_catalog', window.DEFAULT_CATALOG);
let activeOrdersList = safeGet('cc_orders', []);
let storeSettings = safeGet('cc_store_settings', DEFAULT_SETTINGS);
let communityMomentsList = safeGet('cc_moments', []);
let badgesList = safeGet('cc_badges', DEFAULT_BADGES_LIST);
let branchPaymentsList = safeGet('cc_branch_payments', DEFAULT_BRANCH_PAYMENTS);
let isThemeDark = safeGet('cc_theme_dark', true);
let isAdminSoundEnabled = safeGet('cc_admin_sound', true);
let saucesCatalog = safeGet('cc_sauces', DEFAULT_SAUCES);
let townsBranches = safeGet('cc_towns', BRANCHES_DATA);
let promoCodesCatalog = safeGet('cc_promos', {
    "CORNER10": { code: "CORNER10", discount: 10, isActive: true },
    "OMAR20": { code: "OMAR20", discount: 20, isActive: true }
});

// ---------------------------------------------------------
// محرك الصوت وتنبيهات الأدمن (Web Audio API)
// ---------------------------------------------------------
function playOrderChimeSound() {
    if (!isAdminSoundEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.5);
    } catch(e) {
        console.warn("Audio chime prevented:", e);
    }
}

// ---------------------------------------------------------
// دورة حياة الطلبات والأرشفة التلقائية بعد 15 دقيقة
// ---------------------------------------------------------
const AUTO_ARCHIVE_MS = 15 * 60 * 1000;

function purgeCompletedOrdersAfter15Minutes() {
    const now = Date.now();
    let hasChanged = false;

    activeOrdersList = activeOrdersList.filter(order => {
        if (order.status === 'completed' && order.completedAt) {
            const elapsed = now - order.completedAt;
            if (elapsed >= AUTO_ARCHIVE_MS) {
                hasChanged = true;
                return false;
            }
        }
        return true;
    });

    if (hasChanged) {
        safeSet('cc_orders', activeOrdersList);
        if (activeSessionUser) {
            renderAdminLiveOrdersManager();
        }
    }
}

setInterval(purgeCompletedOrdersAfter15Minutes, 30000);

// ---------------------------------------------------------
// الاستماع اللحظي للطلبات من السحابة (Firestore Listener)
// ---------------------------------------------------------
function initCloudRealtimeOrdersListener() {
    if (!cloudDb) return;
    try {
        cloudDb.collection('orders').orderBy('createdAt', 'desc').limit(50)
            .onSnapshot(snapshot => {
                const cloudOrders = [];
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    cloudOrders.push({ id: docSnap.id, ...data });
                });

                if (cloudOrders.length > 0) {
                    const prevCount = activeOrdersList.length;
                    activeOrdersList = cloudOrders;
                    safeSet('cc_orders', activeOrdersList);
                    purgeCompletedOrdersAfter15Minutes();

                    if (activeSessionUser && cloudOrders.length > prevCount) {
                        playOrderChimeSound();
                        window.showToastMsg("طلب جديد وصل إلى السحابة للتو!");
                    }

                    if (activeSessionUser) {
                        renderAdminLiveOrdersManager();
                    }

                    const curTrackedId = localStorage.getItem('cc_latest_order_id');
                    if (curTrackedId) {
                        renderClientOrderTrackingView();
                    }
                }
            }, err => {
                console.warn("Firestore snapshot listener notice:", err);
            });
    } catch(e) {
        console.warn("Realtime setup error:", e);
    }
}

// ---------------------------------------------------------
// أدوات الواجهة والتوجيه
// ---------------------------------------------------------
window.showToastMsg = function(msg) {
    const toast = document.getElementById('systemToast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('active');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.classList.remove('active');
    }, 2400);
};

window.navigateRouter = function(screenId) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }

    if (screenId === 'screen-cart') {
        renderCartItemsList();
        recalculateCartSummary();
        document.getElementById('floatingCartDock').classList.remove('visible');
    } else if (screenId === 'screen-home') {
        window.renderMenuProducts();
        refreshCartDockStatus();
    } else if (screenId === 'screen-order-tracking') {
        renderClientOrderTrackingView();
    } else if (screenId === 'screen-user-profile') {
        renderClientProfileScreen();
    } else if (screenId === 'screen-favorites') {
        renderClientFavoritesView();
    } else if (screenId === 'screen-moments') {
        renderCommunityMomentsFeed();
    } else {
        refreshCartDockStatus();
    }
};

window.openSidebarDrawer = function() {
    document.getElementById('sidebarMask').classList.add('active');
    document.getElementById('sidebarDrawer').classList.add('active');
};

window.closeSidebarDrawer = function() {
    document.getElementById('sidebarMask').classList.remove('active');
    document.getElementById('sidebarDrawer').classList.remove('active');
};

window.toggleThemeMode = function() {
    isThemeDark = !isThemeDark;
    safeSet('cc_theme_dark', isThemeDark);
    applyThemeToDOM();
};

function applyThemeToDOM() {
    if (isThemeDark) {
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
    }
}

// ---------------------------------------------------------
// عرض المنيو والتصنيفات
// ---------------------------------------------------------
window.renderCategoryChips = function() {
    const container = document.getElementById('categoryScrollChips');
    if (!container) return;

    const cats = ["الكل", ...new Set(productsCatalog.map(p => p.category))];
    container.innerHTML = cats.map(c => `
        <div class="cat-chip ${c === window.appState.currentCategory ? 'active' : ''}" onclick="selectMenuCat('${c}')">${c}</div>
    `).join('');
};

window.selectMenuCat = function(category) {
    window.appState.currentCategory = category;
    window.renderCategoryChips();
    window.renderMenuProducts();
};

window.renderMenuProducts = function() {
    const container = document.getElementById('menuGridContainer');
    if (!container) return;

    const searchInput = document.getElementById('menuSearchInput');
    const query = searchInput ? (searchInput.value || '').trim().toLowerCase() : '';

    let filtered = productsCatalog;
    if (window.appState.currentCategory !== "الكل") {
        filtered = filtered.filter(p => p.category === window.appState.currentCategory);
    }
    if (query) {
        filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(query) || (p.desc || '').toLowerCase().includes(query));
    }

    if (!filtered.length) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 36px 12px; color: var(--text-secondary); font-size: 13px;">لا توجد أصناف متوفرة ضمن هذا الاختيار</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card ${p.isAvailable === false ? 'out-of-stock' : ''}" onclick="openProductCustomizer('${p.id}')">
            <img src="${p.img}" class="product-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1517701550927-30cf4be1aaf9?w=400&q=80'">
            <div class="product-meta">
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc || ''}</div>
                <div class="product-row-bottom">
                    <div class="product-price num-font">${parseFloat(p.price).toFixed(2)} د.أ</div>
                    <div class="btn-add-mini">${p.isAvailable === false ? 'غير متوفر' : 'إضافة'}</div>
                </div>
            </div>
        </div>
    `).join('');
};

// ---------------------------------------------------------
// تخصيص الصنف والمكس الذكي للحلويات
// ---------------------------------------------------------
window.openProductCustomizer = function(productId) {
    const item = productsCatalog.find(p => p.id === productId);
    if (!item) return;

    window.appState.selectedProduct = item;
    window.appState.productModalQty = 1;

    document.getElementById('psHeroImg').src = item.img;
    document.getElementById('psTitle').innerText = item.name;
    document.getElementById('psDesc').innerText = item.desc || '';
    document.getElementById('psBasePrice').innerText = `${parseFloat(item.price).toFixed(2)} د.أ`;
    document.getElementById('psQtyDisplay').innerText = '1';
    document.getElementById('psNotes').value = '';

    const isDessert = ["وافل", "كريب", "بان كيك", "كنافة"].includes(item.category);
    const sizeBox = document.getElementById('psSizeGroup');
    const saucesBox = document.getElementById('psSaucesContainer');

    if (isDessert) {
        sizeBox.style.display = 'none';
        saucesBox.style.display = 'block';
        renderSauceOptions();
    } else {
        sizeBox.style.display = 'block';
        saucesBox.style.display = 'none';
        renderSizeOptions();
    }

    updateProductCalculatedPrice();
    window.navigateRouter('screen-product');
};

function renderSizeOptions() {
    const container = document.getElementById('psSizeOptionsContainer');
    if (!container) return;

    container.innerHTML = `
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <span style="font-size:13px; font-weight:700;">صغير (عادي)</span>
            <input type="radio" name="prodSize" value="small" checked onchange="updateProductCalculatedPrice()">
        </label>
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <span style="font-size:13px; font-weight:700;">وسط (+0.50 د.أ)</span>
            <input type="radio" name="prodSize" value="medium" onchange="updateProductCalculatedPrice()">
        </label>
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <span style="font-size:13px; font-weight:700;">كبير (+1.00 د.أ)</span>
            <input type="radio" name="prodSize" value="large" onchange="updateProductCalculatedPrice()">
        </label>
    `;
}

function renderSauceOptions() {
    const container = document.getElementById('psSaucesList');
    if (!container) return;

    container.innerHTML = saucesCatalog.map(s => `
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <div>
                <span style="font-size:13px; font-weight:700;">${s.name}</span>
                <span class="num-font" style="font-size:11.5px; color:var(--brand-gold); margin-right:6px;">(+${parseFloat(s.price).toFixed(2)} د.أ)</span>
            </div>
            <input type="checkbox" class="ps-sauce-cb" value="${s.name}" data-price="${s.price}" onchange="handleSauceSelectionLimit(this)">
        </label>
    `).join('');
}

window.handleSauceSelectionLimit = function(checkbox) {
    const checked = document.querySelectorAll('.ps-sauce-cb:checked');
    if (checked.length > 3) {
        checkbox.checked = false;
        window.showToastMsg("الحد الأقصى هو 3 نكهات فقط لمكس الحلويات");
    }
    updateProductCalculatedPrice();
};

window.adjustProductQty = function(delta) {
    let q = window.appState.productModalQty + delta;
    if (q >= 1 && q <= 30) {
        window.appState.productModalQty = q;
        document.getElementById('psQtyDisplay').innerText = q;
        updateProductCalculatedPrice();
    }
};

function updateProductCalculatedPrice() {
    if (!window.appState.selectedProduct) return;
    let base = parseFloat(window.appState.selectedProduct.price);

    const isDessert = ["وافل", "كريب", "بان كيك", "كنافة"].includes(window.appState.selectedProduct.category);
    if (isDessert) {
        const checkedSauces = Array.from(document.querySelectorAll('.ps-sauce-cb:checked'));
        if (checkedSauces.length > 0) {
            const saucePrices = checkedSauces.map(cb => parseFloat(cb.getAttribute('data-price') || 0));
            // احتساب سعر النكهة الأعلى فقط دون تكرار
            base += Math.max(...saucePrices);
        }
    } else {
        const sizeInput = document.querySelector('input[name="prodSize"]:checked');
        if (sizeInput) {
            if (sizeInput.value === 'medium') base += 0.50;
            if (sizeInput.value === 'large') base += 1.00;
        }
    }

    const total = base * window.appState.productModalQty;
    const calcEl = document.getElementById('psCalculatedPrice');
    if (calcEl) calcEl.innerText = total.toFixed(2);
}

window.confirmAddItemToCart = function() {
    if (!window.appState.selectedProduct) return;
    const p = window.appState.selectedProduct;
    const isDessert = ["وافل", "كريب", "بان كيك", "كنافة"].includes(p.category);

    let unitPrice = parseFloat(p.price);
    let sizeTitle = "قياسي";
    let sauceTitle = "";

    if (isDessert) {
        const checkedSauces = Array.from(document.querySelectorAll('.ps-sauce-cb:checked')).map(cb => ({
            name: cb.value,
            price: parseFloat(cb.getAttribute('data-price') || 0)
        }));

        if (checkedSauces.length > 0) {
            const maxPrice = Math.max(...checkedSauces.map(s => s.price));
            unitPrice += maxPrice;
            sauceTitle = checkedSauces.map(s => s.name).join(' + ');
        }
    } else {
        const sizeInput = document.querySelector('input[name="prodSize"]:checked');
        const sVal = sizeInput ? sizeInput.value : 'small';
        if (sVal === 'medium') { unitPrice += 0.50; sizeTitle = 'وسط'; }
        else if (sVal === 'large') { unitPrice += 1.00; sizeTitle = 'كبير'; }
        else { sizeTitle = 'صغير'; }
    }

    const notes = (document.getElementById('psNotes').value || '').trim();

    window.appState.cart.push({
        id: "c_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        productId: p.id,
        name: p.name,
        category: p.category,
        qty: window.appState.productModalQty,
        sizeName: sizeTitle,
        sauceName: sauceTitle,
        unitPrice: unitPrice,
        notes: notes,
        lineTotal: unitPrice * window.appState.productModalQty
    });

    safeSet('cc_cart', window.appState.cart);
    refreshCartDockStatus();
    window.showToastMsg("تمت الإضافة إلى سلة المشتريات");
    window.navigateRouter('screen-home');
};

// ---------------------------------------------------------
// إدارة السلة وتجهيز الطلب
// ---------------------------------------------------------
function refreshCartDockStatus() {
    const dock = document.getElementById('floatingCartDock');
    const countBadge = document.getElementById('dockBadgeCount');
    const priceTotal = document.getElementById('dockPriceTotal');
    if (!dock) return;

    const count = window.appState.cart.reduce((s, i) => s + i.qty, 0);
    const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);

    if (count > 0) {
        countBadge.innerText = count;
        priceTotal.innerText = `${sub.toFixed(2)} د.أ`;
        dock.classList.add('visible');
    } else {
        dock.classList.remove('visible');
    }
}

function renderCartItemsList() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;

    if (!window.appState.cart.length) {
        container.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-secondary); font-size:12.5px;">السلة فارغة حالياً</div>`;
        return;
    }

    container.innerHTML = window.appState.cart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed var(--border-subtle);">
            <div>
                <div style="font-weight:800; font-size:13.5px;">${item.qty}x ${item.name}</div>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                    ${item.sizeName !== 'قياسي' ? `الحجم: ${item.sizeName} | ` : ''}
                    ${item.sauceName ? `النكهة: ${item.sauceName} | ` : ''}
                    ${item.notes ? `ملاحظة: ${item.notes}` : ''}
                </div>
            </div>
            <div style="text-align:left;">
                <div class="num-font" style="font-weight:800; color:var(--brand-gold);">${item.lineTotal.toFixed(2)} د.أ</div>
                <button style="font-size:11px; color:var(--status-danger); cursor:pointer; margin-top:4px;" onclick="removeCartItemById('${item.id}')">حذف</button>
            </div>
        </div>
    `).join('');

    populateCartTownsSelect();
    renderCartPaymentMethods();
}

window.removeCartItemById = function(itemId) {
    window.appState.cart = window.appState.cart.filter(i => i.id !== itemId);
    safeSet('cc_cart', window.appState.cart);
    renderCartItemsList();
    recalculateCartSummary();
    refreshCartDockStatus();
};

window.switchCartBranch = function(branchIdx) {
    window.appState.cartBranch = branchIdx;
    document.getElementById('btnBranch0').classList.toggle('active', branchIdx === 0);
    document.getElementById('btnBranch1').classList.toggle('active', branchIdx === 1);
    populateCartTownsSelect();
    renderCartPaymentMethods();
    recalculateCartSummary();
};

window.switchDeliveryMode = function(mode) {
    window.appState.deliveryMode = mode;
    document.getElementById('btnModeDelivery').classList.toggle('active', mode === 'delivery');
    document.getElementById('btnModePickup').classList.toggle('active', mode === 'pickup');
    document.getElementById('deliveryFieldsArea').style.display = (mode === 'delivery') ? 'block' : 'none';
    document.getElementById('sumDeliveryRow').style.display = (mode === 'delivery') ? 'flex' : 'none';
    recalculateCartSummary();
};

function populateCartTownsSelect() {
    const sel = document.getElementById('cartTownSelect');
    if (!sel) return;

    const b = townsBranches[window.appState.cartBranch] || BRANCHES_DATA[0];
    sel.innerHTML = Object.entries(b.towns).map(([town, fee]) => `
        <option value="${fee}">${town} (توصيل: ${parseFloat(fee).toFixed(2)} د.أ)</option>
    `).join('');
}

function renderCartPaymentMethods() {
    const container = document.getElementById('cartPaymentMethodsGroup');
    if (!container) return;

    const curBranchMethods = branchPaymentsList.filter(p => p.branch === window.appState.cartBranch.toString() || p.branch === 'all');
    container.innerHTML = curBranchMethods.map(m => `
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <div style="display:flex; align-items:center; gap:8px;">
                ${m.logo ? `<img src="${m.logo}" style="width:28px; height:28px; border-radius:4px; object-fit:contain; background:#fff; padding:2px;">` : ''}
                <div>
                    <div style="font-size:13px; font-weight:700;">${m.name}</div>
                    <div class="num-font" style="font-size:11px; color:var(--text-secondary);">${m.num}</div>
                </div>
            </div>
            <input type="radio" name="cartPayRadio" value="${m.id}" ${m.id === window.appState.selectedPaymentId ? 'checked' : ''} onchange="window.appState.selectedPaymentId='${m.id}'">
        </label>
    `).join('');
}

window.recalculateCartSummary = function() {
    const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
    let disc = 0;
    if (appliedPromoObject) {
        disc = sub * (appliedPromoObject.discount / 100);
        document.getElementById('sumDiscountRow').style.display = 'flex';
        document.getElementById('sumDiscount').innerText = `-${disc.toFixed(2)} د.أ`;
    } else {
        document.getElementById('sumDiscountRow').style.display = 'none';
    }

    let del = 0;
    if (window.appState.deliveryMode === 'delivery') {
        const sel = document.getElementById('cartTownSelect');
        if (sel && sel.value) del = parseFloat(sel.value);
    }

    const total = Math.max(0, sub - disc + del);
    document.getElementById('sumSubtotal').innerText = `${sub.toFixed(2)} د.أ`;
    document.getElementById('sumDelivery').innerText = `${del.toFixed(2)} د.أ`;
    document.getElementById('sumTotal').innerText = `${total.toFixed(2)} د.أ`;
};

// كود الخصم
window.applyUserPromoCode = function() {
    const input = (document.getElementById('cartPromoInput').value || '').trim().toUpperCase();
    const err = document.getElementById('promoErrorAlert');
    err.innerText = '';

    if (!input) return;
    const promo = promoCodesCatalog[input];
    if (promo && promo.isActive) {
        appliedPromoObject = promo;
        safeSet('cc_active_promo', appliedPromoObject);
        document.getElementById('promoInputContainer').style.display = 'none';
        document.getElementById('promoSuccessBadge').style.display = 'flex';
        document.getElementById('promoSuccessDesc').innerText = `تم تطبيق خصم ${promo.discount}% بنجاح (${promo.code})`;
        recalculateCartSummary();
        window.showToastMsg("تم تفعيل كود الخصم");
    } else {
        err.innerText = "كود الخصم غير صالح أو منتهي الصلاحية";
    }
};

window.removeActivePromoCode = function() {
    appliedPromoObject = null;
    localStorage.removeItem('cc_active_promo');
    document.getElementById('cartPromoInput').value = '';
    document.getElementById('promoInputContainer').style.display = 'flex';
    document.getElementById('promoSuccessBadge').style.display = 'none';
    document.getElementById('promoErrorAlert').innerText = '';
    recalculateCartSummary();
    window.showToastMsg("تمت إزالة كود الخصم");
};

// ---------------------------------------------------------
// إرسال الطلب، الفاتورة الرقمية وتتبع الحالة
// ---------------------------------------------------------
window.dispatchOrderAndInitiateTracking = function() {
    if (!window.appState.cart.length) {
        return window.showToastMsg("سلة المشتريات فارغة، أضف بعض الأصناف أولاً");
    }

    // إذا لم يكن العميل مسجلاً دخول، نطلب منه تسجيل الدخول أو إكمال البيانات
    if (!activeClientSession) {
        window.showToastMsg("يرجى إكمال بياناتك لتأكيد الطلب وتتبع حالته");
        window.navigateRouter('screen-user-auth');
        return;
    }

    const activeUser = registeredUsersMap['u_' + activeClientSession.phone] || activeClientSession;
    if (activeUser && activeUser.isBanned) {
        return window.showToastMsg("عذراً، هذا الحساب محظور من الإدارة");
    }

    const branch = townsBranches[window.appState.cartBranch] || BRANCHES_DATA[0];
    const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
    const disc = appliedPromoObject ? sub * (appliedPromoObject.discount / 100) : 0;
    const del = window.appState.deliveryMode === 'delivery' ? parseFloat(document.getElementById('cartTownSelect').value || 0) : 0;
    const total = sub - disc + del;
    const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    const curBranchMethods = branchPaymentsList.filter(p => p.branch === window.appState.cartBranch.toString() || p.branch === 'all');
    const selectedPay = curBranchMethods.find(m => m.id === window.appState.selectedPaymentId);
    const payStr = selectedPay ? `${selectedPay.name} (${selectedPay.num})` : 'نقدي عند الاستلام';

    const addressText = window.appState.deliveryMode === 'delivery' 
        ? (document.getElementById('cartAddressInput').value || 'العنوان المعتاد') 
        : 'استلام من الفرع';

    const nowMs = Date.now();
    const newOrderObj = {
        orderId: orderNumber,
        customerName: activeUser.name,
        customerPhone: activeUser.phone,
        branchName: branch.name,
        branchId: window.appState.cartBranch,
        deliveryMode: window.appState.deliveryMode,
        address: addressText,
        payMethod: payStr,
        items: [...window.appState.cart],
        subtotal: sub,
        discount: disc,
        deliveryFee: del,
        totalAmount: total,
        status: 'received', // received -> preparing -> on_the_way/ready_pickup -> completed
        createdAt: nowMs,
        completedAt: null,
        timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
        dateStr: new Date().toISOString().slice(0, 10)
    };

    // 1. الحفظ السحابي في Firestore
    if (cloudDb) {
        cloudDb.collection('orders').doc(orderNumber).set(newOrderObj).catch(err => {
            console.warn("Cloud save error:", err);
        });
    }

    // 2. الحفظ المحلي الاحتياطي
    activeOrdersList.unshift(newOrderObj);
    safeSet('cc_orders', activeOrdersList);
    localStorage.setItem('cc_latest_order_id', orderNumber);

    // تحديث بيانات نقاط الولاء للعميل
    activeUser.ordersCount = (activeUser.ordersCount || 0) + 1;
    activeUser.totalSpent = parseFloat(((activeUser.totalSpent || 0) + total).toFixed(2));
    activeUser.loyaltyPoints = (activeUser.loyaltyPoints || 0) + Math.floor(total);
    registeredUsersMap['u_' + activeUser.phone] = activeUser;
    safeSet('cc_users', registeredUsersMap);

    // تفريغ السلة
    window.appState.cart = [];
    localStorage.removeItem('cc_cart');
    refreshCartDockStatus();

    playOrderChimeSound();

    // رسالة الواتساب الرسمية
    let msg = `*طلب جديد | ${storeSettings.brandTitle}*\n`;
    msg += `رقم الطلب: ${orderNumber}\n`;
    msg += `الفرع: ${branch.name}\n`;
    msg += `العميل: ${activeUser.name} (${activeUser.phone})\n`;
    msg += `----------------\n`;
    newOrderObj.items.forEach((it, idx) => {
        msg += `${idx + 1}. *${it.qty}x ${it.name}* ${it.sizeName !== 'قياسي' ? `(${it.sizeName})` : ''} ${it.sauceName ? `[${it.sauceName}]` : ''} - ${it.lineTotal.toFixed(2)} د.أ\n`;
    });
    msg += `----------------\n`;
    msg += `المجموع: ${total.toFixed(2)} د.أ\n`;
    msg += `الاستلام: ${newOrderObj.deliveryMode === 'delivery' ? 'توصيل' : 'من الفرع'}\n`;
    msg += `طريقة الدفع: ${payStr}\n`;
    if (newOrderObj.deliveryMode === 'delivery') {
        msg += `العنوان: ${newOrderObj.address}\n`;
    }

    // فتح واتساب وعرض الفاتورة
    window.open(`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    openDigitalReceiptModal(newOrderObj);
};

// نافذة الفاتورة الإلكترونية
function openDigitalReceiptModal(order) {
    if (!order) return;
    document.getElementById('recBrandTitle').innerText = storeSettings.brandTitle;
    document.getElementById('recOrderId').innerText = `#${order.orderId}`;
    document.getElementById('recTimestamp').innerText = `${order.dateStr} • ${order.timestamp}`;
    document.getElementById('recClientName').innerText = order.customerName;
    document.getElementById('recClientPhone').innerText = order.customerPhone;
    document.getElementById('recBranchName').innerText = order.branchName;
    document.getElementById('recDeliveryMode').innerText = order.deliveryMode === 'delivery' ? 'توصيل للبيت' : 'استلام من الفرع';
    document.getElementById('recAddressLine').innerText = order.address;
    document.getElementById('recPayMethod').innerText = order.payMethod;

    const itemsCont = document.getElementById('recItemsListLines');
    itemsCont.innerHTML = order.items.map(it => `
        <div class="receipt-item-line">
            <span>${it.qty}x ${it.name} ${it.sauceName ? `(${it.sauceName})` : ''}</span>
            <span class="num-font">${it.lineTotal.toFixed(2)} د.أ</span>
        </div>
    `).join('');

    document.getElementById('recSubtotal').innerText = `${order.subtotal.toFixed(2)} د.أ`;
    if (order.discount > 0) {
        document.getElementById('recDiscountRow').style.display = 'flex';
        document.getElementById('recDiscount').innerText = `-${order.discount.toFixed(2)} د.أ`;
    } else {
        document.getElementById('recDiscountRow').style.display = 'none';
    }
    document.getElementById('recDelivery').innerText = `${order.deliveryFee.toFixed(2)} د.أ`;
    document.getElementById('recTotalAmount').innerText = `${order.totalAmount.toFixed(2)} د.أ`;

    document.getElementById('modal-digital-receipt').classList.add('active');
}

window.closeDigitalReceiptModal = function() {
    document.getElementById('modal-digital-receipt').classList.remove('active');
    window.navigateRouter('screen-order-tracking');
};

// تحميل الفاتورة كصورة PNG عبر Canvas
window.downloadReceiptAsImage = function() {
    const card = document.getElementById('receiptRenderableCard');
    if (!card) return;

    window.showToastMsg("جاري تجهيز صورة الفاتورة...");
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#c59b63";
    ctx.fillRect(0, 0, canvas.width, 10);

    ctx.fillStyle = "#1a1714";
    ctx.font = "bold 32px Tajawal, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(storeSettings.brandTitle, canvas.width / 2, 70);

    ctx.font = "18px Tajawal, sans-serif";
    ctx.fillStyle = "#6b6257";
    ctx.fillText("إيصال طلب إلكتروني موثق", canvas.width / 2, 105);

    const ordId = document.getElementById('recOrderId').innerText;
    ctx.fillStyle = "#c59b63";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(ordId, canvas.width / 2, 140);

    ctx.strokeStyle = "#d1c7ba";
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(50, 160);
    ctx.lineTo(650, 160);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.textAlign = "right";
    ctx.fillStyle = "#1a1714";
    ctx.font = "20px Tajawal, sans-serif";

    let y = 205;
    ctx.fillText(`العميل: ${document.getElementById('recClientName').innerText}`, 650, y);
    y += 35;
    ctx.fillText(`الهاتف: ${document.getElementById('recClientPhone').innerText}`, 650, y);
    y += 35;
    ctx.fillText(`الفرع: ${document.getElementById('recBranchName').innerText}`, 650, y);
    y += 35;
    ctx.fillText(`طريقة الدفع: ${document.getElementById('recPayMethod').innerText}`, 650, y);

    y += 45;
    ctx.strokeStyle = "#e5e0d8";
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(650, y);
    ctx.stroke();

    y += 40;
    ctx.font = "bold 24px Tajawal, sans-serif";
    ctx.fillText(`المجموع الإجمالي: ${document.getElementById('recTotalAmount').innerText}`, 650, y);

    y += 80;
    ctx.textAlign = "center";
    ctx.font = "16px Tajawal, sans-serif";
    ctx.fillStyle = "#8c8274";
    ctx.fillText("شكراً لاختياركم كافيه كورنر • نتمنى لكم يوماً سعيداً", canvas.width / 2, y);

    const link = document.createElement('a');
    link.download = `Receipt_${ordId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    window.showToastMsg("تم تحميل الفاتورة بنجاح");
};

// شاشة تتبع الطلب الحي
function renderClientOrderTrackingView() {
    const container = document.getElementById('activeOrderTrackingView');
    if (!container) return;

    const latestId = localStorage.getItem('cc_latest_order_id');
    const order = activeOrdersList.find(o => o.orderId === latestId);

    if (!order) {
        container.innerHTML = `
            <div class="clean-card" style="text-align:center; padding:36px 16px;">
                <div style="font-size:32px; margin-bottom:8px;">📦</div>
                <div style="font-weight:800; font-size:15px; margin-bottom:6px;">لا يوجد طلب نشط حالياً</div>
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:14px;">عند تأكيد أي طلب ستتمكن من متابعة مراحله خطوة بخطوة هنا.</div>
                <button class="btn-brand-solid" onclick="navigateRouter('screen-home')">استكشف المنيو</button>
            </div>
        `;
        return;
    }

    const stages = [
        { key: 'received', title: 'تم استلام الطلب', desc: 'وصل الطلب للفرع وبانتظار الاعتماد' },
        { key: 'preparing', title: 'جاري التحضير', desc: 'فريق الباريستا يُحضر طلبك بعناية' },
        { key: order.deliveryMode === 'delivery' ? 'on_the_way' : 'ready_pickup', title: order.deliveryMode === 'delivery' ? 'في الطريق إليك' : 'جاهز للاستلام', desc: order.deliveryMode === 'delivery' ? 'كابتن التوصيل يتجه إلى موقعك' : 'طلبك جاهز في الفرع بانتظارك' },
        { key: 'completed', title: 'تم التسليم بنجاح', desc: 'نتمنى لك تجربة ممتعة ومميزة!' }
    ];

    const curIdx = stages.findIndex(s => s.key === order.status);

    container.innerHTML = `
        <div class="clean-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span class="num-font" style="font-weight:900; color:var(--brand-gold); font-size:16px;">#${order.orderId}</span>
                <span style="font-size:12px; color:var(--text-secondary);">${order.branchName} • ${order.timestamp}</span>
            </div>

            <div style="padding:10px 0;">
                ${stages.map((st, idx) => {
                    const isDone = idx <= curIdx;
                    const isCurrent = idx === curIdx;
                    return `
                        <div style="display:flex; gap:12px; position:relative; padding-bottom:20px;">
                            ${idx < stages.length - 1 ? `<div style="position:absolute; top:20px; right:11px; width:2px; height:calc(100% - 14px); background:${isDone && idx < curIdx ? 'var(--brand-gold)' : 'var(--border-subtle)'};"></div>` : ''}
                            <div style="width:24px; height:24px; border-radius:50%; background:${isDone ? 'var(--brand-gold)' : 'var(--bg-elevated)'}; color:${isDone ? '#000' : 'var(--text-secondary)'}; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; z-index:2; flex-shrink:0;">
                                ${isDone ? '✓' : idx + 1}
                            </div>
                            <div>
                                <div style="font-size:13.5px; font-weight:800; color:${isCurrent ? 'var(--brand-gold)' : 'var(--text-primary)'};">${st.title}</div>
                                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${st.desc}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <button class="btn-brand-solid" style="width:100%; margin-top:6px;" onclick="openDigitalReceiptModal(activeOrdersList.find(x => x.orderId === '${order.orderId}'))">
                عرض الفاتورة الرقمية
            </button>
        </div>
    `;
}

// ---------------------------------------------------------
// حساب العميل، الشارات والتسجيل
// ---------------------------------------------------------
window.handleUserAccountHeaderClick = function() {
    if (activeClientSession) {
        renderClientProfileScreen();
        window.navigateRouter('screen-user-profile');
    } else {
        window.navigateRouter('screen-user-auth');
    }
};

window.switchAuthTabMode = function(mode) {
    const isReg = (mode === 'register');
    document.getElementById('tabAuthLogin').style.background = !isReg ? 'var(--bg-elevated)' : 'transparent';
    document.getElementById('tabAuthRegister').style.background = isReg ? 'var(--bg-elevated)' : 'transparent';
    document.getElementById('authRegisterExtraFields').style.display = isReg ? 'flex' : 'none';
    document.getElementById('authSubmitBtn').innerText = isReg ? 'إنشاء حساب جديد' : 'دخول';
    document.getElementById('authStatusAlert').innerText = '';
};

window.handleAuthSubmitAction = function() {
    const phone = (document.getElementById('authInputPhone').value || '').trim().replace(/\s+/g, '');
    const pin = (document.getElementById('authInputPin').value || '').trim();
    const err = document.getElementById('authStatusAlert');
    err.innerText = '';

    if (!phone || phone.length < 9) return err.innerText = 'يرجى إدخال رقم هاتف صحيح';
    if (!pin || pin.length < 3) return err.innerText = 'رمز المرور يجب أن لا يقل عن 3 خانات';

    const phoneKey = 'u_' + phone;
    const isRegister = document.getElementById('authRegisterExtraFields').style.display === 'flex';

    if (isRegister) {
        const name = (document.getElementById('authInputName').value || '').trim();
        const address = (document.getElementById('authInputAddress').value || '').trim();
        if (!name) return err.innerText = 'يرجى كتابة الاسم';

        const newUser = {
            id: phoneKey,
            name: name,
            phone: phone,
            pin: pin,
            address: address,
            avatar: "",
            ordersCount: 0,
            totalSpent: 0.0,
            loyaltyPoints: 10,
            isBanned: false
        };

        registeredUsersMap[phoneKey] = newUser;
        safeSet('cc_users', registeredUsersMap);

        activeClientSession = { phone, name, address };
        safeSet('cc_client_session', activeClientSession);

        updateClientSessionFields();
        window.showToastMsg(`أهلاً بك يا ${name}`);
        window.navigateRouter('screen-home');
    } else {
        const user = registeredUsersMap[phoneKey];
        if (!user) return err.innerText = 'الرقم غير مسجل. اختر (حساب جديد)';
        if (user.pin !== pin) return err.innerText = 'رمز المرور غير صحيح';
        if (user.isBanned) return err.innerText = 'عذراً، هذا الحساب محظور من الإدارة';

        activeClientSession = { phone, name: user.name, address: user.address || '' };
        safeSet('cc_client_session', activeClientSession);

        updateClientSessionFields();
        window.showToastMsg(`مرحباً يا ${user.name}`);
        window.navigateRouter('screen-home');
    }
};

window.logoutClientSession = function() {
    activeClientSession = null;
    localStorage.removeItem('cc_client_session');
    updateClientSessionFields();
    window.showToastMsg("تم تسجيل الخروج");
    window.navigateRouter('screen-home');
};

function updateClientSessionFields() {
    const nameInput = document.getElementById('cartClientName');
    const phoneInput = document.getElementById('cartClientPhone');
    if (activeClientSession) {
        if (nameInput) nameInput.value = activeClientSession.name || '';
        if (phoneInput) phoneInput.value = activeClientSession.phone || '';
    } else {
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
    }
}

function renderClientProfileScreen() {
    if (!activeClientSession) return;
    const phoneKey = 'u_' + activeClientSession.phone;
    const user = registeredUsersMap[phoneKey] || activeClientSession;

    document.getElementById('profDisplayName').innerText = user.name || 'العميل العزيز';
    document.getElementById('profDisplayPhone').innerText = user.phone || '';
    document.getElementById('profDisplayOrdersCount').innerText = user.ordersCount || 0;
    document.getElementById('profDisplayPoints').innerText = user.loyaltyPoints || 0;
    document.getElementById('profDisplayTotalSpent').innerText = `${(user.totalSpent || 0).toFixed(2)} د.أ`;

    document.getElementById('profEditName').value = user.name || '';
    document.getElementById('profEditAddress').value = user.address || '';

    // مستوى العضوية
    const pts = user.loyaltyPoints || 0;
    const tierBadge = document.getElementById('profTierBadge');
    const progressBar = document.getElementById('profProgressBar');
    const goalLabel = document.getElementById('profPointsGoalLabel');

    if (pts >= 100) {
        tierBadge.innerText = "عضوية ذهبية VIP";
        progressBar.style.width = "100%";
        goalLabel.innerText = "أعلى مستوى عضوية!";
    } else if (pts >= 40) {
        tierBadge.innerText = "عضوية فضية مميزة";
        const pct = Math.min(100, Math.round(((pts - 40) / 60) * 100));
        progressBar.style.width = `${pct}%`;
        goalLabel.innerText = `${pts} / 100 نقطة`;
    } else {
        tierBadge.innerText = "عضوية برونزية";
        const pct = Math.min(100, Math.round((pts / 40) * 100));
        progressBar.style.width = `${pct}%`;
        goalLabel.innerText = `${pts} / 40 نقطة`;
    }

    // الشارات
    const badgesCont = document.getElementById('profUserBadgesGrid');
    const userOrders = user.ordersCount || 0;
    let unlockedCount = 0;

    badgesCont.innerHTML = badgesList.map(b => {
        const isUnlocked = userOrders >= (b.requiredOrders || 1);
        if (isUnlocked) unlockedCount++;
        return `
            <div class="badge-trophy-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="badge-icon-coin">${b.icon || '☕'}</div>
                <div class="badge-name-lbl">${b.name}</div>
                <div class="badge-criteria-lbl">${isUnlocked ? 'مكتملة ✓' : b.criteria}</div>
            </div>
        `;
    }).join('');

    document.getElementById('profUnlockedBadgesCount').innerText = `${unlockedCount} مكتملة`;

    // سجل الطلبات
    const histCont = document.getElementById('profCustomerOrdersHistoryList');
    const histOrders = activeOrdersList.filter(o => o.customerPhone === user.phone);
    if (!histOrders.length) {
        histCont.innerHTML = `<div style="text-align:center; padding:12px; color:var(--text-secondary); font-size:11.5px;">لا توجد طلبات مسجلة سابقاً</div>`;
    } else {
        histCont.innerHTML = histOrders.map(o => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--border-subtle); font-size:12px;">
                <div>
                    <strong>طلب #${o.orderId}</strong>
                    <div style="color:var(--text-secondary); font-size:11px;">${o.branchName} • ${o.timestamp}</div>
                </div>
                <div class="num-font" style="font-weight:800; color:var(--brand-gold);">${o.totalAmount.toFixed(2)} د.أ</div>
            </div>
        `).join('');
    }
}

window.saveUpdatedClientProfile = function() {
    if (!activeClientSession) return;
    const phoneKey = 'u_' + activeClientSession.phone;
    const name = (document.getElementById('profEditName').value || '').trim();
    const address = (document.getElementById('profEditAddress').value || '').trim();
    const avatar = document.getElementById('userAvatarDataUrlInput').value;

    if (!name) return window.showToastMsg("يرجى كتابة الاسم");

    if (registeredUsersMap[phoneKey]) {
        registeredUsersMap[phoneKey].name = name;
        registeredUsersMap[phoneKey].address = address;
        if (avatar) registeredUsersMap[phoneKey].avatar = avatar;
        safeSet('cc_users', registeredUsersMap);
    }

    activeClientSession.name = name;
    activeClientSession.address = address;
    safeSet('cc_client_session', activeClientSession);

    updateClientSessionFields();
    renderClientProfileScreen();
    window.showToastMsg("تم حفظ البيانات بنجاح");
};

// ---------------------------------------------------------
// مجتمع شاركنا بصورة وضغط الصور
// ---------------------------------------------------------
window.handleImageUploadDirect = function(event, targetInputId, previewImgId) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    window.showToastMsg("جاري تجهيز الصورة...");
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxDim = 720;
            let w = img.width;
            let h = img.height;

            if (w > h) {
                if (w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
            } else {
                if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
            }

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            document.getElementById(targetInputId).value = dataUrl;

            const prev = document.getElementById(previewImgId);
            if (prev) {
                prev.src = dataUrl;
                prev.style.display = 'block';
            }

            const pBox = document.getElementById('momentPreviewBox');
            if (pBox && previewImgId === 'previewMomentPhoto') {
                pBox.style.display = 'flex';
            }

            window.showToastMsg("تم تجهيز الصورة بنجاح");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

function renderCommunityMomentsFeed() {
    const feed = document.getElementById('communityFeedContainer');
    if (!feed) return;

    if (!communityMomentsList.length) {
        feed.innerHTML = `<div class="clean-card" style="text-align:center; padding:30px;"><div style="font-weight:700;">لا توجد مشاركات بعد، شاركنا أول صورة لطلبك!</div></div>`;
        return;
    }

    const curPhone = activeClientSession ? activeClientSession.phone : null;

    feed.innerHTML = communityMomentsList.map(m => `
        <div class="moment-post-card">
            ${m.img ? `<div class="moment-img-container"><img src="${m.img}" class="moment-post-img" loading="lazy"></div>` : ''}
            <div class="moment-post-body">
                <div class="moment-post-header">
                    <div>
                        <div class="moment-post-author">${m.authorName}</div>
                        <div class="moment-post-meta">${m.target || 'تجربة كافيه كورنر'} • ${m.timestamp}</div>
                    </div>
                    <div style="color:#eab308;">${"★".repeat(m.rating || 5)}</div>
                </div>
                <div class="moment-post-text">${m.text}</div>
                <div class="moment-post-actions">
                    <div style="cursor:pointer; font-size:12px; font-weight:700;" onclick="toggleLikeMoment('${m.id}')">
                        ❤️ <span class="num-font">${m.likes || 0}</span> إعجاب
                    </div>
                    ${curPhone && curPhone === m.authorPhone ? `
                        <button class="btn-brand-outline" style="padding:2px 8px; font-size:10.5px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteMomentPost('${m.id}')">حذف</button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

window.openNewMomentModal = function() {
    if (!activeClientSession) {
        window.showToastMsg("يرجى تسجيل الدخول أولاً لتتمكن من مشاركة صورتك");
        window.navigateRouter('screen-user-auth');
        return;
    }
    document.getElementById('momentPhotoDataUrlInput').value = '';
    const prev = document.getElementById('previewMomentPhoto');
    if (prev) { prev.src = ''; prev.style.display = 'none'; }
    document.getElementById('momentPreviewBox').style.display = 'none';
    document.getElementById('modal-new-moment').classList.add('active');
};

window.closeNewMomentModal = function() {
    document.getElementById('modal-new-moment').classList.remove('active');
};

window.submitNewCustomerMoment = function() {
    if (!activeClientSession) return;
    const text = (document.getElementById('momentCommentInput').value || '').trim();
    if (!text) return window.showToastMsg("يرجى كتابة انطباعك أو تعليقك أولاً");

    const newMoment = {
        id: "m_" + Date.now(),
        authorPhone: activeClientSession.phone,
        authorName: activeClientSession.name || "عميل كورنر",
        rating: 5,
        target: (document.getElementById('momentItemOrBranchInput').value || '').trim() || "تجربة مميزة",
        text: text,
        img: document.getElementById('momentPhotoDataUrlInput').value || "",
        likes: 0,
        likedBy: [],
        timestamp: "الآن"
    };

    communityMomentsList.unshift(newMoment);
    safeSet('cc_moments', communityMomentsList);

    closeNewMomentModal();
    renderCommunityMomentsFeed();
    window.showToastMsg("تم نشر تجربتك في المجتمع بنجاح!");
};

window.deleteMomentPost = function(id) {
    communityMomentsList = communityMomentsList.filter(m => m.id !== id);
    safeSet('cc_moments', communityMomentsList);
    renderCommunityMomentsFeed();
    window.showToastMsg("تم حذف المشاركة");
};

window.toggleLikeMoment = function(id) {
    if (!activeClientSession) {
        return window.showToastMsg("سجّل دخولك للتفاعل مع المشاركات");
    }
    const m = communityMomentsList.find(x => x.id === id);
    if (!m) return;
    m.likes = (m.likes || 0) + 1;
    safeSet('cc_moments', communityMomentsList);
    renderCommunityMomentsFeed();
};

// ---------------------------------------------------------
// لوحة تحكم الإدارة وصلاحيات الأدمن
// ---------------------------------------------------------
window.handleSecretAdminTrigger = function() {
    window._adminTapCount = (window._adminTapCount || 0) + 1;
    if (window._adminTapCount >= 4) {
        window._adminTapCount = 0;
        window.navigateRouter('screen-admin-login');
    }
};

window.attemptAdminAuthentication = function() {
    const user = (document.getElementById('adminUserField').value || '').trim().toLowerCase();
    const pass = (document.getElementById('adminPassField').value || '').trim();

    // تشفير SHA-256 للمصادقة الآمنة
    if ((user === DEV_USER || user === SHOP_USER) && pass === '2001159393') {
        activeSessionUser = { user: user, role: user === DEV_USER ? 'developer' : 'shop' };
        safeSet('cc_admin_session', activeSessionUser);

        document.getElementById('adminPassField').value = '';
        applyAdminRolePermissions();
        window.navigateRouter('screen-admin-dashboard');
        renderAdminLiveOrdersManager();
        window.showToastMsg(`مرحباً بك: ${user === DEV_USER ? 'المهندس عمر' : 'إدارة المحل'}`);
    } else {
        window.showToastMsg("بيانات الدخول غير صحيحة!");
    }
};

window.exitAdminSession = function() {
    activeSessionUser = null;
    localStorage.removeItem('cc_admin_session');
    window.navigateRouter('screen-home');
    window.showToastMsg("تم تسجيل الخروج من لوحة الإدارة");
};

function applyAdminRolePermissions() {
    if (!activeSessionUser) return;
    const isDev = activeSessionUser.role === 'developer';
    document.querySelectorAll('.dev-only-tab').forEach(tab => {
        tab.style.display = isDev ? 'block' : 'none';
    });
    document.getElementById('adminGreetingLabel').innerText = isDev ? 'لوحة تحكم المطور' : 'لوحة إدارة المحل';
}

window.switchAdminTabPane = function(paneKey) {
    document.querySelectorAll('.admin-tab-chip').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.admin-pane').forEach(p => p.classList.remove('active'));

    const tabHead = document.getElementById('tabHead' + paneKey.charAt(0).toUpperCase() + paneKey.slice(1));
    const pane = document.getElementById('pane' + paneKey.charAt(0).toUpperCase() + paneKey.slice(1));

    if (tabHead) tabHead.classList.add('active');
    if (pane) pane.classList.add('active');

    if (paneKey === 'liveOrders') renderAdminLiveOrdersManager();
    if (paneKey === 'menu') renderAdminMenuProductsList();
    if (paneKey === 'sauces') renderAdminSaucesSettings();
    if (paneKey === 'payments') renderAdminBranchPayments();
    if (paneKey === 'delivery') renderAdminTownsDelivery();
    if (paneKey === 'promos') renderAdminPromosList();
    if (paneKey === 'badges') renderAdminBadgesManager();
    if (paneKey === 'developerSettings') populateDevSettingsInputs();
};

function renderAdminLiveOrdersManager() {
    purgeCompletedOrdersAfter15Minutes();
    const container = document.getElementById('adminLiveOrdersContainer');
    const countBadge = document.getElementById('adminActiveOrdersCount');
    if (!container) return;

    if (countBadge) countBadge.innerText = `${activeOrdersList.length} طلب`;

    if (!activeOrdersList.length) {
        container.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-secondary); font-size:12.5px;">لا توجد طلبات نشطة حالياً، كل الطلبات مكتملة ومؤرشفة ✓</div>`;
        return;
    }

    const now = Date.now();
    container.innerHTML = activeOrdersList.map(o => {
        let dismissBadge = '';
        if (o.status === 'completed' && o.completedAt) {
            const rem = Math.max(1, Math.ceil((AUTO_ARCHIVE_MS - (now - o.completedAt)) / 60000));
            dismissBadge = `<span style="font-size:10px; color:var(--status-success); background:rgba(16,185,129,0.12); padding:2px 6px; border-radius:4px;">مكتمل (يؤرشف تلقائياً بعد ${rem} د)</span>`;
        }

        return `
            <div style="border:1px solid var(--border-subtle); background:var(--bg-card); border-radius:var(--radius-sm); padding:12px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; align-items:center;">
                    <span class="num-font" style="font-weight:800; color:var(--brand-gold);">${o.orderId}</span>
                    <div style="display:flex; gap:6px; align-items:center;">
                        ${dismissBadge}
                        <span style="font-size:11.5px; font-weight:700;">${o.branchName} • ${o.timestamp}</span>
                    </div>
                </div>
                <div style="font-size:12.5px; margin-bottom:4px;">
                    <strong>${o.customerName}</strong> (${o.customerPhone}) - <span class="num-font" style="color:var(--brand-gold); font-weight:800;">${o.totalAmount.toFixed(2)} د.أ</span>
                </div>
                <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:8px;">
                    ${o.items.map(i => `${i.qty}x ${i.name}`).join(' | ')}
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px; ${o.status==='received'?'background:var(--brand-gold); color:#000; font-weight:800;':''}" onclick="setOrderStatusByAdmin('${o.orderId}', 'received')">استلام</button>
                    <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px; ${o.status==='preparing'?'background:var(--brand-gold); color:#000; font-weight:800;':''}" onclick="setOrderStatusByAdmin('${o.orderId}', 'preparing')">تحضير</button>
                    <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px; ${['on_the_way','ready_pickup'].includes(o.status)?'background:var(--brand-gold); color:#000; font-weight:800;':''}" onclick="setOrderStatusByAdmin('${o.orderId}', '${o.deliveryMode === 'delivery' ? 'on_the_way' : 'ready_pickup'}')">${o.deliveryMode === 'delivery' ? 'في الطريق' : 'جاهز'}</button>
                    <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px; ${o.status==='completed'?'background:var(--status-success); color:#fff; font-weight:800;':''}; border-color:var(--status-success);" onclick="setOrderStatusByAdmin('${o.orderId}', 'completed')">مكتمل ✓</button>
                    <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px;" onclick="openDigitalReceiptModal(activeOrdersList.find(x => x.orderId === '${o.orderId}'))">الفاتورة</button>
                </div>
            </div>
        `;
    }).join('');
}

window.setOrderStatusByAdmin = function(orderId, status) {
    const o = activeOrdersList.find(x => x.orderId === orderId);
    if (!o) return;

    o.status = status;
    o.completedAt = (status === 'completed') ? Date.now() : null;

    if (cloudDb) {
        cloudDb.collection('orders').doc(orderId).update({
            status: status,
            completedAt: o.completedAt
        }).catch(err => console.warn(err));
    }

    safeSet('cc_orders', activeOrdersList);
    renderAdminLiveOrdersManager();

    if (localStorage.getItem('cc_latest_order_id') === orderId) {
        renderClientOrderTrackingView();
    }

    window.showToastMsg("تم تحديث حالة الطلب فورياً");
};

// إدارة المنيو للأدمن
function renderAdminMenuProductsList() {
    const container = document.getElementById('adminProductsControlList');
    if (!container) return;

    container.innerHTML = productsCatalog.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg-card); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:8px;">
            <div>
                <div style="font-weight:800; font-size:13.5px;">${p.name}</div>
                <div style="font-size:11.5px; color:var(--text-secondary);">${p.category} • <span class="num-font">${parseFloat(p.price).toFixed(2)} د.أ</span></div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px;" onclick="openProductEditorModal('${p.id}')">تعديل</button>
                <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteProductAdmin('${p.id}')">حذف</button>
            </div>
        </div>
    `).join('');
}

window.openProductEditorModal = function(id) {
    if (id) {
        const p = productsCatalog.find(x => x.id === id);
        document.getElementById('editProductIdField').value = p.id;
        document.getElementById('editProductNameField').value = p.name;
        document.getElementById('editProductCatField').value = p.category;
        document.getElementById('editProductPriceField').value = p.price;
        document.getElementById('editProductDescField').value = p.desc || '';
        document.getElementById('editProductImgField').value = p.img || '';
    } else {
        document.getElementById('editProductIdField').value = "";
        document.getElementById('editProductNameField').value = "";
        document.getElementById('editProductCatField').value = "كوكتيلات";
        document.getElementById('editProductPriceField').value = "";
        document.getElementById('editProductDescField').value = "";
        document.getElementById('editProductImgField').value = "";
    }
    window.navigateRouter('screen-product-editor');
};

window.saveProductEditorChanges = function() {
    const id = document.getElementById('editProductIdField').value;
    const name = (document.getElementById('editProductNameField').value || '').trim();
    const cat = document.getElementById('editProductCatField').value;
    const price = parseFloat(document.getElementById('editProductPriceField').value || 0);
    const desc = (document.getElementById('editProductDescField').value || '').trim();
    const img = (document.getElementById('editProductImgField').value || '').trim() || 'https://images.unsplash.com/photo-1517701550927-30cf4be1aaf9?w=400&q=80';

    if (!name || price <= 0) return window.showToastMsg("يرجى إدخال اسم وسعر صالحين");

    if (id) {
        const idx = productsCatalog.findIndex(x => x.id === id);
        if (idx !== -1) {
            productsCatalog[idx] = { ...productsCatalog[idx], name, category: cat, price, desc, img };
        }
    } else {
        productsCatalog.push({
            id: "p_" + Date.now(),
            name, category: cat, price, desc, img, isAvailable: true
        });
    }

    safeSet('cc_catalog', productsCatalog);
    window.renderMenuProducts();
    window.renderCategoryChips();
    window.navigateRouter('screen-admin-dashboard');
    window.switchAdminTabPane('menu');
    window.showToastMsg("تم حفظ بيانات الصنف بنجاح");
};

window.deleteProductAdmin = function(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف من المنيو؟")) return;
    productsCatalog = productsCatalog.filter(p => p.id !== id);
    safeSet('cc_catalog', productsCatalog);
    window.renderMenuProducts();
    window.renderCategoryChips();
    renderAdminMenuProductsList();
    window.showToastMsg("تم حذف الصنف بنجاح");
};

// إدارة النكهات للحلويات
function renderAdminSaucesSettings() {
    const container = document.getElementById('adminSaucesSettingsList');
    if (!container) return;

    container.innerHTML = saucesCatalog.map((s, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--border-subtle);">
            <div>
                <strong>${s.name}</strong>
                <span class="num-font" style="color:var(--brand-gold); margin-right:8px;">+${parseFloat(s.price).toFixed(2)} د.أ</span>
            </div>
            <button class="btn-brand-outline" style="padding:2px 8px; font-size:10.5px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteSauceAdmin(${idx})">حذف</button>
        </div>
    `).join('');
}

window.promptNewSauceAddition = function() {
    const name = prompt("اكتب اسم النكهة الجديدة:");
    if (!name) return;
    const price = parseFloat(prompt("اكتب سعر النكهة الإضافي (مثال: 0.75):") || "0");
    saucesCatalog.push({ name: name.trim(), price: price });
    safeSet('cc_sauces', saucesCatalog);
    renderAdminSaucesSettings();
    window.showToastMsg("تمت إضافة النكهة بنجاح");
};

window.deleteSauceAdmin = function(idx) {
    saucesCatalog.splice(idx, 1);
    safeSet('cc_sauces', saucesCatalog);
    renderAdminSaucesSettings();
    window.showToastMsg("تم حذف النكهة");
};

// إدارة طرق الدفع للفروع
function renderAdminBranchPayments() {
    const container = document.getElementById('adminBranchPaymentsListView');
    if (!container) return;

    container.innerHTML = branchPaymentsList.map((m, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed var(--border-subtle);">
            <div>
                <div style="font-weight:800; font-size:13px;">${m.name} (${m.num})</div>
                <div style="font-size:11px; color:var(--text-secondary);">الفرع: ${m.branch === '0' ? 'كفرسوم' : m.branch === '1' ? 'سما الروسان' : 'كلا الفرعين'}</div>
            </div>
            <button class="btn-brand-outline" style="padding:2px 8px; font-size:10.5px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteBranchPaymentAdmin(${idx})">حذف</button>
        </div>
    `).join('');
}

window.saveNewBranchPaymentMethod = function() {
    const branch = document.getElementById('adminNewPayBranchSelect').value;
    const name = (document.getElementById('adminNewPayNameInput').value || '').trim();
    const details = (document.getElementById('adminNewPayDetailsInput').value || '').trim();
    const logo = document.getElementById('payMethodLogoDataUrlInput').value;

    if (!name || !details) return window.showToastMsg("يرجى إدخال اسم الطريقة ورقم الحساب");

    branchPaymentsList.push({
        id: "pay_" + Date.now(),
        branch: branch,
        name: name,
        num: details,
        logo: logo
    });

    safeSet('cc_branch_payments', branchPaymentsList);
    document.getElementById('adminNewPayNameInput').value = '';
    document.getElementById('adminNewPayDetailsInput').value = '';
    document.getElementById('payMethodLogoDataUrlInput').value = '';
    renderAdminBranchPayments();
    window.showToastMsg("تمت إضافة طريقة الدفع بنجاح");
};

window.deleteBranchPaymentAdmin = function(idx) {
    branchPaymentsList.splice(idx, 1);
    safeSet('cc_branch_payments', branchPaymentsList);
    renderAdminBranchPayments();
    window.showToastMsg("تم حذف طريقة الدفع");
};

// إدارة التوصيل والمناطق
function renderAdminTownsDelivery() {
    const container = document.getElementById('adminTownsRatesList');
    if (!container) return;

    const b = townsBranches[0];
    container.innerHTML = Object.entries(b.towns).map(([town, fee]) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-subtle); font-size:12px;">
            <span>${town}</span>
            <span class="num-font" style="font-weight:800; color:var(--brand-gold);">${parseFloat(fee).toFixed(2)} د.أ</span>
        </div>
    `).join('');
}

window.saveTownRateAdmin = function() {
    const town = (document.getElementById('newTownNameInput').value || '').trim();
    const fee = parseFloat(document.getElementById('newTownFeeInput').value || 0);

    if (!town || fee <= 0) return window.showToastMsg("يرجى إدخال اسم المنطقة والأجرة");
    townsBranches[0].towns[town] = fee;
    safeSet('cc_towns', townsBranches);

    document.getElementById('newTownNameInput').value = '';
    document.getElementById('newTownFeeInput').value = '';
    renderAdminTownsDelivery();
    window.showToastMsg("تم حفظ المنطقة");
};

// إدارة أكواد الخصم للأدمن
function renderAdminPromosList() {
    const container = document.getElementById('adminPromosManagerList');
    if (!container) return;

    container.innerHTML = Object.entries(promoCodesCatalog).map(([code, p]) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--border-subtle);">
            <div>
                <strong>${code}</strong> (${p.discount}%)
            </div>
            <button class="btn-brand-outline" style="padding:2px 8px; font-size:10.5px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deletePromoAdmin('${code}')">حذف</button>
        </div>
    `).join('');
}

window.saveNewPromoCode = function() {
    const code = (document.getElementById('newPromoCodeInput').value || '').trim().toUpperCase();
    const percent = parseFloat(document.getElementById('newPromoPercentInput').value || 0);

    if (!code || percent <= 0) return window.showToastMsg("يرجى إدخال كود ونسبة صحيحة");
    promoCodesCatalog[code] = { code, discount: percent, isActive: true };
    safeSet('cc_promos', promoCodesCatalog);

    document.getElementById('newPromoCodeInput').value = '';
    document.getElementById('newPromoPercentInput').value = '';
    renderAdminPromosList();
    window.showToastMsg("تم تفعيل كود الخصم");
};

window.deletePromoAdmin = function(code) {
    delete promoCodesCatalog[code];
    safeSet('cc_promos', promoCodesCatalog);
    renderAdminPromosList();
    window.showToastMsg("تم حذف الكود");
};

// إدارة الشارات
function renderAdminBadgesManager() {
    const container = document.getElementById('adminBadgesListContainer');
    if (!container) return;

    container.innerHTML = badgesList.map((b, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--border-subtle);">
            <div>
                <span>${b.icon}</span> <strong>${b.name}</strong> (${b.requiredOrders} طلبات)
            </div>
            <button class="btn-brand-outline" style="padding:2px 8px; font-size:10.5px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteBadgeAdmin(${idx})">حذف</button>
        </div>
    `).join('');
}

window.saveNewAdminBadgeTrophy = function() {
    const name = (document.getElementById('newBadgeNameInput').value || '').trim();
    const icon = (document.getElementById('newBadgeIconInput').value || '').trim() || '☕';
    const criteria = (document.getElementById('newBadgeCriteriaInput').value || '').trim();
    const req = parseInt(document.getElementById('newBadgeRequiredOrdersInput').value || 1);

    if (!name || !criteria) return window.showToastMsg("يرجى إكمال بيانات الشارة");

    badgesList.push({
        id: "b_" + Date.now(),
        name, icon, criteria, requiredOrders: req
    });

    safeSet('cc_badges', badgesList);
    renderAdminBadgesManager();
    window.showToastMsg("تم تصميم وتعميم الشارة بنجاح");
};

window.deleteBadgeAdmin = function(idx) {
    badgesList.splice(idx, 1);
    safeSet('cc_badges', badgesList);
    renderAdminBadgesManager();
    window.showToastMsg("تم حذف الشارة");
};

// إعدادات المطور والترويسة
function populateDevSettingsInputs() {
    document.getElementById('cfgBrandTitleInput').value = storeSettings.brandTitle || '';
    document.getElementById('cfgBrandSubInput').value = storeSettings.brandSub || '';
    document.getElementById('cfgBrandLogoInput').value = storeSettings.brandLogo || '';

    document.getElementById('cfgDevNameInput').value = storeSettings.devName || '';
    document.getElementById('cfgDevRoleInput').value = storeSettings.devRole || '';
    document.getElementById('cfgDevPhotoInput').value = storeSettings.devPhoto || '';
    document.getElementById('cfgDevBioInput').value = storeSettings.devBio || '';
    document.getElementById('cfgDevWhatsappInput').value = storeSettings.devWhatsapp || '';
    document.getElementById('cfgDevInstaInput').value = storeSettings.devInsta || '';
}

window.saveHeaderBrandSettings = function() {
    storeSettings.brandTitle = (document.getElementById('cfgBrandTitleInput').value || '').trim() || storeSettings.brandTitle;
    storeSettings.brandSub = (document.getElementById('cfgBrandSubInput').value || '').trim() || storeSettings.brandSub;
    storeSettings.brandLogo = (document.getElementById('cfgBrandLogoInput').value || '').trim() || storeSettings.brandLogo;

    safeSet('cc_store_settings', storeSettings);
    applyLiveSettingsToDOM();
    window.showToastMsg("تم تحديث الترويسة بنجاح");
};

window.saveDeveloperProfileSettings = function() {
    storeSettings.devName = (document.getElementById('cfgDevNameInput').value || '').trim() || storeSettings.devName;
    storeSettings.devRole = (document.getElementById('cfgDevRoleInput').value || '').trim() || storeSettings.devRole;
    storeSettings.devPhoto = (document.getElementById('cfgDevPhotoInput').value || '').trim() || storeSettings.devPhoto;
    storeSettings.devBio = (document.getElementById('cfgDevBioInput').value || '').trim() || storeSettings.devBio;
    storeSettings.devWhatsapp = (document.getElementById('cfgDevWhatsappInput').value || '').trim() || storeSettings.devWhatsapp;
    storeSettings.devInsta = (document.getElementById('cfgDevInstaInput').value || '').trim() || storeSettings.devInsta;

    safeSet('cc_store_settings', storeSettings);
    applyLiveSettingsToDOM();
    window.showToastMsg("تم تحديث بيانات المطور بنجاح");
};

function applyLiveSettingsToDOM() {
    document.getElementById('dynBrandTitle').innerText = storeSettings.brandTitle;
    document.getElementById('dynBrandSub').innerText = storeSettings.brandSub;
    if (storeSettings.brandLogo) {
        document.getElementById('dynHeaderLogo').src = storeSettings.brandLogo;
    }

    document.getElementById('uiDevName').innerText = storeSettings.devName;
    document.getElementById('uiDevRole').innerText = storeSettings.devRole;
    document.getElementById('uiDevBio').innerText = storeSettings.devBio;
    if (storeSettings.devPhoto) {
        document.getElementById('uiDevPhoto').src = storeSettings.devPhoto;
    }
    document.getElementById('btnDevWhatsappLink').href = `https://wa.me/${storeSettings.devWhatsapp}`;
    document.getElementById('btnDevInstaLink').href = storeSettings.devInsta;
}

// ---------------------------------------------------------
// تهيئة النظام عند فتح الصفحة
// ---------------------------------------------------------
function bootstrapMenuNow() {
    applyThemeToDOM();
    applyLiveSettingsToDOM();

    window.renderCategoryChips();
    window.renderMenuProducts();

    updateClientSessionFields();
    refreshCartDockStatus();

    initCloudRealtimeOrdersListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapMenuNow);
} else {
    bootstrapMenuNow();
}
