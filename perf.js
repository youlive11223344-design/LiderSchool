(function () {
  var KEY = 'perf', AUTO = 'perfAuto';
  var root = document.documentElement;
  var pref = null, auto = false;
  try { pref = localStorage.getItem(KEY); auto = localStorage.getItem(AUTO) === '1'; } catch (e) {}

  var TXT = {
    uz: {
      on: 'Yengil rejim yoqilgan. O‘chirish uchun bosing',
      off: 'Yengil rejim (sekin qurilmalar uchun). Yoqish uchun bosing',
      note: 'Sayt sekin ishlayotgani sezildi, yengil rejimga o‘tdi. O‘chirish uchun menyudagi chaqmoq tugmasini bosing.'
    },
    ru: {
      on: 'Лёгкий режим включён. Нажмите, чтобы выключить',
      off: 'Лёгкий режим (для слабых устройств). Нажмите, чтобы включить',
      note: 'Сайт работал медленно, поэтому включён лёгкий режим. Чтобы выключить, нажмите кнопку с молнией в меню.'
    },
    en: {
      on: 'Lite mode is on. Click to turn it off',
      off: 'Lite mode (for slow devices). Click to turn it on',
      note: 'The site was running slowly, so lite mode was switched on. Use the lightning button in the menu to turn it off.'
    }
  };
  function T() {
    var l = 'uz';
    try { l = (window.I18N && I18N.current && I18N.current()) || localStorage.getItem('lang') || 'uz'; } catch (e) {}
    return TXT[l] || TXT.uz;
  }

  function weak() {
    var n = navigator, c = n.connection || {};
    return !!((n.hardwareConcurrency && n.hardwareConcurrency <= 2) ||
              (n.deviceMemory && n.deviceMemory <= 2) ||
              c.saveData === true ||
              (window.matchMedia && matchMedia('(prefers-reduced-transparency: reduce)').matches));
  }

  var lite = pref === 'lite' || (pref !== 'full' && (auto || weak()));
  if (lite) root.classList.add('lite');

  /* ---------- Uslublar ---------- */
  var decor = [
    '.hero::before', '.hero::after', '.hero .cta::before', '.stats::before', '.stats::after',
    '.campus::before', '.campus::after', '#yangiliklar::before', '#yangiliklar::after',
    '#jamoa::before', '#jamoa::after', '#qabul::before', '#qabul::after'
  ].map(function (s) { return 'html.lite ' + s; }).join(',') + '{display:none!important}';

  var noShadow = ['.vbox', '.stats div', '.info', 'nav .wrap', '.nc', '.t', '.pf', '.qform', '.ghost', '#lb img']
    .map(function (s) { return 'html.lite ' + s; }).join(',') + '{box-shadow:none!important}';

  var css = [
    '#perf{order:3;flex:none;width:32px;height:32px;margin-left:10px;padding:0;border-radius:50%;border:1.5px solid rgba(255,255,255,.4);background:transparent;color:#fff;display:grid;place-items:center;cursor:pointer}',
    '#perf:hover{border-color:#E7C777}',
    '#perf[aria-pressed=true]{background:#C9A24A;border-color:#C9A24A;color:#0A1B45}',
    '.pnote{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:80;max-width:92vw;padding:12px 18px;border-radius:18px;background:rgba(10,27,69,.96);color:#fff;border:1px solid rgba(255,255,255,.25);font:600 14px/1.4 system-ui,sans-serif;text-align:center}',

    '.vc .frame .yt{position:absolute;left:0;top:0;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:#0A1B45 center/cover no-repeat}',
    '.vc .frame .yt::before{content:"";position:absolute;left:0;top:0;right:0;bottom:0;background:linear-gradient(transparent 55%,rgba(10,27,69,.55))}',
    '.vc .frame .yt span{position:absolute;left:50%;top:50%;width:68px;height:68px;margin:-34px 0 0 -34px;border-radius:50%;background:#C9A24A;display:block}',
    '.vc .frame .yt span::after{content:"";position:absolute;left:27px;top:20px;border-style:solid;border-width:14px 0 14px 22px;border-color:transparent transparent transparent #0A1B45}',
    '.vc .frame .yt:hover span{background:#E7C777}',

    'html.lite{scroll-behavior:auto}',
    'html.lite *,html.lite *::before,html.lite *::after{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;transition:none!important}',
    'html.lite .ring{animation:none!important;display:none!important}',
    decor,
    noShadow,
    'html.lite nav .wrap{background:rgba(10,27,69,.97)}',
    'html.lite[data-theme=dark] nav .wrap{background:rgba(6,13,34,.97)}',
    'html.lite .stats div,html.lite .ghost{background:rgba(255,255,255,.14)}',
    'html.lite .info{background:rgba(255,255,255,.09)}',
    'html.lite #yangiliklar .nc,html.lite #jamoa .t,html.lite #jamoa .pf,html.lite #qabul .qform{background:rgba(255,255,255,.12)}',
    'html.lite #lb{background:rgba(5,12,32,.95)}',
    'html.lite[data-theme=dark] #map{filter:none}',
    'html.lite[data-theme=dark] .g img,html.lite[data-theme=dark] .av img,html.lite[data-theme=dark] .nc img{filter:none}',
    'html.lite .nc:hover,html.lite .btn:hover,html.lite #authLi a:hover{transform:none!important}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var btn = null, vid = null;

  function paintBtn() {
    if (!btn) return;
    var on = root.classList.contains('lite'), t = T();
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? t.on : t.off);
    btn.title = on ? t.on : t.off;
  }

  function setLite(on, how) {
    root.classList.toggle('lite', on);
    try {
      if (how === 'user') {
        localStorage.setItem(KEY, on ? 'lite' : 'full');
        localStorage.removeItem(AUTO);
      } else if (how === 'auto' && on) {
        localStorage.setItem(AUTO, '1');
      }
    } catch (e) {}
    if (vid) {
      if (on) vid.pause();
      else if (vid.src) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
    }
    paintBtn();
  }

  /* ---------- YouTube: bosilmaguncha yuklanmaydi ---------- */
  function facades() {
    var list = document.querySelectorAll('.vc .frame iframe');
    for (var i = 0; i < list.length; i++) {
      (function (f) {
        var m = /embed\/([\w-]{6,})/.exec(f.getAttribute('src') || '');
        if (!m) return;
        var id = m[1], box = f.parentNode, title = f.title || '';
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'yt';
        b.setAttribute('aria-label', title || 'Play');
        b.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
        b.appendChild(document.createElement('span'));
        b.onclick = function () {
          var n = document.createElement('iframe');
          n.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
          n.title = title;
          n.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
          n.setAttribute('allowfullscreen', '');
          box.replaceChild(n, b);
        };
        box.replaceChild(b, f);
      })(list[i]);
    }
  }

  /* ---------- Tezlikni o'lchash: sekin bo'lsa, o'zi yengil rejimga o'tadi ---------- */
  function note() {
    var d = document.createElement('div');
    d.className = 'pnote';
    d.textContent = T().note;
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 8000);
  }

  function probe() {
    if (pref === 'lite' || pref === 'full' || root.classList.contains('lite')) return;
    if (!window.requestAnimationFrame) return;
    var gaps = [], last = 0, n = 0, aborted = false;
    function tick(ts) {
      if (document.hidden) { aborted = true; return; }
      if (last) gaps.push(ts - last);
      last = ts;
      if (++n < 50) requestAnimationFrame(tick); else finish();
    }
    function finish() {
      if (aborted || gaps.length < 20) return;
      gaps.sort(function (a, b) { return a - b; });
      var med = gaps[Math.floor(gaps.length / 2)];
      if (med > 26) { setLite(true, 'auto'); note(); }
    }
    setTimeout(function () { if (!document.hidden) requestAnimationFrame(tick); }, 2500);
  }

  function init() {
    var nav = document.querySelector('nav .wrap'), th = document.getElementById('theme');
    if (nav && th) {
      btn = document.createElement('button');
      btn.id = 'perf';
      btn.type = 'button';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>';
      btn.onclick = function () { setLite(!root.classList.contains('lite'), 'user'); };
      nav.insertBefore(btn, th);
      paintBtn();
    }

    vid = document.getElementById('heroVideo');
    if (vid) {
      var guard = function () { if (root.classList.contains('lite') && !vid.paused) vid.pause(); };
      vid.addEventListener('play', guard);
      vid.addEventListener('loadeddata', guard);
      guard();
    }

    facades();
    probe();
    window.addEventListener('langchange', paintBtn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();