/* Sample websites: menu, light/dark, "this is a sample" messages, and colour/mode changes sent by the viewer. */
(function () {
  var h = document.documentElement;
  function ready() { h.classList.add('ready'); }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]).then(ready);
  } else ready();

  var nav = document.getElementById('nav'), mb = document.querySelector('.menu-b');
  if (mb) mb.addEventListener('click', function () {
    var on = nav.classList.toggle('open');
    mb.setAttribute('aria-expanded', on ? 'true' : 'false');
  });
  if (nav) nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { nav.classList.remove('open'); if (mb) mb.setAttribute('aria-expanded', 'false'); }
  });

  function setMode(m, keep) {
    h.dataset.mode = m;
    if (keep) try { localStorage.setItem('nsd-mode', m); } catch (e) {}
  }
  var mt = document.querySelector('[data-mode-toggle]');
  if (mt) mt.addEventListener('click', function () {
    var m = h.dataset.mode === 'dark' ? 'light' : 'dark';
    setMode(m, true);
    if (window.parent !== window) window.parent.postMessage({ nsd: 'mode', mode: m }, location.origin);
  });

  var toast = document.querySelector('.toast'), tt;
  function say(html) {
    toast.innerHTML = html;
    toast.classList.add('on');
    clearTimeout(tt);
    tt = setTimeout(function () { toast.classList.remove('on'); }, 5200);
  }
  var view = location.pathname.replace('/demo/', '/view/');
  var MSG = 'This is a sample website. On your own website this button opens <b>your</b> WhatsApp or phone. ' +
    '<a href="' + view + '" target="_top">Get this design</a>';
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-sample]');
    if (!a) return;
    if (a.getAttribute('href') === '#contact' && !a.classList.contains('fwa') && a.closest('.hero,.ctab')) {
      setTimeout(function () { say(MSG); }, 400);
      return;
    }
    e.preventDefault();
    say(MSG);
  });
  var f = document.querySelector('[data-sample-form]');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    say('Sample only: on your website this form sends the message straight to your WhatsApp. ' +
      '<a href="' + view + '" target="_top">Get this design</a>');
  });

  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.nsd !== 'set') return;
    if (e.data.mode === 'light' || e.data.mode === 'dark') setMode(e.data.mode);
    if (/^[0-2]$/.test(String(e.data.c))) h.dataset.c = String(e.data.c);
  });
})();
