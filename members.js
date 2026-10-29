import { auth, db } from "./firebase.js";
import { S } from "./strings.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, getDocs, query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const T = (k, v) => I18N.t(k, v);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => String(n).trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const TAGS = ['Robototexnika', 'Dasturlash', 'Ekologiya', 'San’at', 'Fan', 'Boshqa'];
const tagL = x => ((I18N.get('tags') || {})[x]) || x;

// Admin kiritgan o'qituvchi matnlari: tanlangan tilda bo'lsa o'shani, bo'lmasa o'zbekchasini ko'rsatamiz
const tx = (t, k) => {
  const l = I18N.current();
  return (l !== 'uz' && t.tr && t.tr[l] && t.tr[l][k]) || t[k] || '';
};
const ord = t => (typeof t.order === 'number' ? t.order : 1e9);

let user = null, profile = null, isAdmin = false, editing = null; // editing: {type:'teacher'|'project', id}
let teachers = new Map(), projects = new Map();

// ---------- Profil, admin va "kutilmoqda" belgisi uchun uslub ----------
document.head.insertAdjacentHTML('beforeend', `<style>
#authLi a.pbtn{display:flex;align-items:center;gap:8px;padding:4px 16px 4px 4px;background:transparent;border:1.5px solid var(--gold);color:#fff}
#authLi a.pbtn:hover{background:rgba(201,162,74,.18);transform:none}
#authLi a.adm{background:transparent;color:var(--gold2);border-color:rgba(201,162,74,.5)}
#authLi a.adm:hover{background:rgba(201,162,74,.18);transform:none}
.pav{width:30px;height:30px;border-radius:50%;background:var(--gold);color:#0A1B45;display:grid;place-items:center;font:700 .8rem var(--sans);overflow:hidden;flex:none}
.pav img{width:100%;height:100%;object-fit:cover;display:block}
.pnm{max-width:110px;overflow:hidden;text-overflow:ellipsis}
.pend{display:inline-block;margin-top:10px;padding:3px 10px;border-radius:999px;background:rgba(201,162,74,.2);color:#E7C777;font:700 .75rem var(--sans)}
@media(max-width:820px){.pnm{display:none}#authLi a.pbtn{padding:3px}}
</style>`);

// ---------- Nav: Kirish yoki Profil (+ Admin) tugmasi ----------
function paintNav() {
  const box = $('#authLi');
  if (!box) return;
  if (user) {
    const name = profile?.name || user.displayName || T('m.profile');
    const av = profile?.photo ? `<img src="${esc(profile.photo)}" alt="">` : esc(initials(name));
    box.innerHTML = (isAdmin ? `<a class="adm" href="admin.html">Admin</a>` : '') +
      `<a class="pbtn" href="profile.html" title="${esc(T('m.profile'))}"><span class="pav">${av}</span><span class="pnm">${esc(name)}</span></a>`;
  } else {
    box.innerHTML = `<a href="login.html">${esc(T('nav.login'))}</a>`;
  }
}

// ---------- Ma'lumotlarni yuklash va chizish ----------
async function load() {
  try {
    const [ts, ps] = await Promise.all([
      getDocs(query(collection(db, 'teachers'), where('approved', '==', true))),
      getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
    ]);
    teachers = new Map(ts.docs.map(d => [d.id, d.data()]));
    projects = new Map(ps.docs.map(d => [d.id, d.data()]));
    // o'qituvchi o'z (hali tasdiqlanmagan) kartasini ham ko'radi
    if (user && profile?.role === 'teacher' && !teachers.has(user.uid)) {
      try {
        const s = await getDoc(doc(db, 'teachers', user.uid));
        if (s.exists()) teachers.set(user.uid, s.data());
      } catch (e) {}
    }
  } catch (e) { console.warn('Yuklashda xato:', e); }
  render();
}

function actions(type, id) {
  return `<div class="act"><button class="mini" data-a="edit" data-t="${type}" data-id="${esc(id)}">${esc(T('m.edit'))}</button>
  <button class="mini del" data-a="del" data-t="${type}" data-id="${esc(id)}">${esc(T('m.del'))}</button></div>`;
}

function render() {
  document.querySelectorAll('.dyn').forEach(e => e.remove());

  [...teachers.entries()].sort((a, b) => ord(a[1]) - ord(b[1])).forEach(([id, t]) => {
    const mine = user && user.uid === id;
    $('#team').insertAdjacentHTML('beforeend',
      `<div class="t dyn"><div class="av">${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.n)}">` : esc(initials(t.n))}</div>
       <h3>${esc(t.n)}</h3><small>${esc(tx(t, 'r'))}</small><p>${esc(tx(t, 'b'))}</p>
       ${t.approved !== true ? `<span class="pend">${esc(S('pending'))}</span>` : ''}
       ${mine ? actions('teacher', id) : ''}</div>`);
  });

  projects.forEach((p, id) => {
    const mine = user && user.uid === p.ownerUid;
    $('#proj').insertAdjacentHTML('beforeend',
      `<div class="t dyn"><span class="tag">${esc(tagL(p.tag))}</span><h3>${esc(p.n)}</h3><p>${esc(p.b)}</p>
       <small>${esc(T('m.by'))}: ${esc(p.ownerName)}</small>${mine ? actions('project', id) : ''}</div>`);
  });
  renderPanel();
}

// ---------- Forma paneli: o'qituvchi faqat o'qituvchilarga, o'quvchi faqat loyihaga ----------
function renderPanel() {
  const P = $('#panel');
  if (!P) return;
  if (!user) { P.innerHTML = `<p class="note">${T('m.signin')}</p>`; return; }
  if (!profile) { P.innerHTML = `<p class="note">${T('m.incomplete')}</p>`; return; }
  if (profile.banned) { P.innerHTML = `<p class="note">${esc(T('m.banned'))}</p>`; return; }

  if (profile.role === 'teacher') {
    const own = teachers.get(user.uid);
    const v = (editing?.type === 'teacher' ? own : null) || {};
    P.innerHTML = `<form id="pf" class="pf"><h3>${esc(own ? (editing ? T('m.t.edit') : T('m.t.in')) : T('m.t.add'))}</h3>
      ${own && !editing ? `<p class="note">${T('m.t.own')}</p>${own.approved !== true ? `<p class="note">${esc(S('pendingNote'))}</p>` : ''}` : `
      <input name="r" placeholder="${esc(T('m.t.r.ph'))}" value="${esc(v.r)}" required maxlength="80">
      <textarea name="b" placeholder="${esc(T('m.t.b.ph'))}" required maxlength="200">${esc(v.b || profile.bio)}</textarea>
      <p class="note">${T('m.t.note')}</p>
      ${!own ? `<p class="note">${esc(S('pendingNote'))}</p>` : ''}
      <button class="btn gold" type="submit">${esc(editing ? T('m.save') : T('m.add'))}</button>
      ${editing ? `<button class="btn line" type="button" id="cancel">${esc(T('m.cancel'))}</button>` : ''}`}
    </form>`;
  } else {
    const v = (editing?.type === 'project' ? projects.get(editing.id) : null) || {};
    P.innerHTML = `<form id="pf" class="pf"><h3>${esc(editing ? T('m.p.edit') : T('m.p.add'))}</h3>
      <select name="tag">${TAGS.map(t => `<option value="${t}"${v.tag === t ? ' selected' : ''}>${esc(tagL(t))}</option>`).join('')}</select>
      <input name="n" placeholder="${esc(T('m.p.n.ph'))}" value="${esc(v.n)}" required maxlength="80">
      <textarea name="b" placeholder="${esc(T('m.p.b.ph'))}" required maxlength="250">${esc(v.b)}</textarea>
      <button class="btn gold" type="submit">${esc(editing ? T('m.save') : T('m.add'))}</button>
      ${editing ? `<button class="btn line" type="button" id="cancel">${esc(T('m.cancel'))}</button>` : ''}
    </form>`;
  }
  const c = $('#cancel'); if (c) c.onclick = () => { editing = null; renderPanel(); };
  const f = $('#pf');
  if (f && f.elements.b) f.onsubmit = async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    try {
      if (profile.role === 'teacher') {
        const base = { n: profile.name, r: d.r.trim(), b: d.b.trim(), photo: profile.photo || '', updatedAt: serverTimestamp() };
        if (teachers.has(user.uid)) await updateDoc(doc(db, 'teachers', user.uid), base);
        else await setDoc(doc(db, 'teachers', user.uid), { uid: user.uid, approved: false, ...base });
      } else if (editing) {
        await updateDoc(doc(db, 'projects', editing.id), { tag: d.tag, n: d.n.trim(), b: d.b.trim(), ownerUid: user.uid });
      } else {
        await addDoc(collection(db, 'projects'), {
          tag: d.tag, n: d.n.trim(), b: d.b.trim(), ownerUid: user.uid, ownerName: profile.name, createdAt: serverTimestamp()
        });
      }
      editing = null; await load();
    } catch (err) { alert(T('m.saveFail') + (err.code || err.message)); }
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
  } else if (a === 'del' && confirm(T('m.confirm'))) {
    try {
      await deleteDoc(doc(db, t === 'teacher' ? 'teachers' : 'projects', id));
      editing = null; await load();
    } catch (err) { alert(T('m.delFail') + (err.code || err.message)); }
  }
});

// ---------- Til almashganda qayta chizish ----------
window.addEventListener('langchange', () => { paintNav(); render(); });

// ---------- Boshlash ----------
onAuthStateChanged(auth, async u => {
  user = u; profile = null; isAdmin = false; editing = null;
  if (u) {
    try { const s = await getDoc(doc(db, 'users', u.uid)); profile = s.exists() ? s.data() : null; } catch (e) {}
    try { isAdmin = (await getDoc(doc(db, 'admins', u.uid))).exists(); } catch (e) {}
  }
  paintNav();
  await load();
});