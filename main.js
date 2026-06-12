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


const defaultZoneRange = 0.25; // 15% de l'écran en haut, 15% en bas

//zonne range entre [0,1] (comme ya deux zones 100% = 50% du canva)
//génere une proba + ou moins forte dépendement de la position du y et de si 
function shouldDraw(y, zoneRange = defaultZoneRange) {
  const margin = canvas.height * zoneRange;

  // Zone d'atténuation du haut
  if (y < margin) {
    const proba = y / margin; // 0% tout en haut, 100% à la fin de la marge
    return Math.random() < proba;
  }

  // Zone d'atténuation du bas
  if (y > canvas.height - margin) {
    const distanceDepuisLeBas = canvas.height - y;
    const proba = distanceDepuisLeBas / margin; // 0% tout en bas, 100% au début de la marge
    return Math.random() < proba;
  }

  // Zone centrale : on dessine à 100%
  return true;
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
        
     if (shouldDraw(y)) {
      
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

/*
====================================================================================================================================================================================

                                                            C   U   B   I   C         B   A   C   K   G   R   O   U   N   D
====================================================================================================================================================================================
*/

 const CONFIG = {
      orbes: {
        quantite: 15,
        dispersion: 0.12,
        etendueVerticale: 2.5,
        tailleMinimale: 0.15,
        variationTaille: 0.70,
        opaciteCoeur: 0.65,
        opaciteMilieu: 0.22
      },
      animation: {
        fluiditeScroll: 0.07,
        intensiteParallaxe: 0.4,
        vitesseBase: 1.03,
        multiplicateurVitesse: 2.2
      },
      grille: { colonnes: 3 },
      palette: [
        { hue: 158, saturation: 65, lightness: 22 },
        { hue: 258, saturation: 70, lightness: 22 },
        { hue: 158, saturation: 100, lightness: 8 },
        { hue: 252, saturation: 75, lightness: 11 },
      ]
    };

    const sectionBackground = document.getElementById('section-arriere-plan');
    const canvasElement = document.getElementById('canvas-brouillard');
    const contexteCanvas = canvasElement.getContext('2d', { alpha: false });

    function obtenirCouleurInterpolee(ratioProgression) {
      const indexSegment = ratioProgression * (CONFIG.palette.length - 1);
      const indexCouleurBase = Math.min(Math.floor(indexSegment), CONFIG.palette.length - 2);
      const fractionRestante = indexSegment - indexCouleurBase;

      const couleurDepart = CONFIG.palette[indexCouleurBase];
      const couleurArrivee = CONFIG.palette[indexCouleurBase + 1];

      return {
        hue: couleurDepart.hue + (couleurArrivee.hue - couleurDepart.hue) * fractionRestante,
        saturation: couleurDepart.saturation + (couleurArrivee.saturation - couleurDepart.saturation) * fractionRestante,
        lightness: couleurDepart.lightness + (couleurArrivee.lightness - couleurDepart.lightness) * fractionRestante
      };
    }

    // NOUVEAU : Fonction de pré-rendu. On dessine le dégradé sur un canvas invisible.
    function creerTextureOrbe(couleur) {
      const offscreenCanvas = document.createElement('canvas');
      const tailleTexture = 512; // Résolution fixe pour le dégradé pré-calculé
      offscreenCanvas.width = tailleTexture;
      offscreenCanvas.height = tailleTexture;
      const ctx = offscreenCanvas.getContext('2d');
      const rayon = tailleTexture / 2;

      const degradeRadial = ctx.createRadialGradient(rayon, rayon, 0, rayon, rayon, rayon);
      degradeRadial.addColorStop(0, `hsla(${couleur.hue},${couleur.saturation}%,${couleur.lightness}%,${CONFIG.orbes.opaciteCoeur})`);
      degradeRadial.addColorStop(0.5, `hsla(${couleur.hue},${couleur.saturation}%,${couleur.lightness}%,${CONFIG.orbes.opaciteMilieu})`);
      degradeRadial.addColorStop(1, `hsla(${couleur.hue},${couleur.saturation}%,${couleur.lightness}%,0)`);

      ctx.fillStyle = degradeRadial;
      ctx.fillRect(0, 0, tailleTexture, tailleTexture);

      return offscreenCanvas; // Retourne l'image toute prête
    }

    function genererOrbesLumineux() {
      return Array.from({ length: CONFIG.orbes.quantite }, (_, index) => {
        const ratioDeProgression = index / (CONFIG.orbes.quantite - 1);
        const variationAleatoire = (Math.random() - 0.5) * CONFIG.orbes.dispersion * 2;
        const vitesseParallaxe = Math.max(CONFIG.animation.vitesseBase, ratioDeProgression + variationAleatoire) * CONFIG.animation.multiplicateurVitesse;
        
        const indexColonne = index % CONFIG.grille.colonnes;
        const indexLigne = Math.floor(index / CONFIG.grille.colonnes);
        
        const positionRelativeX = (indexColonne + 0.5) / CONFIG.grille.colonnes + (Math.random() - 0.5) * 0.25;
        const positionRelativeY = ((indexLigne + 0.5) / Math.ceil(CONFIG.orbes.quantite / CONFIG.grille.colonnes)) * CONFIG.orbes.etendueVerticale + (Math.random() - 0.5) * 0.25;

        const couleurCalculee = obtenirCouleurInterpolee(Math.random());
        // On génère la texture unique pour cet orbe
        const texturePreRendue = creerTextureOrbe(couleurCalculee);

        return {
          centreX: Math.max(0.05, Math.min(0.95, positionRelativeX)),
          centreY: Math.max(0.05, positionRelativeY),
          rayonRelatif: CONFIG.orbes.tailleMinimale + Math.random() * CONFIG.orbes.variationTaille,
          vitesseParallaxe,
          texture: texturePreRendue // On stocke l'image pré-calculée
        };
      });
    }

    const listeOrbes = genererOrbesLumineux();
    let defilementLisseActuel = window.scrollY;
    let frameDemandee = false;
    let sectionVisible = true; // Variable pour vérifier si la section est à l'écran

    function redimensionnerCanvas() {
      canvasElement.width = sectionBackground.offsetWidth;
      canvasElement.height = sectionBackground.offsetHeight;
      if (sectionVisible) dessinerOrbes(); 
    }

    function dessinerOrbes() {
      const largeurCanvas = canvasElement.width;
      const hauteurCanvas = canvasElement.height;
      const limiteHauteSection = sectionBackground.offsetTop;
      const defilementRelatif = defilementLisseActuel - limiteHauteSection;

      contexteCanvas.fillStyle = '#0a0d12';
      contexteCanvas.fillRect(0, 0, largeurCanvas, hauteurCanvas);

      listeOrbes.forEach(orbe => {
        const decalageVertical = defilementRelatif * orbe.vitesseParallaxe * CONFIG.animation.intensiteParallaxe;
        const positionPixelX = orbe.centreX * largeurCanvas;
        const positionPixelY = (orbe.centreY * hauteurCanvas) - decalageVertical;
        const rayonPixel = orbe.rayonRelatif * Math.max(largeurCanvas, hauteurCanvas);

        // Si l'orbe sort de l'écran, on l'ignore (Culling)
        if (positionPixelY + rayonPixel < 0 || positionPixelY - rayonPixel > hauteurCanvas) return;

        // NOUVEAU : On utilise drawImage pour copier la texture pré-calculée. 
        // Le GPU fait ça instantanément.
        contexteCanvas.drawImage(
          orbe.texture, 
          positionPixelX - rayonPixel, 
          positionPixelY - rayonPixel, 
          rayonPixel * 2, 
          rayonPixel * 2
        );
      });
    }

    function boucleAnimation() {
      // Si la section n'est pas à l'écran, on coupe tout
      if (!sectionVisible) {
        frameDemandee = false;
        return;
      }

      const differenceScroll = window.scrollY - defilementLisseActuel;
      
      if (Math.abs(differenceScroll) > 0.1) {
        defilementLisseActuel += differenceScroll * CONFIG.animation.fluiditeScroll;
        dessinerOrbes();
        requestAnimationFrame(boucleAnimation);
      } else {
        frameDemandee = false;
      }
    }

    // NOUVEAU : Intersection Observer pour éteindre l'animation si on ne la regarde pas
    const observateurVisibilite = new IntersectionObserver((entrees) => {
      sectionVisible = entrees[0].isIntersecting;
      if (sectionVisible && !frameDemandee) {
        frameDemandee = true;
        requestAnimationFrame(boucleAnimation);
      }
    }, { threshold: 0 }); // threshold: 0 signifie qu'il se déclenche dès qu'un pixel entre/sort

    observateurVisibilite.observe(sectionBackground);

    window.addEventListener('scroll', () => {
      if (sectionVisible && !frameDemandee) {
        frameDemandee = true;
        requestAnimationFrame(boucleAnimation);
      }
    });

    redimensionnerCanvas();
    window.addEventListener('resize', redimensionnerCanvas);
    
    frameDemandee = true;
    boucleAnimation();