const DEV_USER = 'omar';
const SHOP_USER = 'corner';
const MASTER_PIN = '2001159393';
window.DEFAULT_CATALOG = [
{ id:"p1", name:"كوكتيل إمبراطور فواكه", category:"كوكتيلات", price:2.50, desc:"مزيج قطع فواكه طازجة مع القشطة والمكسرات", img:"https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&q=80", isAvailable:true, hasSizes:true },
{ id:"p2", name:"وافل بلجيكي أصلي", category:"وافل", price:2.50, desc:"وافل دافئ مقرمش غني بأشهى النكهات والصوصات", img:"https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80", isAvailable:true, hasSizes:false },
{ id:"p3", name:"كريب فيتوتشيني فاخر", category:"كريب", price:3.00, desc:"شرائح كريب رقيقة طازجة مع نكهاتك المفضلة", img:"https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80", isAvailable:true, hasSizes:false },
{ id:"p4", name:"ميلك شيك أوريو", category:"ميلك شيك", price:2.00, desc:"مخفوق الحليب والآيس كريم مع بسكويت الأوريو", img:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80", isAvailable:true, hasSizes:true },
{ id:"p5", name:"بان كيك كلاسيك", category:"بان كيك", price:2.00, desc:"طبقات بان كيك هشة وطرية مع صوصك المفضل", img:"https://images.unsplash.com/photo-1528207776546-384cb11312b2?w=400&q=80", isAvailable:true, hasSizes:false },
{ id:"p6", name:"كنافة نابلسية بالجبن", category:"كنافة", price:3.00, desc:"كنافة سخنة متبلة بالسمن والجبن المذوب", img:"https://images.unsplash.com/photo-1628198642220-4bf63f25c755?w=400&q=80", isAvailable:true, hasSizes:false },
{ id:"p7", name:"آيس كوفي منعش", category:"ستيم بارد", price:1.50, desc:"شوت إسبريسو مزدوج مثلج مع حليب ناعم", img:"https://images.unsplash.com/photo-1461023058943-0708e52150fe?w=400&q=80", isAvailable:true, hasSizes:true },
{ id:"p8", name:"موكا حار فاخر", category:"ستيم ساخن", price:2.00, desc:"مزيج قهوة ساخنة غنية بالشوكولاتة والكريما", img:"https://images.unsplash.com/photo-1517701550927-30cf4be1aaf9?w=400&q=80", isAvailable:true, hasSizes:true },
{ id:"p9", name:"آيس كريم فانيليا", category:"آيس كريم", price:1.00, desc:"كرة آيس كريم إيطالية غنية بالفانيليا النقية", img:"https://images.unsplash.com/photo-1570197781417-0a52375c020b?w=400&q=80", isAvailable:true, hasSizes:false }
];
const DEFAULT_SAUCES = [
{ id: "s1", name: "نوتيلا أصلية", price: 0.50, enabled: true },
{ id: "s2", name: "لوتس كرانش", price: 0.75, enabled: true },
{ id: "s3", name: "بسكويت أوريو", price: 0.50, enabled: true },
{ id: "s4", name: "كيندر بوينو", price: 0.75, enabled: true },
{ id: "s5", name: "بستاشيو فاخر", price: 1.00, enabled: true },
{ id: "s6", name: "شوكولاتة بيضاء", price: 0.50, enabled: true }
];
const DEFAULT_SETTINGS = {
brandTitle: "كافيه كورنر",
brandSub: "أشهى الكوكتيلات والحلويات الفاخرة",
logoUrl: "./logo.png",
devName: "المهندس عمر عبيدات",
devRole: "Lead Systems Architect & Full-Stack Engineer",
devPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
devBio: "تصميم وتطوير المنظومة الرقمية الشاملة لكافيه كورنر بنظام فوري ذكي لإدارة الطلبات، ومجتمع الصور، ومزامنة الأسعار وتتبع الحالات لحظياً.",
devWhatsapp: "962796433698",
devInsta: "https://www.instagram.com/o_yd"
};
const DEFAULT_MOMENTS = [
{
id: "m1",
authorPhone: "0790000000",
authorName: "أحمد الروسان",
rating: 5,
target: "وافل بلجيكي نوتيلا ولوتس",
text: "أفضل وافل بالمنطقة بدون منازع، القرمشة خرافية والصوصات موزونة 100%.",
img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80",
likes: 18,
likedBy: [],
timestamp: "أمس"
},
{
id: "m2",
authorPhone: "0791111111",
authorName: "سارة عبيدات",
rating: 5,
target: "آيس كوفي دبل شوت",
text: "انتعاش الصباح في فرع كفرسوم.. القهوة موزونة والخدمة ممتازة وسريعة.",
img: "https://images.unsplash.com/photo-1461023058943-0708e52150fe?w=800&q=80",
likes: 24,
likedBy: [],
timestamp: "منذ يومين"
}
];
// دالة رفع الصور وضغطها بذكاء مع تفعيل صندوق المعاينة الفوري
window.handleImageUploadDirect = function(event, targetInputId, previewImgId) {
const file = event.target.files && event.target.files[0];
if (!file) return;
if (!file.type.startsWith('image/')) {
return window.showToastMsg("يرجى اختيار ملف صورة صالح");
}
window.showToastMsg("جاري معالجة الصورة...");
const reader = new FileReader();
reader.onload = function(e) {
const img = new Image();
img.onload = function() {
const canvas = document.createElement('canvas');
const maxDimension = 720; // دقة ممتازة مع حجم خفيف جداً
let width = img.width;
let height = img.height;
if (width > height) {
if (width > maxDimension) {
height = Math.round((height * maxDimension) / width);
width = maxDimension;
}
} else {
if (height > maxDimension) {
width = Math.round((width * maxDimension) / height);
height = maxDimension;
}
}
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, width, height);
const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
const inputField = document.getElementById(targetInputId);
if (inputField) inputField.value = compressedDataUrl;
const previewEl = document.getElementById(previewImgId);
if (previewEl) {
previewEl.src = compressedDataUrl;
previewEl.style.display = 'block';
}
// إظهار صندوق معاينة الصور في نافذة إضافة المنشور
const previewBox = document.getElementById('momentPreviewBox');
if (previewBox && previewImgId === 'previewMomentPhoto') {
previewBox.style.display = 'flex';
}
window.showToastMsg("تم تجهيز الصورة بنجاح");
};
img.src = e.target.result;
};
reader.readAsDataURL(file);
};
let BRANCHES_DATA = {
0: {
name: "كفرسوم",
whatsapp: "962790155906",
cliqName: "Orange Money",
cliqNum: "0770155906",
towns: { "كفرسوم": 1.0, "سمر": 1.25, "سحم": 1.5, "حبراص": 1.25, "يبلا": 1.5, "الرفيد": 1.5, "حرثا": 1.5, "المزيريب": 1.5, "عقربا": 2.0, "حاتم": 1.75, "ملكا": 2.0, "أم قيس": 2.5, "المنصورة": 2.0 }
},
1: {
name: "سما الروسان",
whatsapp: "962790155906",
cliqName: "Zain Cash",
cliqNum: "0790155906",
towns: { "سما الروسان": 1.0, "حبراص": 1.25, "حاتم": 1.5, "كفرسوم": 1.5, "إبدر": 1.75, "المخيبة": 2.5 }
}
};
function safeGet(key, fallback) {
try {
const val = localStorage.getItem(key);
return val ? JSON.parse(val) : fallback;
} catch(e) { return fallback; }
}
function safeSet(key, value) {
try {
localStorage.setItem(key, JSON.stringify(value));
return true;
} catch (e) {
return false;
}
}
let productsList = safeGet('cc_products', null) || window.DEFAULT_CATALOG;
let saucesList = safeGet('cc_sauces', DEFAULT_SAUCES);
let promoCodesList = safeGet('cc_promos', { "CORNER20": { code: "CORNER20", discount: 20 } });
let registeredUsersMap = safeGet('cc_users', {});
let activeClientSession = safeGet('cc_client_session', null);
let appSystemVersion = localStorage.getItem('cc_version') || 'v7.6.0';
let activeOrdersList = safeGet('cc_orders', []);
let storeSettings = safeGet('cc_store_settings', DEFAULT_SETTINGS);
let communityMomentsList = safeGet('cc_moments', DEFAULT_MOMENTS);
let offersList = safeGet('cc_offers', [
{ id: "off1", title: "عرض الويك إند الذهبي", desc: "وافل بلجيكي مع أي ميلك شيك بخصم 20%", img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&q=80" }
]);
let activeSessionUser = null;
let appliedPromoObject = null;
let currentAuthMode = 'login';
let secretClickCount = 0;
let secretClickTimer = null;
let currentSelectedMomentStars = 5;
window.appState = {
cartBranch: 0,
currentCategory: "الكل",
cart: safeGet('cc_cart', []),
deliveryMode: "delivery",
paymentMethod: "cliq",
selectedProduct: null,
productModalQty: 1
};
function checkBranchIsOpen(branchId) {
const now = new Date();
const currentHour = now.getHours() + (now.getMinutes() / 60);
if (branchId === 0) {
return (currentHour >= 6.5 || currentHour < 3.0);
}
if (branchId === 1) {
return (currentHour >= 16.0 || currentHour < 3.0);
}
return true;
}
function updateBranchStatusBadges() {
const currentBranchOpen = checkBranchIsOpen(window.appState.cartBranch);
const topBadge = document.getElementById('uiCurrentBranchStatusBadge');
if (topBadge) {
topBadge.innerText = currentBranchOpen ? "مفتوح الآن" : "مغلق حالياً";
topBadge.className = ⁠header-hours-badge ${currentBranchOpen ? 'badge-open' : 'badge-closed'}⁠;
}
}
function autoIncrementVersion() {
let parts = appSystemVersion.replace('v', '').split('.');
if (parts.length === 3) {
parts[2] = parseInt(parts[2]) + 1;
appSystemVersion = 'v' + parts.join('.');
} else {
appSystemVersion = 'v7.6.1';
}
localStorage.setItem('cc_version', appSystemVersion);
updateVersionBadgeUI();
}
function updateVersionBadgeUI() {
const vEl = document.getElementById('sidebarVersionLabel');
if (vEl) vEl.innerText = appSystemVersion;
}
window.showToastMsg = function(msg) {
const t = document.getElementById('systemToast');
if (!t) return;
t.innerText = msg;
t.classList.add('active');
setTimeout(() => t.classList.remove('active'), 2000);
};
window.navigateRouter = function(screenId) {
document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
const target = document.getElementById(screenId);
if (target) {
target.classList.add('active');
window.scrollTo(0, 0);
}
if (screenId === 'screen-cart') {
renderCartContent();
recalculateCartSummary();
renderCartPaymentOptions();
const dock = document.getElementById('floatingCartDock');
if (dock) dock.classList.remove('visible');
} else if (screenId === 'screen-order-tracking') {
renderClientOrderTrackingView();
} else if (screenId === 'screen-offers') {
renderClientOffersScreen();
} else if (screenId === 'screen-moments') {
renderCommunityMomentsFeed();
} else {
refreshCartDockStatus();
}
};
window.openSidebarDrawer = function() {
updateVersionBadgeUI();
document.getElementById('sidebarMask').classList.add('active');
document.getElementById('sidebarDrawer').classList.add('active');
};
window.closeSidebarDrawer = function() {
document.getElementById('sidebarMask').classList.remove('active');
document.getElementById('sidebarDrawer').classList.remove('active');
};
window.toggleAppTheme = function() {
document.body.classList.toggle('dark-mode');
const isDark = document.body.classList.contains('dark-mode');
localStorage.setItem('cc_theme', isDark ? 'dark' : 'light');
};
window.renderCategoryChips = function() {
const cats = ["الكل", ...new Set(productsList.map(p => p.category))];
const container = document.getElementById('categoryScrollChips');
if (!container) return;
container.innerHTML = cats.map(c => ⁠<div class="cat-chip ${c === window.appState.currentCategory ? 'active' : ''}" onclick="selectMenuCat('${c}')">${c}</div>⁠).join('');
};
window.selectMenuCat = function(c) {
window.appState.currentCategory = c;
window.renderCategoryChips();
window.renderMenuProducts();
};
window.renderMenuProducts = function() {
const q = (document.getElementById('menuSearchInput')?.value || '').trim().toLowerCase();
let list = productsList;
if (window.appState.currentCategory && window.appState.currentCategory !== "الكل") {
list = list.filter(p => p.category === window.appState.currentCategory);
}
if (q) {
list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q));
}
const grid = document.getElementById('menuGridContainer');
if (!grid) return;
if (list.length === 0) {
grid.innerHTML = ⁠<div style="grid-column: 1/-1; text-align: center; padding: 40px 16px; color: var(--text-secondary); font-size: 13px;">لا توجد أصناف مطابقة للبحث</div>⁠;
return;
}
grid.innerHTML = list.map(item => ⁠<div class="product-card ${item.isAvailable === false ? 'out-of-stock' : ''}" onclick="${item.isAvailable !== false ?⁠openProductCustomizer('${item.id}')⁠:⁠showToastMsg('غير متوفر حالياً')⁠}"> <img src="${item.img}" class="product-img" loading="lazy" onerror="this.src='https://placehold.co/400x400/18110b/ffffff?text=Coffee'"> <div class="product-meta"> <div class="product-name">${item.name}</div> <div class="product-desc">${item.desc}</div> <div class="product-row-bottom"> <div class="product-price num-font">${parseFloat(item.price).toFixed(2)} د.أ</div> <div class="btn-add-mini">${item.isAvailable !== false ? 'إضافة' : 'مغلق'}</div> </div> </div> </div> ⁠).join('');
};
window.openProductCustomizer = function(id) {
const item = productsList.find(x => x.id === id);
if (!item) return;
window.appState.selectedProduct = item;
window.appState.productModalQty = 1;
document.getElementById('psHeroImg').src = item.img;
document.getElementById('psTitle').innerText = item.name;
document.getElementById('psDesc').innerText = item.desc;
document.getElementById('psBasePrice').innerText = parseFloat(item.price).toFixed(2) + ' د.أ';
document.getElementById('psQtyDisplay').innerText = '1';
document.getElementById('psNotes').value = '';
const isSweet = ["وافل", "كريب", "بان كيك", "كنافة"].includes(item.category);
const hasSizes = (item.hasSizes !== false && !isSweet);
document.getElementById('psSizeGroup').style.display = hasSizes ? 'block' : 'none';
if (hasSizes) {
document.getElementById('psSizeOptionsContainer').innerHTML = ⁠<label style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; cursor:pointer;" onclick="updateProductModalPricing()"> <span style="font-size:13px;">صغير (عادي)</span> <input type="radio" name="size" value="small" checked> </label> <label style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; cursor:pointer;" onclick="updateProductModalPricing()"> <span style="font-size:13px;">وسط (+0.50 د.أ)</span> <input type="radio" name="size" value="medium"> </label> <label style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; cursor:pointer;" onclick="updateProductModalPricing()"> <span style="font-size:13px;">كبير (+1.00 د.أ)</span> <input type="radio" name="size" value="large"> </label>⁠;
}
document.getElementById('psSaucesContainer').style.display = isSweet ? 'block' : 'none';
if (isSweet) {
document.getElementById('psSaucesList').innerHTML = saucesList.filter(s => s.enabled !== false).map(s => ⁠<label style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; cursor:pointer;" onclick="handleSauceCheckLimit(this)"> <div> <span style="font-size:13px;">${s.name}</span> <span style="font-size:11px; color:var(--text-secondary); margin-right:4px;" class="num-font">(+${parseFloat(s.price).toFixed(2)} د.أ)</span> </div> <input type="checkbox" class="sauce-toggle-cb" value="${s.name}" data-price="${s.price}"> </label>⁠).join('');
}
updateProductModalPricing();
window.navigateRouter('screen-product');
};
window.handleSauceCheckLimit = function(labelEl) {
const cb = labelEl.querySelector('.sauce-toggle-cb');
if (!cb) return;
const checked = Array.from(document.querySelectorAll('.sauce-toggle-cb:checked'));
if (checked.length > 3) {
cb.checked = false;
window.showToastMsg("الحد الأقصى 3 نكهات فقط للمكس");
}
updateProductModalPricing();
};
window.adjustProductQty = function(delta) {
let q = window.appState.productModalQty + delta;
if (q >= 1 && q <= 20) {
window.appState.productModalQty = q;
document.getElementById('psQtyDisplay').innerText = q;
updateProductModalPricing();
}
};
window.updateProductModalPricing = function() {
if (!window.appState.selectedProduct) return;
const item = window.appState.selectedProduct;
let base = parseFloat(item.price);
const isSweet = ["وافل", "كريب", "بان كيك", "كنافة"].includes(item.category);
const hasSizes = (item.hasSizes !== false && !isSweet);
if (hasSizes) {
const sizeEl = document.querySelector('input[name="size"]:checked');
if (sizeEl) {
if (sizeEl.value === 'medium') base += 0.50;
if (sizeEl.value === 'large') base += 1.00;
}
}
if (isSweet) {
const checkedSauces = Array.from(document.querySelectorAll('.sauce-toggle-cb:checked'));
if (checkedSauces.length > 0) {
const maxSaucePrice = Math.max(...checkedSauces.map(cb => parseFloat(cb.getAttribute('data-price') || 0)));
base += maxSaucePrice;
}
}
document.getElementById('psCalculatedPrice').innerText = (base * window.appState.productModalQty).toFixed(2);
};
window.confirmAddItemToCart = function() {
if (!window.appState.selectedProduct) return;
const item = window.appState.selectedProduct;
const isSweet = ["وافل", "كريب", "بان كيك", "كنافة"].includes(item.category);
const hasSizes = (item.hasSizes !== false && !isSweet);
const sizeInput = document.querySelector('input[name="size"]:checked');
const checkedSauceInputs = Array.from(document.querySelectorAll('.sauce-toggle-cb:checked'));
let unit = parseFloat(item.price);
if (hasSizes && sizeInput) {
if (sizeInput.value === 'medium') unit += 0.50;
if (sizeInput.value === 'large') unit += 1.00;
}
if (isSweet && checkedSauceInputs.length > 0) {
const maxPrice = Math.max(...checkedSauceInputs.map(cb => parseFloat(cb.getAttribute('data-price') || 0)));
unit += maxPrice;
}
const sauceDesc = checkedSauceInputs.map(cb => cb.value).join(' + ');
window.appState.cart.push({
id: 'item_' + Date.now(),
name: item.name,
qty: window.appState.productModalQty,
sizeName: hasSizes && sizeInput ? (sizeInput.value === 'medium' ? 'وسط' : sizeInput.value === 'large' ? 'كبير' : 'صغير') : 'قياسي',
sauceName: sauceDesc,
notes: document.getElementById('psNotes').value.trim(),
lineTotal: unit * window.appState.productModalQty
});
safeSet('cc_cart', window.appState.cart);
window.showToastMsg("تمت الإضافة للسلة");
window.navigateRouter('screen-home');
refreshCartDockStatus();
};
function refreshCartDockStatus() {
const dock = document.getElementById('floatingCartDock');
if (!dock) return;
const count = window.appState.cart.reduce((s, i) => s + i.qty, 0);
const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
if (count > 0) {
document.getElementById('dockBadgeCount').innerText = count;
document.getElementById('dockPriceTotal').innerText = sub.toFixed(2) + ' د.أ';
dock.classList.add('visible');
} else {
dock.classList.remove('visible');
}
}
function renderCartContent() {
const container = document.getElementById('cartItemsList');
if (!container) return;
if (!window.appState.cart.length) {
container.innerHTML = ⁠<div style="text-align:center; padding:12px; color:var(--text-secondary); font-size:12.5px;">السلة فارغة حالياً</div>⁠;
return;
}
container.innerHTML = window.appState.cart.map((item, idx) => ⁠<div style="display:flex; justify-content:space-between; align-items:flex-start; padding:8px 0; border-bottom:1px dashed var(--border-light);"> <div> <div style="font-weight:700; font-size:13px;">${item.qty}x ${item.name}</div> <div style="font-size:11px; color:var(--text-secondary);">${item.sizeName !== 'قياسي' ?⁠الحجم: ${item.sizeName}⁠: ''} ${item.sauceName ?⁠(نكهة: ${item.sauceName})⁠: ''}</div> ${item.notes ?⁠<div style="font-size:10.5px; color:var(--text-tertiary);">ملاحظة: ${item.notes}</div>⁠: ''} </div> <div style="text-align:left;"> <div class="num-font" style="font-weight:700; color:var(--brand-accent); font-size:13px;">${item.lineTotal.toFixed(2)} د.أ</div> <span style="color:var(--danger); font-size:11px; cursor:pointer;" onclick="removeCartItem(${idx})">حذف</span> </div> </div>⁠).join('');
populateTownDropdown();
updateClientSessionState();
}
window.removeCartItem = function(idx) {
window.appState.cart.splice(idx, 1);
safeSet('cc_cart', window.appState.cart);
renderCartContent();
recalculateCartSummary();
refreshCartDockStatus();
};
function populateTownDropdown() {
const select = document.getElementById('cartTownSelect');
if (!select) return;
const b = BRANCHES_DATA[window.appState.cartBranch] || BRANCHES_DATA[0];
select.innerHTML = Object.entries(b.towns || {}).map(([t, fee]) => ⁠<option value="${fee}" data-town="${t}">${t} (${fee.toFixed(2)} د.أ)</option>⁠).join('');
recalculateCartSummary();
}
function renderCartPaymentOptions() {
const container = document.getElementById('cartPaymentMethodsGroup');
if (!container) return;
const b = BRANCHES_DATA[window.appState.cartBranch] || BRANCHES_DATA[0];
container.innerHTML = ⁠<label style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; cursor:pointer;" onclick="setCartPaymentMethod('cliq')"> <div> <div style="font-weight:700; font-size:12.5px;">كليك (CliQ - ${b.cliqName})</div> <div style="font-size:11px; color:var(--text-secondary);" class="num-font">الرقم: ${b.cliqNum}</div> </div> <input type="radio" name="cart_pay" ${window.appState.paymentMethod === 'cliq' ? 'checked' : ''}> </label> <label style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; cursor:pointer;" onclick="setCartPaymentMethod('cash')"> <div> <div style="font-weight:700; font-size:12.5px;">دفع نقدي (كاش)</div> <div style="font-size:11px; color:var(--text-secondary);">عند الاستلام</div> </div> <input type="radio" name="cart_pay" ${window.appState.paymentMethod === 'cash' ? 'checked' : ''}> </label>⁠;
}
window.setCartPaymentMethod = function(method) {
window.appState.paymentMethod = method;
renderCartPaymentOptions();
};
window.switchCartBranch = function(b) {
window.appState.cartBranch = b;
document.getElementById('btnBranch0').style.background = (b === 0) ? 'var(--segment-bg)' : 'transparent';
document.getElementById('btnBranch1').style.background = (b === 1) ? 'var(--segment-bg)' : 'transparent';
populateTownDropdown();
renderCartPaymentOptions();
updateBranchStatusBadges();
};
window.switchDeliveryMode = function(m) {
window.appState.deliveryMode = m;
document.getElementById('btnModeDelivery').style.background = (m === 'delivery') ? 'var(--segment-bg)' : 'transparent';
document.getElementById('btnModePickup').style.background = (m === 'pickup') ? 'var(--segment-bg)' : 'transparent';
document.getElementById('deliveryFieldsArea').style.display = (m === 'delivery') ? 'block' : 'none';
recalculateCartSummary();
};
window.applyUserPromoCode = function() {
const inp = (document.getElementById('cartPromoInput')?.value || '').trim().toUpperCase();
const err = document.getElementById('promoErrorAlert');
err.innerText = '';
if (promoCodesList[inp]) {
appliedPromoObject = promoCodesList[inp];
document.getElementById('promoInputContainer').style.display = 'none';
document.getElementById('promoSuccessBadge').style.display = 'flex';
document.getElementById('promoSuccessDesc').innerText = ⁠تم تطبيق خصم ${appliedPromoObject.discount}%⁠;
recalculateCartSummary();
window.showToastMsg("تم تفعيل الخصم");
} else {
err.innerText = 'الكود غير صحيح';
}
};
window.removeActivePromoCode = function() {
appliedPromoObject = null;
document.getElementById('cartPromoInput').value = '';
document.getElementById('promoInputContainer').style.display = 'flex';
document.getElementById('promoSuccessBadge').style.display = 'none';
recalculateCartSummary();
};
window.recalculateCartSummary = function() {
const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
let disc = 0;
if (appliedPromoObject) {
disc = sub * (appliedPromoObject.discount / 100);
document.getElementById('sumDiscountRow').style.display = 'flex';
document.getElementById('sumDiscount').innerText = ⁠-${disc.toFixed(2)} د.أ⁠;
} else {
document.getElementById('sumDiscountRow').style.display = 'none';
}
let del = 0;
if (window.appState.deliveryMode === 'delivery') {
const sel = document.getElementById('cartTownSelect');
if (sel && sel.value) del = parseFloat(sel.value);
}
document.getElementById('sumSubtotal').innerText = sub.toFixed(2) + ' د.أ';
document.getElementById('sumDelivery').innerText = del.toFixed(2) + ' د.أ';
document.getElementById('sumTotal').innerText = (sub - disc + del).toFixed(2) + ' د.أ';
};
window.dispatchOrderAndInitiateTracking = function() {
if (!activeClientSession) {
window.showToastMsg("يرجى تسجيل الدخول أولاً لإتمام الطلب");
window.navigateRouter('screen-user-auth');
return;
}
const activeUser = registeredUsersMap['u_' + activeClientSession.phone];
if (activeUser && activeUser.isBanned) {
return window.showToastMsg("عذراً، هذا الحساب محظور من الإدارة");
}
if (!window.appState.cart.length) return window.showToastMsg("السلة فارغة");
const branch = BRANCHES_DATA[window.appState.cartBranch];
const sub = window.appState.cart.reduce((s, i) => s + i.lineTotal, 0);
let disc = appliedPromoObject ? sub * (appliedPromoObject.discount / 100) : 0;
let del = window.appState.deliveryMode === 'delivery' ? parseFloat(document.getElementById('cartTownSelect').value) : 0;
const total = sub - disc + del;
const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
let payStr = window.appState.paymentMethod === 'cliq' ? ⁠كليك (${branch.cliqName})⁠ : 'نقدي عند الاستلام';
const newOrderObj = {
orderId: orderNumber,
customerName: activeUser.name,
customerPhone: activeUser.phone,
branchName: branch.name,
branchId: window.appState.cartBranch,
deliveryMode: window.appState.deliveryMode,
address: window.appState.deliveryMode === 'delivery' ? document.getElementById('cartAddressInput').value : 'استلام من الفرع',
payMethod: payStr,
items: [...window.appState.cart],
totalAmount: total,
status: 'received',
timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
dateStr: new Date().toISOString().slice(0, 10)
};
activeOrdersList.unshift(newOrderObj);
safeSet('cc_orders', activeOrdersList);
localStorage.setItem('cc_latest_order_id', orderNumber);
activeUser.ordersCount = (activeUser.ordersCount || 0) + 1;
activeUser.totalSpent = parseFloat(((activeUser.totalSpent || 0) + total).toFixed(2));
activeUser.loyaltyPoints = (activeUser.loyaltyPoints || 0) + Math.floor(total);
if (!activeUser.badges) activeUser.badges = [];
if (activeUser.ordersCount >= 3 && !activeUser.badges.includes("رائد الكورنر")) {
activeUser.badges.push("رائد الكورنر");
}
if (activeUser.ordersCount >= 7 && !activeUser.badges.includes("العميل الذهبي")) {
activeUser.badges.push("العميل الذهبي");
}
if (activeUser.ordersCount >= 15 && !activeUser.badges.includes("سفير الكورنر")) {
activeUser.badges.push("سفير الكورنر");
}
safeSet('cc_users', registeredUsersMap);
let msg = ⁠*طلب جديد | ${storeSettings.brandTitle}*\nرقم الطلب: ${orderNumber}\nالفرع: ${branch.name}\nالعميل: ${activeUser.name} (${activeUser.phone})\n----------------\n⁠;
window.appState.cart.forEach((i, idx) => {
msg += ⁠${idx + 1}. *${i.qty}x ${i.name}* (${i.sizeName}) - ${i.lineTotal.toFixed(2)} د.أ\n⁠;
});
msg += ⁠----------------\nالمجموع: ${total.toFixed(2)} د.أ\nالاستلام: ${window.appState.deliveryMode === 'delivery' ? 'توصيل' : 'من الفرع'}\nالدفع: ${payStr}\n⁠;
if (window.appState.deliveryMode === 'delivery') msg += ⁠العنوان: ${newOrderObj.address}\n⁠;
window.appState.cart = [];
localStorage.removeItem('cc_cart');
refreshCartDockStatus();
window.open(⁠https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(msg)}⁠, '_blank');
window.navigateRouter('screen-order-tracking');
window.showToastMsg("تم إرسال الطلب، وبدء التتبع الحي");
};
function renderClientOrderTrackingView() {
const container = document.getElementById('activeOrderTrackingView');
if (!container) return;
const latestId = localStorage.getItem('cc_latest_order_id');
const order = activeOrdersList.find(o => o.orderId === latestId);
if (!order) {
container.innerHTML = ⁠<div class="clean-card" style="text-align:center; padding:30px 16px;"> <div style="font-weight:700; font-size:14px; margin-bottom:6px;">لا يوجد طلبات نشطة حالياً</div> <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:12px;">عند إرسال طلب جديد، ستظهر مراحل تحضيره هنا مباشرة.</div> <button class="btn-brand-solid" onclick="navigateRouter('screen-home')">الذهاب للمنيو</button> </div>⁠;
return;
}
const isDelivery = order.deliveryMode === 'delivery';
const status = order.status;
container.innerHTML = `
<div class="clean-card">
<div style="display:flex; justify-content:space-between; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-light);">
<div>
<span style="font-size:11px; color:var(--text-secondary);">رقم الطلب:</span>
<div class="num-font" style="font-weight:800; color:var(--brand-accent);">￼
￼
￼
￼
￼{order.timestamp}</div>
</div>
</div>
<div style="display:flex; flex-direction:column; gap:8px; margin-bottom:14px;">
<div style="font-size:12.5px; font-weight:700; color:${status === 'received' ? 'var(--brand-accent)' : 'inherit'};">1. تم استلام الطلب</div>
<div style="font-size:12.5px; font-weight:700; color:${status === 'preparing' ? 'var(--brand-accent)' : 'inherit'};">2. جاري التحضير</div>
<div style="font-size:12.5px; font-weight:700; color:${['on_the_way', 'ready_pickup'].includes(status) ? 'var(--brand-accent)' : 'inherit'};">3. ${isDelivery ? 'في طريق التوصيل إليك' : 'جاهز للاستلام من الفرع'}</div>
<div style="font-size:12.5px; font-weight:700; color:${status === 'completed' ? 'var(--success)' : 'inherit'};">4. تم التسليم بنجاح</div>
</div>
<div style="font-size:12px; line-height:1.6; border-top:1px solid var(--border-light); padding-top:8px;">
<div>الفرع: <strong>￼
￼{order.totalAmount.toFixed(2)} د.أ</strong></div>
</div>
</div>
`;
}
window.handleUserAccountHeaderClick = function() {
if (activeClientSession) {
renderClientProfileScreen();
window.navigateRouter('screen-user-profile');
} else {
window.switchAuthTabMode('login');
window.navigateRouter('screen-user-auth');
}
};
window.switchAuthTabMode = function(mode) {
currentAuthMode = mode;
const isReg = (mode === 'register');
document.getElementById('tabAuthLogin').style.background = !isReg ? 'var(--segment-bg)' : 'transparent';
document.getElementById('tabAuthRegister').style.background = isReg ? 'var(--segment-bg)' : 'transparent';
document.getElementById('authRegisterExtraFields').style.display = isReg ? 'flex' : 'none';
document.getElementById('authSubmitBtn').innerText = isReg ? 'إنشاء حساب جديد' : 'دخول';
document.getElementById('authStatusAlert').innerText = '';
};
window.handleAuthSubmitAction = function() {
const phone = (document.getElementById('authInputPhone').value || '').trim().replace(/\s+/g, '');
const pin = (document.getElementById('authInputPin').value || '').trim();
const errEl = document.getElementById('authStatusAlert');
errEl.innerText = '';
if (!phone || phone.length < 9) return errEl.innerText = 'يرجى إدخال رقم هاتف صحيح';
if (!pin || pin.length < 3) return errEl.innerText = 'رمز المرور لا يقل عن 3 خانات';
const phoneKey = 'u_' + phone;
if (currentAuthMode === 'register') {
const name = (document.getElementById('authInputName').value || '').trim();
const address = (document.getElementById('authInputAddress').value || '').trim();
if (!name) return errEl.innerText = 'يرجى كتابة الاسم';
if (registeredUsersMap[phoneKey]) return errEl.innerText = 'الرقم مسجل مسبقاً، سجّل الدخول مباشرة';
const newUser = {
id: phoneKey, name, phone, pin, address,
avatar: "",
badges: ["عضو جديد"],
ordersCount: 0, totalSpent: 0.0, loyaltyPoints: 10, isBanned: false
};
registeredUsersMap[phoneKey] = newUser;
safeSet('cc_users', registeredUsersMap);
activeClientSession = { phone, name, address };
safeSet('cc_client_session', activeClientSession);
updateClientSessionState();
window.showToastMsg(⁠أهلاً بك يا ${name}⁠);
window.navigateRouter('screen-home');
} else {
const user = registeredUsersMap[phoneKey];
if (!user) return errEl.innerText = 'الرقم غير مسجل. اختر حساب جديد';
if (user.pin !== pin) return errEl.innerText = 'رمز المرور غير صحيح';
if (user.isBanned) return errEl.innerText = 'عذراً، هذا الحساب محظور من الإدارة';
activeClientSession = { phone, name: user.name, address: user.address || '' };
safeSet('cc_client_session', activeClientSession);
updateClientSessionState();
window.showToastMsg(⁠مرحباً يا ${user.name}⁠);
window.navigateRouter('screen-home');
}
};
window.logoutClientSession = function() {
activeClientSession = null;
localStorage.removeItem('cc_client_session');
updateClientSessionState();
window.showToastMsg('تم تسجيل الخروج');
window.navigateRouter('screen-home');
};
function updateClientSessionState() {
const nameField = document.getElementById('cartClientName');
const phoneField = document.getElementById('cartClientPhone');
if (activeClientSession) {
if (nameField) nameField.value = activeClientSession.name || '';
if (phoneField) phoneField.value = activeClientSession.phone || '';
} else {
if (nameField) nameField.value = '';
if (phoneField) phoneField.value = '';
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
document.getElementById('profDisplayTotalSpent').innerText = ⁠${(user.totalSpent || 0).toFixed(2)} د.أ⁠;
document.getElementById('profEditName').value = user.name || '';
document.getElementById('profEditAddress').value = user.address || '';
const avatarWrap = document.getElementById('profAvatarWrap');
if (user.avatar) {
avatarWrap.innerHTML = ⁠<img src="${user.avatar}" alt="${user.name}">⁠;
} else {
avatarWrap.innerHTML = ⁠<span>${(user.name || 'ع').charAt(0)}</span>⁠;
}
const badgesRow = document.getElementById('profBadgesRow');
const badges = user.badges || ["عضو جديد"];
badgesRow.innerHTML = badges.map(b => ⁠<span class="clean-badge active">${b}</span>⁠).join('');
const historyContainer = document.getElementById('profCustomerOrdersHistoryList');
const userOrders = activeOrdersList.filter(o => o.customerPhone === user.phone);
if (!userOrders.length) {
historyContainer.innerHTML = ⁠<div style="text-align:center; padding:10px; color:var(--text-secondary); font-size:12px;">لا يوجد طلبات سابقة مسجلة</div>⁠;
} else {
historyContainer.innerHTML = userOrders.map(o => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed var(--border-light); font-size:12px;"> <div> <strong>طلب #${o.orderId}</strong> <div style="color:var(--text-secondary); font-size:11px;">${o.branchName} - ${o.items.length} أصناف</div> </div> <div class="num-font" style="font-weight:700; color:var(--brand-accent);">${o.totalAmount.toFixed(2)} د.أ</div> </div>⁠).join('');
}
}
window.saveUpdatedClientProfile = function() {
if (!activeClientSession) return;
const phoneKey = 'u_' + activeClientSession.phone;
const newName = (document.getElementById('profEditName').value || '').trim();
const newAddr = (document.getElementById('profEditAddress').value || '').trim();
const avatarData = document.getElementById('userAvatarDataUrlInput').value;
if (!newName) return window.showToastMsg('يرجى كتابة الاسم');
if (registeredUsersMap[phoneKey]) {
registeredUsersMap[phoneKey].name = newName;
registeredUsersMap[phoneKey].address = newAddr;
if (avatarData) registeredUsersMap[phoneKey].avatar = avatarData;
}
activeClientSession.name = newName;
activeClientSession.address = newAddr;
safeSet('cc_client_session', activeClientSession);
safeSet('cc_users', registeredUsersMap);
updateClientSessionState();
renderClientProfileScreen();
window.showToastMsg('تم حفظ البيانات بنجاح');
};
/* مجتمع شاركنا بصورة - ظهور كامل للصور وميزة الحذف */
window.renderCommunityMomentsFeed = function() {
const feed = document.getElementById('communityFeedContainer');
if (!feed) return;
const currentPhone = activeClientSession ? activeClientSession.phone : null;
if (!communityMomentsList.length) {
feed.innerHTML = ⁠<div class="clean-card" style="text-align:center; padding:24px;"><div style="font-weight:700;">لا توجد مشاركات، شاركنا أول تجربة!</div></div>⁠;
return;
}
feed.innerHTML = communityMomentsList.map(m => {
const isAuthor = currentPhone && (m.authorPhone === currentPhone);
const stars = "★".repeat(m.rating || 5);
return ⁠<div class="moment-post-card"> ${m.img ?⁠
<div class="moment-img-container">
<img src="${m.img}" class="moment-post-img" loading="lazy" alt="تجربة العميل">
</div>
⁠: ''} <div class="moment-post-body"> <div class="moment-post-header"> <div> <div class="moment-post-author">${m.authorName}</div> <div class="moment-post-meta">${m.target || 'تجربة كافيه كورنر'} • ${m.timestamp}</div> </div> <div style="color:#eab308; font-size:13px;">${stars}</div> </div> <div class="moment-post-text">${m.text}</div> <div class="moment-post-actions"> <div style="font-size:12px; font-weight:600; cursor:pointer;" onclick="toggleLikeMoment('${m.id}')"> ❤️ <span class="num-font">${m.likes || 0}</span> إعجاب </div> ${isAuthor ?⁠
<button class="btn-brand-outline" style="padding:2px 8px; font-size:10.5px; color:var(--danger); border-color:var(--danger);" onclick="deleteMyMoment('${m.id}')">
حذف مشاركتي
</button>
⁠: ''} </div> </div> </div>⁠;
}).join('');
};
window.openNewMomentModal = function() {
if (!activeClientSession) {
window.showToastMsg("يرجى تسجيل الدخول أولاً لتتمكن من مشاركة صورتك");
window.navigateRouter('screen-user-auth');
return;
}
// تصفير المعاينة السابقة
document.getElementById('momentPhotoDataUrlInput').value = '';
const prev = document.getElementById('previewMomentPhoto');
if (prev) { prev.src = ''; prev.style.display = 'none'; }
const pBox = document.getElementById('momentPreviewBox');
if (pBox) pBox.style.display = 'none';
document.getElementById('modal-new-moment').classList.add('active');
};
window.closeNewMomentModal = function() {
document.getElementById('modal-new-moment').classList.remove('active');
};
window.setMomentStarRating = function(stars) {
currentSelectedMomentStars = stars;
const spans = document.querySelectorAll('#momentStarRatingPickers span');
spans.forEach((s, idx) => {
s.style.opacity = (idx < stars) ? '1' : '0.3';
});
};
window.submitNewCustomerMoment = function() {
if (!activeClientSession) return;
const user = registeredUsersMap['u_' + activeClientSession.phone] || activeClientSession;
const photoData = document.getElementById('momentPhotoDataUrlInput').value;
const itemOrBranch = document.getElementById('momentItemOrBranchInput').value.trim();
const comment = document.getElementById('momentCommentInput').value.trim();
if (!comment) return window.showToastMsg("اكتب تعليقك أو انطباعك عن التجربة");
const newMoment = {
id: "m_" + Date.now(),
authorPhone: user.phone || activeClientSession.phone,
authorName: user.name || "عميل كورنر",
rating: currentSelectedMomentStars,
target: itemOrBranch || "تجربة مميزة",
text: comment,
img: photoData || "",
likes: 0,
likedBy: [],
timestamp: "الآن"
};
communityMomentsList.unshift(newMoment);
safeSet('cc_moments', communityMomentsList);
closeNewMomentModal();
renderCommunityMomentsFeed();
autoIncrementVersion();
window.showToastMsg("تم نشر تجربتك بنجاح!");
};
window.deleteMyMoment = function(id) {
if (!confirm("هل أنت متأكد من حذف مشاركتك؟")) return;
communityMomentsList = communityMomentsList.filter(m => m.id !== id);
safeSet('cc_moments', communityMomentsList);
renderCommunityMomentsFeed();
window.showToastMsg("تم حذف المشاركة");
};
window.toggleLikeMoment = function(momentId) {
if (!activeClientSession) {
return window.showToastMsg("سجل دخولك للتفاعل مع المشاركات");
}
const m = communityMomentsList.find(x => x.id === momentId);
if (!m) return;
const userId = 'u_' + activeClientSession.phone;
if (!m.likedBy) m.likedBy = [];
if (m.likedBy.includes(userId)) {
m.likedBy = m.likedBy.filter(u => u !== userId);
m.likes = Math.max(0, (m.likes || 1) - 1);
} else {
m.likedBy.push(userId);
m.likes = (m.likes || 0) + 1;
}
safeSet('cc_moments', communityMomentsList);
renderCommunityMomentsFeed();
};
window.handleSecretAdminTrigger = function() {
secretClickCount++;
clearTimeout(secretClickTimer);
secretClickTimer = setTimeout(() => { secretClickCount = 0; }, 1200);
if (secretClickCount >= 4) {
secretClickCount = 0;
window.navigateRouter('screen-admin-login');
}
};
window.attemptAdminAuthentication = function() {
const user = (document.getElementById('adminUserField')?.value || '').trim().toLowerCase();
const pass = (document.getElementById('adminPassField')?.value || '').trim();
if (!pass) return window.showToastMsg("أدخل كلمة المرور");
let isAuthenticated = (pass === MASTER_PIN) && (user === DEV_USER || user === SHOP_USER);
if (isAuthenticated) {
activeSessionUser = user;
document.getElementById('adminPassField').value = '';
applyAdminRolePermissions(user);
window.navigateRouter('screen-admin-dashboard');
renderAdminLiveOrdersManager();
if (user === DEV_USER) {
renderAdminProductsManager();
renderAdminSaucesManager();
renderAdminTownsManager();
renderAdminUsersListView();
renderAdminPromosManager();
renderAdminOffersListManager();
renderAdminMomentsManager();
loadDeveloperAndBrandSettingsIntoUI();
calculateRealAnalyticsAndDraw();
}
window.showToastMsg(user === DEV_USER ? "أهلاً بك يا مهندس عمر" : "أهلاً بك - إدارة المحل");
} else {
window.showToastMsg("بيانات الدخول غير صحيحة");
}
};
function applyAdminRolePermissions(role) {
const greeting = document.getElementById('adminGreetingLabel');
const devTabs = document.querySelectorAll('.dev-only-tab');
if (role === DEV_USER) {
greeting.innerText = "لوحة المطور (عمر عبيدات)";
devTabs.forEach(t => t.style.display = 'block');
} else {
greeting.innerText = "لوحة تأكيد الطلبات";
devTabs.forEach(t => t.style.display = 'none');
switchAdminTabPane('liveOrders');
}
}
window.exitAdminSession = function() {
activeSessionUser = null;
window.navigateRouter('screen-home');
};
window.switchAdminTabPane = function(paneId) {
if (activeSessionUser !== DEV_USER && paneId !== 'liveOrders') {
return window.showToastMsg("هذه الصلاحية خاصة بالمطور فقط");
}
document.querySelectorAll('.admin-tab-chip').forEach(c => c.classList.remove('active'));
document.querySelectorAll('.admin-pane').forEach(p => p.classList.remove('active'));
const tabEl = document.getElementById('tabHead' + paneId.charAt(0).toUpperCase() + paneId.slice(1));
const paneEl = document.getElementById('pane' + paneId.charAt(0).toUpperCase() + paneId.slice(1));
if (tabEl) tabEl.classList.add('active');
if (paneEl) paneEl.classList.add('active');
if (paneId === 'analytics') {
setTimeout(calculateRealAnalyticsAndDraw, 40);
}
};
function renderAdminLiveOrdersManager() {
const container = document.getElementById('adminLiveOrdersContainer');
const countBadge = document.getElementById('adminActiveOrdersCount');
if (!container) return;
if (countBadge) countBadge.innerText = ⁠${activeOrdersList.length} طلب⁠;
if (!activeOrdersList.length) {
container.innerHTML = ⁠<div style="text-align:center; padding:12px; color:var(--text-secondary); font-size:12px;">لا يوجد طلبات نشطة</div>⁠;
return;
}
container.innerHTML = activeOrdersList.map(o => ⁠<div style="border:1px solid var(--border-light); border-radius:var(--radius-sm); padding:10px; margin-bottom:8px;"> <div style="display:flex; justify-content:space-between; margin-bottom:4px;"> <span class="num-font" style="font-weight:800; color:var(--brand-accent);">${o.orderId}</span> <span style="font-size:11px; font-weight:600;">${o.branchName} • ${o.timestamp}</span> </div> <div style="font-size:12px; margin-bottom:4px;"> <strong>${o.customerName}</strong> (${o.customerPhone}) - <span class="num-font">${o.totalAmount.toFixed(2)} د.أ</span> </div> <div style="display:flex; gap:4px; flex-wrap:wrap; margin-top:6px;"> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px;" onclick="setOrderStatusByAdmin('${o.orderId}', 'received')">استلام</button> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px;" onclick="setOrderStatusByAdmin('${o.orderId}', 'preparing')">تحضير</button> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px;" onclick="setOrderStatusByAdmin('${o.orderId}', '${o.deliveryMode === 'delivery' ? 'on_the_way' : 'ready_pickup'}')">${o.deliveryMode === 'delivery' ? 'في الطريق' : 'جاهز'}</button> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; color:var(--success); border-color:var(--success);" onclick="setOrderStatusByAdmin('${o.orderId}', 'completed')">مكتمل</button> </div> </div>⁠).join('');
}
window.setOrderStatusByAdmin = function(orderId, status) {
const o = activeOrdersList.find(x => x.orderId === orderId);
if (!o) return;
o.status = status;
safeSet('cc_orders', activeOrdersList);
renderAdminLiveOrdersManager();
if (localStorage.getItem('cc_latest_order_id') === orderId) {
renderClientOrderTrackingView();
}
window.showToastMsg("تم تحديث حالة الطلب");
};
function renderAdminMomentsManager() {
const container = document.getElementById('adminMomentsListContainer');
if (!container) return;
if (!communityMomentsList.length) {
container.innerHTML = ⁠<div style="text-align:center; padding:10px; color:var(--text-secondary); font-size:12px;">لا توجد مشاركات</div>⁠;
return;
}
container.innerHTML = communityMomentsList.map(m => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-light); font-size:12px;"> <div> <strong>${m.authorName}</strong> (${m.rating}★) <div style="color:var(--text-secondary); font-size:11px;">${m.text}</div> </div> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; color:var(--danger); border-color:var(--danger);" onclick="deleteMomentAdmin('${m.id}')">حذف</button> </div>⁠).join('');
}
window.deleteMomentAdmin = function(id) {
communityMomentsList = communityMomentsList.filter(m => m.id !== id);
safeSet('cc_moments', communityMomentsList);
renderAdminMomentsManager();
renderCommunityMomentsFeed();
window.showToastMsg("تم حذف المشاركة من الأدمن");
};
function renderAdminSaucesManager() {
const container = document.getElementById('adminSaucesSettingsList');
if (!container) return;
container.innerHTML = saucesList.map(s => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-light); font-size:12.5px;"> <div>${s.name} (<span class="num-font">${parseFloat(s.price).toFixed(2)} د.أ</span>)</div> <div style="display:flex; gap:4px;"> <input type="number" step="0.25" class="ios-input-field num-font" value="${s.price}" style="width:60px; padding:2px 4px; font-size:11px;" onchange="updateSaucePriceAdmin('${s.id}', this.value)"> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; color:var(--danger); border-color:var(--danger);" onclick="deleteSauceAdmin('${s.id}')">حذف</button> </div> </div>⁠).join('');
}
window.updateSaucePriceAdmin = function(id, val) {
const s = saucesList.find(x => x.id === id);
if (!s) return;
s.price = parseFloat(val) || 0;
safeSet('cc_sauces', saucesList);
autoIncrementVersion();
window.showToastMsg("تم تعديل السعر");
};
window.deleteSauceAdmin = function(id) {
saucesList = saucesList.filter(x => x.id !== id);
safeSet('cc_sauces', saucesList);
renderAdminSaucesManager();
autoIncrementVersion();
window.showToastMsg("تم حذف النكهة");
};
window.promptNewSauceAddition = function() {
const name = prompt("اسم النكهة:");
if (!name || !name.trim()) return;
const priceStr = prompt("السعر (د.أ):", "0.50");
const price = parseFloat(priceStr) || 0.50;
saucesList.push({ id: 's_' + Date.now(), name: name.trim(), price, enabled: true });
safeSet('cc_sauces', saucesList);
renderAdminSaucesManager();
autoIncrementVersion();
window.showToastMsg("تمت إضافة النكهة");
};
function renderAdminTownsManager() {
const container = document.getElementById('adminTownsRatesList');
if (!container) return;
const b = BRANCHES_DATA[window.appState.cartBranch] || BRANCHES_DATA[0];
const towns = b.towns || {};
container.innerHTML = Object.entries(towns).map(([t, fee]) => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-light); font-size:12px;"> <div>${t} (${parseFloat(fee).toFixed(2)} د.أ)</div> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; color:var(--danger); border-color:var(--danger);" onclick="deleteTownRateAdmin('${t}')">حذف</button> </div>⁠).join('');
}
window.saveTownRateAdmin = function() {
const name = (document.getElementById('newTownNameInput').value || '').trim();
const fee = parseFloat(document.getElementById('newTownFeeInput').value) || 0;
if (!name) return window.showToastMsg("أدخل اسم المنطقة");
BRANCHES_DATA[window.appState.cartBranch].towns[name] = fee;
document.getElementById('newTownNameInput').value = '';
document.getElementById('newTownFeeInput').value = '';
renderAdminTownsManager();
autoIncrementVersion();
window.showToastMsg("تم حفظ المنطقة");
};
window.deleteTownRateAdmin = function(t) {
delete BRANCHES_DATA[window.appState.cartBranch].towns[t];
renderAdminTownsManager();
autoIncrementVersion();
window.showToastMsg("تم حذف المنطقة");
};
function renderAdminProductsManager() {
const container = document.getElementById('adminProductsControlList');
if (!container) return;
container.innerHTML = productsList.map(p => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-light); font-size:12.5px;"> <div> <strong>${p.name}</strong> (${parseFloat(p.price).toFixed(2)} د.أ) <div style="color:var(--text-secondary); font-size:11px;">${p.category}</div> </div> <div style="display:flex; gap:4px;"> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px;" onclick="openProductEditorModal('${p.id}')">تعديل</button> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; color:var(--danger); border-color:var(--danger);" onclick="deleteProductFromCatalog('${p.id}')">حذف</button> </div> </div>⁠).join('');
}
window.openProductEditorModal = function(id) {
const previewEl = document.getElementById('previewProductImgAdmin');
if (id) {
const p = productsList.find(x => x.id === id);
document.getElementById('editProductIdField').value = p.id;
document.getElementById('editProductNameField').value = p.name;
document.getElementById('editProductCatField').value = p.category;
document.getElementById('editProductPriceField').value = p.price;
document.getElementById('editProductDescField').value = p.desc;
document.getElementById('editProductImgField').value = p.img;
if (previewEl) {
previewEl.src = p.img;
previewEl.style.display = 'block';
}
} else {
document.getElementById('editProductIdField').value = '';
document.getElementById('editProductNameField').value = '';
document.getElementById('editProductCatField').value = 'كوكتيلات';
document.getElementById('editProductPriceField').value = '';
document.getElementById('editProductDescField').value = '';
document.getElementById('editProductImgField').value = '';
if (previewEl) previewEl.style.display = 'none';
}
window.navigateRouter('screen-product-editor');
};
window.saveProductEditorChanges = function() {
const id = document.getElementById('editProductIdField').value;
const name = document.getElementById('editProductNameField').value.trim();
const cat = document.getElementById('editProductCatField').value;
const price = parseFloat(document.getElementById('editProductPriceField').value) || 0;
const desc = document.getElementById('editProductDescField').value.trim();
const img = document.getElementById('editProductImgField').value.trim();
if (!name || price <= 0) return window.showToastMsg("أدخل اسم وسعر صالح");
const payload = { id: id || ('prod_' + Date.now()), name, category: cat, price, desc, img, isAvailable: true };
if (id) {
const idx = productsList.findIndex(p => p.id === id);
if (idx !== -1) productsList[idx] = payload;
} else {
productsList.unshift(payload);
}
safeSet('cc_products', productsList);
autoIncrementVersion();
window.renderCategoryChips();
window.renderMenuProducts();
renderAdminProductsManager();
window.navigateRouter('screen-admin-dashboard');
window.showToastMsg("تم حفظ الصنف بنجاح");
};
window.deleteProductFromCatalog = function(id) {
productsList = productsList.filter(p => p.id !== id);
safeSet('cc_products', productsList);
autoIncrementVersion();
window.renderCategoryChips();
window.renderMenuProducts();
renderAdminProductsManager();
window.showToastMsg("تم حذف الصنف");
};
function loadDeveloperAndBrandSettingsIntoUI() {
document.getElementById('cfgBrandTitleInput').value = storeSettings.brandTitle || '';
document.getElementById('cfgBrandSubInput').value = storeSettings.brandSub || '';
document.getElementById('cfgBrandLogoInput').value = storeSettings.logoUrl || '';
document.getElementById('cfgDevNameInput').value = storeSettings.devName || '';
document.getElementById('cfgDevRoleInput').value = storeSettings.devRole || '';
document.getElementById('cfgDevPhotoInput').value = storeSettings.devPhoto || '';
document.getElementById('cfgDevBioInput').value = storeSettings.devBio || '';
document.getElementById('cfgDevWhatsappInput').value = storeSettings.devWhatsapp || '';
document.getElementById('cfgDevInstaInput').value = storeSettings.devInsta || '';
}
window.saveHeaderBrandSettings = function() {
storeSettings.brandTitle = document.getElementById('cfgBrandTitleInput').value.trim() || 'كافيه كورنر';
storeSettings.brandSub = document.getElementById('cfgBrandSubInput').value.trim() || '';
storeSettings.logoUrl = document.getElementById('cfgBrandLogoInput').value.trim() || './logo.png';
safeSet('cc_store_settings', storeSettings);
applyLiveSettingsToDOM();
autoIncrementVersion();
window.showToastMsg("تم حفظ الترويسة");
};
window.saveDeveloperProfileSettings = function() {
storeSettings.devName = document.getElementById('cfgDevNameInput').value.trim() || 'المهندس عمر عبيدات';
storeSettings.devRole = document.getElementById('cfgDevRoleInput').value.trim() || '';
storeSettings.devPhoto = document.getElementById('cfgDevPhotoInput').value.trim() || '';
storeSettings.devBio = document.getElementById('cfgDevBioInput').value.trim() || '';
storeSettings.devWhatsapp = document.getElementById('cfgDevWhatsappInput').value.trim() || '962796433698';
storeSettings.devInsta = document.getElementById('cfgDevInstaInput').value.trim() || 'https://www.instagram.com/o_yd';
safeSet('cc_store_settings', storeSettings);
applyLiveSettingsToDOM();
autoIncrementVersion();
window.showToastMsg("تم حفظ بيانات المطور");
};
function applyLiveSettingsToDOM() {
const bt = document.getElementById('dynBrandTitle');
const bs = document.getElementById('dynBrandSub');
const hl = document.getElementById('dynHeaderLogo');
if (bt) bt.innerText = storeSettings.brandTitle;
if (bs) bs.innerText = storeSettings.brandSub;
if (hl && storeSettings.logoUrl) hl.src = storeSettings.logoUrl;
const devNameEl = document.getElementById('uiDevName');
const devRoleEl = document.getElementById('uiDevRole');
const devBioEl = document.getElementById('uiDevBio');
const devPhotoEl = document.getElementById('uiDevPhoto');
const devWaBtn = document.getElementById('btnDevWhatsappLink');
const devInstaBtn = document.getElementById('btnDevInstaLink');
if (devNameEl) devNameEl.innerText = storeSettings.devName;
if (devRoleEl) devRoleEl.innerText = storeSettings.devRole;
if (devBioEl) devBioEl.innerText = storeSettings.devBio;
if (devPhotoEl && storeSettings.devPhoto) devPhotoEl.src = storeSettings.devPhoto;
if (devWaBtn) devWaBtn.href = ⁠https://wa.me/${storeSettings.devWhatsapp || '962796433698'}⁠;
if (devInstaBtn) devInstaBtn.href = storeSettings.devInsta || 'https://www.instagram.com/o_yd';
}
function renderClientOffersScreen() {
const container = document.getElementById('clientOffersListContainer');
if (!container) return;
if (!offersList.length) {
container.innerHTML = ⁠<div class="clean-card" style="text-align:center; padding:24px;">لا توجد عروض حالياً</div>⁠;
return;
}
container.innerHTML = offersList.map(o => ⁠<div class="clean-card" style="padding:0; overflow:hidden; margin-bottom:12px;"> ${o.img ?⁠<img src="${o.img}" style="width:100%; height:180px; object-fit:cover;" onerror="this.style.display='none'">⁠: ''} <div style="padding:14px;"> <div style="font-size:15px; font-weight:800; margin-bottom:4px;">${o.title}</div> <div style="font-size:12px; color:var(--text-secondary); line-height:1.5;">${o.desc}</div> </div> </div>⁠).join('');
}
function renderAdminOffersListManager() {
const container = document.getElementById('adminOffersListView');
if (!container) return;
if (!offersList.length) {
container.innerHTML = ⁠<div style="text-align:center; padding:8px; color:var(--text-secondary); font-size:12px;">لا يوجد عروض</div>⁠;
return;
}
container.innerHTML = offersList.map(o => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-light); font-size:12px;"> <div> <strong>${o.title}</strong> <div style="color:var(--text-secondary); font-size:11px;">${o.desc}</div> </div> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; color:var(--danger); border-color:var(--danger);" onclick="deleteOfferAdmin('${o.id}')">حذف</button> </div>⁠).join('');
}
window.saveNewOfferAdmin = function() {
const title = (document.getElementById('newOfferTitleInput').value || '').trim();
const desc = (document.getElementById('newOfferDescInput').value || '').trim();
const img = (document.getElementById('newOfferImgInput').value || '').trim();
if (!title) return window.showToastMsg("أدخل عنوان العرض");
offersList.unshift({ id: 'off_' + Date.now(), title, desc, img });
safeSet('cc_offers', offersList);
document.getElementById('newOfferTitleInput').value = '';
document.getElementById('newOfferDescInput').value = '';
document.getElementById('newOfferImgInput').value = '';
renderAdminOffersListManager();
autoIncrementVersion();
window.showToastMsg("تم نشر العرض");
};
window.deleteOfferAdmin = function(id) {
offersList = offersList.filter(o => o.id !== id);
safeSet('cc_offers', offersList);
renderAdminOffersListManager();
autoIncrementVersion();
window.showToastMsg("تم حذف العرض");
};
function renderAdminUsersListView() {
const container = document.getElementById('adminUsersCardsList');
if (!container) return;
const users = Object.values(registeredUsersMap);
container.innerHTML = users.map(u => ⁠<div style="padding:8px 0; border-bottom:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center; font-size:12px;"> <div> <strong>${u.name}</strong> (${u.phone}) <div style="color:var(--text-secondary); font-size:11px;">طلبات: ${u.ordersCount || 0} • ${u.isBanned ? '<span style="color:var(--danger);">محظور</span>' : '<span style="color:var(--success);">نشط</span>'}</div> </div> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; ${u.isBanned ? 'color:var(--success); border-color:var(--success);' : 'color:var(--danger); border-color:var(--danger);'}" onclick="toggleUserBanStatus('${u.id}')"> ${u.isBanned ? 'إلغاء الحظر' : 'حظر'} </button> </div>⁠).join('');
}
window.toggleUserBanStatus = function(phoneKey) {
const user = registeredUsersMap[phoneKey];
if (!user) return;
user.isBanned = !user.isBanned;
safeSet('cc_users', registeredUsersMap);
renderAdminUsersListView();
autoIncrementVersion();
window.showToastMsg("تم تعديل حالة الحظر");
};
window.saveNewPromoCode = function() {
const code = (document.getElementById('newPromoCodeInput').value || '').trim().toUpperCase();
const disc = parseFloat(document.getElementById('newPromoPercentInput').value) || 0;
if (!code || disc <= 0) return window.showToastMsg("أدخل بيانات صحيحة");
promoCodesList[code] = { code, discount: disc };
safeSet('cc_promos', promoCodesList);
autoIncrementVersion();
renderAdminPromosManager();
window.showToastMsg("تم حفظ الكود");
};
function renderAdminPromosManager() {
const container = document.getElementById('adminPromosManagerList');
if (!container) return;
container.innerHTML = Object.values(promoCodesList).map(p => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-light); font-size:12px;"> <strong>${p.code} (${p.discount}%)</strong> <button class="btn-brand-outline" style="padding:2px 6px; font-size:10.5px; color:var(--danger); border-color:var(--danger);" onclick="deletePromoCode('${p.code}')">حذف</button> </div>⁠).join('');
}
window.deletePromoCode = function(c) {
delete promoCodesList[c];
safeSet('cc_promos', promoCodesList);
autoIncrementVersion();
renderAdminPromosManager();
window.showToastMsg("تم حذف الكود");
};
function calculateRealAnalyticsAndDraw() {
const realOrders = activeOrdersList;
const totalOrdersCount = realOrders.length;
const totalSalesRevenue = realOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
const avgTicket = totalOrdersCount > 0 ? (totalSalesRevenue / totalOrdersCount) : 0;
const rRev = document.getElementById('statRealRevenue');
const rOrd = document.getElementById('statRealOrdersCount');
const rAvg = document.getElementById('statRealAverageTicket');
if (rRev) rRev.innerText = ⁠${totalSalesRevenue.toFixed(2)} د.أ⁠;
if (rOrd) rOrd.innerText = ⁠${totalOrdersCount}⁠;
if (rAvg) rAvg.innerText = ⁠${avgTicket.toFixed(2)} د.أ⁠;
const canvas1 = document.getElementById('salesWeeklyChartCanvas');
if (canvas1) {
const ctx = canvas1.getContext('2d');
const dpr = window.devicePixelRatio || 1;
const w = canvas1.clientWidth || 480;
const h = canvas1.clientHeight || 160;
canvas1.width = w * dpr;
canvas1.height = h * dpr;
ctx.scale(dpr, dpr);
ctx.clearRect(0, 0, w, h);
const days = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
const values = [0, 0, 0, 0, 0, 0, 0];
realOrders.forEach(o => {
const d = new Date(o.dateStr || Date.now()).getDay();
const mappedIdx = (d + 1) % 7;
values[mappedIdx] += (o.totalAmount || 0);
});
const max = Math.max(...values, 10);
const padding = 20;
const plotW = w - padding * 2;
const plotH = h - padding * 2;
const stepX = plotW / (values.length - 1);
const pts = values.map((val, idx) => ({
x: padding + idx * stepX,
y: h - padding - (val / max) * plotH
}));
ctx.beginPath();
ctx.moveTo(pts[0].x, pts[0].y);
for (let i = 1; i < pts.length; i++) {
const xc = (pts[i].x + pts[i-1].x) / 2;
const yc = (pts[i].y + pts[i-1].y) / 2;
ctx.quadraticCurveTo(pts[i-1].x, pts[i-1].y, xc, yc);
}
ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
ctx.strokeStyle = '#c59b63';
ctx.lineWidth = 2;
ctx.stroke();
pts.forEach((p, idx) => {
ctx.beginPath();
ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
ctx.fillStyle = '#c59b63';
ctx.fill();
ctx.fillStyle = '#888';
ctx.font = '10px Tajawal';
ctx.textAlign = 'center';
ctx.fillText(days[idx], p.x, h - 4);
});
}
}
document.addEventListener('DOMContentLoaded', () => {
if (localStorage.getItem('cc_theme') === 'dark') document.body.classList.add('dark-mode');
updateVersionBadgeUI();
applyLiveSettingsToDOM();
updateBranchStatusBadges();
window.renderCategoryChips();
window.renderMenuProducts();
updateClientSessionState();
refreshCartDockStatus();
setInterval(updateBranchStatusBadges, 60000);
});
