/* =========================================================
   COFFEE CORNER PRO — INTERACTIVITY & EXPERIENCE ENGINE
   إدارة QR الطاولات، الطلب الجماعي، الإحالات، والإشعارات
   ========================================================= */

// فحص روابط QR الطاولات والجلسات الجماعية عند الفتح
function checkExperienceUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const tableNum = params.get('table');
    const branchParam = params.get('branch');

    if (tableNum) {
        window.appState.activeTable = parseInt(tableNum);
        window.appState.deliveryMode = "table";
        if (branchParam !== null) {
            window.appState.cartBranch = parseInt(branchParam) || 0;
        }

        const banner = document.getElementById('tableActiveBanner');
        const lbl = document.getElementById('lblActiveTableNum');
        if (lbl) lbl.innerText = `طاولة رقم ${tableNum}`;
        if (banner) banner.style.display = 'flex';

        const tableInput = document.getElementById('cartTableNumberInput');
        if (tableInput) tableInput.value = tableNum;

        window.showToastMsg(`أهلاً بك! تم ربط طلبك بطاولة رقم ${tableNum}`);
    }
}

window.clearActiveTableMode = function() {
    window.appState.activeTable = null;
    window.appState.deliveryMode = "delivery";
    const banner = document.getElementById('tableActiveBanner');
    if (banner) banner.style.display = 'none';
    window.showToastMsg("تم إلغاء وضع الطاولة");
};

// مركز إشعارات الزبون
const DEFAULT_NOTIFICATIONS = [
    { id: "n1", title: "أهلاً بك في كافيه كورنر! ✨", desc: "حصلت على 10 نقاط ترحيبية فورية في حسابك.", time: "اليوم" },
    { id: "n2", title: "كود خصم حصري 🏷️", desc: "استخدم كود CORNER10 واحصل على خصم 10% على طلبك القادم.", time: "أمس" }
];

window.renderCustomerNotifications = function() {
    const container = document.getElementById('customerNotificationsList');
    if (!container) return;
    
    container.innerHTML = DEFAULT_NOTIFICATIONS.map(n => `
        <div class="clean-card" style="margin-bottom:8px;">
            <div style="font-size:13.5px; font-weight:900; color:var(--brand-gold); margin-bottom:4px;">${n.title}</div>
            <div style="font-size:11.5px; color:var(--text-secondary); line-height:1.5;">${n.desc}</div>
            <div class="num-font" style="font-size:10px; color:var(--text-dim); margin-top:4px;">${n.time}</div>
        </div>
    `).join('');
};

// مجتمع شاركنا بصورة
const DEFAULT_MOMENTS = [
    {
        id: "m1",
        authorName: "أحمد الروسان",
        rating: 5,
        text: "أفضل وافل بلجيكي جربته بالشمال! القرمشة والصوصات ممتازة 100%.",
        img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&q=80",
        likes: 14
    }
];

window.renderMomentsFeed = function() {
    const container = document.getElementById('communityFeedContainer');
    if (!container) return;

    container.innerHTML = DEFAULT_MOMENTS.map(m => `
        <div class="clean-card" style="padding:0; overflow:hidden;">
            <img src="${m.img}" style="width:100%; height:180px; object-fit:cover;" alt="تجربة العميل">
            <div style="padding:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div style="font-size:13.5px; font-weight:900;">${m.authorName}</div>
                    <div style="color:var(--brand-gold); font-size:12px;">★★★★★</div>
                </div>
                <div style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:10px;">${m.text}</div>
                <div style="font-size:12px; font-weight:800; color:var(--brand-gold);">❤️ <span class="num-font">${m.likes}</span> إعجاب</div>
            </div>
        </div>
    `).join('');
};

window.openNewMomentModal = function() {
    window.showToastMsg("قريباً: فتح رفع التجارب لجميع الزبائن!");
};

// تشغيل الفحص عند اكتمال الصفحة
document.addEventListener('DOMContentLoaded', () => {
    checkExperienceUrlParams();
    window.renderCustomerNotifications();
    window.renderMomentsFeed();
});
