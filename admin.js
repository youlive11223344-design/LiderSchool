import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, collection, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => String(n || '?').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const dt = ts => (ts?.toDate ? ts.toDate() : null);
const fmt = ts => { const d = dt(ts); return d ? d.toLocaleDateString('uz-UZ') : '—'; };
const fmtDT = ts => { const d = dt(ts); return d ? d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : '—'; };
const ms = ts => (ts?.toMillis ? ts.toMillis() : 0);
const ord = t => (typeof t.order === 'number' ? t.order : 1e9);
const say = (id, t, ok) => { const e = $(id); e.textContent = t; e.className = 'msg' + (ok ? ' ok' : ''); };
const KIND = { email: 'Email', phone: 'Telefon', google: 'Google' };
const ST = { new: 'Yangi', seen: 'Ko‘rildi', done: 'Bog‘lanildi' };

let me = null, users = [], teachers = [], projects = [], apps = [], news = [], gallery = [];
let editingT = null, tPhoto = '';

// ---------- Kod ichida yozilgan 4 ta o'qituvchi (bazaga ko'chirish uchun) ----------
const SEED = [
  { id: 'seed-1', n: 'Dostonbek Kulchaboyev',
    uz: { r: 'Matematika, 15 yil tajriba', b: 'Olimpiada g‘oliblarini tayyorlaydi.' },
    ru: { r: 'Математика, 15 лет опыта', b: 'Готовит победителей олимпиад.' },
    en: { r: 'Mathematics, 15 years of experience', b: 'Prepares Olympiad winners.' } },
  { id: 'seed-2', n: 'Dilshodbek Ziyadullayev',
    uz: { r: 'Kimyo', b: 'Kimyo to‘garagi rahbari.' },
    ru: { r: 'Химия', b: 'Руководитель кружка по химии.' },
    en: { r: 'Chemistry', b: 'Leads the chemistry club.' } },
  { id: 'seed-3', n: 'Maftuna Maxkamova',
    uz: { r: 'Ingliz tili (IELTS 7.5)', b: 'Xalqaro sertifikatlarga tayyorlaydi.' },
    ru: { r: 'Английский язык (IELTS 7.5)', b: 'Готовит к международным сертификатам.' },
    en: { r: 'English (IELTS 7.5)', b: 'Prepares students for international certificates.' } },
  { id: 'seed-4', n: 'Jamshid Po‘latov',
    uz: { r: 'Tarix', b: 'Huquq va Tarix fanlari mutaxasisi' },
    ru: { r: 'История', b: 'Специалист по праву и истории.' },
    en: { r: 'History', b: 'Specialist in law and history.' } }
];

// ---------- Ma'lumotlarni yuklash ----------
async function loadAll() {
  try {
    const names = ['users', 'teachers', 'projects', 'applications', 'news', 'gallery'];
    const snaps = await Promise.all(names.map(n => getDocs(collection(db, n))));
    const [u, t, p, a, n, g] = snaps.map(s => s.docs.map(d => ({ id: d.id, ...d.data() })));
    const byNew = (x, y) => ms(y.createdAt) - ms(x.createdAt);
    users = u.sort(byNew); teachers = t; projects = p.sort(byNew);
    apps = a.sort(byNew); news = n.sort(byNew); gallery = g.sort(byNew);
  } catch (e) { alert('Yuklab bo‘lmadi: ' + (e.code || e.message)); }
  render();
}

// ---------- Chizish ----------
function renderStats() {
  const newApps = apps.filter(a => a.status === 'new').length;
  const pendT = teachers.filter(t => t.approved !== true).length;
  const st = [
    ['Foydalanuvchilar', users.length],
    ['O‘qituvchilar (rol)', users.filter(u => u.role === 'teacher').length],
    ['O‘quvchilar', users.filter(u => u.role === 'student').length],
    ['Tasdiq kutayotgan o‘qituvchilar', pendT],
    ['Yangi arizalar', newApps],
    ['Yangiliklar', news.length],
    ['Galereya rasmlari', gallery.length],
    ['Saytdagi o‘qituvchi kartalari', teachers.filter(t => t.approved === true).length],
    ['Loyihalar', projects.length],
    ['Bloklanganlar', users.filter(u => u.banned).length]
  ];
  $('#stats').innerHTML = st.map(([l, n]) => `<div class="sc"><b>${n}</b><span>${l}</span></div>`).join('');
  $('#tabApps').textContent = newApps ? `Arizalar (${newApps})` : 'Arizalar';
  $('#tabTeachers').textContent = pendT ? `O‘qituvchilar (${pendT})` : 'O‘qituvchilar';
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

function renderApps() {
  const f = $('#af').value;
  const rows = apps.filter(a => !f || a.status === f);
  $('#appList').innerHTML = rows.length ? rows.map(a => `
    <div class="t app ${a.status === 'new' ? 'new' : ''}">
      <div class="row"><span class="tag">${esc(a.grade)}</span><small>${fmtDT(a.createdAt)}</small></div>
      <h3>${esc(a.child)}</h3>
      <small>Ota-ona: ${esc(a.parent)}</small>
      <p><a href="tel:${esc(a.phone)}">${esc(a.phone)}</a></p>
      ${a.message ? `<p>${esc(a.message)}</p>` : ''}
      <div class="row" style="margin-top:14px">
        <select data-a="astat" data-id="${esc(a.id)}">
          ${Object.entries(ST).map(([k, v]) => `<option value="${k}"${a.status === k ? ' selected' : ''}>${v}</option>`).join('')}
        </select>
        <button class="mini del" style="margin:0" data-a="dapp" data-id="${esc(a.id)}">O‘chirish</button>
      </div>
    </div>`).join('') : `<div class="empty">Arizalar yo‘q.</div>`;
}

function renderNews() {
  $('#newsList').innerHTML = news.length ? news.map(n => `
    <div class="t">
      ${n.image ? `<img class="thumb" src="${esc(n.image)}" alt="">` : ''}
      <small>${fmt(n.createdAt)}</small>
      <h3>${esc(n.title)}</h3>
      <p>${esc((n.body || '').slice(0, 140))}${(n.body || '').length > 140 ? '…' : ''}</p>
      <button class="mini del" data-a="dnews" data-id="${esc(n.id)}">O‘chirish</button>
    </div>`).join('') : `<div class="empty">Hozircha yangiliklar yo‘q.</div>`;
}

function renderGallery() {
  $('#galList').innerHTML = gallery.length ? gallery.map(g => `
    <div class="gi"><img src="${esc(g.src)}" alt=""><p>${esc(g.cap)}</p>
    <button class="mini del" data-a="dgal" data-id="${esc(g.id)}">O‘chirish</button></div>`).join('')
    : `<div class="empty">Admin paneldan qo‘shilgan rasmlar yo‘q. (Kodda yozilgan eski rasmlar saytda baribir ko‘rinadi.)</div>`;
}

function renderTeachers() {
  const have = new Set(teachers.map(t => t.id));
  let seedDone = false;
  try { seedDone = localStorage.getItem('seedDone') === '1'; } catch (e) {}
  $('#seedBox').hidden = seedDone || SEED.every(s => have.has(s.id));

  const sorted = [...teachers].sort((a, b) => {
    const pa = a.approved === true ? 1 : 0, pb = b.approved === true ? 1 : 0;
    return pa !== pb ? pa - pb : ord(a) - ord(b);
  });
  $('#tcards').innerHTML = sorted.length ? sorted.map(t => {
    const ok = t.approved === true;
    return `<div class="t ${ok ? '' : 'pend'}">
      <div class="av">${t.photo ? `<img src="${esc(t.photo)}" alt="">` : esc(initials(t.n))}</div>
      <h3>${esc(t.n)}</h3><small>${esc(t.r)}</small><p>${esc(t.b)}</p>
      <p style="margin-top:10px"><span class="pill ${ok ? 'ok' : 'warn'}">${ok ? 'Saytda ko‘rinadi' : 'Tasdiq kutilmoqda'}</span>
      <span class="pill">${t.uid ? 'Foydalanuvchi qo‘shgan' : 'Admin qo‘shgan'}</span></p>
      <div class="ac" style="margin-top:12px">
        <button class="mini" data-a="${ok ? 'unapprove' : 'approve'}" data-id="${esc(t.id)}">${ok ? 'Yashirish' : 'Tasdiqlash'}</button>
        <button class="mini" data-a="eteacher" data-id="${esc(t.id)}">Tahrirlash</button>
        <button class="mini del" data-a="dteacher" data-id="${esc(t.id)}">O‘chirish</button>
      </div></div>`;
  }).join('') : `<div class="empty">Hozircha o‘qituvchilar yo‘q.</div>`;
}

function renderProjects() {
  $('#pcards').innerHTML = projects.length ? projects.map(p => `
    <div class="t"><span class="tag">${esc(p.tag)}</span><h3>${esc(p.n)}</h3><p>${esc(p.b)}</p>
    <small>Muallif: ${esc(p.ownerName)} · ${fmt(p.createdAt)}</small><br>
    <button class="mini del" data-a="dproj" data-id="${esc(p.id)}">Loyihani o‘chirish</button></div>`).join('')
    : `<div class="empty">Hozircha loyihalar yo‘q.</div>`;
}

function render() {
  renderStats(); renderUsers(); renderTeachers(); renderApps(); renderNews(); renderGallery(); renderProjects();
}

// ---------- Tablar ----------
document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
  document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x === b));
  document.querySelectorAll('.pane').forEach(p => p.hidden = p.dataset.p !== b.dataset.t);
});
$('#q').oninput = renderUsers;
$('#rf').onchange = renderUsers;
$('#af').onchange = renderApps;
$('#refresh').onclick = loadAll;

// ---------- Rasmni kichraytirish ----------
function toDataURL(file, max, q) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * k), h = Math.round(img.height * k);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      let out = c.toDataURL('image/jpeg', q);
      for (let t = q; out.length > 900000 && t > 0.3; t -= 0.1) out = c.toDataURL('image/jpeg', t);
      out.length > 950000 ? rej(new Error('Rasm juda katta.')) : res(out);
    };
    img.onerror = () => rej(new Error('Rasm o‘qilmadi.'));
    img.src = url;
  });
}

function squareImg(file, size) {
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

// ---------- O'qituvchi formasi ----------
function paintTPhoto() {
  $('#tav').innerHTML = tPhoto ? `<img src="${esc(tPhoto)}" alt="">` : esc(initials($('#tn').value || '?'));
  $('#trm').hidden = !tPhoto;
}
function resetTForm() {
  editingT = null; tPhoto = '';
  $('#tf').reset();
  $('#tfTitle').textContent = 'Yangi o‘qituvchi qo‘shish';
  $('#tcancel').hidden = true;
  paintTPhoto();
}
function fillTForm(t) {
  editingT = t.id; tPhoto = t.photo || '';
  $('#tn').value = t.n || '';
  $('#r-uz').value = t.r || ''; $('#b-uz').value = t.b || '';
  ['ru', 'en'].forEach(l => {
    $('#r-' + l).value = (t.tr && t.tr[l] && t.tr[l].r) || '';
    $('#b-' + l).value = (t.tr && t.tr[l] && t.tr[l].b) || '';
  });
  $('#tfTitle').textContent = 'O‘qituvchini tahrirlash';
  $('#tcancel').hidden = false;
  say('#tm', '');
  paintTPhoto();
  $('#tf').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
$('#tn').oninput = () => { if (!tPhoto) paintTPhoto(); };
$('#tcancel').onclick = () => { resetTForm(); say('#tm', ''); };
$('#trm').onclick = () => { tPhoto = ''; paintTPhoto(); };
$('#tfile').onchange = async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try { tPhoto = await squareImg(f, 256); paintTPhoto(); say('#tm', ''); }
  catch (err) { say('#tm', err.message); }
};

$('#tf').onsubmit = async e => {
  e.preventDefault();
  const n = $('#tn').value.trim(), r = $('#r-uz').value.trim(), b = $('#b-uz').value.trim();
  if (n.length < 2) return say('#tm', 'Ism va familiyani kiriting.');
  if (r.length < 2) return say('#tm', 'O‘zbekcha fan va tajribani kiriting (majburiy).');
  const tr = {};
  ['ru', 'en'].forEach(l => {
    const rr = $('#r-' + l).value.trim(), bb = $('#b-' + l).value.trim();
    if (rr || bb) tr[l] = { r: rr, b: bb };
  });
  try {
    say('#tm', 'Saqlanmoqda…', true);
    const data = { n, r, b, photo: tPhoto, tr, updatedAt: serverTimestamp() };
    if (editingT) {
      await updateDoc(doc(db, 'teachers', editingT), data);
    } else {
      const max = teachers.reduce((m, t) => Math.max(m, typeof t.order === 'number' ? t.order : 0), 0);
      await addDoc(collection(db, 'teachers'), { ...data, approved: true, source: 'admin', order: max + 1, createdAt: serverTimestamp() });
    }
    resetTForm();
    say('#tm', 'Saqlandi.', true);
    await loadAll();
  } catch (err) { say('#tm', err.code || err.message); }
};

// ---------- 4 ta o'qituvchini bazaga ko'chirish ----------
$('#seed').onclick = async () => {
  try {
    say('#sm', 'Ko‘chirilmoqda…', true);
    const have = new Set(teachers.map(t => t.id));
    let k = 0;
    for (let i = 0; i < SEED.length; i++) {
      const s = SEED[i];
      if (have.has(s.id)) continue;
      await setDoc(doc(db, 'teachers', s.id), {
        n: s.n, r: s.uz.r, b: s.uz.b, photo: '', tr: { ru: s.ru, en: s.en },
        approved: true, source: 'seed', order: i + 1, createdAt: serverTimestamp()
      });
      k++;
    }
    try { localStorage.setItem('seedDone', '1'); } catch (err) {}
    say('#sm', k + ' ta o‘qituvchi ko‘chirildi.', true);
    await loadAll();
  } catch (err) { say('#sm', err.code || err.message); }
};

// ---------- Yangilik qo'shish ----------
$('#nf').onsubmit = async e => {
  e.preventDefault();
  const title = $('#nt').value.trim(), body = $('#nb').value.trim(), f = $('#ni').files[0];
  if (title.length < 3) return say('#nm', 'Sarlavha kamida 3 ta belgidan iborat bo‘lsin.');
  if (body.length < 5) return say('#nm', 'Matnni yozing.');
  try {
    say('#nm', 'Saqlanmoqda…', true);
    const image = f ? await toDataURL(f, 800, 0.7) : '';
    await addDoc(collection(db, 'news'), { title, body, image, authorName: me.displayName || '', createdAt: serverTimestamp() });
    e.target.reset();
    say('#nm', 'Yangilik e’lon qilindi.', true);
    await loadAll();
  } catch (err) { say('#nm', err.message || err.code); }
};

// ---------- Galereyaga rasm qo'shish ----------
$('#gf').onsubmit = async e => {
  e.preventDefault();
  const f = $('#gi').files[0], cap = $('#gc').value.trim();
  if (!f) return say('#gm', 'Rasm tanlang.');
  if (cap.length < 2) return say('#gm', 'Rasm tagidagi yozuvni kiriting.');
  try {
    say('#gm', 'Yuklanmoqda…', true);
    const src = await toDataURL(f, 1000, 0.75);
    await addDoc(collection(db, 'gallery'), { src, cap, createdAt: serverTimestamp() });
    e.target.reset();
    say('#gm', 'Rasm qo‘shildi.', true);
    await loadAll();
  } catch (err) { say('#gm', err.message || err.code); }
};

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
    } else if (a === 'approve' || a === 'unapprove') {
      await updateDoc(doc(db, 'teachers', id), { approved: a === 'approve' });
      const t = teachers.find(x => x.id === id); if (t) t.approved = a === 'approve';
      render();
    } else if (a === 'eteacher') {
      const t = teachers.find(x => x.id === id);
      if (t) fillTForm(t);
    } else if (a === 'dteacher') {
      if (!confirm('Bu o‘qituvchi kartasi o‘chirilsinmi?')) return;
      if (editingT === id) resetTForm();
      await deleteDoc(doc(db, 'teachers', id)); await loadAll();
    } else if (a === 'dproj') {
      if (!confirm('Bu loyiha o‘chirilsinmi?')) return;
      await deleteDoc(doc(db, 'projects', id)); await loadAll();
    } else if (a === 'dapp') {
      if (!confirm('Bu ariza o‘chirilsinmi?')) return;
      await deleteDoc(doc(db, 'applications', id)); await loadAll();
    } else if (a === 'dnews') {
      if (!confirm('Bu yangilik o‘chirilsinmi?')) return;
      await deleteDoc(doc(db, 'news', id)); await loadAll();
    } else if (a === 'dgal') {
      if (!confirm('Bu rasm galereyadan o‘chirilsinmi?')) return;
      await deleteDoc(doc(db, 'gallery', id)); await loadAll();
    }
  } catch (err) { alert('Bajarib bo‘lmadi: ' + (err.code || err.message)); }
});

// ---------- Ariza holatini o'zgartirish ----------
$('#app').addEventListener('change', async e => {
  const s = e.target.closest('select[data-a="astat"]');
  if (!s) return;
  try {
    await updateDoc(doc(db, 'applications', s.dataset.id), { status: s.value });
    const a = apps.find(x => x.id === s.dataset.id); if (a) a.status = s.value;
    renderStats(); renderApps();
  } catch (err) { alert('Bajarib bo‘lmadi: ' + (err.code || err.message)); }
});

// ---------- Excel (CSV) eksport ----------
const safe = v => { v = String(v ?? ''); return /^[=+\-@]/.test(v) ? "'" + v : v; };
function csv(name, rows) {
  const text = '\ufeff' + rows.map(r => r.map(c => '"' + safe(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click();
}
$('#csv').onclick = () => csv('foydalanuvchilar.csv', [
  ['Ism', 'Rol', 'Aloqa', 'Usul', 'Sana', 'Holat'],
  ...users.map(u => [u.name, u.role === 'teacher' ? 'O‘qituvchi' : 'O‘quvchi', u.identifier, KIND[u.kind] || u.kind, fmt(u.createdAt), u.banned ? 'Bloklangan' : 'Faol'])
]);
$('#csvApps').onclick = () => csv('arizalar.csv', [
  ['Sana', 'Ota-ona', 'Telefon', 'Farzand', 'Sinf', 'Izoh', 'Holat'],
  ...apps.map(a => [fmtDT(a.createdAt), a.parent, a.phone, a.child, a.grade, a.message, ST[a.status] || a.status])
]);

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
  paintTPhoto();
  await loadAll();
});