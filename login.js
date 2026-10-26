import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,
  GoogleAuthProvider, updateProfile, onAuthStateChanged, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const msg = (t, ok) => { const m = $('#msg'); m.textContent = t; m.className = ok ? 'ok' : ''; };
const NEXT = "index.html";
let mode = 'login', busy = false, holding = false;

auth.languageCode = 'uz';

const go = () => { msg('Kirdingiz! Sahifa ochilmoqda…', true); location.replace(NEXT); };

// ---------- Allaqachon kirgan bo'lsa, bosh sahifaga o'tkazamiz ----------
onAuthStateChanged(auth, async u => {
  if (!u || busy || holding) return;
  try {
    const s = await getDoc(doc(db, 'users', u.uid));
    if (s.exists()) go();
  } catch (e) {}
});

// ---------- Parolni ko'rsatish / yashirish (ko'z tugmasi) ----------
document.querySelectorAll('.eye').forEach(b => b.onclick = () => {
  const i = document.getElementById(b.dataset.for);
  const show = i.type === 'password';
  i.type = show ? 'text' : 'password';
  b.classList.toggle('on', show);
  b.setAttribute('aria-label', show ? 'Parolni yashirish' : 'Parolni ko‘rsatish');
});

// ---------- Email yoki telefon -> Firebase email ----------
function parseId(v) {
  v = v.trim();
  if (!v) return null;
  if (v.includes('@')) {
    return /^\S+@\S+\.\S+$/.test(v) ? { email: v.toLowerCase(), kind: 'email', shown: v.toLowerCase() } : null;
  }
  let d = v.replace(/\D/g, '');
  if (d.length === 9) d = '998' + d;
  if (!/^998\d{9}$/.test(d)) return null;
  return { email: `${d}@tel.lider-maktab.uz`, kind: 'phone', shown: '+' + d };
}

const ERR = {
  'auth/invalid-credential': "Login yoki parol noto‘g‘ri. Akkauntingiz bo‘lmasa, «Ro‘yxatdan o‘tish» ni tanlang.",
  'auth/wrong-password': "Parol noto‘g‘ri.",
  'auth/user-not-found': "Bunday akkaunt yo‘q. «Ro‘yxatdan o‘tish» ni tanlang.",
  'auth/email-already-in-use': "Bu email yoki telefon bilan akkaunt bor. «Kirish» orqali kiring.",
  'auth/weak-password': "Parol juda oddiy: kamida 6 ta belgi kiriting.",
  'auth/invalid-email': "Email manzil noto‘g‘ri.",
  'auth/too-many-requests': "Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.",
  'auth/network-request-failed': "Internet bilan aloqa yo‘q.",
  'auth/popup-closed-by-user': "Google oynasi yopildi.",
  'auth/popup-blocked': "Brauzer Google oynasini blokladi. Ruxsat bering.",
  'auth/unauthorized-domain': "Bu domen Firebase'da ruxsat etilmagan (Authentication → Settings → Authorized domains).",
  'permission-denied': "Bazaga yozishga ruxsat yo‘q (Firestore rules ni tekshiring)."
};
const showErr = e => msg(ERR[e.code] || ("Xatolik: " + (e.code || e.message)));

// ---------- Rejim almashtirish ----------
function setMode(m) {
  mode = m;
  document.querySelectorAll('.sw button').forEach(b => b.setAttribute('aria-selected', b.dataset.m === m));
  const reg = m === 'reg';
  $('#nameW').hidden = !reg; $('#regW').hidden = !reg;
  $('#forgot').hidden = reg;
  $('#ttl').textContent = reg ? "Ro‘yxatdan o‘tish" : "Kirish";
  $('#sub').textContent = reg ? "Yangi akkaunt yarating: ma’lumotlarni kiriting va parol o‘ylab toping." : "Akkauntingiz bo‘lsa, kirish uchun login va parolni kiriting.";
  $('#submit').textContent = reg ? "Akkaunt yaratish" : "Kirish";
  $('#pw').autocomplete = reg ? 'new-password' : 'current-password';
  msg('');
}
document.querySelectorAll('.sw button').forEach(b => b.onclick = () => setMode(b.dataset.m));

// ---------- Parolni unutdim ----------
$('#forgot').onclick = async e => {
  e.preventDefault();
  if (busy) return;
  const raw = $('#id').value.trim();
  if (!raw) return msg("Avval yuqoridagi maydonga email manzilingizni yozing.");
  if (!raw.includes('@')) return msg("Telefon raqam bilan ro‘yxatdan o‘tganlar parolni o‘zi tiklay olmaydi. Maktab ma’muriyatiga murojaat qiling.");
  const id = parseId(raw);
  if (!id) return msg("Email manzil noto‘g‘ri.");
  busy = true; msg('Yuborilmoqda…', true);
  try {
    await sendPasswordResetEmail(auth, id.email);
    msg("Agar bu email bilan akkaunt mavjud bo‘lsa, parolni tiklash havolasi yuborildi. «Spam» papkasini ham tekshiring.", true);
  } catch (err) { showErr(err); }
  finally { busy = false; }
};

// ---------- Shartlar ----------
document.querySelectorAll('.tl').forEach(a => a.onclick = e => { e.preventDefault(); $('#terms').showModal(); });
$('#tclose').onclick = () => $('#terms').close();

// ---------- Email / telefon + parol ----------
$('#f').onsubmit = async e => {
  e.preventDefault();
  if (busy) return;
  const id = parseId($('#id').value);
  const pw = $('#pw').value;
  if (!id) return msg("Email yoki telefon raqamni to‘g‘ri kiriting (masalan +998 90 123 45 67).");
  if (pw.length < 6) return msg("Parol kamida 6 ta belgidan iborat bo‘lsin.");

  busy = true; $('#submit').disabled = true; msg('Iltimos, kuting…', true);
  try {
    if (mode === 'login') {
      const cred = await signInWithEmailAndPassword(auth, id.email, pw);
      const s = await getDoc(doc(db, 'users', cred.user.uid));
      if (!s.exists()) throw { code: 'x', message: "Bu akkaunt uchun profil topilmadi. «Ro‘yxatdan o‘tish» orqali qaytadan yarating yoki administratorga murojaat qiling." };
      go();
    } else {
      const name = $('#name').value.trim();
      const role = document.querySelector('input[name=role]:checked')?.value;
      if (name.length < 2) throw { code: 'x', message: "Ism va familiyangizni kiriting." };
      if (pw !== $('#pw2').value) throw { code: 'x', message: "Parollar bir xil emas." };
      if (!role) throw { code: 'x', message: "O‘qituvchi yoki o‘quvchi ekanligingizni tanlang." };
      if (!$('#tc').checked) throw { code: 'x', message: "Davom etish uchun foydalanish shartlariga rozilik bering." };

      const cred = await createUserWithEmailAndPassword(auth, id.email, pw);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        name, role, kind: id.kind, identifier: id.shown, photo: '', bio: '', createdAt: serverTimestamp()
      });
      go();
    }
  } catch (err) {
    err.code === 'x' ? msg(err.message) : showErr(err);
  } finally { busy = false; $('#submit').disabled = false; }
};

// ---------- Google ----------
$('#google').onclick = async () => {
  if (busy) return;
  busy = true; msg('Google oynasi ochilmoqda…', true);
  try {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) { go(); return; }
    holding = true;
    $('#f').hidden = true; document.querySelector('.sw').hidden = true;
    $('.or').hidden = true; $('#google').hidden = true;
    $('#gname').value = user.displayName || '';
    $('#fin').hidden = false;
    msg("Google orqali kirdingiz. Profilni yakunlang.", true);
  } catch (err) { showErr(err); }
  finally { busy = false; }
};

$('#fin').onsubmit = async e => {
  e.preventDefault();
  const user = auth.currentUser;
  const name = $('#gname').value.trim();
  const role = document.querySelector('input[name=grole]:checked')?.value;
  if (!user) return msg("Qaytadan Google orqali kiring.");
  if (name.length < 2) return msg("Ism va familiyangizni kiriting.");
  if (!role) return msg("O‘qituvchi yoki o‘quvchi ekanligingizni tanlang.");
  if (!$('#gtc').checked) return msg("Foydalanish shartlariga rozilik bering.");
  try {
    await setDoc(doc(db, 'users', user.uid), {
      name, role, kind: 'google', identifier: user.email || '', photo: '', bio: '', createdAt: serverTimestamp()
    });
    await updateProfile(user, { displayName: name });
    holding = false; go();
  } catch (err) { showErr(err); }
};