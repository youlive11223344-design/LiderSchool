import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, getDocs, updateDoc, deleteDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => String(n || '?').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const fmt = ts => { try { return ts?.toDate ? ts.toDate().toLocaleDateString('uz-UZ') : '—'; } catch (e) { return '—'; } };
const ms = ts => (ts?.toMillis ? ts.toMillis() : 0);
const KIND = { email: 'Email', phone: 'Telefon', google: 'Google' };

let me = null, users = [], teachers = [], projects = [], tab = 'users';

// ---------- Ma'lumotlarni yuklash ----------
async function loadAll() {
  try {
    const [u, t, p] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'teachers')),
      getDocs(collection(db, 'projects'))
    ]);
    users = u.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => ms(b.createdAt) - ms(a.createdAt));
    teachers = t.docs.map(d => ({ id: d.id, ...d.data() }));
    projects = p.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => ms(b.createdAt) - ms(a.createdAt));
  } catch (e) { alert('Yuklab bo‘lmadi: ' + (e.code || e.message)); }
  render();
}

// ---------- Chizish ----------
function renderStats() {
  const st = [
    ['Foydalanuvchilar', users.length],
    ['O‘qituvchilar', users.filter(u => u.role === 'teacher').length],
    ['O‘quvchilar', users.filter(u => u.role === 'student').length],
    ['O‘qituvchi kartalari', teachers.length],
    ['Loyihalar', projects.length],
    ['Bloklanganlar', users.filter(u => u.banned).length]
  ];
  $('#stats').innerHTML = st.map(([l, n]) => `<div class="sc"><b>${n}</b><span>${l}</span></div>`).join('');
}

function renderUsers() {
  const q = $('#q').value.trim().toLowerCase(), rf = $('#rf').value;
  const rows = users.filter(u =>
    (!rf || u.role === rf) &&
    (!q || (u.name || '').toLowerCase().includes(q) || (u.identifier || '').toLowerCase().includes(q)));
  $('#tb').innerHTML = rows.length ? rows.map(u => {
    const self = u.id === me.uid;
    return `<tr>
      <td><div class="who"><span class="pav">${u.photo ? `<img src="${esc(u.photo)}" alt="">` : esc(initials(u.name))}</span>${esc(u.name)}${self ? ' <span class="pill">Siz</span>' : ''}</div></td>
      <td><span class="pill">${u.role === 'teacher' ? 'O‘qituvchi' : 'O‘quvchi'}</span></td>
      <td>${esc(u.identifier)}</td>
      <td>${esc(KIND[u.kind] || u.kind || '—')}</td>
      <td>${fmt(u.createdAt)}</td>
      <td>${u.banned ? '<span class="pill bad">Bloklangan</span>' : '<span class="pill ok">Faol</span>'}</td>
      <td><div class="ac">${self ? '—' : `
        <button class="mini" data-a="${u.banned ? 'unban' : 'ban'}" data-id="${esc(u.id)}">${u.banned ? 'Blokdan chiqarish' : 'Bloklash'}</button>
        <button class="mini del" data-a="wipe" data-id="${esc(u.id)}">Ma’lumotlarini o‘chirish</button>`}</div></td>
    </tr>`;
  }).join('') : `<tr><td colspan="7" class="empty">Hech narsa topilmadi.</td></tr>`;
}

function renderTeachers() {
  $('#tcards').innerHTML = teachers.length ? teachers.map(t => `
    <div class="t"><div class="av">${t.photo ? `<img src="${esc(t.photo)}" alt="">` : esc(initials(t.n))}</div>
    <h3>${esc(t.n)}</h3><small>${esc(t.r)}</small><p>${esc(t.b)}</p>
    <button class="mini del" data-a="dteacher" data-id="${esc(t.id)}">Kartani o‘chirish</button></div>`).join('')
    : `<div class="empty">Hozircha o‘qituvchi kartalari yo‘q.</div>`;
}

function renderProjects() {
  $('#pcards').innerHTML = projects.length ? projects.map(p => `
    <div class="t"><span class="tag">${esc(p.tag)}</span><h3>${esc(p.n)}</h3><p>${esc(p.b)}</p>
    <small>Muallif: ${esc(p.ownerName)} · ${fmt(p.createdAt)}</small><br>
    <button class="mini del" data-a="dproj" data-id="${esc(p.id)}">Loyihani o‘chirish</button></div>`).join('')
    : `<div class="empty">Hozircha loyihalar yo‘q.</div>`;
}

function render() { renderStats(); renderUsers(); renderTeachers(); renderProjects(); }

// ---------- Tablar ----------
document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
  tab = b.dataset.t;
  document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x === b));
  $('#vUsers').hidden = tab !== 'users';
  $('#vTeachers').hidden = tab !== 'teachers';
  $('#vProjects').hidden = tab !== 'projects';
});
$('#q').oninput = renderUsers;
$('#rf').onchange = renderUsers;
$('#refresh').onclick = loadAll;

// ---------- Amallar ----------
$('#app').addEventListener('click', async e => {
  const b = e.target.closest('button[data-a]');
  if (!b) return;
  const { a, id } = b.dataset;
  try {
    if (a === 'ban' || a === 'unban') {
      const ban = a === 'ban';
      if (ban && !confirm('Foydalanuvchi bloklansinmi? U karta va loyiha qo‘sha olmaydi.')) return;
      await updateDoc(doc(db, 'users', id), { banned: ban });
      const u = users.find(x => x.id === id); if (u) u.banned = ban;
      render();
    } else if (a === 'wipe') {
      if (!confirm('Foydalanuvchining profili, kartasi va barcha loyihalari o‘chiriladi. Davom etasizmi?')) return;
      await Promise.all(projects.filter(p => p.ownerUid === id).map(p => deleteDoc(doc(db, 'projects', p.id))));
      if (teachers.some(t => t.id === id)) await deleteDoc(doc(db, 'teachers', id));
      await deleteDoc(doc(db, 'users', id));
      await loadAll();
    } else if (a === 'dteacher') {
      if (!confirm('Bu o‘qituvchi kartasi o‘chirilsinmi?')) return;
      await deleteDoc(doc(db, 'teachers', id)); await loadAll();
    } else if (a === 'dproj') {
      if (!confirm('Bu loyiha o‘chirilsinmi?')) return;
      await deleteDoc(doc(db, 'projects', id)); await loadAll();
    }
  } catch (err) { alert('Bajarib bo‘lmadi: ' + (err.code || err.message)); }
});

// ---------- Excel (CSV) eksport ----------
const safe = v => { v = String(v ?? ''); return /^[=+\-@]/.test(v) ? "'" + v : v; };
$('#csv').onclick = () => {
  const rows = [['Ism', 'Rol', 'Aloqa', 'Usul', 'Sana', 'Holat'],
    ...users.map(u => [u.name, u.role === 'teacher' ? 'O‘qituvchi' : 'O‘quvchi', u.identifier, KIND[u.kind] || u.kind, fmt(u.createdAt), u.banned ? 'Bloklangan' : 'Faol'])];
  const csv = '\ufeff' + rows.map(r => r.map(c => '"' + safe(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'foydalanuvchilar.csv';
  a.click();
};

$('#logout').onclick = async () => { await signOut(auth); location.href = 'index.html'; };

// ---------- Kirish nazorati: faqat adminlar ----------
onAuthStateChanged(auth, async u => {
  if (!u) { location.href = 'login.html'; return; }
  let ok = false;
  try { ok = (await getDoc(doc(db, 'admins', u.uid))).exists(); } catch (e) {}
  $('#load').hidden = true;
  if (!ok) { $('#uid').textContent = u.uid; $('#deny').hidden = false; return; }
  me = u;
  $('#who').textContent = u.displayName || u.email || '';
  $('#app').hidden = false;
  await loadAll();
});