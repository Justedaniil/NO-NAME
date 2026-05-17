(function(){
  'use strict';

  /* ── Nav scroll → solid ── */
  var nav = document.getElementById('nav');
  if(nav){
    function onScroll(){
      nav.classList.toggle('solid', window.scrollY > 80);
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* ── Reveal on scroll (.r → .on) ── */
  var items = document.querySelectorAll('.r');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('on');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.07, rootMargin:'0px 0px -30px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('on'); });
  }

  /* ── Mobile menu ── */
  var ham     = document.querySelector('.hamburger');
  var menu    = document.getElementById('mob-menu');
  var overlay = document.getElementById('mob-overlay');
  var close   = document.getElementById('mob-close');

  function openMenu(){
    if(!menu) return;
    menu.classList.add('open');
    overlay.classList.add('open');
    ham.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    if(!menu) return;
    menu.classList.remove('open');
    overlay.classList.remove('open');
    if(ham) ham.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  if(ham)     ham.addEventListener('click', openMenu);
  if(close)   close.addEventListener('click', closeMenu);
  if(overlay) overlay.addEventListener('click', closeMenu);

  /* Close on ESC */
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMenu();
  });

  /* ── Hero parallax (index only) ── */
  var heroBg = document.querySelector('.hero-bg');
  if(heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches){
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if(y < window.innerHeight){
        heroBg.style.transform = 'translateY(' + (y * 0.25) + 'px)';
      }
    }, {passive:true});
  }

})();
