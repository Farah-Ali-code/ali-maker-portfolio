/* ============================================================
   main.js — Maker Portfolio
   Modules :
     1. Hero — chargement de l'image avec effet de dézoom
     2. Navigation — passage en mode opaque au scroll
     3. Gallery — scroll vertical → défilement horizontal
     4. Reveal — apparition des éléments à l'entrée dans le viewport
     5. Smooth anchors — scroll fluide sur les liens internes
   ============================================================ */


/* ─────────────────────────────────────────────
   1. HERO IMAGE
   L'image n'est pas mise directement en CSS
   pour pouvoir détecter quand elle est chargée
   et déclencher l'animation de dézoom (.loaded).
   ───────────────────────────────────────────── */
(function initHero() {
  const HERO_URL = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&q=85';
  const heroDiv  = document.getElementById('heroImg');

  // On applique le background immédiatement (peut utiliser le cache navigateur)
  heroDiv.style.backgroundImage = `url('${HERO_URL}')`;

  // On crée un Image() pour surveiller le chargement réel
  const img = new Image();
  img.onload = () => heroDiv.classList.add('loaded');  // déclenche le dézoom CSS
  img.src = HERO_URL;
})();


/* ─────────────────────────────────────────────
   2. NAVIGATION — OPAQUE AU SCROLL
   La nav est transparente sur le hero.
   Dès que l'utilisateur scrolle de plus de 60px,
   on ajoute .scrolled qui applique le fond flou.
   ───────────────────────────────────────────── */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const THRESHOLD = 60;  // pixels de scroll avant d'activer le fond

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > THRESHOLD);
  });
})();


/* ─────────────────────────────────────────────
   3. GALLERY — SCROLL HORIZONTAL PILOTÉ PAR LE SCROLL VERTICAL
   
   Principe :
   - Le container HTML fait 400vh de haut (4 panels)
   - L'intérieur est en position sticky → reste visible
   - On écoute le scroll de la page et on calcule
     la progression (0.0 → 1.0) à l'intérieur du container
   - On convertit cette progression en index de panel (0 → 3)
   - On translate la track horizontalement
   
   Les points (dots) servent d'indicateurs de position
   et permettent aussi de naviguer par clic.
   ───────────────────────────────────────────── */
(function initGallery() {
  const container   = document.getElementById('galleryContainer');
  const track       = document.getElementById('galleryTrack');
  const panels      = document.querySelectorAll('.gallery-panel');
  const dots        = document.querySelectorAll('.g-dot');
  const PANEL_COUNT = panels.length;  // 4

  let currentIndex = 0;  // panel actuellement visible

  /**
   * Active un panel donné par son index.
   * - Retire .active du panel courant et de son point
   * - Ajoute .active au nouveau panel et à son point
   * - Translate la track pour montrer le bon panel
   */
  function setPanel(idx) {
    if (idx === currentIndex) return;  // pas de changement inutile

    // Désactiver l'ancien panel
    panels[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    // Activer le nouveau panel
    currentIndex = idx;
    panels[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');

    // Déplacer la track — chaque panel fait 100vw de large
    track.style.transition = 'transform 0.75s cubic-bezier(0.77, 0, 0.18, 1)';
    track.style.transform  = `translateX(-${currentIndex * 100}vw)`;
  }

  /**
   * Calcule quel panel afficher en fonction de la position de scroll.
   * Appelée à chaque événement scroll.
   */
  function onScroll() {
    const rect   = container.getBoundingClientRect();
    const totalH = container.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;  // distance scrollée depuis le haut du container

    // On ignore si on est hors du container
    if (scrolled < 0 || scrolled > totalH) return;

    // Progression de 0 à 1 → index de 0 à PANEL_COUNT-1
    const progress = scrolled / totalH;
    const targetIndex = Math.min(PANEL_COUNT - 1, Math.floor(progress * PANEL_COUNT));

    setPanel(targetIndex);
  }

  // Écoute du scroll — passive:true pour ne pas bloquer le rendu
  window.addEventListener('scroll', onScroll, { passive: true });

  /**
   * Clic sur un point → scroll jusqu'au panel correspondant.
   * On calcule la position Y dans le container qui correspond
   * à ce panel, puis on scrolle la page à cet endroit.
   */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx     = parseInt(dot.dataset.dot, 10);
      const totalH  = container.offsetHeight - window.innerHeight;
      const targetY = container.offsetTop + (idx / PANEL_COUNT) * totalH;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────────
   4. REVEAL AU SCROLL (IntersectionObserver)
   
   Les éléments avec la classe .reveal partent
   invisibles (opacity:0, translateY). Quand ils
   entrent dans le viewport, on ajoute .visible
   qui les fait apparaître via une transition CSS.
   
   Le délai échelonné (i * 80ms) crée un effet
   de cascade quand plusieurs éléments arrivent
   en même temps.
   ───────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;

        // Délai échelonné pour la cascade
        setTimeout(
          () => entry.target.classList.add('visible'),
          i * 80
        );

        // On arrête d'observer une fois apparu (une seule fois)
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }  // déclenche quand 10% de l'élément est visible
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────
   5. SMOOTH ANCHORS
   Surcharge le comportement par défaut des liens
   #ancre pour utiliser scrollIntoView au lieu du
   saut brutal du navigateur.
   Note : scroll-behavior: smooth en CSS suffit
   dans la plupart des cas, mais scrollIntoView
   est plus compatible et plus contrôlable.
   ───────────────────────────────────────────── */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
