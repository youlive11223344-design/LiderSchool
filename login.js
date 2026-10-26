import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,
  GoogleAuthProvider, updateProfile, onAuthStateChanged, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const T = (k, v) => I18N.t(k, v);
const msg = (t, ok) => { const m = $('#msg'); m.textContent = t; m.className = ok ? 'ok' : ''; };
const NEXT = "index.html";
let mode = 'login', busy = false, holding = false;

auth.languageCode = I18N.current();
window.addEventListener('langchange', () => { auth.languageCode = I18N.current(); setMode(mode); });

const go = () => { msg(T('l.go'), true); location.replace(NEXT); };

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
  b.setAttribute('aria-label', T(show ? 'aria.hide' : 'aria.show'));
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

const showErr = e => {
  const k = 'e.' + String(e.code || '').replace('auth/', '');
  msg(I18N.has(k) ? T(k) : T('e.generic') + (e.code || e.message));
};

// ---------- Rejim almashtirish ----------
function setMode(m) {
  mode = m;
  document.querySelectorAll('.sw button').forEach(b => b.setAttribute('aria-selected', b.dataset.m === m));
  const reg = m === 'reg';
  $('#nameW').hidden = !reg; $('#regW').hidden = !reg;
  $('#forgot').hidden = reg;
  $('#ttl').textContent = T(reg ? 'l.t.reg' : 'l.t.login');
  $('#sub').textContent = T(reg ? 'l.s.reg' : 'l.s.login');
  $('#submit').textContent = T(reg ? 'l.btn.reg' : 'l.btn.login');
  $('#pw').autocomplete = reg ? 'new-password' : 'current-password';
  msg('');
}
document.querySelectorAll('.sw button').forEach(b => b.onclick = () => setMode(b.dataset.m));
setMode('login');

// ---------- Parolni unutdim ----------
$('#forgot').onclick = async e => {
  e.preventDefault();
  if (busy) return;
  const raw = $('#id').value.trim();
  if (!raw) return msg(T('l.f.email'));
  if (!raw.includes('@')) return msg(T('l.f.phone'));
  const id = parseId(raw);
  if (!id) return msg(T('e.invalid-email'));
  busy = true; msg(T('l.f.sending'), true);
  try {
    await sendPasswordResetEmail(auth, id.email);
    msg(T('l.f.ok'), true);
  } catch (err) { showErr(err); }
  finally { busy = false; }
};

// ---------- Shartlar ----------
document.addEventListener('click', e => {
  if (e.target.closest('.tl')) { e.preventDefault(); $('#terms').showModal(); }
});
$('#tclose').onclick = () => $('#terms').close();

// ---------- Email / telefon + parol ----------
$('#f').onsubmit = async e => {
  e.preventDefault();
  if (busy) return;
  const id = parseId($('#id').value);
  const pw = $('#pw').value;
  if (!id) return msg(T('l.e.id'));
  if (pw.length < 6) return msg(T('l.e.pw'));

  busy = true; $('#submit').disabled = true; msg(T('l.wait'), true);
  try {
    if (mode === 'login') {
      const cred = await signInWithEmailAndPassword(auth, id.email, pw);
      const s = await getDoc(doc(db, 'users', cred.user.uid));
      if (!s.exists()) throw { code: 'x', message: T('l.e.noprof') };
      go();
    } else {
      const name = $('#name').value.trim();
      const role = document.querySelector('input[name=role]:checked')?.value;
      if (name.length < 2) throw { code: 'x', message: T('l.e.name') };
      if (pw !== $('#pw2').value) throw { code: 'x', message: T('l.e.match') };
      if (!role) throw { code: 'x', message: T('l.e.role') };
      if (!$('#tc').checked) throw { code: 'x', message: T('l.e.terms') };

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
  busy = true; msg(T('l.gopen'), true);
  try {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) { go(); return; }
    holding = true;
    $('#f').hidden = true; document.querySelector('.sw').hidden = true;
    $('.or').hidden = true; $('#google').hidden = true;
    $('#gname').value = user.displayName || '';
    $('#fin').hidden = false;
    msg(T('l.gdone'), true);
  } catch (err) { showErr(err); }
  finally { busy = false; }
};

$('#fin').onsubmit = async e => {
  e.preventDefault();
  const user = auth.currentUser;
  const name = $('#gname').value.trim();
  const role = document.querySelector('input[name=grole]:checked')?.value;
  if (!user) return msg(T('l.e.again'));
  if (name.length < 2) return msg(T('l.e.name'));
  if (!role) return msg(T('l.e.role'));
  if (!$('#gtc').checked) return msg(T('l.e.terms'));
  try {
    await setDoc(doc(db, 'users', user.uid), {
      name, role, kind: 'google', identifier: user.email || '', photo: '', bio: '', createdAt: serverTimestamp()
    });
    await updateProfile(user, { displayName: name });
    holding = false; go();
  } catch (err) { showErr(err); }
};