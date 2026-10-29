/* =====================================================
   ✏️ SHU YERDAN TAHRIRLANG (Visual Studio Code'da)
   Matnlar (tarjimalar) i18n.js faylida turadi.
   O'qituvchilar endi admin paneldan boshqariladi.
   ===================================================== */

// 📍 1) MAKTAB KOORDINATASI (manzil matni i18n.js ichida: 'loc.addr')
const SCHOOL = {
  lat: 40.49644391831609,   // <-- LATITUDE (kenglik)
  lng: 68.76960876683343    // <-- LONGITUDE (uzunlik)
};

// 🗺️ Xarita: Google Maps → Ulashish → Xaritani joylashtirish → iframe ichidagi src="..." ni shu yerga qo'ying.
const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d619.6711137612483!2d68.76960876683343!3d40.49644391831609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b2070045b69d51%3A0x8d59fccba0c81565!2sLider%20o'quv%20Markazi!5e0!3m2!1suz!2s!4v1792160020943!5m2!1suz!2s";

// 🎬 2) BOSH SAHIFA VIDEOSI
const HERO_VIDEO = "videos/animatsiya.mp4";
const HERO_POSTER = "";

// 🖼️ 3) GALEREYA RASMLARI (yozuvlari i18n.js ichida: 'gal.caps', xuddi shu tartibda)
const GALLERY = [
  {src:"images/matematika.jpg"},
  {src:"images/kimyo.jpg"},
  {src:"images/kutubxona.jpg"},
  {src:"images/tanaffus.jpg"},
  {src:"images/robototexnika.jpg"},
  {src:"images/sportzal.jpg"},
  {src:"images/tasviriy_sanat.jpg"},
  {src:"images/bitiruv.jpg"}
];

// 🏫 4) KAMPUS XONALARI (matnlari i18n.js ichida: 'rooms')
const ROOMS = ['sinf','lab','kutub','zal','it','oshxona'];

// 🎞️ 5) VIDEOLAR — type: "youtube" (id yozing) yoki "mp4" (fayl yo'li). Nomlari i18n.js ichida: 'vid.list'
const VIDEOS = [
  {type:"youtube",id:"3hM6AXRFLro"},
  {type:"youtube",id:"j1PtPCJAiZ4"},
  {type:"youtube",id:"CVmCZSdm8AY"}
];

/* =====================================================
   Quyidagi kodni o'zgartirish shart emas
   ===================================================== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const T=(k,v)=>I18N.t(k,v);
const c=`${SCHOOL.lat},${SCHOOL.lng}`;

// Menu
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
$$('#menu a').forEach(a=>a.onclick=()=>$('#menu').classList.remove('open'));
$('#yr').textContent=new Date().getFullYear();

// 🌙 Dark / Night rejim
const root=document.documentElement, tb=$('#theme');
if(!root.dataset.theme)root.dataset.theme=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
function paintTheme(){
  const d=root.dataset.theme==='dark';
  tb.textContent=d?'☀️':'🌙';
  tb.title=d?T('th.light'):T('th.dark');
}
tb.onclick=()=>{
  root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';
  try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}
  paintTheme();
};

// Hero: aylanuvchi so'z + hisoblagichlar + video
let wi=0;
const words=()=>I18N.get('hero.words');
$('#rot').textContent=words()[0];
setInterval(()=>{const e=$('#rot');e.style.opacity=0;setTimeout(()=>{const w=words();wi=(wi+1)%w.length;e.textContent=w[wi];e.style.opacity=1},400)},2800);
const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;io.unobserve(x.target);const el=x.target,n=+el.dataset.n;let v=0;const t=setInterval(()=>{v+=Math.ceil(n/40);if(v>=n){v=n;clearInterval(t)}el.textContent=v},30)}));
$$('[data-n]').forEach(e=>io.observe(e));
if(HERO_VIDEO){const v=$('#heroVideo');v.src=HERO_VIDEO;v.poster=HERO_POSTER;v.hidden=false;$('#heroPh').hidden=true}

// Manzil
$('#map').src = MAP_EMBED || `https://maps.google.com/maps?q=${c}&z=16&output=embed`;
$('#navG').href=`https://www.google.com/maps/dir/?api=1&destination=${c}&travelmode=driving`;
$('#navY').href=`https://yandex.com/maps/?rtext=~${c}&rtt=auto`;
$('#navMe').onclick=()=>{
  const m=$('#locmsg');
  if(!navigator.geolocation){m.textContent=T('loc.nogeo');return}
  m.textContent=T('loc.finding');
  navigator.geolocation.getCurrentPosition(p=>{
    const R=6371,r=x=>x*Math.PI/180,dLa=r(SCHOOL.lat-p.coords.latitude),dLo=r(SCHOOL.lng-p.coords.longitude);
    const a=Math.sin(dLa/2)**2+Math.cos(r(p.coords.latitude))*Math.cos(r(SCHOOL.lat))*Math.sin(dLo/2)**2;
    m.textContent=T('loc.dist',{km:(2*R*Math.asin(Math.sqrt(a))).toFixed(1)});
  },()=>m.textContent=T('loc.denied'));
};

// Galereya + lightbox
const lb=$('#lb'),lbc=$('#lbc');
const galBtns=[];
GALLERY.forEach((g,i)=>{
  const b=document.createElement('button');b.className='g';
  b.innerHTML=`<img src="${g.src}" alt="" loading="lazy"><span></span>`;
  b.onclick=()=>{const cap=(T('gal.caps')[i]||'');lbc.innerHTML=`<img src="${g.src}" alt="${cap}">`;lb.classList.add('on')};
  galBtns.push(b);
  $('#gal').append(b);
});
function paintGallery(){galBtns.forEach((b,i)=>{const cap=(T('gal.caps')[i]||'');b.querySelector('span').textContent=cap;b.querySelector('img').alt=cap})}
lb.onclick=e=>{if(e.target===lb||e.target.tagName==='BUTTON')lb.classList.remove('on')};
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});

// Kampus
let curRoom='sinf';
function showRoom(k){
  curRoom=k;
  const r=T('rooms')[k];
  $$('.room').forEach(x=>x.classList.toggle('on',x.dataset.k===k));
  $('#info').innerHTML=`<h3>${r.t}</h3><p>${r.d}</p><ul>${r.l.map(i=>`<li>${i}</li>`).join('')}</ul>`;
}
$$('.room').forEach(r=>{r.onclick=()=>showRoom(r.dataset.k);r.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showRoom(r.dataset.k)}}});

// O'quvchi loyihalari (statik namunalar .st — foydalanuvchi loyihalariga tegmaydi)
function paintPeople(){
  $$('#proj .st').forEach(e=>e.remove());
  const pl=T('proj.list');
  $('#proj').insertAdjacentHTML('afterbegin',pl.map(p=>`<div class="t st"><span class="tag">${p.tag}</span><h3>${p.n}</h3><p>${p.b}</p></div>`).join(''));
}
$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));$('#team').hidden=t.dataset.t!=='team';$('#proj').hidden=t.dataset.t!=='proj'});

// Videolar
$('#vids').innerHTML=VIDEOS.map(v=>{
  let f='<div class="frame">—</div>';
  if(v.type==='youtube'&&v.id)f=`<div class="frame"><iframe src="https://www.youtube.com/embed/${v.id}" title="" loading="lazy" allowfullscreen></iframe></div>`;
  if(v.type==='mp4'&&v.src)f=`<div class="frame"><video src="${v.src}" controls preload="metadata"></video></div>`;
  return `<div class="vc">${f}<div class="txt"><h3></h3><p></p></div></div>`}).join('');
function paintVideos(){
  const vl=T('vid.list');
  $$('.vc').forEach((c,i)=>{const v=vl[i]||{t:'',d:''};c.querySelector('h3').textContent=v.t;c.querySelector('p').textContent=v.d;const f=c.querySelector('iframe');if(f)f.title=v.t});
}

// Tilga bog'liq hamma narsani chizish
function paintAll(){
  $('#addr').textContent=T('loc.addr');
  paintTheme();paintGallery();showRoom(curRoom);paintPeople();paintVideos();
  const w=words();$('#rot').textContent=w[wi%w.length];
}
paintAll();
addEventListener('langchange',paintAll);