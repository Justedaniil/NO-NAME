/* ══════════════════════════════════════
   MOULIN DE MOISSAC — shared.js v3
   Mega-menu · Mobile fullscreen · Booking bar · Galerie drag
══════════════════════════════════════ */
(function(){
  'use strict';

  /* ── Nav scroll ── */
  var nav = document.getElementById('nav');
  function onScroll(){
    if(!nav) return;
    nav.classList.toggle('solid', window.scrollY > 80);

    // Sticky booking bar
    var bar = document.getElementById('booking-sticky');
    if(bar){
      bar.classList.toggle('visible', window.scrollY > window.innerHeight * 0.9);
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ── Reveal on scroll ── */
  var items = document.querySelectorAll('.r');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('on');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.06, rootMargin:'0px 0px -30px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('on'); });
  }

  /* ── Mobile menu fullscreen ── */
  var ham = document.querySelector('.hamburger');
  var mobMenu = document.getElementById('mob-menu');
  var mobOverlay = document.getElementById('mob-overlay');
  var mobClose = document.getElementById('mob-close');

  function openMob(){
    if(mobMenu) mobMenu.classList.add('open');
    if(mobOverlay) mobOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if(ham) ham.setAttribute('aria-expanded','true');
  }
  function closeMob(){
    if(mobMenu) mobMenu.classList.remove('open');
    if(mobOverlay) mobOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if(ham) ham.setAttribute('aria-expanded','false');
  }
  if(ham) ham.addEventListener('click', openMob);
  if(mobClose) mobClose.addEventListener('click', closeMob);
  if(mobOverlay) mobOverlay.addEventListener('click', closeMob);

  /* Mobile sub-menus toggle */
  document.querySelectorAll('.mob-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = document.getElementById(btn.dataset.target);
      if(target) target.classList.toggle('open');
    });
  });

  /* ── Hero logo fallback ── */
  var heroLogoImgs = document.querySelectorAll('.hero-logo img,.nav-logo-img');
  heroLogoImgs.forEach(function(img){
    img.addEventListener('error', function(){
      var fallback = img.nextElementSibling;
      if(fallback && fallback.classList.contains('brand-txt')){
        img.style.display='none';
        fallback.style.display='flex';
      }
    });
  });

  /* ── Parallax hero ── */
  var heroBg = document.querySelector('.hero-bg');
  if(heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches){
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if(y < window.innerHeight){
        heroBg.style.transform = 'translateY(' + (y * 0.25) + 'px) scale(1)';
      }
    }, {passive:true});
  }

  /* ── Galerie scroll horizontal (drag) ── */
  document.querySelectorAll('.galerie-h-track').forEach(function(track){
    var isDown = false;
    var startX, scrollLeft;

    track.addEventListener('mousedown', function(e){
      isDown = true;
      track.style.cursor='grabbing';
      startX = e.pageX - track.getBoundingClientRect().left;
      scrollLeft = track.parentElement.scrollLeft;
    });
    track.addEventListener('mouseleave', function(){ isDown=false; track.style.cursor='grab'; });
    track.addEventListener('mouseup', function(){ isDown=false; track.style.cursor='grab'; });
    track.addEventListener('mousemove', function(e){
      if(!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.getBoundingClientRect().left;
      var walk = (x - startX) * 1.4;
      track.parentElement.scrollLeft = scrollLeft - walk;
    });

    // Touch
    var touchStartX, touchScrollLeft;
    track.addEventListener('touchstart', function(e){
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = track.parentElement.scrollLeft;
    }, {passive:true});
    track.addEventListener('touchmove', function(e){
      var dx = touchStartX - e.touches[0].pageX;
      track.parentElement.scrollLeft = touchScrollLeft + dx;
    }, {passive:true});
  });

  /* Galerie prev/next buttons */
  document.querySelectorAll('.gal-btn-prev').forEach(function(btn){
    btn.addEventListener('click', function(){
      var wrap = btn.closest('.galerie-h').querySelector('.galerie-h-track-wrap');
      if(wrap) wrap.scrollBy({left: -400, behavior:'smooth'});
    });
  });
  document.querySelectorAll('.gal-btn-next').forEach(function(btn){
    btn.addEventListener('click', function(){
      var wrap = btn.closest('.galerie-h').querySelector('.galerie-h-track-wrap');
      if(wrap) wrap.scrollBy({left: 400, behavior:'smooth'});
    });
  });

  /* ── Widget réservation — date min ── */
  var inputs = document.querySelectorAll('input[type="date"]');
  var today = new Date().toISOString().split('T')[0];
  inputs.forEach(function(inp){ inp.min = today; });

  /* Arrival → Departure auto +1 day */
  var arrInput = document.querySelector('.booking-arrival');
  var depInput = document.querySelector('.booking-depart');
  if(arrInput && depInput){
    arrInput.addEventListener('change', function(){
      var d = new Date(arrInput.value);
      d.setDate(d.getDate()+1);
      depInput.min = d.toISOString().split('T')[0];
      if(!depInput.value || depInput.value <= arrInput.value){
        depInput.value = d.toISOString().split('T')[0];
      }
    });
  }

  /* Booking form submit → Best Western avec params */
  document.querySelectorAll('.booking-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var arr = form.querySelector('.booking-arrival');
      var dep = form.querySelector('.booking-depart');
      var adu = form.querySelector('.booking-adultes');
      var base = 'https://www.bestwestern.fr/infos_hotel.jsp?HotelCode=87142&lang=fr';
      var params = '';
      if(arr && arr.value) params += '&checkin=' + arr.value;
      if(dep && dep.value) params += '&checkout=' + dep.value;
      if(adu && adu.value) params += '&adults=' + adu.value;
      window.open(base + params, '_blank', 'noopener');
    });
  });

  /* ── Newsletter form ── */
  document.querySelectorAll('.newsletter-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = form.querySelector('.newsletter-input');
      var btn = form.querySelector('.newsletter-submit');
      if(input && input.value){
        btn.textContent = '✓ Merci !';
        btn.style.background = '#6a9e5e';
        input.value = '';
        setTimeout(function(){
          btn.textContent = 'S\'abonner';
          btn.style.background = '';
        }, 3000);
      }
    });
  });

  /* ── Video hero fallback ── */
  var heroVid = document.querySelector('.hero-video');
  if(heroVid){
    heroVid.addEventListener('error', function(){
      heroVid.style.display = 'none';
      var fallback = document.querySelector('.hero-bg');
      if(fallback) fallback.style.opacity = '1';
    });
  }

})();
