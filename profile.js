import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged, signOut, updateProfile, updatePassword, deleteUser,
  reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider, GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const T = (k, v) => I18N.t(k, v);
const say = (id, t, ok) => { const e = $(id); e.textContent = t; e.className = 'msg' + (ok ? ' ok' : ''); };
const initials = n => String(n).trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

let user = null, profile = null, deleting = false;

const errText = e => {
  const k = 'e.' + String(e.code || '').replace('auth/', '');
  return I18N.has(k) ? T(k) : (e.message || e.code || T('e.generic'));
};

// ---------- Parolni ko'rsatish / yashirish ----------
document.querySelectorAll('.eye').forEach(b => b.onclick = () => {
  const i = document.getElementById(b.dataset.for);
  const show = i.type === 'password';
  i.type = show ? 'text' : 'password';
  b.classList.toggle('on', show);
  b.setAttribute('aria-label', T(show ? 'aria.hide' : 'aria.show'));
});

// ---------- Ekranni to'ldirish ----------
function paint() {
  const name = profile.name || user.displayName || T('p.user');
  $('#pName').textContent = name;
  $('#pRole').textContent = T(profile.role === 'teacher' ? 'l.teacher' : 'l.student');
  $('#pId').textContent = profile.identifier || user.email || '';
  const d = user.metadata.creationTime ? new Date(user.metadata.creationTime) : null;
  $('#pSince').textContent = d ? T('p.since', { d: d.toLocaleDateString(I18N.locale()) }) : '';

  const img = $('#bigImg'), txt = $('#bigTxt');
  if (profile.photo) {
    img.src = profile.photo; img.hidden = false; txt.hidden = true; $('#rm').hidden = false;
  } else {
    img.hidden = true; txt.hidden = false; txt.textContent = initials(name); $('#rm').hidden = true;
  }
  if (document.activeElement !== $('#nm')) $('#nm').value = name;
  if (document.activeElement !== $('#bio')) $('#bio').value = profile.bio || '';
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
    img.onerror = () => rej(new Error(T('p.m.readFail')));
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
  if (!f.type.startsWith('image/')) return say('#m0', T('p.m.img'));
  try {
    say('#m0', T('p.m.up'), true);
    await setPhoto(await resize(f));
    say('#m0', T('p.m.imgOk'), true);
  } catch (err) { say('#m0', errText(err)); }
};
$('#rm').onclick = async () => {
  if (!confirm(T('p.m.imgAsk'))) return;
  try { await setPhoto(''); say('#m0', T('p.m.imgRm'), true); }
  catch (err) { say('#m0', errText(err)); }
};

// ---------- Ism va "o'zim haqimda" ----------
$('#f1').onsubmit = async e => {
  e.preventDefault();
  const name = $('#nm').value.trim(), bio = $('#bio').value.trim();
  if (name.length < 2) return say('#m1', T('p.m.name'));
  try {
    say('#m1', T('p.m.saving'), true);
    await updateProfile(user, { displayName: name });
    await updateDoc(doc(db, 'users', user.uid), { name, bio });
    const t = await getDoc(doc(db, 'teachers', user.uid));
    if (t.exists()) await updateDoc(doc(db, 'teachers', user.uid), { n: name });
    const ps = await getDocs(query(collection(db, 'projects'), where('ownerUid', '==', user.uid)));
    await Promise.all(ps.docs.map(d => updateDoc(d.ref, { ownerName: name })));
    profile.name = name; profile.bio = bio; paint();
    say('#m1', T('p.m.saved'), true);
  } catch (err) { say('#m1', errText(err)); }
};

// ---------- Parolni o'zgartirish ----------
$('#f2').onsubmit = async e => {
  e.preventDefault();
  const cur = $('#cur').value, n1 = $('#n1').value, n2 = $('#n2').value;
  if (!cur) return say('#m2', T('p.m.cur'));
  if (n1.length < 6) return say('#m2', T('p.m.short'));
  if (n1 !== n2) return say('#m2', T('p.m.mis'));
  try {
    say('#m2', T('p.m.check'), true);
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, cur));
    await updatePassword(user, n1);
    e.target.reset();
    say('#m2', T('p.m.pwOk'), true);
  } catch (err) { say('#m2', errText(err)); }
};

// ---------- Faoliyat ----------
async function activity() {
  const box = $('#act');
  if (profile.role === 'teacher') {
    const t = await getDoc(doc(db, 'teachers', user.uid));
    box.innerHTML = t.exists()
      ? `<p>${T('p.a.t.in')}</p><div class="row"><a class="btn line sm" href="index.html#jamoa">${T('p.a.t.view')}</a></div>`
      : `<p>${T('p.a.t.out')}</p><div class="row"><a class="btn gold sm" href="index.html#jamoa">${T('p.a.t.join')}</a></div>`;
  } else {
    const ps = await getDocs(query(collection(db, 'projects'), where('ownerUid', '==', user.uid)));
    box.innerHTML = `<p>${T('p.a.s.cnt', { n: ps.size })}</p>
      <div class="row"><a class="btn ${ps.size ? 'line' : 'gold'} sm" href="index.html#jamoa">${T(ps.size ? 'p.a.s.view' : 'p.a.s.add')}</a></div>`;
  }
}

// ---------- Chiqish ----------
$('#logout').onclick = async () => { await signOut(auth); location.href = 'index.html'; };

// ---------- Akkauntni o'chirish ----------
$('#del').onclick = async () => {
  if (!confirm(T('p.m.delAsk'))) return;
  try {
    if (profile.kind === 'google') {
      await reauthenticateWithPopup(user, new GoogleAuthProvider());
    } else {
      const pw = $('#dpw').value;
      if (!pw) return say('#m3', T('p.m.delPw'));
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

// ---------- Til almashganda ----------
window.addEventListener('langchange', () => { if (profile) { paint(); activity(); } });

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