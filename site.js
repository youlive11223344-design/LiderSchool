import { db } from "./firebase.js";
import {
  collection, getDocs, addDoc, query, orderBy, limit, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const T = (k, v) => I18N.t(k, v);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = ts => { try { return ts?.toDate ? ts.toDate().toLocaleDateString(I18N.locale()) : ''; } catch (e) { return ''; } };

// ---------- Yangiliklar ----------
let newsData = [];

function renderNews() {
  if (!newsData.length) return;
  $('#newsList').innerHTML = newsData.map(n => `<article class="nc">
      ${n.image ? `<img src="${esc(n.image)}" alt="${esc(n.title)}" loading="lazy">` : ''}
      <div class="nb">
        <time>${esc(fmt(n.createdAt))}</time>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.body)}</p>
        <button class="more" type="button">${esc(T('news.more'))}</button>
      </div></article>`).join('');
  $('#yangiliklar').hidden = false;
  $('#navNews').hidden = false;
  // "To'liq o'qish" tugmasi faqat matn uzun bo'lsa ko'rinadi
  document.querySelectorAll('.nc').forEach(c => {
    const p = c.querySelector('p'), b = c.querySelector('.more');
    if (p.scrollHeight <= p.clientHeight + 2) b.hidden = true;
  });
}

async function loadNews() {
  try {
    const s = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(6)));
    newsData = s.docs.map(d => d.data());
    renderNews();
  } catch (e) { console.warn('Yangiliklar yuklanmadi:', e); }
}

document.addEventListener('click', e => {
  const b = e.target.closest('.nc .more');
  if (!b) return;
  const p = b.parentElement.querySelector('p');
  const open = p.classList.toggle('open');
  b.textContent = open ? T('news.less') : T('news.more');
});

// ---------- Galereya (admin qo'shgan rasmlar, mavjudlarining ketidan) ----------
async function loadGallery() {
  try {
    const s = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'asc')));
    s.forEach(d => {
      const g = d.data();
      const b = document.createElement('button');
      b.className = 'g';
      b.innerHTML = `<img src="${esc(g.src)}" alt="${esc(g.cap)}" loading="lazy"><span>${esc(g.cap)}</span>`;
      b.onclick = () => {
        $('#lbc').innerHTML = `<img src="${esc(g.src)}" alt="${esc(g.cap)}">`;
        $('#lb').classList.add('on');
      };
      $('#gal').append(b);
    });
  } catch (e) { console.warn('Galereya yuklanmadi:', e); }
}

// ---------- Qabul arizasi ----------
const form = $('#aform');
const sel = $('#grade');
const GRADES = ['Tayyorlov', ...Array.from({ length: 11 }, (_, i) => (i + 1) + '-sinf')]; // bazaga doim o'zbekcha yoziladi

function buildGrades() {
  const cur = sel.value;
  sel.innerHTML = `<option value="">${esc(T('q.pick'))}</option>` +
    GRADES.map((g, i) => `<option value="${g}">${esc(i === 0 ? T('q.prep') : T('q.grade.n', { n: i }))}</option>`).join('');
  sel.value = cur;
}
buildGrades();

const say = (t, ok) => { const m = $('#amsg'); m.textContent = t; m.className = 'qmsg' + (ok ? ' ok' : ''); };
let sending = false;

form.onsubmit = async e => {
  e.preventDefault();
  if (sending) return;
  const f = form.elements;
  if (f.website.value) return; // spam tuzog'i (bot to'ldiradi)

  let last = 0;
  try { last = +localStorage.getItem('appTs') || 0; } catch (err) {}
  if (Date.now() - last < 60000) return say(T('q.e.wait'));

  const parent = f.parent.value.trim(), child = f.child.value.trim();
  const phone = f.phone.value.replace(/[^\d+]/g, '');
  if (parent.length < 2) return say(T('q.e.parent'));
  if (phone.replace(/\D/g, '').length < 9) return say(T('q.e.phone'));
  if (child.length < 2) return say(T('q.e.child'));
  if (!f.grade.value) return say(T('q.e.grade'));

  sending = true; f.send.disabled = true; say(T('q.sending'), true);
  try {
    await addDoc(collection(db, 'applications'), {
      parent, phone: phone.slice(0, 20), child, grade: f.grade.value,
      message: f.message.value.trim().slice(0, 500), status: 'new', createdAt: serverTimestamp()
    });
    try { localStorage.setItem('appTs', String(Date.now())); } catch (err) {}
    form.reset();
    say(T('q.ok'), true);
  } catch (err) {
    say(T('q.fail'));
    console.warn(err);
  } finally { sending = false; f.send.disabled = false; }
};

window.addEventListener('langchange', () => { buildGrades(); renderNews(); });

loadNews();
loadGallery();