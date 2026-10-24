/* =====================================================
   ✏️ SHU YERDAN TAHRIRLANG (Visual Studio Code'da)
   ===================================================== */

// 📍 1) MAKTAB MANZILI — koordinatani o'zgartiring.
//    Google Maps'da maktabni toping → o'ng tugma → birinchi qator (masalan 39.6542, 66.9597) ni nusxalang.
const SCHOOL = {
  name: "Lider xususiy maktabi",
  address: "FQWC+J3G, Shifokor ko‘chasi, Guliston, Sirdaryo viloyati, O‘zbekiston",
  lat: 40.49644391831609,   // <-- LATITUDE (kenglik)
  lng: 68.76960876683343    // <-- LONGITUDE (uzunlik)
};

// 🗺️ Xarita: Google Maps → Ulashish → Xaritani joylashtirish → iframe ichidagi src="..." ni shu yerga qo'ying.
// Bo'sh qoldirsangiz, xarita koordinatadan avtomatik chiqadi.
const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d619.6711137612483!2d68.76960876683343!3d40.49644391831609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b2070045b69d51%3A0x8d59fccba0c81565!2sLider%20o'quv%20Markazi!5e0!3m2!1suz!2s!4v1792160020943!5m2!1suz!2s";

// 🎬 2) BOSH SAHIFA VIDEOSI (mp4 yo'li yoki bo'sh qoldiring)
const HERO_VIDEO = "videos/animatsiya.mp4";   // masalan: "videos/hero.mp4"
const HERO_POSTER = "";  // masalan: "img/tanaffus.jpg"

// 🖼️ 3) GALEREYA — rasmlar img/ papkada turishi kerak
const GALLERY = [
  {src:"images/matematika.jpg", cap:"Matematika darsi"},
  {src:"images/kimyo.jpg", cap:"Kimyo laboratoriyasi"},
  {src:"images/kutubxona.jpg", cap:"Kutubxonada"},
  {src:"images/tanaffus.jpg", cap:"Tanaffus"},
  {src:"images/robototexnika.jpg", cap:"Robototexnika to‘garagi"},
  {src:"images/sportzal.jpg", cap:"Sport zali"},
  {src:"images/tasviriy_sanat.jpg", cap:"Tasviriy san’at"},
  {src:"images/bitiruv.jpg", cap:"Bitiruv kuni"}
];

// 🏫 4) KAMPUS XONALARI (matnlarni o'zgartiring)
const ROOMS = {
  sinf:{t:"Sinfxonalar",d:"Keng, yorug‘ va zamonaviy jihozlangan sinflar. Har birida 20–25 o‘quvchi.",l:["Interaktiv doska","Kondensioner","Ergonomik mebel"]},
  lab:{t:"Laboratoriyalar",d:"Fizika, kimyo va biologiya bo‘yicha amaliy mashg‘ulotlar.",l:["Xavfsiz tajriba stollari","Mikroskoplar","Elektronika to‘plamlari"]},
  kutub:{t:"Kutubxona",d:"Uch tilda kitoblar va tinch o‘qish zonasi.",l:["O‘zbek, rus, ingliz","Elektron katalog","Guruh xonasi"]},
  zal:{t:"Sport zali",d:"Basketbol, voleybol, gimnastika va suzish tayyorgarligi.",l:["Professional pol qoplamasi","Murabbiylar","Suzish havzasi"]},
  it:{t:"IT markazi",d:"Dasturlash, robototexnika va 3D modellashtirish.",l:["Kompyuterlar","3D printer","Robot to‘plamlari"]},
  oshxona:{t:"Oshxona",d:"Kunlik issiq, sog‘lom ovqat.",l:["Haftalik menyu","Allergiya hisobga olinadi"]}
};

// 👩‍🏫 5) O'QITUVCHILAR (photo: "img/ali.jpg" yozsangiz, harflar o'rniga rasm chiqadi)
const TEAM = [
  {n:"Dostonbek Kulchaboyev",r:"Matematika, 15 yil tajriba",b:"Olimpiada g‘oliblarini tayyorlaydi.",photo:""},
  {n:"Dilshodbek Ziyadullayev",r:"Kimyo",b:"Kimyo to‘garagi rahbari.",photo:""},
  {n:"Maftuna Maxkamova",r:"Ingliz tili (IELTS 7.5)",b:"Xalqaro sertifikatlarga tayyorlaydi.",photo:""},
  {n:"Jamshid Po'latov",r:"Tarix",b:"Huquq va Tarix fanlari mutaxasisi",photo:""}
];

// 🚀 6) O'QUVCHI LOYIHALARI
const PROJECTS = [
  {tag:"Robototexnika",n:"Aqlli sug‘orish tizimi",b:"8-sinf o‘quvchilari tomonidan yaratilgan, namlik sensorli qurilma."},
  {tag:"Dasturlash",n:"Maktab ovqat menyu ilovasi",b:"Telegram bot orqali kunlik menyu va fikr-mulohaza."},
  {tag:"Ekologiya",n:"Plastik o‘rniga mato qoplar",b:"6-sinf eko-klubi loyihasi, shahar yarmarkasida taqdim etilgan."}
];

// 🎞️ 7) VIDEO-KONTAYNERLAR — type: "youtube" (id yozing) yoki "mp4" (fayl yo'li)
const VIDEOS = [
  {title:"Maktab bilan tanishuv",desc:"1 daqiqada Lider maktabi.",type:"youtube",id:"3hM6AXRFLro"},
  {title:"Maktabda bir kun",desc:"Ertalabdan kechgacha.",type:"youtube",id:"j1PtPCJAiZ4"},
  {title:"Direktor murojaati",desc:"Ta’lim yondashuvimiz haqida.",type:"youtube",id:"CVmCZSdm8AY"}
];

/* =====================================================
   Quyidagi kodni o'zgartirish shart emas
   ===================================================== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
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
  tb.title=d?'Kunduzgi rejim':'Tungi rejim';
}
tb.onclick=()=>{
  root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';
  try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}
  paintTheme();
};
paintTheme();

// Hero: rotating phrase + counters + video
const words=["yetakchi bo‘ladi","olim bo‘ladi","kashfiyotchi bo‘ladi","jasur bo‘ladi"];let wi=0;
setInterval(()=>{const e=$('#rot');e.style.opacity=0;setTimeout(()=>{wi=(wi+1)%words.length;e.textContent=words[wi];e.style.opacity=1},400)},2800);
const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;io.unobserve(x.target);const el=x.target,n=+el.dataset.n;let v=0;const t=setInterval(()=>{v+=Math.ceil(n/40);if(v>=n){v=n;clearInterval(t)}el.textContent=v},30)}));
$$('[data-n]').forEach(e=>io.observe(e));
if(HERO_VIDEO){const v=$('#heroVideo');v.src=HERO_VIDEO;v.poster=HERO_POSTER;v.hidden=false;$('#heroPh').hidden=true}

// Location
$('#addr').textContent=SCHOOL.address;
$('#map').src = MAP_EMBED || `https://maps.google.com/maps?q=${c}&z=16&output=embed`;
// Google: origin ko'rsatilmasa — qurilmaning hozirgi joyi avtomatik olinadi
$('#navG').href=`https://www.google.com/maps/dir/?api=1&destination=${c}&travelmode=driving`;
// Yandex: "~" belgisi — boshlang'ich nuqta = hozirgi joy
$('#navY').href=`https://yandex.com/maps/?rtext=~${c}&rtt=auto`;
$('#navMe').onclick=()=>{
  const m=$('#locmsg');
  if(!navigator.geolocation){m.textContent="Brauzer joylashuvni qo‘llab-quvvatlamaydi.";return}
  m.textContent="Joylashuvingiz aniqlanmoqda…";
  navigator.geolocation.getCurrentPosition(p=>{
    const R=6371,r=x=>x*Math.PI/180,dLa=r(SCHOOL.lat-p.coords.latitude),dLo=r(SCHOOL.lng-p.coords.longitude);
    const a=Math.sin(dLa/2)**2+Math.cos(r(p.coords.latitude))*Math.cos(r(SCHOOL.lat))*Math.sin(dLo/2)**2;
    m.textContent=`Maktabgacha taxminan ${(2*R*Math.asin(Math.sqrt(a))).toFixed(1)} km (to‘g‘ri chiziq bo‘yicha).`;
  },()=>m.textContent="Ruxsat berilmadi. Brauzer sozlamalarida joylashuvga ruxsat bering.");
};

// Gallery + lightbox
const lb=$('#lb'),lbc=$('#lbc');
GALLERY.forEach(g=>{
  const b=document.createElement('button');b.className='g';
  b.innerHTML=(g.src?`<img src="${g.src}" alt="${g.cap}" loading="lazy">`:`<i>Rasm joyi</i>`)+`<span>${g.cap}</span>`;
  b.onclick=()=>{lbc.innerHTML=g.src?`<img src="${g.src}" alt="${g.cap}">`:`<div class="ph2"><h3>${g.cap}</h3></div>`;lb.classList.add('on')};
  $('#gal').append(b);
});
lb.onclick=e=>{if(e.target===lb||e.target.tagName==='BUTTON')lb.classList.remove('on')};
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});

// Campus
function showRoom(k){
  const r=ROOMS[k];$$('.room').forEach(x=>x.classList.toggle('on',x.dataset.k===k));
  $('#info').innerHTML=`<h3>${r.t}</h3><p>${r.d}</p><ul>${r.l.map(i=>`<li>${i}</li>`).join('')}</ul>`;
}
$$('.room').forEach(r=>{r.onclick=()=>showRoom(r.dataset.k);r.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showRoom(r.dataset.k)}}});
showRoom('sinf');

// Team & projects
$('#team').innerHTML=TEAM.map(t=>`<div class="t"><div class="av">${t.photo?`<img src="${t.photo}" alt="${t.n}">`:t.n.split(' ').map(w=>w[0]).join('')}</div><h3>${t.n}</h3><small>${t.r}</small><p>${t.b}</p></div>`).join('');
$('#proj').innerHTML=PROJECTS.map(p=>`<div class="t"><span class="tag">${p.tag}</span><h3>${p.n}</h3><p>${p.b}</p></div>`).join('');
$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));$('#team').hidden=t.dataset.t!=='team';$('#proj').hidden=t.dataset.t!=='proj'});

// Videos
$('#vids').innerHTML=VIDEOS.map(v=>{
  let f='<div class="frame">Video joyi<br>(VIDEOS ro‘yxatini to‘ldiring)</div>';
  if(v.type==='youtube'&&v.id)f=`<div class="frame"><iframe src="https://www.youtube.com/embed/${v.id}" title="${v.title}" loading="lazy" allowfullscreen></iframe></div>`;
  if(v.type==='mp4'&&v.src)f=`<div class="frame"><video src="${v.src}" controls preload="metadata"></video></div>`;
  return `<div class="vc">${f}<div class="txt"><h3>${v.title}</h3><p>${v.desc}</p></div></div>`}).join('');