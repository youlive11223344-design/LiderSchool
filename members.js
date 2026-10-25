import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => String(n).trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

let user = null, profile = null, editing = null; // editing: {type:'teacher'|'project', id}
let teachers = new Map(), projects = new Map();

// ---------- Nav: Kirish / Chiqish tugmalari ----------
function paintNav() {
  const box = $('#authLi');
  if (!box) return;
  box.innerHTML = user
    ? `<a class="nm" href="#jamoa">${esc(profile?.name || user.displayName || 'Profil')}</a><a class="out" href="#" id="logout">Chiqish</a>`
    : `<a href="login.html">Kirish</a>`;
  const lo = $('#logout');
  if (lo) lo.onclick = async e => { e.preventDefault(); await signOut(auth); };
}

// ---------- Ma'lumotlarni yuklash va chizish ----------
async function load() {
  try {
    const [ts, ps] = await Promise.all([
      getDocs(collection(db, 'teachers')),
      getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
    ]);
    teachers = new Map(ts.docs.map(d => [d.id, d.data()]));
    projects = new Map(ps.docs.map(d => [d.id, d.data()]));
  } catch (e) { console.warn('Yuklashda xato:', e); }
  render();
}

function actions(type, id) {
  return `<div class="act"><button class="mini" data-a="edit" data-t="${type}" data-id="${esc(id)}">Tahrirlash</button>
  <button class="mini del" data-a="del" data-t="${type}" data-id="${esc(id)}">O‘chirish</button></div>`;
}

function render() {
  document.querySelectorAll('.dyn').forEach(e => e.remove());

  teachers.forEach((t, id) => {
    const mine = user && user.uid === id;
    $('#team').insertAdjacentHTML('beforeend',
      `<div class="t dyn"><div class="av">${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.n)}">` : esc(initials(t.n))}</div>
       <h3>${esc(t.n)}</h3><small>${esc(t.r)}</small><p>${esc(t.b)}</p>${mine ? actions('teacher', id) : ''}</div>`);
  });

  projects.forEach((p, id) => {
    const mine = user && user.uid === p.ownerUid;
    $('#proj').insertAdjacentHTML('beforeend',
      `<div class="t dyn"><span class="tag">${esc(p.tag)}</span><h3>${esc(p.n)}</h3><p>${esc(p.b)}</p>
       <small>Muallif: ${esc(p.ownerName)}</small>${mine ? actions('project', id) : ''}</div>`);
  });
  renderPanel();
}

// ---------- Forma paneli (o'qituvchi yoki o'quvchi uchun) ----------
function renderPanel() {
  const P = $('#panel');
  if (!P) return;
  if (!user) {
    P.innerHTML = `<p class="note">O‘qituvchi sifatida ro‘yxatga qo‘shilish yoki o‘quvchi loyihasini joylash uchun <a href="login.html">akkauntga kiring</a>.</p>`;
    return;
  }
  if (!profile) { P.innerHTML = `<p class="note">Profil to‘liq emas. <a href="login.html">Profilni yakunlang</a>.</p>`; return; }

  if (profile.role === 'teacher') {
    const own = teachers.get(user.uid);
    const v = (editing?.type === 'teacher' ? own : null) || {};
    P.innerHTML = `<form id="pf" class="pf"><h3>${own ? (editing ? 'Ma’lumotni tahrirlash' : 'Siz ro‘yxatdasiz') : 'O‘zingizni o‘qituvchilar ro‘yxatiga qo‘shing'}</h3>
      ${own && !editing ? `<p class="note">Kartangiz pastda. «Tahrirlash» yoki «O‘chirish» tugmasidan foydalaning.</p>` : `
      <input name="r" placeholder="Fan va tajriba (masalan: Matematika, 5 yil)" value="${esc(v.r)}" required maxlength="80">
      <input name="photo" placeholder="Rasm havolasi (ixtiyoriy, https://…)" value="${esc(v.photo)}" maxlength="300">
      <textarea name="b" placeholder="Qisqacha o‘zingiz haqingizda" required maxlength="200">${esc(v.b)}</textarea>
      <button class="btn gold" type="submit">${editing ? 'Saqlash' : 'Qo‘shish'}</button>
      ${editing ? '<button class="btn line" type="button" id="cancel">Bekor qilish</button>' : ''}`}
    </form>`;
  } else {
    const v = (editing?.type === 'project' ? projects.get(editing.id) : null) || {};
    const tags = ['Robototexnika', 'Dasturlash', 'Ekologiya', 'San’at', 'Fan', 'Boshqa'];
    P.innerHTML = `<form id="pf" class="pf"><h3>${editing ? 'Loyihani tahrirlash' : 'O‘z loyihangizni qo‘shing'}</h3>
      <select name="tag">${tags.map(t => `<option${v.tag === t ? ' selected' : ''}>${t}</option>`).join('')}</select>
      <input name="n" placeholder="Loyiha nomi" value="${esc(v.n)}" required maxlength="80">
      <textarea name="b" placeholder="Loyiha haqida qisqacha" required maxlength="250">${esc(v.b)}</textarea>
      <button class="btn gold" type="submit">${editing ? 'Saqlash' : 'Qo‘shish'}</button>
      ${editing ? '<button class="btn line" type="button" id="cancel">Bekor qilish</button>' : ''}
    </form>`;
  }
  const c = $('#cancel'); if (c) c.onclick = () => { editing = null; renderPanel(); };
  const f = $('#pf');
  if (f && f.elements.b) f.onsubmit = async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    try {
      if (profile.role === 'teacher') {
        await setDoc(doc(db, 'teachers', user.uid), {
          uid: user.uid, n: profile.name, r: d.r.trim(), b: d.b.trim(), photo: d.photo.trim(), updatedAt: serverTimestamp()
        });
      } else if (editing) {
        await updateDoc(doc(db, 'projects', editing.id), { tag: d.tag, n: d.n.trim(), b: d.b.trim(), ownerUid: user.uid });
      } else {
        await addDoc(collection(db, 'projects'), {
          tag: d.tag, n: d.n.trim(), b: d.b.trim(), ownerUid: user.uid, ownerName: profile.name, createdAt: serverTimestamp()
        });
      }
      editing = null; await load();
    } catch (err) { alert('Saqlab bo‘lmadi: ' + (err.code || err.message)); }
  };
}

// ---------- Tahrirlash / o'chirish tugmalari ----------
document.addEventListener('click', async e => {
  const b = e.target.closest('button[data-a]');
  if (!b || !user) return;
  const { a, t, id } = b.dataset;
  if (a === 'edit') {
    editing = { type: t, id };
    renderPanel();
    $('#panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (a === 'del' && confirm('Rostdan ham o‘chirmoqchimisiz?')) {
    try {
      await deleteDoc(doc(db, t === 'teacher' ? 'teachers' : 'projects', id));
      editing = null; await load();
    } catch (err) { alert('O‘chirib bo‘lmadi: ' + (err.code || err.message)); }
  }
});

// ---------- Boshlash ----------
onAuthStateChanged(auth, async u => {
  user = u; profile = null; editing = null;
  if (u) { try { const s = await getDoc(doc(db, 'users', u.uid)); profile = s.exists() ? s.data() : null; } catch (e) {} }
  paintNav();
  await load();
});