// On cible la div de fond
const glitchBg = document.getElementById('glitch-canvas');

// --- CONFIGURATION ---
const blockCount = 150; // Change ce chiffre pour avoir plus ou moins de blocs !

// Tes couleurs (sans l'opacité, on va la générer aléatoirement)
const colors = [
  '0, 229, 255',   // Cyan
  '180, 75, 255',  // Violet
  '255, 179, 64',  // Ambre (très rare)
  '5, 1, 18'       // Gomme (couleur du fond pour créer des trous)
];

// Tableaux qui vont stocker les propriétés CSS générées
let bgImages = [];
let bgSizes = [];
let bgPositions = [];

// --- LA BOUCLE DE GÉNÉRATION ---
for (let i = 0; i < blockCount; i++) {
  
  // 1. Choix aléatoire de la couleur (on donne plus de chance au Cyan/Violet)
  let colorIndex = Math.floor(Math.random() * colors.length);
  // Astuce : On force la "Gomme" à apparaître 1 fois sur 4 pour casser les formes
  if (Math.random() > 0.75) colorIndex = 3; 

  let colorBase = colors[colorIndex];

  // 2. Opacité aléatoire
  // Si c'est la gomme (index 3), opacité forte. Sinon, opacité très faible (0.02 à 0.15)
  let opacity = colorIndex === 3 ? 0.98 : (Math.random() * 0.13 + 0.02).toFixed(2);
  let colorValue = `rgba(${colorBase}, ${opacity})`;

  // On crée le dégradé uni
  bgImages.push(`linear-gradient(${colorValue}, ${colorValue})`);

  // 3. Taille aléatoire
  // On alterne entre des blocs très larges/fins (lignes) et des blocs hauts/étroits
  let width, height;
  if (Math.random() > 0.5) {
    width = Math.floor(Math.random() * 400) + 10; // 10px à 410px de large
    height = Math.floor(Math.random() * 40) + 2;  // 2px à 42px de haut
  } else {
    width = Math.floor(Math.random() * 80) + 2;   // 2px à 82px de large
    height = Math.floor(Math.random() * 300) + 10;// 10px à 310px de haut
  }
  
  // Quelques scanlines (lignes très fines qui traversent tout l'écran)
  if (Math.random() > 0.95) {
    width = '100vw';
    height = Math.floor(Math.random() * 3) + 1; // 1px à 3px
  }

  bgSizes.push(`${width}px ${height}px`.replace('vwpx', 'vw'));

  // 4. Position aléatoire (en pourcentages de l'écran)
  let x = Math.floor(Math.random() * 100);
  let y = Math.floor(Math.random() * 100);
  bgPositions.push(`${x}vw ${y}vh`);
}

// --- INJECTION DANS LE CSS ---
glitchBg.style.backgroundImage = bgImages.join(', ');
glitchBg.style.backgroundSize = bgSizes.join(', ');
glitchBg.style.backgroundPosition = bgPositions.join(', ');