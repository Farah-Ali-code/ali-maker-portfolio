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
  const heroDiv = document.getElementById('heroImg');

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
  const navbar = document.getElementById('navbar');
  const THRESHOLD = 60;  // pixels de scroll avant d'activer le fond

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > THRESHOLD);
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




/*
====================================================================================================================================================================================

                                                            C   A   R    R  O   U   S   S    E    L
====================================================================================================================================================================================
*/

//TODO fix the color 

const container = document.querySelector('.gallery-scroll-container');
const originalContent = container.innerHTML;

container.innerHTML = originalContent + originalContent + originalContent;

// 2. Variables du moteur physique
let currentX = -33.3333; // Position de départ (Set central)
let scrollSpeed = 0;     // Vitesse actuelle (0 = à l'arrêt)

//sensible au frsh rate du nav 
function scrollLoop() {
  // On ajoute la vitesse à la position
  currentX += scrollSpeed;

  // --- LES TÉLÉPORTATIONS INVISIBLES ---
  // Si on scrolle trop à gauche (on dépasse le set central vers la gauche)
  if (currentX <= -66.6666) {
    currentX += 33.3333; // Téléportation au début du set central
  }
  // Si on scrolle trop à droite (on dépasse le set central vers la droite)
  else if (currentX >= 0) {
    currentX -= 33.3333; // Téléportation à la fin du set central
  }

  // On applique le résultat directement
  container.style.transform = `translateX(${currentX}%)`;

  // On rappelle la boucle pour la frame suivante
  requestAnimationFrame(scrollLoop);
}

// On lance le moteur
scrollLoop();

let baseOpacity = 1;
let speedFactor = 0.025;

// --- 4. CONTROLEUR DROIT (Fait défiler vers la GAUCHE, donc X diminue) ---
const controllerRight = document.querySelector('.gallery-scroll.controller.right');

controllerRight.addEventListener('mousemove', (event) => {
  let percentage = event.offsetX / controllerRight.offsetWidth;

  // Vitesse négative pour reculer. 
  // 0.02 est la vitesse de base, 0.15 est le boost maximal.
  scrollSpeed = -(0.03 + (percentage * speedFactor));
  //updater le gradient 
  controllerRight.style.opacity = 1-percentage ;


});

controllerRight.addEventListener('mouseleave', () => {
  scrollSpeed = 0; // Pause instantanée
  controllerRight.style.opacity = baseOpacity;
});


// --- 5. CONTROLEUR GAUCHE (Fait défiler vers la DROITE, donc X augmente) ---
const controllerLeft = document.querySelector('.gallery-scroll.controller.left');

controllerLeft.addEventListener('mousemove', (event) => {
  let percentage = event.offsetX / controllerLeft.offsetWidth;
  let invertedPercentage = 1 - percentage;

  // Vitesse positive pour avancer
  scrollSpeed = 0.03 + (invertedPercentage * speedFactor);

  //updater le gradient 
  controllerLeft.style.opacity = percentage ;
});

controllerLeft.addEventListener('mouseleave', () => {
  scrollSpeed = 0; // Pause instantanée
  controllerLeft.style.opacity = baseOpacity;
});




/*
====================================================================================================================================================================================

                                                            C   U   B   I   C         B   A   C   K   G   R   O   U   N   D
====================================================================================================================================================================================
*/


const canvas = document.getElementById('projects_bg');
const ctx = canvas.getContext('2d');

// --- CONFIGURATION ---
const blockCount = 500;

// --- UTILITAIRES ---
function hexToRgb(hex) {
  hex = hex.trim().replace(/^#/, '');
  if (hex.length === 6) {
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16)
    ];
  }
  return [255, 255, 255];
}

function lerpColor(c1, c2, factor) {
  // On sature le facteur entre 0 et 1 pour éviter les couleurs bizarres
  const f = Math.max(0, Math.min(1, factor));
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * f);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * f);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * f);
  return `${r}, ${g}, ${b}`;
}

// --- ASPIRATION DES COULEURS ---
function getProjectColors() {
  const projectColors = [];
  const projects = document.querySelectorAll('.project-row');
  projects.forEach(project => {
    const style = getComputedStyle(project);
    const hexColor = style.getPropertyValue('--pc').trim();
    if (hexColor) projectColors.push(hexToRgb(hexColor));
  });
  return projectColors.length > 0 ? projectColors : [[0, 229, 255], [180, 75, 255]];
}

const projectColors = getProjectColors();

const defaultZoneTrnastionRange = 0.15;
//zonne range entre [0,1] (comme ya deux zones 100% = 50% du canva)
//génere une proba + ou moins forte dépendement de la position du y et de si 
function  transitionProbability(y,zoneRange =defaultZoneTrnastionRange,intensity = 0){ 
  //(comme ya deux zones 100% = 50% du canva)
  let limitHauteduBas = zoneRange*canvas.height/2;
  let limitBasseDuHaut = ((canvas.height)-zoneRange*canvas.height/2);


if(y < limitHauteduBas || y > limitBasseDuHaut  ){
  let pourcentageDeLaZONE;
  if( y < limitHauteduBas){
       pourcentageDeLaZONE= y/limitHauteduBas;
       console.log(pourcentageDeLaZONE)
  }else{
       pourcentageDeLaZONE= (y-limitBasseDuHaut)/ (canvas.height-limitBasseDuHaut);
       console.log(pourcentageDeLaZONE)
  }
    // [0,2] a priorit
  if( Math.random()*pourcentageDeLaZONE*2  > 1-intensity){
    return y;
  }
  return 0;
}
return y;

}

// --- FONCTION DE DESSIN ---
function draw() {
  // Adapter la taille du canvas à l'écran
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Nettoyer (optionnel si le fond CSS est déjà là, mais plus propre)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const nbTransitions = projectColors.length - 1;
  const tailleTranche = 100 / nbTransitions;

  for (let i = 0; i < blockCount; i++) {
    // [0,100]
    let xPct = Math.random() * 100;
    let yPct = Math.random() * 100;

    //[0,width ou height]
    let x = (xPct * canvas.width) / 100;
    let y = (yPct * canvas.height) / 100;
        
     y = transitionProbability(y) ;
     if(y!=0){
     // Logique de couleur basée sur Y
    let colorBase;
    if (nbTransitions === 0) {
      colorBase = projectColors[0].join(',');
    } else {
      const numTranche = Math.min(Math.floor(yPct / tailleTranche), nbTransitions - 1);
      const positionLocale = (yPct - (numTranche * tailleTranche)) / tailleTranche;

      // Ton algorithme avec le blendFactor ( a quel point les couleurs osnt mélanger )
      let blendFactor = 1.1;
      let adjustedFactor = positionLocale + (Math.random() - 0.5) * (blendFactor - 1);

      colorBase = lerpColor(projectColors[numTranche], projectColors[numTranche + 1], adjustedFactor);
    }

    const opacity = (Math.random() * 0.07 + 0.02).toFixed(2);
    ctx.fillStyle = `rgba(${colorBase}, ${opacity})`;

    // Dimensions aléatoires (ton alternance horizontal/vertical)
    let w, h;
    if (Math.random() > 0.5) {
      //    ((Math.random()*2)-1) -------> [-1,1]
      w = Math.floor(((Math.random()*2)-1) * 400) + 10;
      h = Math.floor(((Math.random()*2)-1) * 40) + 2;
    } else {
      w = Math.floor(((Math.random()*2)-1) * 80) + 2;
      h = Math.floor(((Math.random()*2)-1) * 300) + 10;
    }

    // Dessiner le rectangle
    ctx.fillRect(x, y, w, h);
     }
 
    
  }
}

// Redessiner si on change la taille de la fenêtre
window.addEventListener('resize', draw);

// Premier rendu
draw();


