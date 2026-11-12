// GymPulse — общий скрипт сайта: язык RU/EN, появление блоков, копирование почты
(function () {
  var root = document.documentElement;
  function getLang() {
    var l = null;
    try { var q = new URLSearchParams(location.search).get('lang'); if (q === 'ru' || q === 'en') l = q; } catch (e) {}
    if (!l) { try { l = localStorage.getItem('gp_lang'); } catch (e) {} }
    if (l !== 'ru' && l !== 'en') l = /^(ru|uk|be|kk)/i.test(navigator.language || '') ? 'ru' : 'en';
    return l;
  }
  function setLang(l, save) {
    root.lang = l;
    if (save) { try { localStorage.setItem('gp_lang', l); } catch (e) {} }
    document.querySelectorAll('.lang button').forEach(function (b) { var on = b.getAttribute('data-set') === l; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    var t = document.querySelector('meta[name="gp:title-' + l + '"]'); if (t) document.title = t.content;
    if (typeof window.onLang === 'function') window.onLang(l);
  }
  window.gpLang = function () { return root.lang === 'en' ? 'en' : 'ru'; };
  setLang(getLang(), false);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.lang button');
    if (b) setLang(b.getAttribute('data-set'), true);
    var c = e.target.closest && e.target.closest('[data-copy]');
    if (c) {
      var src = document.getElementById(c.getAttribute('data-copy')), txt = src ? src.textContent.trim() : '';
      var done = function () { c.classList.add('ok'); c.setAttribute('data-done', '1'); setTimeout(function () { c.classList.remove('ok'); c.removeAttribute('data-done'); }, 1800); };
      var pick = function () { if (!src) return; var r = document.createRange(); r.selectNodeContents(src); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      try { navigator.clipboard.writeText(txt).then(done, pick); } catch (err) { pick(); }
    }
  });
  root.classList.add('js');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.remove('pre'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); io.observe(el); } });
  }
})();
