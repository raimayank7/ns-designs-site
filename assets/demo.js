/* Sample websites AND the customers' real Blogger sites (scripts/blogger.py inlines this file):
   menu, light/dark, menu tabs, before/after sliders, the advocate notice, "this is a sample" messages,
   forms that open WhatsApp (data-wa-form, real sites only) and colour/mode changes sent by the viewer. */
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

  /* tabs (menu groups): without JavaScript every group stays visible */
  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (t) {
    var tabs = t.querySelectorAll('[role=tab]'), panels = t.querySelectorAll('[role=tabpanel]');
    function pick(i, focus) {
      Array.prototype.forEach.call(tabs, function (b, k) {
        b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; panels[k].hidden = k !== i;
      });
      if (focus) tabs[i].focus();
    }
    Array.prototype.forEach.call(tabs, function (b, k) {
      b.addEventListener('click', function () { pick(k); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? k + 1 : e.key === 'ArrowLeft' ? k - 1 : -2;
        if (n > -2) { e.preventDefault(); pick((n + tabs.length) % tabs.length, true); }
      });
    });
    pick(0);
  });

  /* before / after sliders */
  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-ba]')) e.target.closest('.ba').style.setProperty('--x', e.target.value + '%');
  });

  /* advocate notice: once per visit */
  var ack = document.querySelector('[data-ack]');
  if (ack && !h.classList.contains('shot')) {
    var seen = false;
    try { seen = sessionStorage.getItem('nsd-ack') === '1'; } catch (e) {}
    if (!seen) { ack.hidden = false; var ok = ack.querySelector('[data-ack-ok]'); ok.focus(); }
    ack.querySelector('[data-ack-ok]').addEventListener('click', function () {
      ack.hidden = true; try { sessionStorage.setItem('nsd-ack', '1'); } catch (e) {}
    });
  }

  /* real sites: forms open WhatsApp with every answer typed in */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-wa-form]');
    if (!f) return;
    e.preventDefault();
    var L = [f.dataset.subject || 'Message from the website'];
    Array.prototype.forEach.call(f.elements, function (el) {
      if (!el.name || !String(el.value).trim()) return;
      L.push(el.name + ': ' + String(el.value).trim());
    });
    window.open('https://wa.me/' + f.dataset.wa + '?text=' + encodeURIComponent(L.join('\n')), '_blank', 'noopener');
  });

  /* sample websites: buttons and forms explain themselves */
  var toast = document.querySelector('.toast'), tt;
  function say(html) {
    if (!toast) return;
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
  Array.prototype.forEach.call(document.querySelectorAll('[data-sample-form]'), function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      say('Sample only: on your website this form sends the answers straight to your WhatsApp. ' +
        '<a href="' + view + '" target="_top">Get this design</a>');
    });
  });

  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.nsd !== 'set') return;
    if (e.data.mode === 'light' || e.data.mode === 'dark') setMode(e.data.mode);
    if (/^[0-2]$/.test(String(e.data.c))) h.dataset.c = String(e.data.c);
  });
})();
