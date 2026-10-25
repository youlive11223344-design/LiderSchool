import { auth, db } from "../ADMIN PANEL/firebase.js";
import {
  onAuthStateChanged, signOut, updateProfile, updatePassword, deleteUser,
  reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider, GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const say = (id, t, ok) => { const e = $(id); e.textContent = t; e.className = 'msg' + (ok ? ' ok' : ''); };
const initials = n => String(n).trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

let user = null, profile = null, deleting = false;

const errText = e => ({
  'permission-denied': "Ruxsat yo‘q (Firestore rules ni tekshiring).",
  'auth/wrong-password': "Parol noto‘g‘ri.",
  'auth/invalid-credential': "Parol noto‘g‘ri.",
  'auth/requires-recent-login': "Xavfsizlik uchun qaytadan kiring va urinib ko‘ring.",
  'auth/too-many-requests': "Juda ko‘p urinish. Birozdan keyin urinib ko‘ring.",
  'auth/popup-closed-by-user': "Google oynasi yopildi.",
  'auth/network-request-failed': "Internet bilan aloqa yo‘q."
}[e.code] || e.message || e.code || "Xatolik yuz berdi.");

// ---------- Parolni ko'rsatish / yashirish ----------
document.querySelectorAll('.eye').forEach(b => b.onclick = () => {
  const i = document.getElementById(b.dataset.for);
  const show = i.type === 'password';
  i.type = show ? 'text' : 'password';
  b.classList.toggle('on', show);
  b.setAttribute('aria-label', show ? 'Parolni yashirish' : 'Parolni ko‘rsatish');
});

// ---------- Ekranni to'ldirish ----------
function paint() {
  const name = profile.name || user.displayName || 'Foydalanuvchi';
  $('#pName').textContent = name;
  $('#pRole').textContent = profile.role === 'teacher' ? 'O‘qituvchi' : 'O‘quvchi';
  $('#pId').textContent = profile.identifier || user.email || '';
  const d = user.metadata.creationTime ? new Date(user.metadata.creationTime) : null;
  $('#pSince').textContent = d ? `Ro‘yxatdan o‘tgan: ${d.toLocaleDateString('uz-UZ')}` : '';

  const img = $('#bigImg'), txt = $('#bigTxt');
  if (profile.photo) {
    img.src = profile.photo; img.hidden = false; txt.hidden = true; $('#rm').hidden = false;
  } else {
    img.hidden = true; txt.hidden = false; txt.textContent = initials(name); $('#rm').hidden = true;
  }
  $('#nm').value = name;
  $('#bio').value = profile.bio || '';
  $('#bc').textContent = $('#bio').value.length;
}
$('#bio').oninput = () => $('#bc').textContent = $('#bio').value.length;

// ---------- Rasmni kichraytirish (256x256, kvadrat) ----------
function resize(file, size = 256) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = size;
      const s = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => rej(new Error('Rasm o‘qilmadi.'));
    img.src = url;
  });
}

async function setPhoto(data) {
  await updateDoc(doc(db, 'users', user.uid), { photo: data });
  const t = await getDoc(doc(db, 'teachers', user.uid));
  if (t.exists()) await updateDoc(doc(db, 'teachers', user.uid), { photo: data });
  profile.photo = data; paint();
}

$('#pick').onclick = () => $('#file').click();
$('#file').onchange = async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  if (!f.type.startsWith('image/')) return say('#m0', 'Faqat rasm faylini tanlang.');
  try {
    say('#m0', 'Yuklanmoqda…', true);
    await setPhoto(await resize(f));
    say('#m0', 'Rasm yangilandi.', true);
  } catch (err) { say('#m0', errText(err)); }
};
$('#rm').onclick = async () => {
  if (!confirm('Profil rasmi o‘chirilsinmi?')) return;
  try { await setPhoto(''); say('#m0', 'Rasm o‘chirildi.', true); }
  catch (err) { say('#m0', errText(err)); }
};

// ---------- Ism va "o'zim haqimda" ----------
$('#f1').onsubmit = async e => {
  e.preventDefault();
  const name = $('#nm').value.trim(), bio = $('#bio').value.trim();
  if (name.length < 2) return say('#m1', 'Ism kamida 2 ta belgidan iborat bo‘lsin.');
  try {
    say('#m1', 'Saqlanmoqda…', true);
    await updateProfile(user, { displayName: name });
    await updateDoc(doc(db, 'users', user.uid), { name, bio });
    const t = await getDoc(doc(db, 'teachers', user.uid));
    if (t.exists()) await updateDoc(doc(db, 'teachers', user.uid), { n: name });
    const ps = await getDocs(query(collection(db, 'projects'), where('ownerUid', '==', user.uid)));
    await Promise.all(ps.docs.map(d => updateDoc(d.ref, { ownerName: name })));
    profile.name = name; profile.bio = bio; paint();
    say('#m1', 'Saqlandi.', true);
  } catch (err) { say('#m1', errText(err)); }
};

// ---------- Parolni o'zgartirish ----------
$('#f2').onsubmit = async e => {
  e.preventDefault();
  const cur = $('#cur').value, n1 = $('#n1').value, n2 = $('#n2').value;
  if (!cur) return say('#m2', 'Joriy parolni kiriting.');
  if (n1.length < 6) return say('#m2', 'Yangi parol kamida 6 ta belgidan iborat bo‘lsin.');
  if (n1 !== n2) return say('#m2', 'Yangi parollar bir xil emas.');
  try {
    say('#m2', 'Tekshirilmoqda…', true);
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, cur));
    await updatePassword(user, n1);
    e.target.reset();
    say('#m2', 'Parol o‘zgartirildi.', true);
  } catch (err) { say('#m2', errText(err)); }
};

// ---------- Faoliyat ----------
async function activity() {
  const box = $('#act');
  if (profile.role === 'teacher') {
    const t = await getDoc(doc(db, 'teachers', user.uid));
    box.innerHTML = t.exists()
      ? `<p>Siz o‘qituvchilar ro‘yxatidasiz.</p><div class="row"><a class="btn line sm" href="index.html#jamoa">Kartamni ko‘rish</a></div>`
      : `<p>Siz hali o‘qituvchilar ro‘yxatida emassiz.</p><div class="row"><a class="btn gold sm" href="index.html#jamoa">Ro‘yxatga qo‘shilish</a></div>`;
  } else {
    const ps = await getDocs(query(collection(db, 'projects'), where('ownerUid', '==', user.uid)));
    box.innerHTML = `<p>Qo‘shgan loyihalaringiz: <b>${ps.size}</b></p>
      <div class="row"><a class="btn ${ps.size ? 'line' : 'gold'} sm" href="index.html#jamoa">${ps.size ? 'Loyihalarimni ko‘rish' : 'Loyiha qo‘shish'}</a></div>`;
  }
}

// ---------- Chiqish ----------
$('#logout').onclick = async () => { await signOut(auth); location.href = 'index.html'; };

// ---------- Akkauntni o'chirish ----------
$('#del').onclick = async () => {
  if (!confirm('Akkaunt va unga tegishli barcha ma’lumotlar butunlay o‘chiriladi. Davom etasizmi?')) return;
  try {
    if (profile.kind === 'google') {
      await reauthenticateWithPopup(user, new GoogleAuthProvider());
    } else {
      const pw = $('#dpw').value;
      if (!pw) return say('#m3', 'Tasdiqlash uchun parolingizni kiriting.');
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, pw));
    }
    deleting = true;
    const ps = await getDocs(query(collection(db, 'projects'), where('ownerUid', '==', user.uid)));
    await Promise.all(ps.docs.map(d => deleteDoc(d.ref)));
    const t = await getDoc(doc(db, 'teachers', user.uid));
    if (t.exists()) await deleteDoc(t.ref);
    await deleteDoc(doc(db, 'users', user.uid));
    await deleteUser(user);
    location.href = 'index.html';
  } catch (err) { deleting = false; say('#m3', errText(err)); }
};

// ---------- Boshlash ----------
onAuthStateChanged(auth, async u => {
  if (deleting) return;
  if (!u) { location.href = 'login.html'; return; }
  user = u;
  const s = await getDoc(doc(db, 'users', u.uid));
  if (!s.exists()) { location.href = 'login.html'; return; }
  profile = s.data();
  const g = profile.kind === 'google';
  $('#f2').hidden = g; $('#gnote').hidden = !g; $('#dpwW').hidden = g;
  paint();
  await activity();
  $('#app').hidden = false;
});