/* ... existing code ... ... existing code ... */
const DEV_USER = 'omar';
const SHOP_USER = 'corner';

// تجزئة SHA-256 للرقم السري PIN: 2001159393
const ENCRYPTED_MASTER_PIN_HASH = "68b556093d5089fa2d9d968b5f39611b8166c3c544e97efeb4aa27c8d9fb82d0";

// =========================================================
// محرك السحابة اللحظي (Firebase Firestore Live Realtime Cloud Engine)
// =========================================================
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

window.DEFAULT_CATALOG = [
/* ... existing code ... existing code ... */
let activeOrdersList = safeGet('cc_orders', []);
let storeSettings = safeGet('cc_store_settings', DEFAULT_SETTINGS);
let communityMomentsList = safeGet('cc_moments', []);
let badgesList = safeGet('cc_badges', DEFAULT_BADGES_LIST);
let branchPaymentsList = safeGet('cc_branch_payments', DEFAULT_BRANCH_PAYMENTS);
let isThemeDark = safeGet('cc_theme_dark', true);
let isAdminSoundEnabled = safeGet('cc_admin_sound', true);

// =========================================================
// إدارة دورة حياة الطلبات وأرشفتها تلقائياً بعد 15 دقيقة
// =========================================================
const AUTO_ARCHIVE_MS = 15 * 60 * 1000; // 15 دقيقة بالمللي ثانية

function purgeCompletedOrdersAfter15Minutes() {
    const now = Date.now();
    let hasChanged = false;

    activeOrdersList = activeOrdersList.filter(order => {
        if (order.status === 'completed' && order.completedAt) {
            const elapsed = now - order.completedAt;
            if (elapsed >= AUTO_ARCHIVE_MS) {
                hasChanged = true;
                return false; // حذف الطلب تلقائياً بعد 15 دقيقة من اكتماله
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

// فحص دوري لتنظيف وأرشفة الطلبات المكتملة كل 30 ثانية
setInterval(purgeCompletedOrdersAfter15Minutes, 30000);

// =========================================================
// الاستماع اللحظي للطلبات من السحابة (Real-Time Listener)
// =========================================================
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
                        window.showToastMsg("🔔 طلب جديد وصل إلى السحابة للتو!");
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

let offersList = safeGet('cc_offers', [
/* ... existing code ... existing code ... */
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

    const curBranchMethods = branchPaymentsList.filter(p => p.branch === window.appState.cartBranch.toString() || p.branch === 'all');
    const selectedPay = curBranchMethods.find(m => m.id === window.appState.selectedPaymentId);
    let payStr = selectedPay ? `${selectedPay.name} (${selectedPay.num})` : 'نقدي عند الاستلام';

    const nowMs = Date.now();
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

    // 1. الحفظ السحابي الفوري في Firestore
    if (cloudDb) {
        cloudDb.collection('orders').doc(orderNumber).set(newOrderObj).catch(err => {
            console.warn("Cloud save error:", err);
        });
    }

    // 2. الحفظ المحلي الاحتياطي
    activeOrdersList.unshift(newOrderObj);
    safeSet('cc_orders', activeOrdersList);
    localStorage.setItem('cc_latest_order_id', orderNumber);

    activeUser.ordersCount = (activeUser.ordersCount || 0) + 1;
    activeUser.totalSpent = parseFloat(((activeUser.totalSpent || 0) + total).toFixed(2));
    activeUser.loyaltyPoints = (activeUser.loyaltyPoints || 0) + Math.floor(total);

    safeSet('cc_users', registeredUsersMap);

    let msg = `*طلب جديد | ${storeSettings.brandTitle}*\nرقم الطلب: ${orderNumber}\nالفرع: ${branch.name}\nالعميل: ${activeUser.name} (${activeUser.phone})\n----------------\n`;
    window.appState.cart.forEach((i, idx) => {
        msg += `${idx + 1}. *${i.qty}x ${i.name}* (${i.sizeName}) - ${i.lineTotal.toFixed(2)} د.أ\n`;
    });
    msg += `----------------\nالمجموع: ${total.toFixed(2)} د.أ\nالاستلام: ${window.appState.deliveryMode === 'delivery' ? 'توصيل' : 'من الفرع'}\nالدفع: ${payStr}\n`;
    if (window.appState.deliveryMode === 'delivery') msg += `العنوان: ${newOrderObj.address}\n`;

    window.appState.cart = [];
    localStorage.removeItem('cc_cart');
    refreshCartDockStatus();

    playOrderChimeSound();

    window.open(`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    openDigitalReceiptModal(newOrderObj);
};
/* ... existing code ... ... existing code ... */
function renderAdminLiveOrdersManager() {
    purgeCompletedOrdersAfter15Minutes();
    const container = document.getElementById('adminLiveOrdersContainer');
    const countBadge = document.getElementById('adminActiveOrdersCount');
    if (!container) return;
    if (countBadge) countBadge.innerText = `${activeOrdersList.length} طلب`;

    if (!activeOrdersList.length) {
        container.innerHTML = `<div style="text-align:center; padding:18px; color:var(--text-secondary); font-size:12.5px;">لا يوجد طلبات نشطة حالياً، كل الطلبات مكتملة ومؤرشفة بنجاح ✓</div>`;
        return;
    }

    const now = Date.now();

    container.innerHTML = activeOrdersList.map(o => {
        let autoDismissBadge = '';
        if (o.status === 'completed' && o.completedAt) {
            const remainingMins = Math.max(1, Math.ceil((AUTO_ARCHIVE_MS - (now - o.completedAt)) / 60000));
            autoDismissBadge = `<span style="font-size:10px; color:var(--status-success); background:rgba(16,185,129,0.12); padding:2px 6px; border-radius:4px;">مكتمل (يؤرشف تلقائياً بعد ${remainingMins} د)</span>`;
        }

        return `
            <div style="border:1px solid var(--border-subtle); background:var(--bg-card); border-radius:var(--radius-sm); padding:12px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; align-items:center;">
                    <span class="num-font" style="font-weight:800; color:var(--brand-gold);">${o.orderId}</span>
                    <div style="display:flex; gap:6px; align-items:center;">
                        ${autoDismissBadge}
                        <span style="font-size:11.5px; font-weight:700;">${o.branchName} • ${o.timestamp}</span>
                    </div>
                </div>
                <div style="font-size:12.5px; margin-bottom:6px;">
                    <strong>${o.customerName}</strong> (${o.customerPhone}) - <span class="num-font" style="color:var(--brand-gold);">${o.totalAmount.toFixed(2)} د.أ</span>
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
    if (status === 'completed') {
        o.completedAt = Date.now(); // بدء عداد الـ 15 دقيقة للأرشفة التلقائية
    } else {
        o.completedAt = null;
    }

    // تحديث سحابي فوري ومباشر في Firestore
    if (cloudDb) {
        cloudDb.collection('orders').doc(orderId).update({
            status: status,
            completedAt: o.completedAt
        }).catch(err => {
            console.warn("Cloud update status notice:", err);
        });
    }

    safeSet('cc_orders', activeOrdersList);
    renderAdminLiveOrdersManager();

    if (localStorage.getItem('cc_latest_order_id') === orderId) {
        renderClientOrderTrackingView();
    }

    window.showToastMsg(status === 'completed' ? "اكتمل الطلب وستتم أرشفته تلقائياً بعد 15 دقيقة" : "تم تحديث حالة الطلب فورياً");
};
/* ... existing code ... ... existing code ... */
// تشغيل فوري ومضمون فور تحميل المستند
function bootstrapMenuNow() {
    applyThemeToDOM();
    updateVersionBadgeUI();
    applyLiveSettingsToDOM();
    updateBranchStatusBadges();

    // تشغيل فوري لعرض المنيو والأصناف
    window.renderCategoryChips();
    window.renderMenuProducts();

    updateClientSessionState();
    refreshCartDockStatus();

    // تفعيل الاتصال والمستمع اللحظي المباشر للسحابة
    initCloudRealtimeOrdersListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapMenuNow);
} else {
    bootstrapMenuNow();
}

setInterval(updateBranchStatusBadges, 60000);
setInterval(pollNewOrdersTelemetry, 5000);
