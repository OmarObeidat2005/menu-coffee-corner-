/* =========================================================
COFFEE CORNER PRO — FULL PRODUCTION CORE ENGINE
منظومة المنيو الفوري، الطلبات الحية، الإدارة، وحساب الزبون
========================================================= */
const MASTER_PIN = "2001159393";
const FIREBASE_CONFIG = {
apiKey: "AIzaSyCPGI8XX2v5naRLK2QSQJcw6fB0Nsmbl8M",
authDomain: "coffee-corner-121.firebaseapp.com",
projectId: "coffee-corner-121",
storageBucket: "coffee-corner-121.firebasestorage.app",
messagingSenderId: "550349405177",
appId: "1:550349405177:web:468a9248c6c6be9f46db28"
};
let cloudDb = null;
function initCloudFirestoreSafe() {
try {
if (window.firebase) {
if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
cloudDb = firebase.firestore();
initCloudRealtimeOrdersListener();
}
} catch(err) {
console.warn("Cloud Firestore Notice:", err);
}
}
// الكتالوج الافتراضي المتطابق 100% مع صور المنيو
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
const DEFAULT_BRANCHES = [
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
if (!val) return defaultVal;
const parsed = JSON.parse(val);
if (Array.isArray(defaultVal) && (!Array.isArray(parsed) || parsed.length === 0)) return defaultVal;
return parsed;
} catch(e) { return defaultVal; }
}
function safeSet(key, val) {
try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}
window.appState = {
cartBranch: 0,
currentCategory: "الكل",
cart: safeGet('cc_cart', []),
deliveryMode: "delivery",
selectedPaymentMethod: "cash",
selectedProduct: null,
productModalQty: 1,
activeCouponDiscount: 0
};
let activeSessionUser = safeGet('cc_admin_session', null);
let activeOrdersList = safeGet('cc_orders', []);
let isThemeDark = safeGet('cc_theme_dark', false);
let isAdminSoundEnabled = safeGet('cc_admin_sound', true);
let productsCatalog = safeGet('cc_catalog', window.DEFAULT_CATALOG);
let branchesData = safeGet('cc_branches', DEFAULT_BRANCHES);
let customThemeColor = safeGet('cc_theme_color', '#c59b63');
let headerLogoCustom = safeGet('cc_header_logo', './logo.png');
let devPhotoCustom = safeGet('cc_dev_photo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80');
// بيانات العملاء والمستخدم الحالي
let userProfile = safeGet('cc_user_profile', {
name: "العميل العزيز",
phone: "0790155906",
birthday: "",
bio: "محب للقهوة والمذاق الرفيع في كافيه كورنر.",
avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
points: 0,
ordersCount: 0,
badges: ["عضوية برونزية"]
});
let systemCoupons = safeGet('cc_coupons', {
"CORNER10": { discount: 10, isActive: true }
});
let systemOffers = safeGet('cc_offers', [
{ id: "off1", title: "عرض التوفير الأسبوعي", desc: "خصم 10% على جميع أصناف الوافل والكريب باستخدام الكوبون CORNER10" }
]);
let customerNotifications = safeGet('cc_notifications', [
{ id: "n1", title: "أهلاً بك في كافيه كورنر!", desc: "استمتع بأشهى الكوكتيلات والحلويات مع خدمة التوصيل السريع.", time: "اليوم" }
]);
let communityMoments = safeGet('cc_moments', [
{
id: "m1",
authorName: "أحمد الروسان",
authorPhone: "0790155906",
img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80",
caption: "أفخم وافل بلجيكي جربته في المنطقة!"
}
]);
let bannedCustomersList = safeGet('cc_banned_users', []);
// محرك ضغط وتصغير الصور التلقائي من الهاتف (HTML5 Canvas)
function compressImageNative(file, maxWidth, quality, callback) {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = event => {
const img = new Image();
img.src = event.target.result;
img.onload = () => {
let width = img.width;
let height = img.height;
if (width > maxWidth) {
height = Math.round((height * maxWidth) / width);
width = maxWidth;
}
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, width, height);
const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
callback(compressedDataUrl);
};
};
}
// رفع شعار الترويسة
window.handleHeaderLogoUpload = function(event) {
const file = event.target.files[0];
if (!file) return;
compressImageNative(file, 200, 0.85, base64Url => {
headerLogoCustom = base64Url;
safeSet('cc_header_logo', headerLogoCustom);
document.getElementById('mainHeaderLogoImg').src = base64Url;
document.getElementById('adminLogoPreviewImg').src = base64Url;
if (cloudDb) cloudDb.collection('settings').doc('identity').set({ headerLogo: base64Url }, { merge: true }).catch(e=>console.warn(e));
window.showToastMsg("تم تحديث شعار الترويسة بنجاح!");
});
};
// رفع صورة المطور
window.handleDevPhotoUpload = function(event) {
const file = event.target.files[0];
if (!file) return;
compressImageNative(file, 400, 0.85, base64Url => {
devPhotoCustom = base64Url;
safeSet('cc_dev_photo', devPhotoCustom);
document.getElementById('devProfilePicImg').src = base64Url;
document.getElementById('adminDevPreviewImg').src = base64Url;
if (cloudDb) cloudDb.collection('settings').doc('identity').set({ devPhoto: base64Url }, { merge: true }).catch(e=>console.warn(e));
window.showToastMsg("تم تحديث صورة المطور بنجاح!");
});
};
// رفع صورة الزبون في الملف الشخصي
window.handleUserAvatarUpload = function(event) {
const file = event.target.files[0];
if (!file) return;
compressImageNative(file, 250, 0.85, base64Url => {
userProfile.avatar = base64Url;
document.getElementById('editProfilePicPreview').src = base64Url;
document.getElementById('userProfileAvatarImg').src = base64Url;
safeSet('cc_user_profile', userProfile);
window.showToastMsg("تم تحديث صورتك الشخصية!");
});
};
// رفع صورة الصنف مع المعاينة
window.handleProductImageUpload = function(event) {
const file = event.target.files[0];
if (!file) return;
compressImageNative(file, 500, 0.85, base64Url => {
document.getElementById('editProdImagePreview').src = base64Url;
document.getElementById('editProdImagePreview').setAttribute('data-uploaded', base64Url);
window.showToastMsg("تمت معاينة وضغط الصورة بنجاح!");
});
};
// رنين التنبيه الصوتي القوي للأدمن فقط
function playLoudOrderChime() {
if (!activeSessionUser || !isAdminSoundEnabled) return;
try {
const AudioCtx = window.AudioContext || window.webkitAudioContext;
if (!AudioCtx) return;
const ctx = new AudioCtx();
if (ctx.state === 'suspended') ctx.resume();
const notes = [
{ freq: 659.25, time: 0.0, dur: 0.22 },
{ freq: 880.00, time: 0.22, dur: 0.25 },
{ freq: 1046.50, time: 0.45, dur: 0.40 },
{ freq: 1318.51, time: 0.85, dur: 0.55 }
];
notes.forEach(note => {
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = "triangle";
osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
gain.gain.setValueAtTime(0.01, ctx.currentTime + note.time);
gain.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + note.time + 0.04);
gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + note.dur);
osc.connect(gain);
gain.connect(ctx.destination);
osc.start(ctx.currentTime + note.time);
osc.stop(ctx.currentTime + note.time + note.dur + 0.05);
});
} catch(e) {}
}
window.toggleAdminSoundMute = function() {
isAdminSoundEnabled = !isAdminSoundEnabled;
safeSet('cc_admin_sound', isAdminSoundEnabled);
const btn = document.getElementById('btnToggleSoundSetting');
if (btn) btn.innerText = isAdminSoundEnabled ? '🔔 الصوت: فعال' : '🔕 الصوت: مكتوم';
window.showToastMsg(isAdminSoundEnabled ? "تم تفعيل نغمة الطلبات" : "تم كتم نغمة الطلبات");
};
// الموجه والتنقل بين الشاشات
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
});
const target = document.getElementById(screenId);
if (target) {
target.classList.add('active');
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
} else if (screenId === 'screen-user-profile') {
renderUserProfileView();
} else if (screenId === 'screen-offers') {
renderClientOffersView();
} else if (screenId === 'screen-favorites') {
renderClientFavoritesView();
} else if (screenId === 'screen-order-tracking') {
renderOrderTrackingView();
} else if (screenId === 'screen-notifications') {
renderCustomerNotifications();
} else if (screenId === 'screen-moments') {
renderMomentsFeed();
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
document.body.classList.add('dark-mode');
} else {
document.body.classList.remove('dark-mode');
}
document.documentElement.style.setProperty('--brand-gold', customThemeColor);
document.documentElement.style.setProperty('--brand-gold-hover', customThemeColor);
}
// المزامنة السحابية الحية (Firestore Real-time)
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
if (activeSessionUser && cloudOrders.length > prevCount) {
playLoudOrderChime();
window.showToastMsg("وصل طلب جديد للمحل الآن!");
}
if (activeSessionUser) {
renderAdminLiveOrdersManager();
renderAdminAnalyticsReports();
}
renderOrderTrackingView();
}
}, err => console.warn(err));
// مزامنة الكتالوج
cloudDb.collection('settings').doc('catalog').onSnapshot(docSnap => {
if (docSnap.exists && docSnap.data().items && docSnap.data().items.length > 0) {
productsCatalog = docSnap.data().items;
safeSet('cc_catalog', productsCatalog);
renderCategoryChips();
renderMenuProducts();
renderAdminProductsManager();
}
});
// مزامنة الهوية والثيم
cloudDb.collection('settings').doc('identity').onSnapshot(docSnap => {
if (docSnap.exists) {
const d = docSnap.data();
if (d.headerLogo) {
headerLogoCustom = d.headerLogo;
safeSet('cc_header_logo', headerLogoCustom);
document.getElementById('mainHeaderLogoImg').src = headerLogoCustom;
}
if (d.devPhoto) {
devPhotoCustom = d.devPhoto;
safeSet('cc_dev_photo', devPhotoCustom);
document.getElementById('devProfilePicImg').src = devPhotoCustom;
}
if (d.themeColor) {
customThemeColor = d.themeColor;
safeSet('cc_theme_color', customThemeColor);
applyThemeToDOM();
}
}
});
} catch(e) {}
}
// المنيو وتخصيص الأصناف
function renderCategoryChips() {
const container = document.getElementById('categoryScrollChips');
if (!container) return;
const cats = ["الكل", ...new Set(productsCatalog.map(p => p.category))];
container.innerHTML = cats.map(c => ⁠<div class="cat-chip ${c === window.appState.currentCategory ? 'active' : ''}" onclick="selectMenuCat('${c}')">${c}</div>⁠).join('');
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
if (!filtered || !filtered.length) {
container.innerHTML = ⁠<div style="grid-column: 1/-1; text-align: center; padding: 36px 12px; color: var(--text-secondary); font-size: 13px;">لا توجد أصناف مطابقة</div>⁠;
return;
}
container.innerHTML = filtered.map(p => {
const isAvail = p.isAvailable !== false;
return ⁠<div class="product-card ${!isAvail ? 'unavailable' : ''}" onclick="${isAvail ?⁠openProductCustomizer('${p.id}')⁠:⁠window.showToastMsg('هذا الصنف غير متوفر حالياً')⁠}"> ${!isAvail ? ⁠<span class="tag-sold-out">نفدت الكمية</span>⁠: ''} <img src="${p.img}" class="product-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1517701550927-30cf4be1aaf9?w=400&q=80'"> <div class="product-meta"> <div> <div class="product-name">${p.name}</div> <div class="product-desc">${p.desc || ''}</div> </div> <div class="product-row-bottom"> <div class="product-price num-font">${parseFloat(p.price).toFixed(2)} د.أ</div> <div class="btn-add-mini">${isAvail ? '+ إضافة' : 'غير متوفر'}</div> </div> </div> </div>⁠;
}).join('');
};
window.openProductCustomizer = function(productId) {
const item = productsCatalog.find(p => p.id === productId);
if (!item) return;
window.appState.selectedProduct = item;
window.appState.productModalQty = 1;
document.getElementById('psHeroImg').src = item.img;
document.getElementById('psTitle').innerText = item.name;
document.getElementById('psDesc').innerText = item.desc || '';
document.getElementById('psBasePrice').innerText = ⁠${parseFloat(item.price).toFixed(2)} د.أ⁠;
document.getElementById('psQtyDisplay').innerText = '1';
document.getElementById('psNotes').value = '';
const sizeContainer = document.getElementById('psSizeOptionsContainer');
sizeContainer.innerHTML = ⁠<label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;"> <span style="font-size:13px; font-weight:700;">صغير (عادي)</span> <input type="radio" name="prodSize" value="small" checked onchange="updateProductCalculatedPrice()"> </label> <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;"> <span style="font-size:13px; font-weight:700;">وسط (+0.50 د.أ)</span> <input type="radio" name="prodSize" value="medium" onchange="updateProductCalculatedPrice()"> </label> <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;"> <span style="font-size:13px; font-weight:700;">كبير (+1.00 د.أ)</span> <input type="radio" name="prodSize" value="large" onchange="updateProductCalculatedPrice()"> </label>⁠;
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
// سلة المشتريات وتأكيد الطلب
function refreshCartDockStatus() {
const dock = document.getElementById('floatingCartDock');
const countBadge = document.getElementById('dockBadgeCount');
const priceTotal = document.getElementById('dockPriceTotal');
if (!dock) return;
const count = window.appState.cart.reduce((s, i) => s + i.qty, 0);
const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
if (count > 0) {
countBadge.innerText = count;
priceTotal.innerText = ⁠${sub.toFixed(2)} د.أ⁠;
dock.classList.add('visible');
} else {
dock.classList.remove('visible');
}
}
function renderCartItemsList() {
const container = document.getElementById('cartItemsList');
if (!container) return;
if (!window.appState.cart.length) {
container.innerHTML = ⁠<div style="text-align:center; padding:18px; color:var(--text-secondary); font-size:12.5px;">السلة فارغة حالياً</div>⁠;
return;
}
container.innerHTML = window.appState.cart.map(item => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed var(--border-subtle);"> <div> <div style="font-weight:900; font-size:13.5px;">${item.qty}x ${item.name} (${item.sizeName})</div> ${item.notes ?⁠<div style="font-size:11px; color:var(--text-secondary);">ملاحظة: ${item.notes}</div>⁠: ''} </div> <div style="text-align:left;"> <div class="num-font" style="font-weight:900; color:var(--brand-gold);">${item.lineTotal.toFixed(2)} د.أ</div> <button style="font-size:11px; color:var(--status-danger); background:none; border:none; cursor:pointer;" onclick="removeCartItemById('${item.id}')">حذف</button> </div> </div>⁠).join('');
populateCartTownsSelect();
renderCartPaymentOptions();
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
document.getElementById('deliveryFieldsArea').style.display = (mode === 'delivery') ? 'block' : 'none';
document.getElementById('sumDeliveryRow').style.display = (mode === 'delivery') ? 'flex' : 'none';
recalculateCartSummary();
};
function populateCartTownsSelect() {
const sel = document.getElementById('cartTownSelect');
if (!sel) return;
const b = branchesData[window.appState.cartBranch] || branchesData[0];
sel.innerHTML = Object.entries(b.towns).map(([town, fee]) => ⁠<option value="${fee}">${town} (توصيل: ${parseFloat(fee).toFixed(2)} د.أ)</option>⁠).join('');
}
function renderCartPaymentOptions() {
const container = document.getElementById('cartPaymentMethodsContainer');
if (!container) return;
container.innerHTML = ⁠<label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;"> <div> <span style="font-size:13px; font-weight:800;">دفع نقدي (كاش)</span> <div style="font-size:10.5px; color:var(--text-secondary);">عند الاستلام من كابتن التوصيل</div> </div> <input type="radio" name="payOpt" value="cash" checked onchange="window.appState.selectedPaymentMethod='cash'"> </label> <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border-subtle); cursor:pointer;"> <div> <span style="font-size:13px; font-weight:800;">كليك (CliQ)</span> <div style="font-size:10.5px; color:var(--text-secondary);">تحويل مباشر عبر كليك</div> </div> <input type="radio" name="payOpt" value="cliq" onchange="window.appState.selectedPaymentMethod='cliq'"> </label>⁠;
}
window.applyUserCouponDiscount = function() {
const code = (document.getElementById('cartCouponCodeInput').value || '').trim().toUpperCase();
if (!code) return;
if (systemCoupons[code] && systemCoupons[code].isActive) {
window.appState.activeCouponDiscount = systemCoupons[code].discount;
document.getElementById('couponAppliedBadge').style.display = 'block';
document.getElementById('couponAppliedBadge').innerText = ⁠تم تطبيق الكوبون بنجاح (خصم ${window.appState.activeCouponDiscount}%)⁠;
recalculateCartSummary();
window.showToastMsg("تم تطبيق الخصم!");
} else {
window.showToastMsg("كوبون الخصم غير صحيح أو منتهي!");
}
};
window.recalculateCartSummary = function() {
const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
let del = 0;
if (window.appState.deliveryMode === 'delivery') {
const sel = document.getElementById('cartTownSelect');
if (sel && sel.value) del = parseFloat(sel.value);
}
let discountAmount = 0;
if (window.appState.activeCouponDiscount > 0) {
discountAmount = (sub * window.appState.activeCouponDiscount) / 100;
document.getElementById('sumDiscountRow').style.display = 'flex';
document.getElementById('sumDiscount').innerText = ⁠-${discountAmount.toFixed(2)} د.أ⁠;
} else {
document.getElementById('sumDiscountRow').style.display = 'none';
}
const total = (sub - discountAmount) + del;
document.getElementById('sumSubtotal').innerText = ⁠${sub.toFixed(2)} د.أ⁠;
document.getElementById('sumDelivery').innerText = ⁠${del.toFixed(2)} د.أ⁠;
document.getElementById('sumTotal').innerText = ⁠${total.toFixed(2)} د.أ⁠;
};
window.dispatchOrderAndInitiateTracking = function() {
if (!window.appState.cart.length) return window.showToastMsg("سلة المشتريات فارغة!");
const name = (document.getElementById('cartClientName')?.value || '').trim();
const phone = (document.getElementById('cartClientPhone')?.value || '').trim();
if (!name || !phone) return window.showToastMsg("يرجى إدخال الاسم ورقم الهاتف");
if (bannedCustomersList.includes(phone)) {
return window.showToastMsg("عذراً، هذا الحساب محظور من الطلب حالياً.");
}
const branch = branchesData[window.appState.cartBranch];
const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
const del = window.appState.deliveryMode === 'delivery' ? parseFloat(document.getElementById('cartTownSelect').value || 0) : 0;
const discountAmount = (sub * window.appState.activeCouponDiscount) / 100;
const total = (sub - discountAmount) + del;
const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
const newOrderObj = {
orderId: orderNumber,
customerName: name,
customerPhone: phone,
branchName: branch.name,
branchId: window.appState.cartBranch,
deliveryMode: window.appState.deliveryMode,
paymentMethod: window.appState.selectedPaymentMethod,
items: [...window.appState.cart],
subtotal: sub,
discount: discountAmount,
deliveryFee: del,
totalAmount: total,
status: 'received',
cancelReason: '',
createdAt: Date.now(),
timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
};
if (cloudDb) cloudDb.collection('orders').doc(orderNumber).set(newOrderObj).catch(e => console.warn(e));
activeOrdersList.unshift(newOrderObj);
safeSet('cc_orders', activeOrdersList);
userProfile.name = name;
userProfile.phone = phone;
safeSet('cc_user_profile', userProfile);
window.appState.cart = [];
localStorage.removeItem('cc_cart');
refreshCartDockStatus();
let msg = ⁠*طلب جديد أونلاين | كافيه كورنر*\nرقم الطلب: ${orderNumber}\nالفرع: ${branch.name}\nالعميل: ${name} (${phone})\nنوع الاستلام: ${newOrderObj.deliveryMode}\n----------------\n⁠;
newOrderObj.items.forEach((it, i) => {
msg += ⁠${i+1}. *${it.qty}x ${it.name}* (${it.sizeName}) - ${it.lineTotal.toFixed(2)} د.أ\n⁠;
});
msg += ⁠----------------\nالإجمالي: ${total.toFixed(2)} د.أ\nطريقة الدفع: ${newOrderObj.paymentMethod}\n⁠;
window.open(⁠https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(msg)}⁠, '_blank');
window.showToastMsg("تم إرسال الطلب أونلاين بنجاح!");
window.navigateRouter('screen-order-tracking');
};
// شاشة تتبع الطلب الحي
function renderOrderTrackingView() {
const container = document.getElementById('activeOrderTrackingView');
if (!container) return;
if (!activeOrdersList.length) {
container.innerHTML = ⁠<div class="clean-card" style="text-align:center; padding:36px 16px;"> <div style="font-size:32px; margin-bottom:8px;">📦</div> <div style="font-weight:900; font-size:15px; margin-bottom:4px;">لا توجد طلبات جارية حالياً</div> <div style="font-size:12px; color:var(--text-secondary);">قم بتأكيد طلبك لتتمكن من متابعة حالته في الوقت الفعلي.</div> </div>⁠;
return;
}
const latest = activeOrdersList[0];
let statusText = "تم استلام الطلب";
let statusBadgeClass = "header-hours-badge";
if (latest.status === 'preparing') statusText = "جاري التحضير والتجهيز في الفرع ☕";
else if (latest.status === 'onway') statusText = "الطلب في الطريق إليك مع كابتن التوصيل 🛵";
else if (latest.status === 'completed') statusText = "تم تسليم الطلب بنجاح ✓";
else if (latest.status === 'cancelled') {
statusText = "تم إلغاء الطلب من قبل الإدارة ✕";
statusBadgeClass = "header-hours-badge closed";
}
container.innerHTML = `
<div class="clean-card">
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
<span class="num-font" style="font-weight:900; color:var(--brand-gold);">#￼
￼{statusText}</span>
</div>
${latest.status === 'cancelled' && latest.cancelReason ? ⁠<div style="background:rgba(239,68,68,0.1); border:1px solid var(--status-danger); padding:10px; border-radius:var(--radius-sm); margin-bottom:12px; font-size:12px; color:var(--status-danger); line-height:1.5;"> <strong>سبب الإلغاء من الإدارة:</strong> ${latest.cancelReason} </div>⁠ : ''}
<div style="font-size:12.5px; color:var(--text-secondary); line-height:1.7; margin-bottom:12px;">
<div>📍 <strong>الفرع:</strong> ${latest.branchName}</div>
<div>⏰ <strong>وقت الطلب:</strong> ${latest.timestamp}</div>
<div>👤 <strong>العميل:</strong> ￼
￼{latest.totalAmount.toFixed(2)} د.أ</span></div>
</div>
<div class="clean-title" style="margin-bottom:6px;">الأصناف</div>
<div style="font-size:12px; color:var(--text-secondary);">
${latest.items.map(it => ⁠<div>• ${it.qty}x ${it.name} (${it.sizeName})</div>⁠).join('')}
</div>
</div>
`;
}
// الملف الشخصي للزبون (Instagram Profile)
function renderUserProfileView() {
document.getElementById('userProfileAvatarImg').src = userProfile.avatar;
document.getElementById('profDisplayName').innerText = userProfile.name;
document.getElementById('profStatOrders').innerText = userProfile.ordersCount || 0;
document.getElementById('profStatPoints').innerText = userProfile.points || 0;
document.getElementById('profStatBadges').innerText = (userProfile.badges || []).length;
document.getElementById('profBioDesc').innerText = userProfile.bio || "محب للقهوة والمذاق الرفيع في كافيه كورنر.";
if (userProfile.birthday) {
document.getElementById('profBirthdayText').innerText = ⁠🎂 تاريخ الميلاد: ${userProfile.birthday}⁠;
} else {
document.getElementById('profBirthdayText').innerText = ⁠🎂 تاريخ الميلاد: غير محدد⁠;
}
const badgeContainer = document.getElementById('userBadgesCabinetContainer');
if (badgeContainer) {
badgeContainer.innerHTML = (userProfile.badges || ["عضوية برونزية"]).map(b => ⁠<span class="header-hours-badge" style="font-size:11px; padding:4px 10px;">${b}</span>⁠).join('');
}
const igGrid = document.getElementById('userMomentsIGGrid');
if (igGrid) {
const userMoments = communityMoments.filter(m => m.authorPhone === userProfile.phone);
if (userMoments.length > 0) {
igGrid.innerHTML = userMoments.map(m => ⁠<img src="${m.img}" class="ig-post-thumb" alt="مشاركة الزبون">⁠).join('');
} else {
igGrid.innerHTML = ⁠<div style="grid-column:1/-1; text-align:center; padding:16px; color:var(--text-secondary); font-size:11.5px;">لم تشارك أي صور بعد. شارك تجربتك في الكافيه لتظهر هنا!</div>⁠;
}
}
}
window.openEditProfileModal = function() {
document.getElementById('editProfilePicPreview').src = userProfile.avatar;
document.getElementById('inputProfName').value = userProfile.name || '';
document.getElementById('inputProfBirthday').value = userProfile.birthday || '';
document.getElementById('inputProfBio').value = userProfile.bio || '';
window.navigateRouter('screen-edit-profile');
};
window.saveUserProfileData = function() {
const name = document.getElementById('inputProfName').value.trim();
const bday = document.getElementById('inputProfBirthday').value;
const bio = document.getElementById('inputProfBio').value.trim();
if (!name) return window.showToastMsg("يرجى إدخال اسمك الكريم");
userProfile.name = name;
userProfile.birthday = bday;
userProfile.bio = bio;
safeSet('cc_user_profile', userProfile);
window.showToastMsg("تم حفظ وتحديث ملفك الشخصي بنجاح!");
window.navigateRouter('screen-user-profile');
};
// لوحة الإدارة والأقسام المتطابقة 100%
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
if (sectionKey === 'products') renderAdminProductsManager();
if (sectionKey === 'coupons') renderAdminCouponsAndOffers();
if (sectionKey === 'customers') renderAdminCustomersManager();
if (sectionKey === 'reports') renderAdminAnalyticsReports();
if (sectionKey === 'identity') {
document.getElementById('adminLogoPreviewImg').src = headerLogoCustom;
document.getElementById('adminDevPreviewImg').src = devPhotoCustom;
}
if (sectionKey === 'themes') {
document.getElementById('themeGoldColorPicker').value = customThemeColor;
}
if (sectionKey === 'storeSettings') {
document.getElementById('adminBranch0PhoneInput').value = branchesData[0].whatsapp;
document.getElementById('adminBranch1PhoneInput').value = branchesData[1].whatsapp;
}
};
window.backToAdminMainHub = function() {
document.querySelectorAll('.admin-sub-view').forEach(v => v.classList.remove('active'));
document.getElementById('adminMainHubView').style.display = 'block';
const badge = document.getElementById('badgeHubLiveOrdersCount');
if (badge) badge.innerText = activeOrdersList.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
};
// 1. إدارة الطلبات الحية
function renderAdminLiveOrdersManager() {
const container = document.getElementById('adminLiveOrdersContainer');
if (!container) return;
if (!activeOrdersList.length) {
container.innerHTML = ⁠<div style="text-align:center; padding:16px; color:var(--text-secondary); font-size:12px;">لا توجد طلبات واردة حالياً</div>⁠;
return;
}
container.innerHTML = activeOrdersList.map(o => ⁠<div class="clean-card" style="margin-bottom:10px;"> <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;"> <span class="num-font" style="font-weight:900; color:var(--brand-gold);">#${o.orderId}</span> <span style="font-size:11px; color:var(--text-secondary);">${o.branchName} • ${o.timestamp}</span> </div> <div style="font-size:12.5px; margin-bottom:2px;"><strong>${o.customerName}</strong> (${o.customerPhone})</div> <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:6px;">${o.items.map(it =>⁠￼{it.name}`).join(' ، ')}</div>
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
<span class="num-font" style="font-weight:900; color:var(--brand-gold);">￼
￼{o.status}</span>
</div>
<div style="display:flex; gap:6px; flex-wrap:wrap; border-top:1px solid var(--border-subtle); padding-top:8px;">
<button class="btn-brand-outline" style="padding:4px 8px; font-size:10.5px;" onclick="updateOrderStatusByAdmin('${o.orderId}', 'preparing')">تحضير ☕</button>
<button class="btn-brand-outline" style="padding:4px 8px; font-size:10.5px;" onclick="updateOrderStatusByAdmin('${o.orderId}', 'onway')">في الطريق 🛵</button>
<button class="btn-brand-solid" style="padding:4px 8px; font-size:10.5px; background:var(--status-success);" onclick="completeOrderAndAwardLoyalty('${o.orderId}')">مكتمل ✓</button>
<button class="btn-brand-outline" style="padding:4px 8px; font-size:10.5px; color:var(--status-danger); border-color:var(--status-danger);" onclick="promptCancelOrderAdmin('${o.orderId}')">إلغاء مع سبب ✕</button>
</div>
</div>
`).join('');
}
window.updateOrderStatusByAdmin = function(orderId, newStatus) {
const o = activeOrdersList.find(x => x.orderId === orderId);
if (!o) return;
o.status = newStatus;
safeSet('cc_orders', activeOrdersList);
if (cloudDb) cloudDb.collection('orders').doc(orderId).update({ status: newStatus }).catch(e=>console.warn(e));
renderAdminLiveOrdersManager();
window.showToastMsg("تم تحديث حالة الطلب");
};
window.completeOrderAndAwardLoyalty = function(orderId) {
const o = activeOrdersList.find(x => x.orderId === orderId);
if (!o) return;
o.status = 'completed';
safeSet('cc_orders', activeOrdersList);
if (cloudDb) cloudDb.collection('orders').doc(orderId).update({ status: 'completed' }).catch(e=>console.warn(e));
if (userProfile.phone === o.customerPhone) {
userProfile.ordersCount = (userProfile.ordersCount || 0) + 1;
userProfile.points = (userProfile.points || 0) + Math.floor(o.totalAmount);
if (userProfile.ordersCount >= 3 && !userProfile.badges.includes("رائد الكورنر")) {
userProfile.badges.push("رائد الكورنر");
}
if (userProfile.ordersCount >= 7 && !userProfile.badges.includes("العميل الذهبي VIP")) {
userProfile.badges.push("العميل الذهبي VIP");
}
safeSet('cc_user_profile', userProfile);
}
renderAdminLiveOrdersManager();
renderAdminAnalyticsReports();
window.showToastMsg("تم اعتماد اكتمال الطلب واحتساب نقاط العميل!");
};
window.promptCancelOrderAdmin = function(orderId) {
const reason = prompt("يرجى كتابة سبب الإلغاء ليظهر للزبون مباشرة (مثال: نفاد الكمية، الفرع مغلق):");
if (reason === null) return;
const o = activeOrdersList.find(x => x.orderId === orderId);
if (!o) return;
o.status = 'cancelled';
o.cancelReason = reason || 'تم الإلغاء لظروف تشغيلية طارئة';
safeSet('cc_orders', activeOrdersList);
if (cloudDb) cloudDb.collection('orders').doc(orderId).update({ status: 'cancelled', cancelReason: o.cancelReason }).catch(e=>console.warn(e));
renderAdminLiveOrdersManager();
window.showToastMsg("تم إلغاء الطلب وإرسال التنبيه للزبون");
};
// 2. إدارة وتعديل أصناف المنيو
function renderAdminProductsManager() {
const container = document.getElementById('adminProductsControlList');
if (!container) return;
container.innerHTML = productsCatalog.map(p => ⁠<div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:8px;"> <div style="display:flex; align-items:center; gap:10px;"> <img src="${p.img}" style="width:40px; height:40px; border-radius:var(--radius-sm); object-fit:cover;"> <div> <div style="font-size:13px; font-weight:900;">${p.name}</div> <div style="font-size:11px; color:var(--text-secondary);">${p.category} • <span class="num-font">${parseFloat(p.price).toFixed(2)} د.أ</span></div> </div> </div> <div style="display:flex; gap:6px;"> <button class="btn-brand-outline" style="padding:4px 10px; font-size:11px;" onclick="openProductEditorModal('${p.id}')">تعديل</button> <button class="btn-brand-outline" style="padding:4px 8px; font-size:11px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteProductFromCatalog('${p.id}')">حذف</button> </div> </div>⁠).join('');
}
window.openProductEditorModal = function(productId) {
if (productId) {
const p = productsCatalog.find(x => x.id === productId);
document.getElementById('editProdId').value = p.id;
document.getElementById('editProdName').value = p.name;
document.getElementById('editProdCategory').value = p.category;
document.getElementById('editProdPrice').value = p.price;
document.getElementById('editProdDesc').value = p.desc || '';
document.getElementById('editProdImagePreview').src = p.img;
document.getElementById('editProdImagePreview').removeAttribute('data-uploaded');
document.getElementById('editProdAvailableToggle').checked = p.isAvailable !== false;
document.getElementById('productEditorModalHeader').innerText = "تعديل الصنف";
} else {
document.getElementById('editProdId').value = "";
document.getElementById('editProdName').value = "";
document.getElementById('editProdCategory').value = "كوكتيلات";
document.getElementById('editProdPrice').value = "";
document.getElementById('editProdDesc').value = "";
document.getElementById('editProdImagePreview').src = "https://images.unsplash.com/photo-1517701550927-30cf4be1aaf9?w=400&q=80";
document.getElementById('editProdImagePreview').removeAttribute('data-uploaded');
document.getElementById('editProdAvailableToggle').checked = true;
document.getElementById('productEditorModalHeader').innerText = "إضافة صنف جديد";
}
window.navigateRouter('screen-product-editor');
};
window.saveProductEditorRecord = function() {
const id = document.getElementById('editProdId').value;
const name = document.getElementById('editProdName').value.trim();
const category = document.getElementById('editProdCategory').value;
const price = parseFloat(document.getElementById('editProdPrice').value);
const desc = document.getElementById('editProdDesc').value.trim();
const isAvail = document.getElementById('editProdAvailableToggle').checked;
const uploadedImg = document.getElementById('editProdImagePreview').getAttribute('data-uploaded');
const existingImg = document.getElementById('editProdImagePreview').src;
const finalImg = uploadedImg || existingImg;
if (!name || isNaN(price) || price <= 0) return window.showToastMsg("يرجى إدخال اسم وسعر صالحين");
const targetId = id || ('p_' + Date.now());
const itemData = { id: targetId, name, category, price, desc, img: finalImg, isAvailable: isAvail };
if (id) {
const idx = productsCatalog.findIndex(x => x.id === id);
if (idx !== -1) productsCatalog[idx] = itemData;
} else {
productsCatalog.unshift(itemData);
}
safeSet('cc_catalog', productsCatalog);
if (cloudDb) cloudDb.collection('settings').doc('catalog').set({ items: productsCatalog }).catch(e=>console.warn(e));
renderCategoryChips();
renderMenuProducts();
renderAdminProductsManager();
window.showToastMsg("تم حفظ وتحديث الصنف سحابياً!");
window.navigateRouter('screen-admin-dashboard');
openAdminSubSection('products');
};
window.deleteProductFromCatalog = function(productId) {
productsCatalog = productsCatalog.filter(x => x.id !== productId);
safeSet('cc_catalog', productsCatalog);
if (cloudDb) cloudDb.collection('settings').doc('catalog').set({ items: productsCatalog }).catch(e=>console.warn(e));
renderCategoryChips();
renderMenuProducts();
renderAdminProductsManager();
window.showToastMsg("تم حذف الصنف بنجاح!");
};
// 3. إدارة العروض والكوبونات
function renderAdminCouponsAndOffers() {
const offContainer = document.getElementById('adminOffersListContainer');
if (offContainer) {
offContainer.innerHTML = systemOffers.map(off => ⁠<div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:6px;"> <div> <div style="font-size:12.5px; font-weight:900;">${off.title}</div> <div style="font-size:11px; color:var(--text-secondary);">${off.desc}</div> </div> <button class="btn-brand-outline" style="padding:4px 8px; font-size:10px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteOfferAdmin('${off.id}')">حذف</button> </div>⁠).join('');
}
const coupContainer = document.getElementById('adminCouponsListContainer');
if (coupContainer) {
coupContainer.innerHTML = Object.entries(systemCoupons).map(([code, c]) => ⁠<div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:6px;"> <div style="font-size:13px; font-weight:900;" class="num-font">${code} (${c.discount}%)</div> <button class="btn-brand-outline" style="padding:4px 8px; font-size:10px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteCouponAdmin('${code}')">إلغاء</button> </div>⁠).join('');
}
}
window.saveNewOfferFromAdmin = function() {
const title = document.getElementById('newOfferTitleInput').value.trim();
const desc = document.getElementById('newOfferDescInput').value.trim();
if (!title || !desc) return window.showToastMsg("يرجى إدخال عنوان وتفاصيل العرض");
systemOffers.unshift({ id: "off_" + Date.now(), title, desc });
safeSet('cc_offers', systemOffers);
document.getElementById('newOfferTitleInput').value = '';
document.getElementById('newOfferDescInput').value = '';
renderAdminCouponsAndOffers();
window.showToastMsg("تم نشر العرض بنجاح!");
};
window.deleteOfferAdmin = function(id) {
systemOffers = systemOffers.filter(x => x.id !== id);
safeSet('cc_offers', systemOffers);
renderAdminCouponsAndOffers();
window.showToastMsg("تم حذف العرض");
};
window.saveNewCouponFromAdmin = function() {
const code = document.getElementById('newCouponCodeInput').value.trim().toUpperCase();
const disc = parseFloat(document.getElementById('newCouponPercentInput').value);
if (!code || isNaN(disc) || disc <= 0) return window.showToastMsg("يرجى إدخال رمز كوبون ونسبة صحيحة");
systemCoupons[code] = { discount: disc, isActive: true };
safeSet('cc_coupons', systemCoupons);
document.getElementById('newCouponCodeInput').value = '';
document.getElementById('newCouponPercentInput').value = '';
renderAdminCouponsAndOffers();
window.showToastMsg("تم تفعيل الكوبون بنجاح!");
};
window.deleteCouponAdmin = function(code) {
delete systemCoupons[code];
safeSet('cc_coupons', systemCoupons);
renderAdminCouponsAndOffers();
window.showToastMsg("تم إلغاء الكوبون");
};
// 4. إدارة شارات الولاء
window.saveNewBadgeDefinition = function() {
const name = document.getElementById('newBadgeNameInput').value.trim();
const icon = document.getElementById('newBadgeIconInput').value.trim();
if (!name) return window.showToastMsg("يرجى إدخال اسم الشارة");
const fullBadge = ⁠${icon} ${name}⁠.trim();
if (!userProfile.badges.includes(fullBadge)) {
userProfile.badges.push(fullBadge);
safeSet('cc_user_profile', userProfile);
}
document.getElementById('newBadgeNameInput').value = '';
document.getElementById('newBadgeIconInput').value = '';
window.showToastMsg("تمت إضافة الشارة لمنظومة المكافآت بنجاح!");
};
// 5. إدارة الزبائن والمراسلة المباشرة والحظر
function renderAdminCustomersManager() {
const container = document.getElementById('adminCustomersListContainer');
if (!container) return;
const uniquePhones = [...new Set(activeOrdersList.map(o => o.customerPhone))];
if (!uniquePhones.length) {
container.innerHTML = ⁠<div style="font-size:12px; color:var(--text-secondary); padding:8px;">لا يوجد زبائن مسجلين بعد</div>⁠;
return;
}
container.innerHTML = uniquePhones.map(phone => {
const order = activeOrdersList.find(o => o.customerPhone === phone);
const isBanned = bannedCustomersList.includes(phone);
return ⁠<div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:8px;"> <div> <div style="font-size:13px; font-weight:900;">${order ? order.customerName : 'زبون كافيه كورنر'}</div> <div class="num-font" style="font-size:11px; color:var(--text-secondary);">${phone}</div> </div> <div style="display:flex; gap:6px;"> <button class="btn-brand-outline" style="padding:4px 8px; font-size:10.5px;" onclick="document.getElementById('msgTargetPhoneInput').value='${phone}'">مراسلة ✉</button> <button class="btn-brand-outline" style="padding:4px 8px; font-size:10.5px; ${isBanned ? 'color:var(--status-success); border-color:var(--status-success);' : 'color:var(--status-danger); border-color:var(--status-danger);'}" onclick="toggleCustomerBanStatus('${phone}')"> ${isBanned ? 'إلغاء الحظر' : 'حظر الزبون'} </button> </div> </div>⁠;
}).join('');
}
window.sendAdminNotificationToCustomer = function() {
const targetPhone = document.getElementById('msgTargetPhoneInput').value.trim();
const content = document.getElementById('msgContentAdminInput').value.trim();
if (!targetPhone || !content) return window.showToastMsg("يرجى إدخال الهاتف ونص الرسالة");
customerNotifications.unshift({
id: "msg_" + Date.now(),
title: "رسالة رسمية من إدارة كافيه كورنر ☕",
desc: content,
time: "الآن"
});
safeSet('cc_notifications', customerNotifications);
document.getElementById('msgContentAdminInput').value = '';
window.showToastMsg("تم إرسال الإشعار للزبون بنجاح!");
};
window.toggleCustomerBanStatus = function(phone) {
if (bannedCustomersList.includes(phone)) {
bannedCustomersList = bannedCustomersList.filter(p => p !== phone);
window.showToastMsg("تم إلغاء حظر الزبون");
} else {
bannedCustomersList.push(phone);
window.showToastMsg("تم حظر الزبون من إرسال الطلبات");
}
safeSet('cc_banned_users', bannedCustomersList);
renderAdminCustomersManager();
};
// 6. التقارير والرسم البياني
function renderAdminAnalyticsReports() {
const rev = activeOrdersList.reduce((s, o) => s + (o.status !== 'cancelled' ? (o.totalAmount || 0) : 0), 0);
const validCount = activeOrdersList.filter(o => o.status !== 'cancelled').length;
const avg = validCount ? (rev / validCount) : 0;
const revEl = document.getElementById('repNetRevenue');
const avgEl = document.getElementById('repAvgOrderValue');
if (revEl) revEl.innerText = ⁠${rev.toFixed(2)} د.أ⁠;
if (avgEl) avgEl.innerText = ⁠${avg.toFixed(2)} د.أ⁠;
const canvas = document.getElementById('adminSalesAnalyticsCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = customThemeColor;
ctx.font = "bold 11px Tajawal";
ctx.fillText("إجمالي الطلبات الناجحة: " + validCount, 15, 25);
ctx.fillText("صافي الإيرادات: " + rev.toFixed(2) + " د.أ", 15, 50);
}
// 7. الثيمات والمظهر
window.applyAndSaveCustomTheme = function() {
const color = document.getElementById('themeGoldColorPicker').value;
customThemeColor = color;
safeSet('cc_theme_color', color);
applyThemeToDOM();
if (cloudDb) cloudDb.collection('settings').doc('identity').set({ themeColor: color }, { merge: true }).catch(e=>console.warn(e));
window.showToastMsg("تم حفظ وتعميم الثيم سحابياً بنجاح!");
};
// 8. إعدادات الفروع ومناطق التوصيل
window.saveAdminTownRateRecord = function() {
const branchIdx = parseInt(document.getElementById('adminTownBranchSelect').value);
const townName = document.getElementById('adminTownNameInput').value.trim();
const fee = parseFloat(document.getElementById('adminTownFeeInput').value);
if (!townName || isNaN(fee)) return window.showToastMsg("يرجى إدخال اسم المنطقة وسعر التوصيل");
branchesData[branchIdx].towns[townName] = fee;
safeSet('cc_branches', branchesData);
document.getElementById('adminTownNameInput').value = '';
document.getElementById('adminTownFeeInput').value = '';
populateCartTownsSelect();
window.showToastMsg("تم حفظ سعر التوصيل للمنطقة!");
};
// الشاشات التفاعلية
function renderClientOffersView() {
const container = document.getElementById('clientOffersContainer');
if (!container) return;
container.innerHTML = systemOffers.map(off => ⁠<div class="clean-card"> <div style="font-weight:900; font-size:15px; color:var(--brand-gold); margin-bottom:6px;">${off.title}</div> <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.6;">${off.desc}</div> </div>⁠).join('');
}
function renderClientFavoritesView() {
const container = document.getElementById('clientFavoritesContainer');
if (!container) return;
container.innerHTML = ⁠<div class="clean-card" style="text-align:center; padding:36px 16px;"> <div style="font-size:36px; margin-bottom:8px; color:var(--brand-gold);">♡</div> <div style="font-weight:900; font-size:15px; margin-bottom:6px;">قائمتك المفضلة</div> <div style="font-size:12px; color:var(--text-secondary); margin-bottom:14px;">احفظ أشهى الكوكتيلات والحلويات بلمسة زر واحدة.</div> <button class="btn-brand-solid" onclick="navigateRouter('screen-home')">تصفح المنيو الآن</button> </div>⁠;
}
function renderCustomerNotifications() {
const container = document.getElementById('customerNotificationsList');
if (!container) return;
container.innerHTML = customerNotifications.map(n => ⁠<div class="clean-card" style="margin-bottom:8px;"> <div style="font-size:13.5px; font-weight:900; color:var(--brand-gold); margin-bottom:4px;">${n.title}</div> <div style="font-size:12px; color:var(--text-secondary); line-height:1.5;">${n.desc}</div> <div class="num-font" style="font-size:10px; color:var(--text-dim); margin-top:4px;">${n.time}</div> </div>⁠).join('');
}
function renderMomentsFeed() {
const container = document.getElementById('communityFeedContainer');
if (!container) return;
container.innerHTML = communityMoments.map(m => ⁠<div class="clean-card" style="padding:0; overflow:hidden; margin-bottom:12px;"> <img src="${m.img}" style="width:100%; height:200px; object-fit:cover;" alt="صورة العميل"> <div style="padding:12px 14px;"> <div style="font-size:13px; font-weight:900; margin-bottom:4px;">${m.authorName}</div> <div style="font-size:11.5px; color:var(--text-secondary); line-height:1.4;">${m.caption}</div> </div> </div>⁠).join('');
}
window.openNewMomentModal = function() {
const caption = prompt("اكتب تعليقاً على تجربتك مع الصورة:");
if (!caption) return;
communityMoments.unshift({
id: "m_" + Date.now(),
authorName: userProfile.name,
authorPhone: userProfile.phone,
img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80",
caption: caption
});
safeSet('cc_moments', communityMoments);
renderMomentsFeed();
window.showToastMsg("تم نشر مشاركتك بنجاح!");
};
// التهيئة الأولى للموقع
function bootstrapApplication() {
applyThemeToDOM();
const logoEl = document.getElementById('mainHeaderLogoImg');
const devEl = document.getElementById('devProfilePicImg');
if (logoEl) logoEl.src = headerLogoCustom;
if (devEl) devEl.src = devPhotoCustom;
renderCategoryChips();
renderMenuProducts();
populateCartTownsSelect();
renderCartPaymentOptions();
refreshCartDockStatus();
setTimeout(initCloudFirestoreSafe, 800);
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', bootstrapApplication);
} else {
bootstrapApplication();
}
