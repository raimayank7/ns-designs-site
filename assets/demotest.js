/* Sample websites only (never in a customer's Blogger theme): "Ads check" from the viewer shows where Google AdSense ads
   fit in this design: top display ad, in-feed ad in the list, in-article ad in the About text, a display ad between sections,
   a multiplex (related content) block and an anchor ad at the bottom of the screen. They are drawn boxes, not real ads:
   AdSense fills such places only on the customer's own approved site. Turn on with postMessage {nsd:'ads', on:true} or ?ads=1. */
(function () {
  var h = document.documentElement, made = [];
  var CSS = '.nsg{box-sizing:border-box;margin:22px auto;max-width:970px;padding:0 16px;font:13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:#3c4043}' +
    '.nsg-l{display:flex;justify-content:space-between;gap:8px;margin:0 0 4px;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#70757a}' +
    '.nsg-b{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;border:1px solid #dadce0;border-radius:8px;' +
    'background:repeating-linear-gradient(135deg,#f8f9fa 0 12px,#f1f3f4 12px 24px);min-height:var(--h,250px);padding:12px}' +
    '.nsg-b b{font-size:15px;color:#202124}.nsg-b span{color:#5f6368}' +
    '.nsg-m{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;width:100%;margin-top:8px}' +
    '.nsg-m i{display:block;height:90px;border-radius:6px;background:#e8eaed}' +
    'li.nsg-li{list-style:none;grid-column:1/-1;width:100%;padding:0;margin:8px 0}li.nsg-li .nsg{margin:0;padding:0;max-width:none}' +
    '.nsg-anc{position:fixed;left:0;right:0;bottom:0;z-index:60;margin:0;max-width:none;padding:6px 10px 8px;background:#fff;box-shadow:0 -4px 16px rgba(0,0,0,.18)}' +
    '.nsg-anc .nsg-b{min-height:50px;flex-direction:row;gap:10px}.nsg-x{border:0;background:#f1f3f4;border-radius:6px;min-width:40px;min-height:32px;font:16px system-ui;cursor:pointer;color:#202124}' +
    'html[data-mode="dark"] .nsg{color:#e8eaed}html[data-mode="dark"] .nsg-b{border-color:#5f6368;background:repeating-linear-gradient(135deg,#2a2b2e 0 12px,#303134 12px 24px)}' +
    'html[data-mode="dark"] .nsg-b b{color:#f1f3f4}html[data-mode="dark"] .nsg-b span,html[data-mode="dark"] .nsg-l{color:#bdc1c6}html[data-mode="dark"] .nsg-m i{background:#3c4043}' +
    'html[data-mode="dark"] .nsg-anc{background:#202124}html[data-mode="dark"] .nsg-x{background:#3c4043;color:#f1f3f4}';

  function unit(kind, size, h, extra) {
    var d = document.createElement('div');
    d.className = 'nsg';
    d.setAttribute('role', 'note');
    d.setAttribute('aria-label', 'Sample ad place: ' + kind);
    d.innerHTML = '<p class="nsg-l"><span>Ad</span><span>Sample place for Google AdSense</span></p>' +
      '<div class="nsg-b" style="--h:' + h + 'px"><b>' + kind + '</b><span>' + size + '</span>' + (extra || '') + '</div>';
    return d;
  }
  function put(node, ref, where) {
    if (!ref) return;
    ref.insertAdjacentElement(where, node);
    made.push(node);
  }
  function on() {
    if (made.length) return;
    if (!document.getElementById('nsg-css')) {
      var st = document.createElement('style'); st.id = 'nsg-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var sec = document.querySelectorAll('main > section');
    // 1. top display ad, after the first section (hero)
    put(unit('Display ad', 'Responsive: fits phone, tablet and computer', 120), sec[0], 'afterend');
    // 2. in-feed ad inside the list of goods or services
    var ul = document.querySelector('#list ul');
    if (ul && ul.children.length > 2) {
      var li = document.createElement('li'); li.className = 'nsg-li';
      li.appendChild(unit('In-feed ad', 'Sits between your items like one of them', 140));
      ul.insertBefore(li, ul.children[2]);
      made.push(li);
    }
    // 3. in-article ad inside the About text
    put(unit('In-article ad', 'Inside your text, between paragraphs', 200), document.querySelector('#about p'), 'afterend');
    // 4. display ad between two later sections
    put(unit('Display ad', 'Between sections, e.g. 300 × 250 or wider', 250), document.querySelector('#reviews, #faq, #contact'), 'beforebegin');
    // 5. multiplex (related content) before the footer
    put(unit('Multiplex ad', 'A grid of related ads', 0, '<div class="nsg-m"><i></i><i></i><i></i><i></i></div>'), document.querySelector('main'), 'afterend');
    // 6. anchor ad at the bottom of the screen (phones mostly), can be closed
    var a = unit('Anchor ad', 'Stays at the bottom of the screen', 50);
    a.classList.add('nsg-anc');
    var x = document.createElement('button'); x.type = 'button'; x.className = 'nsg-x'; x.textContent = '×'; x.setAttribute('aria-label', 'Close the anchor ad');
    x.addEventListener('click', function () { a.remove(); });
    a.querySelector('.nsg-b').appendChild(x);
    document.body.appendChild(a); made.push(a);
    var first = made[0];
    if (first && first.scrollIntoView) first.scrollIntoView({ block: 'center' });
  }
  function off() {
    made.forEach(function (n) { n.remove(); });
    made = [];
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.nsd !== 'ads') return;
    if (e.data.on) on(); else off();
  });
  if (/[?&]ads=1/.test(location.search)) on();
})();
