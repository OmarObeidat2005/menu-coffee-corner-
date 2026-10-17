/* =========================================================
   COFFEE CORNER PRO — CORE APPLICATION ENGINE (MODULAR)
   إدارة التوجيه، المنيو، السلة، الحسابات، ورنين الطلبات العالي للأدمن
   ========================================================= */

const DEV_USER = 'omar';
const SHOP_USER = 'corner';
const MASTER_PIN = "2001159393";

// إعداد Firebase Firestore السحابي
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
    console.warn("Cloud Firestore Notice:", err);
}

// الكتالوج الافتراضي
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
    } catch(e) {}
}

// الحالة العامة المشتركة
window.appState = {
    cartBranch: 0,
    currentCategory: "الكل",
    cart: safeGet('cc_cart', []),
    deliveryMode: "delivery",
    activeTable: null,
    activeGroupCode: null,
    activeGroupName: "",
    selectedPaymentId: "pay_3",
    selectedProduct: null,
    productModalQty: 1
};

let activeSessionUser = safeGet('cc_admin_session', null);
let activeOrdersList = safeGet('cc_orders', []);
let isThemeDark = safeGet('cc_theme_dark', true);
let isAdminSoundEnabled = safeGet('cc_admin_sound', true);
let productsCatalog = safeGet('cc_catalog', window.DEFAULT_CATALOG);

// ---------------------------------------------------------
// رنين الطلبات القوي والمضخم للأدمن فقط
// ---------------------------------------------------------
function playLoudOrderChime() {
    if (!activeSessionUser || !isAdminSoundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const notes = [
            { freq: 659.25, time: 0.0, dur: 0.22 }, // E5
            { freq: 880.00, time: 0.22, dur: 0.25 }, // A5
            { freq: 1046.50, time: 0.45, dur: 0.40 }, // C6
            { freq: 1318.51, time: 0.85, dur: 0.55 }  // E6
        ];

        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
            gain.gain.setValueAtTime(0.01, ctx.currentTime + note.time);
            gain.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + note.time + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + note.dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + note.time);
            osc.stop(ctx.currentTime + note.time + note.dur + 0.05);
        });
    } catch(e) {
        console.warn("Audio chime error:", e);
    }
}

window.toggleAdminSoundMute = function() {
    isAdminSoundEnabled = !isAdminSoundEnabled;
    safeSet('cc_admin_sound', isAdminSoundEnabled);
    const btn = document.getElementById('btnToggleSoundSetting');
    if (btn) btn.innerText = isAdminSoundEnabled ? '🔔 الصوت: فعال' : '🔕 الصوت: مكتوم';
    window.showToastMsg(isAdminSoundEnabled ? "تم تفعيل نغمة الطلبات" : "تم كتم نغمة الطلبات");
};

// ---------------------------------------------------------
// نظام التوجيه والعرض الصارم بدون أي تداخل
// ---------------------------------------------------------
window.showToastMsg = function(msg) {
    const toast = document.getElementById('systemToast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('active');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('active'), 2500);
};

window.navigateRouter = function(screenId) {
    document.querySelectorAll('.app-screen').forEach(s => {
        s.classList.remove('active');
        s.style.setProperty('display', 'none', 'important');
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.style.setProperty('display', 'flex', 'important');
        window.scrollTo(0, 0);
    }

    if (screenId === 'screen-cart') {
        renderCartItemsList();
        recalculateCartSummary();
        const dock = document.getElementById('floatingCartDock');
        if (dock) dock.classList.remove('visible');
    } else if (screenId === 'screen-home') {
        renderMenuProducts();
        refreshCartDockStatus();
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
// أرشفة الطلبات بعد 15 دقيقة
// ---------------------------------------------------------
const AUTO_ARCHIVE_MS = 15 * 60 * 1000;
function purgeCompletedOrdersAfter15Minutes() {
    const now = Date.now();
    let hasChanged = false;
    activeOrdersList = activeOrdersList.filter(order => {
        if (order.status === 'completed' && order.completedAt) {
            if (now - order.completedAt >= AUTO_ARCHIVE_MS) {
                hasChanged = true;
                return false;
            }
        }
        return true;
    });
    if (hasChanged) {
        safeSet('cc_orders', activeOrdersList);
        if (activeSessionUser) renderAdminLiveOrdersManager();
    }
}
setInterval(purgeCompletedOrdersAfter15Minutes, 30000);

// ---------------------------------------------------------
// المزامنة السحابية الحية (Firestore Real-time)
// ---------------------------------------------------------
function initCloudRealtimeOrdersListener() {
    if (!cloudDb) return;
    try {
        cloudDb.collection('orders').orderBy('createdAt', 'desc').limit(60)
            .onSnapshot(snapshot => {
                const cloudOrders = [];
                snapshot.forEach(docSnap => cloudOrders.push({ id: docSnap.id, ...docSnap.data() }));
                
                if (cloudOrders.length > 0) {
                    const prevCount = activeOrdersList.length;
                    activeOrdersList = cloudOrders;
                    safeSet('cc_orders', activeOrdersList);
                    purgeCompletedOrdersAfter15Minutes();

                    if (activeSessionUser && cloudOrders.length > prevCount) {
                        playLoudOrderChime();
                        window.showToastMsg("وصل طلب جديد للمحل الآن!");
                    }

                    if (activeSessionUser) {
                        renderAdminLiveOrdersManager();
                        renderAdminAnalyticsReports();
                    }
                }
            }, err => console.warn("Firestore Listener Error:", err));
    } catch(e) {}
}

// ---------------------------------------------------------
// المنيو وتخصيص الأصناف
// ---------------------------------------------------------
function renderCategoryChips() {
    const container = document.getElementById('categoryScrollChips');
    if (!container) return;
    const cats = ["الكل", ...new Set(productsCatalog.map(p => p.category))];
    container.innerHTML = cats.map(c => `
        <div class="cat-chip ${c === window.appState.currentCategory ? 'active' : ''}" onclick="selectMenuCat('${c}')">${c}</div>
    `).join('');
}

window.selectMenuCat = function(category) {
    window.appState.currentCategory = category;
    renderCategoryChips();
    renderMenuProducts();
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
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 36px 12px; color: var(--text-secondary); font-size: 13px;">لا توجد أصناف مطابقة</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="openProductCustomizer('${p.id}')">
            <img src="${p.img}" class="product-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1517701550927-30cf4be1aaf9?w=400&q=80'">
            <div class="product-meta">
                <div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-desc">${p.desc || ''}</div>
                </div>
                <div class="product-row-bottom">
                    <div class="product-price num-font">${parseFloat(p.price).toFixed(2)} د.أ</div>
                    <div class="btn-add-mini">إضافة +</div>
                </div>
            </div>
        </div>
    `).join('');
};

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

    const sizeContainer = document.getElementById('psSizeOptionsContainer');
    sizeContainer.innerHTML = `
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <span style="font-size:13px; font-weight:700;">صغير (عادي)</span>
            <input type="radio" name="prodSize" value="small" checked onchange="updateProductCalculatedPrice()">
        </label>
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <span style="font-size:13px; font-weight:700;">وسط (+0.50 د.أ)</span>
            <input type="radio" name="prodSize" value="medium" onchange="updateProductCalculatedPrice()">
        </label>
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <span style="font-size:13px; font-weight:700;">كبير (+1.00 د.أ)</span>
            <input type="radio" name="prodSize" value="large" onchange="updateProductCalculatedPrice()">
        </label>
    `;

    updateProductCalculatedPrice();
    window.navigateRouter('screen-product');
};

window.adjustProductQty = function(delta) {
    let q = window.appState.productModalQty + delta;
    if (q >= 1 && q <= 30) {
        window.appState.productModalQty = q;
        document.getElementById('psQtyDisplay').innerText = q;
        updateProductCalculatedPrice();
    }
};

window.updateProductCalculatedPrice = function() {
    if (!window.appState.selectedProduct) return;
    let base = parseFloat(window.appState.selectedProduct.price);
    const sizeInput = document.querySelector('input[name="prodSize"]:checked');
    if (sizeInput) {
        if (sizeInput.value === 'medium') base += 0.50;
        if (sizeInput.value === 'large') base += 1.00;
    }
    const total = base * window.appState.productModalQty;
    const calcEl = document.getElementById('psCalculatedPrice');
    if (calcEl) calcEl.innerText = total.toFixed(2);
};

window.confirmAddItemToCart = function() {
    if (!window.appState.selectedProduct) return;
    const p = window.appState.selectedProduct;
    let unitPrice = parseFloat(p.price);
    let sizeTitle = "صغير";

    const sizeInput = document.querySelector('input[name="prodSize"]:checked');
    if (sizeInput && sizeInput.value === 'medium') { unitPrice += 0.50; sizeTitle = 'وسط'; }
    if (sizeInput && sizeInput.value === 'large') { unitPrice += 1.00; sizeTitle = 'كبير'; }

    const itemObj = {
        id: "c_" + Date.now(),
        name: p.name,
        qty: window.appState.productModalQty,
        sizeName: sizeTitle,
        unitPrice: unitPrice,
        notes: (document.getElementById('psNotes').value || '').trim(),
        lineTotal: unitPrice * window.appState.productModalQty
    };

    window.appState.cart.push(itemObj);
    safeSet('cc_cart', window.appState.cart);
    refreshCartDockStatus();
    window.showToastMsg("تمت الإضافة إلى السلة");
    window.navigateRouter('screen-home');
};

// ---------------------------------------------------------
// سلة المشتريات وتأكيد الطلب
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
                <div style="font-weight:900; font-size:13.5px;">${item.qty}x ${item.name} (${item.sizeName})</div>
                ${item.notes ? `<div style="font-size:11px; color:var(--text-secondary);">ملاحظة: ${item.notes}</div>` : ''}
            </div>
            <div style="text-align:left;">
                <div class="num-font" style="font-weight:900; color:var(--brand-gold);">${item.lineTotal.toFixed(2)} د.أ</div>
                <button style="font-size:11px; color:var(--status-danger); background:none; border:none; cursor:pointer;" onclick="removeCartItemById('${item.id}')">حذف</button>
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
    recalculateCartSummary();
};

window.switchDeliveryMode = function(mode) {
    window.appState.deliveryMode = mode;
    document.getElementById('btnModeDelivery').classList.toggle('active', mode === 'delivery');
    document.getElementById('btnModePickup').classList.toggle('active', mode === 'pickup');
    document.getElementById('btnModeTable').classList.toggle('active', mode === 'table');

    document.getElementById('deliveryFieldsArea').style.display = (mode === 'delivery') ? 'block' : 'none';
    document.getElementById('tableFieldsArea').style.display = (mode === 'table') ? 'block' : 'none';
    document.getElementById('sumDeliveryRow').style.display = (mode === 'delivery') ? 'flex' : 'none';
    recalculateCartSummary();
};

function populateCartTownsSelect() {
    const sel = document.getElementById('cartTownSelect');
    if (!sel) return;
    const b = BRANCHES_DATA[window.appState.cartBranch];
    sel.innerHTML = Object.entries(b.towns).map(([town, fee]) => `
        <option value="${fee}">${town} (توصيل: ${fee.toFixed(2)} د.أ)</option>
    `).join('');
}

function renderCartPaymentMethods() {
    const container = document.getElementById('cartPaymentMethodsGroup');
    if (!container) return;
    container.innerHTML = `
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <div>
                <div style="font-size:13px; font-weight:800;">كليك (Orange / Zain)</div>
                <div class="num-font" style="font-size:11px; color:var(--text-secondary);">0790155906</div>
            </div>
            <input type="radio" name="cartPayRadio" value="cliq" checked>
        </label>
        <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;">
            <div>
                <div style="font-size:13px; font-weight:800;">دفع نقدي (كاش)</div>
                <div style="font-size:11px; color:var(--text-secondary);">عند الاستلام</div>
            </div>
            <input type="radio" name="cartPayRadio" value="cash">
        </label>
    `;
}

window.recalculateCartSummary = function() {
    const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
    let del = 0;
    if (window.appState.deliveryMode === 'delivery') {
        const sel = document.getElementById('cartTownSelect');
        if (sel && sel.value) del = parseFloat(sel.value);
    }
    const total = sub + del;
    document.getElementById('sumSubtotal').innerText = `${sub.toFixed(2)} د.أ`;
    document.getElementById('sumDelivery').innerText = `${del.toFixed(2)} د.أ`;
    document.getElementById('sumTotal').innerText = `${total.toFixed(2)} د.أ`;
};

window.dispatchOrderAndInitiateTracking = function() {
    if (!window.appState.cart.length) return window.showToastMsg("سلة المشتريات فارغة!");
    const name = (document.getElementById('cartClientName')?.value || '').trim();
    const phone = (document.getElementById('cartClientPhone')?.value || '').trim();
    if (!name || !phone) return window.showToastMsg("يرجى إدخال الاسم ورقم الهاتف");

    const branch = BRANCHES_DATA[window.appState.cartBranch];
    const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
    const del = window.appState.deliveryMode === 'delivery' ? parseFloat(document.getElementById('cartTownSelect').value || 0) : 0;
    const total = sub + del;
    const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    const newOrderObj = {
        orderId: orderNumber,
        customerName: name,
        customerPhone: phone,
        branchName: branch.name,
        branchId: window.appState.cartBranch,
        deliveryMode: window.appState.deliveryMode,
        items: [...window.appState.cart],
        subtotal: sub,
        deliveryFee: del,
        totalAmount: total,
        status: 'received',
        createdAt: Date.now(),
        completedAt: null,
        timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
    };

    if (cloudDb) {
        cloudDb.collection('orders').doc(orderNumber).set(newOrderObj).catch(e => console.warn(e));
    }
    activeOrdersList.unshift(newOrderObj);
    safeSet('cc_orders', activeOrdersList);

    window.appState.cart = [];
    localStorage.removeItem('cc_cart');
    refreshCartDockStatus();

    let msg = `*طلب جديد | كافيه كورنر*\n`;
    msg += `رقم الطلب: ${orderNumber}\n`;
    msg += `الفرع: ${branch.name}\n`;
    msg += `العميل: ${name} (${phone})\n`;
    msg += `نوع الاستلام: ${newOrderObj.deliveryMode}\n`;
    msg += `----------------\n`;
    newOrderObj.items.forEach((it, i) => {
        msg += `${i+1}. *${it.qty}x ${it.name}* (${it.sizeName}) - ${it.lineTotal.toFixed(2)} د.أ\n`;
    });
    msg += `----------------\n`;
    msg += `الإجمالي: ${total.toFixed(2)} د.أ\n`;

    window.open(`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    window.showToastMsg("تم إرسال الطلب بنجاح!");
    window.navigateRouter('screen-home');
};

// ---------------------------------------------------------
// لوحة الإدارة والأقسام الستة
// ---------------------------------------------------------
let secretClickCount = 0;
let secretTimer = null;
window.handleSecretAdminTrigger = function() {
    secretClickCount++;
    clearTimeout(secretTimer);
    secretTimer = setTimeout(() => { secretClickCount = 0; }, 1500);
    if (secretClickCount >= 4) {
        secretClickCount = 0;
        window.navigateRouter('screen-admin-login');
        window.showToastMsg("بوابة الإدارة المشفرة");
    }
};

window.attemptAdminAuthentication = function() {
    const user = document.getElementById('adminUserField').value;
    const pin = (document.getElementById('adminPassField').value || '').trim();

    if (pin === MASTER_PIN) {
        activeSessionUser = user;
        safeSet('cc_admin_session', user);
        document.getElementById('adminPassField').value = '';
        window.showToastMsg("مرحباً بك في لوحة الإدارة");
        window.navigateRouter('screen-admin-dashboard');
        backToAdminMainHub();
    } else {
        window.showToastMsg("رمز المرور غير صحيح!");
    }
};

window.exitAdminSession = function() {
    activeSessionUser = null;
    localStorage.removeItem('cc_admin_session');
    window.showToastMsg("تم تسجيل الخروج");
    window.navigateRouter('screen-home');
};

window.openAdminSubSection = function(sectionKey) {
    document.getElementById('adminMainHubView').style.display = 'none';
    document.querySelectorAll('.admin-sub-view').forEach(v => v.classList.remove('active'));
    const sub = document.getElementById('subView-' + sectionKey);
    if (sub) sub.classList.add('active');
    if (sectionKey === 'orders') renderAdminLiveOrdersManager();
    if (sectionKey === 'reports') renderAdminAnalyticsReports();
};

window.backToAdminMainHub = function() {
    document.querySelectorAll('.admin-sub-view').forEach(v => v.classList.remove('active'));
    document.getElementById('adminMainHubView').style.display = 'block';
    const badge = document.getElementById('badgeHubLiveOrdersCount');
    if (badge) badge.innerText = activeOrdersList.length;
};

function renderAdminLiveOrdersManager() {
    const container = document.getElementById('adminLiveOrdersContainer');
    if (!container) return;
    if (!activeOrdersList.length) {
        container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-secondary); font-size:12px;">لا توجد طلبات واردة حالياً</div>`;
        return;
    }

    container.innerHTML = activeOrdersList.map(o => `
        <div class="admin-order-box ${o.status === 'received' ? 'new-received' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span class="num-font" style="font-weight:900; color:var(--brand-gold);">#${o.orderId}</span>
                <span style="font-size:11px; color:var(--text-secondary);">${o.branchName} • ${o.timestamp}</span>
            </div>
            <div style="font-size:12.5px; margin-bottom:4px;">
                <strong>${o.customerName}</strong> (${o.customerPhone})
            </div>
            <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:6px;">
                ${o.items.map(it => `${it.qty}x ${it.name}`).join(' ، ')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="num-font" style="font-weight:900; color:var(--brand-gold);">${o.totalAmount.toFixed(2)} د.أ</span>
                <select class="ios-input-field" style="width:auto; padding:4px 8px; font-size:11px;" onchange="updateOrderStatus('${o.orderId}', this.value)">
                    <option value="received" ${o.status === 'received' ? 'selected' : ''}>استلام</option>
                    <option value="preparing" ${o.status === 'preparing' ? 'selected' : ''}>تحضير</option>
                    <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>مكتمل ✓</option>
                </select>
            </div>
        </div>
    `).join('');
}

window.updateOrderStatus = function(orderId, status) {
    const o = activeOrdersList.find(x => x.orderId === orderId);
    if (!o) return;
    o.status = status;
    if (status === 'completed') o.completedAt = Date.now();
    if (cloudDb) cloudDb.collection('orders').doc(orderId).update({ status, completedAt: o.completedAt }).catch(e=>console.warn(e));
    safeSet('cc_orders', activeOrdersList);
    window.showToastMsg(`تم التحديث إلى: ${status}`);
    renderAdminLiveOrdersManager();
};

function renderAdminAnalyticsReports() {
    const rev = activeOrdersList.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const avg = activeOrdersList.length ? (rev / activeOrdersList.length) : 0;
    const revEl = document.getElementById('repNetRevenue');
    const avgEl = document.getElementById('repAvgOrderValue');
    if (revEl) revEl.innerText = `${rev.toFixed(2)} د.أ`;
    if (avgEl) avgEl.innerText = `${avg.toFixed(2)} د.أ`;
}

// ---------------------------------------------------------
// تهيئة التشغيل الأولى
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    applyThemeToDOM();
    renderCategoryChips();
    renderMenuProducts();
    populateCartTownsSelect();
    refreshCartDockStatus();
    initCloudRealtimeOrdersListener();
});
