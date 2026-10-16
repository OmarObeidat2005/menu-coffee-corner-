/* =========================================================
ملف التجارب التفاعلية (Corner Experience & Passport Engine)
مسؤول عن حسابات الزبائن، ومجتمع الصور، ومعالجة الرفع
========================================================= */
const DEFAULT_MOMENTS_LIST = [
{
id: "m1",
authorPhone: "0790000000",
authorName: "أحمد الروسان",
rating: 5,
target: "وافل بلجيكي أصلي (نوتيلا ولوتس)",
text: "أفضل وافل بالشمال بدون منازع! القرمشة خرافية والصوصات موزونة 100%.",
img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80",
likes: 19,
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
likes: 27,
likedBy: [],
timestamp: "منذ يومين"
}
];
let communityMomentsList = (function() {
try {
const val = localStorage.getItem('cc_moments');
return val ? JSON.parse(val) : DEFAULT_MOMENTS_LIST;
} catch(e) {
return DEFAULT_MOMENTS_LIST;
}
})();
let currentSelectedMomentStars = 5;
// محرك ضغط الصور المباشر عبر HTML5 Canvas لحماية الذاكرة ومنع الأخطاء
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
const maxDimension = 720;
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
const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
const inputField = document.getElementById(targetInputId);
if (inputField) inputField.value = compressedDataUrl;
const previewEl = document.getElementById(previewImgId);
if (previewEl) {
previewEl.src = compressedDataUrl;
previewEl.style.display = 'block';
}
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
// =========================================================
// حساب العميل ونظام العضوية (Member Identity & Passport)
// =========================================================
window.handleUserAccountHeaderClick = function() {
if (activeClientSession) {
window.renderClientProfileScreen();
window.navigateRouter('screen-user-profile');
} else {
window.switchAuthTabMode('login');
window.navigateRouter('screen-user-auth');
}
};
window.switchAuthTabMode = function(mode) {
currentAuthMode = mode;
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
ordersCount: 0, totalSpent: 0.0, loyaltyPoints: 10, isBanned: false
};
registeredUsersMap[phoneKey] = newUser;
try { localStorage.setItem('cc_users', JSON.stringify(registeredUsersMap)); } catch(e){}
activeClientSession = { phone, name, address };
try { localStorage.setItem('cc_client_session', JSON.stringify(activeClientSession)); } catch(e){}
window.updateClientSessionState();
window.showToastMsg(⁠أهلاً بك يا ${name}⁠);
window.navigateRouter('screen-home');
} else {
const user = registeredUsersMap[phoneKey];
if (!user) return errEl.innerText = 'الرقم غير مسجل. اختر حساب جديد';
if (user.pin !== pin) return errEl.innerText = 'رمز المرور غير صحيح';
if (user.isBanned) return errEl.innerText = 'عذراً، هذا الحساب محظور من الإدارة';
activeClientSession = { phone, name: user.name, address: user.address || '' };
try { localStorage.setItem('cc_client_session', JSON.stringify(activeClientSession)); } catch(e){}
window.updateClientSessionState();
window.showToastMsg(⁠مرحباً يا ${user.name}⁠);
window.navigateRouter('screen-home');
}
};
window.logoutClientSession = function() {
activeClientSession = null;
localStorage.removeItem('cc_client_session');
window.updateClientSessionState();
window.showToastMsg('تم تسجيل الخروج');
window.navigateRouter('screen-home');
};
window.updateClientSessionState = function() {
const nameField = document.getElementById('cartClientName');
const phoneField = document.getElementById('cartClientPhone');
if (activeClientSession) {
if (nameField) nameField.value = activeClientSession.name || '';
if (phoneField) phoneField.value = activeClientSession.phone || '';
} else {
if (nameField) nameField.value = '';
if (phoneField) phoneField.value = '';
}
};
window.renderClientProfileScreen = function() {
if (!activeClientSession) return;
const phoneKey = 'u_' + activeClientSession.phone;
const user = registeredUsersMap[phoneKey] || activeClientSession;
document.getElementById('profDisplayName').innerText = user.name || 'العميل العزيز';
document.getElementById('profDisplayPhone').innerText = user.phone || '';
document.getElementById('profDisplayOrdersCount').innerText = user.ordersCount || 0;
const pts = user.loyaltyPoints || 0;
document.getElementById('profDisplayPoints').innerText = pts;
document.getElementById('profDisplayTotalSpent').innerText = ⁠${(user.totalSpent || 0).toFixed(2)} د.أ⁠;
document.getElementById('profEditName').value = user.name || '';
document.getElementById('profEditAddress').value = user.address || '';
// مسار التقدم والأوسمة
const tierBadge = document.getElementById('profTierBadge');
const progressBar = document.getElementById('profProgressBar');
const goalLabel = document.getElementById('profPointsGoalLabel');
if (pts >= 100) {
tierBadge.innerText = "العضوية الذهبية VIP";
tierBadge.style.color = "#f59e0b";
progressBar.style.width = "100%";
goalLabel.innerText = "أعلى مستوى عضوية تم الوصول إليه!";
} else if (pts >= 40) {
tierBadge.innerText = "العضوية الفضية المميزة";
tierBadge.style.color = "var(--brand-gold)";
const pct = Math.min(100, Math.round(((pts - 40) / 60) * 100));
progressBar.style.width = ⁠${pct}%⁠;
goalLabel.innerText = ⁠${pts} / 100 نقطة للذهبية⁠;
} else {
tierBadge.innerText = "العضوية البرونزية";
tierBadge.style.color = "var(--text-secondary)";
const pct = Math.min(100, Math.round((pts / 40) * 100));
progressBar.style.width = ⁠${pct}%⁠;
goalLabel.innerText = ⁠${pts} / 40 نقطة للفضية⁠;
}
const avatarWrap = document.getElementById('profAvatarWrap');
if (user.avatar) {
avatarWrap.innerHTML = ⁠<img src="${user.avatar}" alt="${user.name}">⁠;
} else {
avatarWrap.innerHTML = ⁠<span>${(user.name || 'ع').charAt(0)}</span>⁠;
}
const historyContainer = document.getElementById('profCustomerOrdersHistoryList');
const userOrders = activeOrdersList.filter(o => o.customerPhone === user.phone);
if (!userOrders.length) {
historyContainer.innerHTML = ⁠<div style="text-align:center; padding:14px; color:var(--text-secondary); font-size:12px;">لا يوجد طلبات سابقة مسجلة</div>⁠;
} else {
historyContainer.innerHTML = userOrders.map(o => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed var(--border-subtle); font-size:12.5px;"> <div> <strong>طلب #${o.orderId}</strong> <div style="color:var(--text-secondary); font-size:11px;">${o.branchName} - ${o.items.length} أصناف</div> </div> <div class="num-font" style="font-weight:800; color:var(--brand-gold);">${o.totalAmount.toFixed(2)} د.أ</div> </div>⁠).join('');
}
};
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
try {
localStorage.setItem('cc_client_session', JSON.stringify(activeClientSession));
localStorage.setItem('cc_users', JSON.stringify(registeredUsersMap));
} catch(e){}
window.updateClientSessionState();
window.renderClientProfileScreen();
window.showToastMsg('تم حفظ البيانات بنجاح');
};
// =========================================================
// مجتمع شاركنا بصورة (تجارب الزبائن مع المعاينة والحذف)
// =========================================================
window.renderCommunityMomentsFeed = function() {
const feed = document.getElementById('communityFeedContainer');
if (!feed) return;
const currentPhone = activeClientSession ? activeClientSession.phone : null;
if (!communityMomentsList.length) {
feed.innerHTML = ⁠<div class="clean-card" style="text-align:center; padding:30px;"><div style="font-weight:700;">لا توجد مشاركات، شاركنا أول تجربة!</div></div>⁠;
return;
}
feed.innerHTML = communityMomentsList.map(m => {
const isAuthor = currentPhone && (m.authorPhone === currentPhone);
const stars = "★".repeat(m.rating || 5);
return ⁠<div class="moment-post-card"> ${m.img ?⁠
<div class="moment-img-container">
<img src="${m.img}" class="moment-post-img" loading="lazy" alt="تجربة العميل">
</div>
⁠: ''} <div class="moment-post-body"> <div class="moment-post-header"> <div> <div class="moment-post-author">${m.authorName}</div> <div class="moment-post-meta">${m.target || 'تجربة كافيه كورنر'} • ${m.timestamp}</div> </div> <div style="color:#eab308; font-size:14px;">${stars}</div> </div> <div class="moment-post-text">${m.text}</div> <div class="moment-post-actions"> <div style="font-size:12.5px; font-weight:700; cursor:pointer;" onclick="toggleLikeMoment('${m.id}')"> ❤️ <span class="num-font">${m.likes || 0}</span> إعجاب </div> ${isAuthor ?⁠
<button class="btn-brand-outline" style="padding:3px 10px; font-size:11px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteMyMoment('${m.id}')">
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
try { localStorage.setItem('cc_moments', JSON.stringify(communityMomentsList)); } catch(e){}
closeNewMomentModal();
window.renderCommunityMomentsFeed();
if (window.autoIncrementVersion) window.autoIncrementVersion();
window.showToastMsg("تم نشر تجربتك بنجاح!");
};
window.deleteMyMoment = function(id) {
if (!confirm("هل أنت متأكد من حذف مشاركتك؟")) return;
communityMomentsList = communityMomentsList.filter(m => m.id !== id);
try { localStorage.setItem('cc_moments', JSON.stringify(communityMomentsList)); } catch(e){}
window.renderCommunityMomentsFeed();
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
try { localStorage.setItem('cc_moments', JSON.stringify(communityMomentsList)); } catch(e){}
window.renderCommunityMomentsFeed();
};
window.renderAdminMomentsManager = function() {
const container = document.getElementById('adminMomentsListContainer');
if (!container) return;
if (!communityMomentsList.length) {
container.innerHTML = ⁠<div style="text-align:center; padding:12px; color:var(--text-secondary); font-size:12px;">لا توجد مشاركات</div>⁠;
return;
}
container.innerHTML = communityMomentsList.map(m => ⁠<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border-subtle); font-size:12.5px;"> <div> <strong>${m.authorName}</strong> (${m.rating}★) <div style="color:var(--text-secondary); font-size:11.5px;">${m.text}</div> </div> <button class="btn-brand-outline" style="padding:3px 8px; font-size:11px; color:var(--status-danger); border-color:var(--status-danger);" onclick="deleteMomentAdmin('${m.id}')">حذف</button> </div>⁠).join('');
};
window.deleteMomentAdmin = function(id) {
communityMomentsList = communityMomentsList.filter(m => m.id !== id);
try { localStorage.setItem('cc_moments', JSON.stringify(communityMomentsList)); } catch(e){}
window.renderAdminMomentsManager();
window.renderCommunityMomentsFeed();
window.showToastMsg("تم حذف المشاركة من الأدمن");
};
