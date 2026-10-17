/* =========================================================
   COFFEE CORNER PRO — CORE ENGINE (ENTERPRISE EDITION 8.5)
   - حل تداخل الشاشات نهائياً
   - تفعيل الأونلاين المباشر عبر Firestore
   - صوت رنين إنذار قوي ومتناغم وعالي للأدمن فقط
   ========================================================= */

const DEV_USER = 'omar';
const SHOP_USER = 'corner';
const ENCRYPTED_MASTER_PIN_HASH = "68b556093d5089fa2d9d968b5f39611b8166c3c544e97efeb4aa27c8d9fb82d0"; // PIN: 2001159393

// ---------------------------------------------------------
// إعداد Firebase Firestore السحابي (Live Online Realtime)
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

const DEFAULT_SAUCES = [
    { name: "نوتيلا", price: 0.50 },
    { name: "لوتس", price: 0.75 },
    { name: "أوريو", price: 0.50 },
    { name: "كيندر بوينو", price: 0.75 },
    { name: "بستاشيو", price: 1.00 }
];

const DEFAULT_SETTINGS = {
    brandTitle: "كافيه كورنر",
    brandSub: "أشهى الكوكتيلات والحلويات الفاخرة",
    brandLogo: "./logo.png",
    devName: "المهندس عمر عبيدات",
    devRole: "Lead Systems Architect & Full-Stack Engineer",
    devBio: "تم تخطيط وتطوير بنية النظام الرقمي الشامل لتقديم تجربة حجز وطلب ذكية فورية مع معالجة QR الطاولات، والطلب الجماعي، وتحليلات المبيعات الدقيقة.",
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

// الحالة العامة
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
let isThemeDark = safeGet('cc_theme_dark', true);
let isAdminSoundEnabled = safeGet('cc_admin_sound', true);
let saucesCatalog = safeGet('cc_sauces', DEFAULT_SAUCES);
let townsBranches = safeGet('cc_towns', BRANCHES_DATA);
let userNotifications = safeGet('cc_user_notifs', []);
let groupSessionsMap = safeGet('cc_groups', {});
let branchPaymentsList = safeGet('cc_branch_payments', [
    { id: "pay_1", branch: "0", name: "كليك (Orange Money)", num: "0770155906" },
    { id: "pay_2", branch: "1", name: "كليك (Zain Cash)", num: "0790155906" },
    { id: "pay_3", branch: "all", name: "دفع نقدي (كاش)", num: "عند الاستلام أو بالفرع" }
]);
let promoCodesCatalog = safeGet('cc_promos', {
    "CORNER10": { code: "CORNER10", discount: 10, isActive: true, minOrder: 0, usedCount: 3 },
    "OMAR20": { code: "OMAR20", discount: 20, isActive: true, minOrder: 5.0, usedCount: 8 }
});

// ---------------------------------------------------------
// صوت رنين الطلبات الجديد: عالي، قوي، متتابع، ومخصص للأدمن فقط
// ---------------------------------------------------------
function playLoudOrderChime() {
    // يعمل فقط وحصرياً إذا كان الأدمن مسجل دخوله ومفعل الصوت
    if (!activeSessionUser || !isAdminSoundEnabled) return;

    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        // نغمة رنين متعددة الطبقات وعالية الشدة (Loud Triple Chime)
        const notes = [
            { freq: 659.25, time: 0.0, dur: 0.22 }, // E5
            { freq: 880.00, time: 0.22, dur: 0.25 }, // A5
            { freq: 1046.50, time: 0.45, dur: 0.40 }, // C6
            { freq: 1318.51, time: 0.85, dur: 0.55 }  // E6 (High Alert Tone)
        ];

        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "triangle"; // نغمة واضحة وقوية الاختراق
            osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

            // تضخيم الصوت للدرجة القصوى المريحة
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
setInterval(purgeCompletedOrdersAfter15Minutes, 25000);

// ---------------------------------------------------------
// مزامنة السحابة اللحظية (Firestore Real-Time Online Sync)
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

                    // رنين قوي عند وصول أي طلب جديد للأدمن
                    if (activeSessionUser && cloudOrders.length > prevCount) {
                        playLoudOrderChime();
                        window.showToastMsg("وصل طلب جديد للمحل الآن!");
                    }

                    if (activeSessionUser) {
                        renderAdminLiveOrdersManager();
                        renderAdminAnalyticsReports();
                    }

                    const curTrackedId = localStorage.getItem('cc_latest_order_id');
                    if (curTrackedId) renderClientOrderTrackingView();
                }
            }, err => console.warn("Firestore Listener Error:", err));
    } catch(e) {}
}

// ---------------------------------------------------------
// توجيه الشاشات ومنع التداخل الصارم (Strict Routing)
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
    // إخفاء كل الشاشات بدون استثناء لمنع التداخل
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(s => {
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
        window.renderMenuProducts();
        refreshCartDockStatus();
    } else if (screenId === 'screen-order-tracking') {
        renderClientOrderTrackingView();
    } else if (screenId === 'screen-user-profile') {
        renderClientProfileScreen();
    } else if (screenId === 'screen-notifications') {
        renderCustomerNotificationsList();
    } else if (screenId === 'screen-referrals') {
        renderReferralsScreen();
    } else if (screenId === 'screen-group-order') {
        renderGroupOrderScreen();
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
// فحص روابط الطاولة والجروب من الـ URL
// ---------------------------------------------------------
function checkUrlTableAndGroupParams() {
    const params = new URLSearchParams(window.location.search);
    const tableNum = params.get('table');
    const branchParam = params.get('branch');
    const refCode = params.get('ref');
    const groupCode = params.get('group');

    if (tableNum) {
        window.appState.activeTable = parseInt(tableNum);
        window.appState.deliveryMode = "table";
        if (branchParam !== null) {
            window.appState.cartBranch = parseInt(branchParam) || 0;
        }
        const lbl = document.getElementById('lblActiveTableNum');
        if (lbl) lbl.innerText = `طاولة رقم ${tableNum}`;
        const banner = document.getElementById('tableActiveBanner');
        if (banner) banner.style.display = 'flex';
        window.showToastMsg(`أهلاً بك! تم ربط طلبك بطاولة رقم ${tableNum}`);
    }

    if (refCode) {
        localStorage.setItem('cc_pending_ref', refCode);
        const refInput = document.getElementById('authInputRefCode');
        if (refInput) refInput.value = refCode;
    }

    if (groupCode) {
        joinExistingGroupSession(groupCode);
    }
}

window.clearActiveTableMode = function() {
    window.appState.activeTable = null;
    window.appState.deliveryMode = "delivery";
    document.getElementById('tableActiveBanner').style.display = 'none';
    window.showToastMsg("تم إلغاء وضع الطاولة");
};

window.generateTableQrUrlAction = function() {
    const branch = document.getElementById('qrBranchPickSelect').value;
    const tableNum = (document.getElementById('qrTableNumInput').value || '').trim();
    if (!tableNum) return window.showToastMsg("يرجى كتابة رقم الطاولة أولاً");

    const baseUrl = window.location.origin + window.location.pathname;
    const targetUrl = `${baseUrl}?table=${tableNum}&branch=${branch}`;
    const box = document.getElementById('boxGeneratedQrResult');
    box.style.display = 'block';
    box.innerHTML = `
        <div style="background:var(--bg-elevated); padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-accent);">
            <div><strong>رابط الطاولة المباشر:</strong></div>
            <a href="${targetUrl}" target="_blank" style="color:var(--brand-gold); word-break:break-all;">${targetUrl}</a>
            <div style="margin-top:6px;">
                <button class="btn-brand-outline" style="padding:4px 8px; font-size:11px;" onclick="navigator.clipboard.writeText('${targetUrl}'); window.showToastMsg('تم نسخ الرابط للطباعة');">نسخ الرابط</button>
            </div>
        </div>
    `;
    window.showToastMsg("تم توليد رابط الطاولة");
};

// ---------------------------------------------------------
// طلب جماعي (Group Order)
// ---------------------------------------------------------
window.createNewGroupSession = function() {
    const name = (document.getElementById('newGroupNameInput').value || '').trim() || "جلسة شباب الكورنر";
    const groupCode = "GRP-" + Math.floor(1000 + Math.random() * 9000);
    const creatorName = activeClientSession ? activeClientSession.name : "المنظم";

    const newGroup = {
        code: groupCode,
        title: name,
        creator: creatorName,
        createdAt: Date.now(),
        items: []
    };

    groupSessionsMap[groupCode] = newGroup;
    safeSet('cc_groups', groupSessionsMap);
    joinExistingGroupSession(groupCode);
    window.showToastMsg("تم بدء جلسة الطلب الجماعي بنجاح!");
};

function joinExistingGroupSession(groupCode) {
    const grp = groupSessionsMap[groupCode];
    if (!grp) return;
    window.appState.activeGroupCode = groupCode;
    window.appState.activeGroupName = grp.title;

    const lbl = document.getElementById('lblActiveGroupName');
    if (lbl) lbl.innerText = grp.title;
    const banner = document.getElementById('groupActiveBanner');
    if (banner) banner.style.display = 'flex';
    document.getElementById('boxCreateGroupBtn').style.display = 'none';
    document.getElementById('boxActiveGroupInfo').style.display = 'block';
    document.getElementById('lblActiveGroupTitle').innerText = `${grp.title} (#${grp.code})`;
    renderGroupSessionParticipantsList();
}

function renderGroupSessionParticipantsList() {
    const grp = groupSessionsMap[window.appState.activeGroupCode];
    const container = document.getElementById('groupParticipantsItemsList');
    if (!grp || !container) return;

    if (!grp.items.length) {
        container.innerHTML = `<div style="text-align:center; padding:12px; font-size:12px; color:var(--text-secondary);">لا توجد مشروبات مضافة بالجلسة بعد. أضف طلبك من المنيو!</div>`;
        return;
    }

    container.innerHTML = grp.items.map(it => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--border-subtle); font-size:12.5px;">
            <div>
                <strong>${it.member}:</strong> ${it.qty}x ${it.name} ${it.notes ? `(${it.notes})` : ''}
            </div>
            <div class="num-font" style="font-weight:900; color:var(--brand-gold);">${it.lineTotal.toFixed(2)} د.أ</div>
        </div>
    `).join('') + `
        <button class="btn-brand-solid" style="width:100%; margin-top:10px;" onclick="convertGroupItemsToCart()">
            نقل طلبات الجلسة للسلة لتأكيدها
        </button>
    `;
}

window.convertGroupItemsToCart = function() {
    const grp = groupSessionsMap[window.appState.activeGroupCode];
    if (!grp || !grp.items.length) return;

    window.appState.cart.push(...grp.items);
    safeSet('cc_cart', window.appState.cart);
    refreshCartDockStatus();
    window.showToastMsg("تم تجميع طلبات الأصدقاء بالسلة!");
    window.navigateRouter('screen-cart');
};

window.copyGroupShareLink = function() {
    if (!window.appState.activeGroupCode) return;
    const url = `${window.location.origin}${window.location.pathname}?group=${window.appState.activeGroupCode}`;
    navigator.clipboard.writeText(url);
    window.showToastMsg("تم نسخ رابط الجلسة");
};

// ---------------------------------------------------------
// نظام الإحالات
// ---------------------------------------------------------
function renderReferralsScreen() {
    const linkLbl = document.getElementById('lblUserReferralLink');
    const container = document.getElementById('userReferralInvitedList');
    if (!activeClientSession) {
        if (linkLbl) linkLbl.innerText = "سجّل دخولك أولاً";
        if (container) container.innerHTML = `<div style="text-align:center; padding:16px; font-size:12px; color:var(--text-secondary);">يرجى تسجيل الدخول لتفعيل رابط إحالتك.</div>`;
        return;
    }

    const myCode = activeClientSession.phone;
    const fullLink = `${window.location.origin}${window.location.pathname}?ref=${myCode}`;
    if (linkLbl) linkLbl.innerText = fullLink;

    const myInvited = Object.values(registeredUsersMap).filter(u => u.referredBy === myCode);
    if (!myInvited.length) {
        container.innerHTML = `<div style="text-align:center; padding:16px; font-size:12px; color:var(--text-secondary);">لم ينضم أي صديق عبر رابطك بعد. شارك الرابط وابدأ الربح!</div>`;
    } else {
        container.innerHTML = myInvited.map(u => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--border-subtle); font-size:12.5px;">
                <div>
                    <strong>${u.name}</strong>
                    <div style="font-size:11px; color:var(--text-secondary);">${u.ordersCount > 0 ? 'أتم أول طلب مؤهل ✓' : 'مسجل وبانتظار أول طلب'}</div>
                </div>
                <div style="font-weight:900; color:${u.ordersCount > 0 ? 'var(--status-success)' : 'var(--text-secondary)'}; font-size:11.5px;">
                    ${u.ordersCount > 0 ? '+15 نقطة تم كسبها' : 'معلق'}
                </div>
            </div>
        `).join('');
    }
}

window.copyReferralLink = function() {
    if (!activeClientSession) {
        window.showToastMsg("يرجى تسجيل الدخول أولاً");
        window.navigateRouter('screen-user-auth');
        return;
    }
    const fullLink = `${window.location.origin}${window.location.pathname}?ref=${activeClientSession.phone}`;
    navigator.clipboard.writeText(fullLink);
    window.showToastMsg("تم نسخ رابط الدعوة الخاص بك!");
};

// ---------------------------------------------------------
// مركز إشعارات الزبون
// ---------------------------------------------------------
function pushCustomerNotification(title, message, type = 'info') {
    const newNotif = {
        id: "notif_" + Date.now(),
        title: title,
        message: message,
        type: type,
        isRead: false,
        time: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
    };
    userNotifications.unshift(newNotif);
    safeSet('cc_user_notifs', userNotifications);
    updateNotificationBellBadge();
}

function updateNotificationBellBadge() {
    const unreadCount = userNotifications.filter(n => !n.isRead).length;
    const badge = document.getElementById('unreadNotifCountBadge');
    if (badge) {
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function renderCustomerNotificationsList() {
    const container = document.getElementById('customerNotificationsList');
    if (!container) return;

    if (!userNotifications.length) {
        container.innerHTML = `
            <div class="clean-card" style="text-align:center; padding:36px 16px;">
                <div style="font-size:32px; margin-bottom:8px;">🔔</div>
                <div style="font-weight:900; font-size:15px; margin-bottom:4px; color:var(--brand-gold);">لا توجد إشعارات جديدة</div>
                <div style="font-size:12px; color:var(--text-secondary);">ستصلك هنا تحديثات فورية حول حالة طلباتك ومكافآتك.</div>
            </div>
        `;
        return;
    }

    container.innerHTML = userNotifications.map(n => `
        <div class="clean-card" style="margin-bottom:8px; border-color:${n.isRead ? 'var(--border-subtle)' : 'var(--brand-gold)'};">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:900; font-size:13.5px; color:${n.isRead ? 'var(--text-primary)' : 'var(--brand-gold)'};">${n.title}</span>
                <span class="num-font" style="font-size:10.5px; color:var(--text-secondary);">${n.time}</span>
            </div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:4px; line-height:1.5;">${n.message}</div>
        </div>
    `).join('');
}

window.markAllNotificationsAsRead = function() {
    userNotifications.forEach(n => n.isRead = true);
    safeSet('cc_user_notifs', userNotifications);
    updateNotificationBellBadge();
    renderCustomerNotificationsList();
    window.showToastMsg("تم تحديد جميع الإشعارات كمقروءة");
};

// ---------------------------------------------------------
// المنيو والتصنيفات وتخصيص الأصناف
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
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 36px 12px; color: var(--text-secondary); font-size: 13px;">لا توجد أصناف مطابقة للبحث</div>`;
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
                    <div class="btn-add-mini">${p.isAvailable === false ? 'غير متوفر' : 'إضافة +'}</div>
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
        window.showToastMsg("الحد الأقصى 3 نكهات لمكس الحلويات");
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
            unitPrice += Math.max(...checkedSauces.map(s => s.price));
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
    const currentMemberName = activeClientSession ? activeClientSession.name : "أنا";

    const itemObj = {
        id: "c_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        productId: p.id,
        name: p.name,
        category: p.category,
        qty: window.appState.productModalQty,
        sizeName: sizeTitle,
        sauceName: sauceTitle,
        unitPrice: unitPrice,
        notes: notes,
        member: currentMemberName,
        lineTotal: unitPrice * window.appState.productModalQty
    };

    if (window.appState.activeGroupCode && groupSessionsMap[window.appState.activeGroupCode]) {
        groupSessionsMap[window.appState.activeGroupCode].items.push(itemObj);
        safeSet('cc_groups', groupSessionsMap);
        window.showToastMsg("تمت إضافة مشروبك لجلسة الطلب الجماعي!");
        window.navigateRouter('screen-group-order');
        return;
    }

    window.appState.cart.push(itemObj);
    safeSet('cc_cart', window.appState.cart);
    refreshCartDockStatus();
    window.showToastMsg("تمت الإضافة إلى سلة المشتريات");
    window.navigateRouter('screen-home');
};

// ---------------------------------------------------------
// السلة وتأكيد الطلب
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
                <div style="font-weight:900; font-size:13.5px;">${item.qty}x ${item.name}</div>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                    ${item.sizeName !== 'قياسي' ? `الحجم: ${item.sizeName} | ` : ''}
                    ${item.sauceName ? `النكهة: ${item.sauceName} | ` : ''}
                    ${item.member ? `الطلب لـ: <strong>${item.member}</strong> | ` : ''}
                    ${item.notes ? `ملاحظة: ${item.notes}` : ''}
                </div>
            </div>
            <div style="text-align:left;">
                <div class="num-font" style="font-weight:900; color:var(--brand-gold);">${item.lineTotal.toFixed(2)} د.أ</div>
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
    document.getElementById('btnModeTable').classList.toggle('active', mode === 'table');

    document.getElementById('deliveryFieldsArea').style.display = (mode === 'delivery') ? 'block' : 'none';
    document.getElementById('tableFieldsArea').style.display = (mode === 'table') ? 'block' : 'none';
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
            <div>
                <div style="font-size:13px; font-weight:800;">${m.name}</div>
                <div class="num-font" style="font-size:11px; color:var(--text-secondary);">${m.num}</div>
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
        document.getElementById('promoSuccessDesc').innerText = `تم تفعيل خصم ${promo.discount}% بنجاح (${promo.code})`;
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
// إرسال الطلب (أونلاين سحابي + تتبع)
// ---------------------------------------------------------
window.dispatchOrderAndInitiateTracking = function() {
    if (!window.appState.cart.length) {
        return window.showToastMsg("سلة المشتريات فارغة، أضف بعض الأصناف أولاً");
    }

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

    let addressText = 'استلام من الفرع';
    if (window.appState.deliveryMode === 'delivery') {
        addressText = document.getElementById('cartAddressInput').value || 'العنوان المعتاد';
    } else if (window.appState.deliveryMode === 'table') {
        const tNum = document.getElementById('cartTableNumberInput').value || window.appState.activeTable || "طاولة بالصالة";
        addressText = `طاولة رقم: ${tNum}`;
    }

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
        status: 'received',
        createdAt: nowMs,
        completedAt: null,
        timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
        dateStr: new Date().toISOString().slice(0, 10)
    };

    // حفظ سحابي أونلاين ومحلي
    if (cloudDb) {
        cloudDb.collection('orders').doc(orderNumber).set(newOrderObj).catch(err => console.warn("Cloud save error:", err));
    }
    activeOrdersList.unshift(newOrderObj);
    safeSet('cc_orders', activeOrdersList);
    localStorage.setItem('cc_latest_order_id', orderNumber);

    // مكافأة الإحالة عند أول طلب مؤهل
    if ((activeUser.ordersCount || 0) === 0 && activeUser.referredBy) {
        const inviterKey = 'u_' + activeUser.referredBy;
        if (registeredUsersMap[inviterKey]) {
            registeredUsersMap[inviterKey].loyaltyPoints = (registeredUsersMap[inviterKey].loyaltyPoints || 0) + 15;
            activeUser.loyaltyPoints = (activeUser.loyaltyPoints || 0) + 15;
            pushCustomerNotification("مكافأة إحالة مكتملة! 🎁", `حصلت أنت وصديقك على 15 نقطة ولاء مجانية بعد إتمام أول طلب مؤهل!`, 'reward');
        }
    }

    activeUser.ordersCount = (activeUser.ordersCount || 0) + 1;
    activeUser.totalSpent = parseFloat(((activeUser.totalSpent || 0) + total).toFixed(2));
    activeUser.loyaltyPoints = (activeUser.loyaltyPoints || 0) + Math.floor(total);
    registeredUsersMap['u_' + activeUser.phone] = activeUser;
    safeSet('cc_users', registeredUsersMap);

    pushCustomerNotification("تم استلام طلبك بنجاح ☕", `طلبك رقم #${orderNumber} وصل للفرع وبدأ الباريستا بالتجهيز.`, 'order');

    window.appState.cart = [];
    localStorage.removeItem('cc_cart');
    refreshCartDockStatus();

    // تشغيل الرنين للأدمن
    playLoudOrderChime();

    // تجهيز رسالة الواتساب
    let msg = `*طلب جديد | ${storeSettings.brandTitle}*\n`;
    msg += `رقم الطلب: ${orderNumber}\n`;
    msg += `الفرع: ${branch.name}\n`;
    msg += `العميل: ${activeUser.name} (${activeUser.phone})\n`;
    msg += `نوع الاستلام: ${newOrderObj.deliveryMode === 'delivery' ? 'توصيل' : newOrderObj.deliveryMode === 'table' ? `طاولة بالصالة (${addressText})` : 'استلام من الفرع'}\n`;
    msg += `----------------\n`;
    newOrderObj.items.forEach((it, idx) => {
        msg += `${idx + 1}. *${it.qty}x ${it.name}* ${it.sizeName !== 'قياسي' ? `(${it.sizeName})` : ''} ${it.sauceName ? `[${it.sauceName}]` : ''} ${it.member ? `{${it.member}}` : ''} - ${it.lineTotal.toFixed(2)} د.أ\n`;
    });
    msg += `----------------\n`;
    msg += `المجموع النهائي: ${total.toFixed(2)} د.أ\n`;
    msg += `طريقة الدفع: ${payStr}\n`;
    if (newOrderObj.deliveryMode === 'delivery') msg += `العنوان: ${newOrderObj.address}\n`;

    window.open(`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    openDigitalReceiptModal(newOrderObj);
};

function openDigitalReceiptModal(order) {
    if (!order) return;
    document.getElementById('recBrandTitle').innerText = storeSettings.brandTitle;
    document.getElementById('recOrderId').innerText = `#${order.orderId}`;
    document.getElementById('recTimestamp').innerText = `${order.dateStr} • ${order.timestamp}`;
    document.getElementById('recClientName').innerText = order.customerName;
    document.getElementById('recClientPhone').innerText = order.customerPhone;
    document.getElementById('recBranchName').innerText = order.branchName;
    document.getElementById('recDeliveryMode').innerText = order.deliveryMode === 'delivery' ? 'توصيل' : order.deliveryMode === 'table' ? 'بالصالة (طاولة)' : 'استلام من الفرع';
    document.getElementById('recAddressLine').innerText = order.address;
    document.getElementById('recPayMethod').innerText = order.payMethod;

    const itemsCont = document.getElementById('recItemsListLines');
    itemsCont.innerHTML = order.items.map(it => `
        <div style="display:flex; justify-content:space-between; font-size:12px; padding:4px 0; border-bottom:1px solid #f0eae1;">
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

window.downloadReceiptAsImage = function() {
    const card = document.getElementById('receiptRenderableCard');
    if (!card) return;
    window.showToastMsg("جاري حفظ الفاتورة كصورة...");
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#c59b63";
    ctx.fillRect(0, 0, canvas.width, 10);

    ctx.fillStyle = "#1a1714";
    ctx.font = "bold 32px Tajawal, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(storeSettings.brandTitle, canvas.width / 2, 70);

    const ordId = document.getElementById('recOrderId').innerText;
    ctx.fillStyle = "#c59b63";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(ordId, canvas.width / 2, 120);

    ctx.textAlign = "right";
    ctx.fillStyle = "#1a1714";
    ctx.font = "20px Tajawal, sans-serif";
    let y = 180;
    ctx.fillText(`العميل: ${document.getElementById('recClientName').innerText}`, 650, y);
    y += 35;
    ctx.fillText(`الفرع: ${document.getElementById('recBranchName').innerText}`, 650, y);
    y += 35;
    ctx.fillText(`الاستلام: ${document.getElementById('recDeliveryMode').innerText}`, 650, y);
    y += 45;
    ctx.fillText(`المجموع الإجمالي: ${document.getElementById('recTotalAmount').innerText}`, 650, y);

    const link = document.createElement('a');
    link.download = `Receipt_${ordId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    window.showToastMsg("تم حفظ الفاتورة بنجاح");
};

// تتبع الطلب
function renderClientOrderTrackingView() {
    const container = document.getElementById('activeOrderTrackingView');
    if (!container) return;

    const latestId = localStorage.getItem('cc_latest_order_id');
    const order = activeOrdersList.find(o => o.orderId === latestId);

    if (!order) {
        container.innerHTML = `
            <div class="clean-card" style="text-align:center; padding:36px 16px;">
                <div style="font-size:32px; margin-bottom:8px;">📦</div>
                <div style="font-weight:900; font-size:15px; margin-bottom:6px; color:var(--brand-gold);">لا يوجد طلب نشط حالياً</div>
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:14px;">عند إرسال طلب ستتمكن من متابعة مراحله هنا خطوة بخطوة.</div>
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
                        <div style="display:flex; gap:12px; position:relative; padding-bottom:18px;">
                            ${idx < stages.length - 1 ? `<div style="position:absolute; top:20px; right:11px; width:2px; height:calc(100% - 14px); background:${isDone && idx < curIdx ? 'var(--brand-gold)' : 'var(--border-subtle)'};"></div>` : ''}
                            <div style="width:24px; height:24px; border-radius:50%; background:${isDone ? 'var(--brand-gold)' : 'var(--bg-elevated)'}; color:${isDone ? '#000' : 'var(--text-secondary)'}; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:900; z-index:2; flex-shrink:0;">
                                ${isDone ? '✓' : idx + 1}
                            </div>
                            <div>
                                <div style="font-size:13.5px; font-weight:900; color:${isCurrent ? 'var(--brand-gold)' : 'var(--text-primary)'};">${st.title}</div>
                                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${st.desc}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <button class="btn-brand-solid" style="width:100%; margin-top:6px;" onclick="openDigitalReceiptModal(activeOrdersList.find(x => x.orderId === '${order.orderId}'))">
                عرض الفاتورة الإلكترونية
            </button>
        </div>
    `;
}

// ---------------------------------------------------------
// حساب الزبون
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
    if (!pin || pin.length < 3) return err.innerText = 'رمز المرور لا يقل عن 3 خانات';

    const phoneKey = 'u_' + phone;
    const isRegister = document.getElementById('authRegisterExtraFields').style.display === 'flex';

    if (isRegister) {
        const name = (document.getElementById('authInputName').value || '').trim();
        const address = (document.getElementById('authInputAddress').value || '').trim();
        const refCode = (document.getElementById('authInputRefCode').value || localStorage.getItem('cc_pending_ref') || '').trim();

        if (!name) return err.innerText = 'يرجى كتابة الاسم';

        const newUser = {
            id: phoneKey,
            name: name,
            phone: phone,
            pin: pin,
            address: address,
            ordersCount: 0,
            totalSpent: 0.0,
            loyaltyPoints: 10,
            referredBy: refCode !== phone ? refCode : null,
            isBanned: false
        };

        registeredUsersMap[phoneKey] = newUser;
        safeSet('cc_users', registeredUsersMap);

        activeClientSession = { phone, name, address };
        safeSet('cc_client_session', activeClientSession);

        updateClientSessionFields();
        pushCustomerNotification("أهلاً بك في كافيه كورنر! ✨", "حصلت على 10 نقاط ترحيبية فور تسجيل حسابك.", 'reward');
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

    const pts = user.loyaltyPoints || 0;
    const tierBadge = document.getElementById('profTierBadge');
    if (pts >= 100) tierBadge.innerText = "عضوية ذهبية VIP";
    else if (pts >= 40) tierBadge.innerText = "عضوية فضية مميزة";
    else tierBadge.innerText = "عضوية برونزية";

    // الشارات
    const badgesCont = document.getElementById('profUserBadgesGrid');
    const userOrders = user.ordersCount || 0;
    let unlockedCount = 0;

    badgesCont.innerHTML = badgesList.map(b => {
        const isUnlocked = userOrders >= (b.requiredOrders || 1);
        if (isUnlocked) unlockedCount++;
        return `
            <div style="background:var(--bg-surface); padding:10px; border-radius:var(--radius-sm); border:1px solid ${isUnlocked ? 'var(--brand-gold)' : 'var(--border-subtle)'}; opacity:${isUnlocked ? '1' : '0.5'}; text-align:center;">
                <div style="font-size:22px;">${b.icon}</div>
                <div style="font-size:12px; font-weight:800; color:var(--text-primary); margin-top:2px;">${b.name}</div>
                <div style="font-size:9.5px; color:var(--text-secondary);">${isUnlocked ? 'مكتملة ✓' : b.criteria}</div>
            </div>
        `;
    }).join('');

    document.getElementById('profUnlockedBadgesCount').innerText = `${unlockedCount} مكتملة`;

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
                <div class="num-font" style="font-weight:900; color:var(--brand-gold);">${o.totalAmount.toFixed(2)} د.أ</div>
            </div>
        `).join('');
    }
}

window.saveUpdatedClientProfile = function() {
    if (!activeClientSession) return;
    const phoneKey = 'u_' + activeClientSession.phone;
    const name = (document.getElementById('profEditName').value || '').trim();
    const address = (document.getElementById('profEditAddress').value || '').trim();
    if (!name) return window.showToastMsg("يرجى كتابة الاسم");

    if (registeredUsersMap[phoneKey]) {
        registeredUsersMap[phoneKey].name = name;
        registeredUsersMap[phoneKey].address = address;
        safeSet('cc_users', registeredUsersMap);
    }

    activeClientSession.name = name;
    activeClientSession.address = address;
    safeSet('cc_client_session', activeClientSession);

    updateClientSessionFields();
    renderClientProfileScreen();
    window.showToastMsg("تم حفظ التعديلات");
};

// ---------------------------------------------------------
// إدارة الأدمن (The 6 Pillars Hub)
// ---------------------------------------------------------
window.openAdminSubSection = function(sectionKey) {
    document.getElementById('adminMainHubView').style.display = 'none';
    document.querySelectorAll('.admin-sub-view').forEach(v => v.classList.remove('active'));

    const sub = document.getElementById('subView-' + sectionKey);
    if (sub) sub.classList.add('active');

    if (sectionKey === 'orders') renderAdminLiveOrdersManager();
    if (sectionKey === 'products') renderAdminMenuProductsList();
    if (sectionKey === 'coupons') renderAdminPromosList();
    if (sectionKey === 'loyalty') renderAdminBadgesManager();
    if (sectionKey === 'customers') renderAdminCustomerAccountsList();
    if (sectionKey === 'reports') renderAdminAnalyticsReports();
};

window.backToAdminMainHub = function() {
    document.querySelectorAll('.admin-sub-view').forEach(v => v.classList.remove('active'));
    document.getElementById('adminMainHubView').style.display = 'block';
    const countBadge = document.getElementById('badgeHubLiveOrdersCount');
    if (countBadge) countBadge.innerText = activeOrdersList.length;
};

// إدارة الطلبات الحية للأدمن
function renderAdminLiveOrdersManager() {
    const container = document.getElementById('adminLiveOrdersContainer');
    const countBadge = document.getElementById('adminActiveOrdersCount');
    if (!container) return;

    if (countBadge) countBadge.innerText = `${activeOrdersList.length} طلب`;

    if (!activeOrdersList.length) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-secondary); font-size:12px;">لا توجد طلبات واردة حالياً</div>`;
        return;
    }

    container.innerHTML = activeOrdersList.map(o => `
        <div class="admin-order-box ${o.status === 'received' ? 'new-received' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="num-font" style="font-weight:900; color:var(--brand-gold);">#${o.orderId}</span>
                <span style="font-size:11px; color:var(--text-secondary);">${o.branchName} • ${o.timestamp}</span>
            </div>
            <div style="font-size:12.5px; margin-bottom:6px;">
                <strong>${o.customerName}</strong> (${o.customerPhone})<br>
                <span style="font-size:11px; color:var(--text-secondary);">العنوان / الطاولة: ${o.address}</span>
            </div>
            <div style="background:var(--bg-card); padding:8px; border-radius:var(--radius-sm); font-size:11.5px; margin-bottom:8px;">
                ${o.items.map(it => `<div>• ${it.qty}x ${it.name} ${it.notes ? `(${it.notes})` : ''}</div>`).join('')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="num-font" style="font-weight:900; color:var(--brand-gold);">${o.totalAmount.toFixed(2)} د.أ</span>
                <div style="display:flex; gap:6px;">
                    <select class="ios-input-field" style="padding:4px 8px; font-size:11px; width:auto;" onchange="updateOrderStatusAction('${o.orderId}', this.value)">
                        <option value="received" ${o.status === 'received' ? 'selected' : ''}>استلام</option>
                        <option value="preparing" ${o.status === 'preparing' ? 'selected' : ''}>تحضير</option>
                        <option value="on_the_way" ${o.status === 'on_the_way' ? 'selected' : ''}>في الطريق</option>
                        <option value="ready_pickup" ${o.status === 'ready_pickup' ? 'selected' : ''}>جاهز</option>
                        <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>مكتمل ✓</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

window.updateOrderStatusAction = function(orderId, newStatus) {
    const o = activeOrdersList.find(x => x.orderId === orderId);
    if (!o) return;

    o.status = newStatus;
    if (newStatus === 'completed') {
        o.completedAt = Date.now();
    }

    if (cloudDb) {
        cloudDb.collection('orders').doc(orderId).update({
            status: newStatus,
            completedAt: o.completedAt
        }).catch(e => console.warn(e));
    }

    safeSet('cc_orders', activeOrdersList);
    window.showToastMsg(`تم تحديث حالة الطلب إلى: ${newStatus}`);
    renderAdminLiveOrdersManager();
};

// لوحة التحليلات
function renderAdminAnalyticsReports() {
    const allOrders = activeOrdersList;
    const netRev = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalDiscs = allOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
    const avgOrder = allOrders.length > 0 ? (netRev / allOrders.length) : 0;

    const phones = allOrders.map(o => o.customerPhone).filter(Boolean);
    const repeatCount = phones.filter((item, index) => phones.indexOf(item) !== index).length;
    const returningRate = phones.length > 0 ? Math.round((repeatCount / phones.length) * 100) : 0;

    const repNet = document.getElementById('repNetRevenue');
    const repAvg = document.getElementById('repAvgOrderValue');
    const repRet = document.getElementById('repReturningRate');
    const repDisc = document.getElementById('repTotalDiscounts');

    if (repNet) repNet.innerText = `${netRev.toFixed(2)} د.أ`;
    if (repAvg) repAvg.innerText = `${avgOrder.toFixed(2)} د.أ`;
    if (repRet) repRet.innerText = `${returningRate}%`;
    if (repDisc) repDisc.innerText = `${totalDiscs.toFixed(2)} د.أ`;

    const b0Count = allOrders.filter(o => o.branchId === 0 || o.branchName === "كفرسوم").length;
    const b1Count = allOrders.filter(o => o.branchId === 1 || o.branchName === "سما الروسان").length;

    const branchPerf = document.getElementById('repBranchesPerformanceList');
    if (branchPerf) {
        branchPerf.innerHTML = `
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed var(--border-subtle); font-size:12.5px;">
                <span>فرع كفرسوم</span>
                <span class="num-font" style="font-weight:900; color:var(--brand-gold);">${b0Count} طلبات</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:8px 0; font-size:12.5px;">
                <span>فرع سما الروسان</span>
                <span class="num-font" style="font-weight:900; color:var(--brand-gold);">${b1Count} طلبات</span>
            </div>
        `;
    }

    const prodCounts = {};
    allOrders.forEach(o => {
        (o.items || []).forEach(it => {
            prodCounts[it.name] = (prodCounts[it.name] || 0) + (it.qty || 1);
        });
    });

    const sortedProds = Object.entries(prodCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const topProdsCont = document.getElementById('repTopSellingProductsList');
    if (topProdsCont) {
        if (!sortedProds.length) {
            topProdsCont.innerHTML = `<div style="font-size:12px; color:var(--text-secondary); text-align:center;">بانتظار تسجيل أولى الطلبات.</div>`;
        } else {
            topProdsCont.innerHTML = sortedProds.map(([pName, count], idx) => `
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed var(--border-subtle); font-size:12px;">
                    <span>${idx + 1}. ${pName}</span>
                    <span class="num-font" style="font-weight:900; color:var(--brand-gold);">${count} حبة</span>
                </div>
            `).join('');
        }
    }
}

// ---------------------------------------------------------
// مصادقة ودخول الإدارة
// ---------------------------------------------------------
let _adminSecretClickTimer = null;
let _adminSecretClickCount = 0;
window.handleSecretAdminTrigger = function() {
    _adminSecretClickCount++;
    clearTimeout(_adminSecretClickTimer);
    _adminSecretClickTimer = setTimeout(() => { _adminSecretClickCount = 0; }, 1500);

    if (_adminSecretClickCount >= 4) {
        _adminSecretClickCount = 0;
        window.navigateRouter('screen-admin-login');
        window.showToastMsg("بوابة الإدارة المشفرة");
    }
};

window.attemptAdminAuthentication = function() {
    const user = document.getElementById('adminUserField').value;
    const pin = (document.getElementById('adminPassField').value || '').trim();

    if (pin === "2001159393") {
        activeSessionUser = user;
        safeSet('cc_admin_session', user);
        document.getElementById('adminPassField').value = '';
        window.showToastMsg(`مرحباً يا ${user === 'omar' ? 'مهندس عمر' : 'إدارة المحل'}`);
        window.navigateRouter('screen-admin-dashboard');
        backToAdminMainHub();
    } else {
        window.showToastMsg("رمز المرور غير صحيح!");
    }
};

window.exitAdminSession = function() {
    activeSessionUser = null;
    localStorage.removeItem('cc_admin_session');
    window.showToastMsg("تم تسجيل الخروج من لوحة الإدارة");
    window.navigateRouter('screen-home');
};

// ---------------------------------------------------------
// التهيئة الشاملة للتطبيق
// ---------------------------------------------------------
function bootstrapCoffeeCornerApp() {
    applyThemeToDOM();
    window.renderCategoryChips();
    window.renderMenuProducts();
    updateClientSessionFields();
    updateNotificationBellBadge();
    refreshCartDockStatus();
    checkUrlTableAndGroupParams();
    initCloudRealtimeOrdersListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapCoffeeCornerApp);
} else {
    bootstrapCoffeeCornerApp();
}
