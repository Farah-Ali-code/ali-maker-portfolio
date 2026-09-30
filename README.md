# Maker Portfolio

Welcome to my portfolio repository. If you are grading this, thank you for taking the time to look through the source code.

## About the Development Process

This project was built with the assistance of AI, but a significant portion of the code was written and adjusted by hand. I chose this hybrid approach because I could not find a free, automated workflow versatile enough to fully support my artistic vision. 

If you are interested in the design process, you can find my mood board included in this repository, available in both `.pureref` and `.png` formats.

## Dynamic Backgrounds & Shaders

Because I enjoy making shaders, most of the backgrounds on this site are procedurally generated and randomized. I highly encourage you to refresh the page a few times to experience the different visual variations.

## Work in Progress (TODO)

- **Documentation:** I need to add a technical explanation detailing how to add new sections within the cubic background component.
- **Licenses:** I have not yet finalized the research for third-party image licenses. However, any original image created by me is completely free to use for any purpose. A formal open-source license will be added to the repository soon.
-sort images
-unifie the css 

**Licenses:** 


---

### Niveau 1 : Ajustements de contenu & corrections mineures (Très rapide)

*Modifications directes dans le code existant ou les fichiers textes, sans impact structurel.*

* [ ] **Remplacer le texte chiffré dans "my future" :** Décoder ou réécrire le paragraphe de conclusion par une formulation professionnelle claire de vos objectifs.
* [ ] **Mettre à jour l'intitulé de votre profil :** Remplacer les termes "student / completing my 3rd year" par votre titre cible (ex. *Graphics & Low-Level Software Engineer* ou *Technicien supérieur en informatique*).
* [ ] **Corriger les liens externes :** Ajouter `target="_blank"` et `rel="noopener noreferrer"` sur tous les liens sortants (GitHub, démos, projets) pour respecter la consigne d'ouverture dans un nouvel onglet.
* [ ] **Ajouter un point de contact direct :** Ajouter un lien direct `mailto:` cliquable ou un bouton simple vers votre adresse e-mail à côté des icônes LinkedIn et GitHub.
* [ ] **Identifier formellement le projet tutoré :** Ajouter un badge ou un tag visible "Projet Tutoré" sur le projet concerné (ex. *Zenior* ou *Movie Map Explorer*).

---

### Niveau 2 : Intégration du CV en ligne (Faible complexité)

*Ajout d'un composant d'affichage sans logique applicative complexe.*

* [ ] **Intégrer le lecteur de CV en ligne :**
* Conserver les boutons de téléchargement PDF actuels.
* Ajouter un visualiseur PDF natif (`<iframe src="...#toolbar=0">`, `<object>` ou `<embed>`) ou une version HTML/CSS stylisée du CV directement consultable sur la page ou dans une section dédiée.



---

### Niveau 3 : Refonte et enrichissement des données des projets (Moyenne complexité)

*Travail rédactionnel et collecte d'assets pour passer au format complet 12 critères.*

* [ ] **Collecter 4+ visuels par projet phare :** Réunir schémas d'architecture, captures d'écrans des outils, wireframes et rendus finaux pour Soulserv, le projet tutoré et les projets principaux.
* [ ] **Rédiger les blocs obligatoires pour chaque projet :**
* Problématique et contexte.
* Découpage chronologique des étapes clés.
* Compétences mobilisées (techniques, humaines et méthodologiques).
* Liens académiques (mention discrète des SAÉ / compétences BUT).
* Démarche réflexive : bilan d'apprentissage, difficultés rencontrées et résolutions.


* [ ] **Structurer les données (JSON / CMS / Markdown) :** Organiser ces champs dans un schéma de données pour alimenter votre système d'affichage dynamique.

---

### Niveau 4 : Développement de la page "Numérique Responsable" (Complexité moyenne / frontend)

*Création d'une vue dédiée avec design, structure et contenus ciblés.*

* [ ] **Créer la route et le composant de page :**
* Section 1 : Objectifs et cadre pédagogique abordés durant le BUT.
* Section 2 : Notions théoriques clés (cycle de vie logiciel, sobriété numérique, accessibilité WCAG, empreinte carbone des serveurs/calculs GPU).
* Section 3 : Engagements concrets et bonnes pratiques appliqués dans vos projets (optimisation mémoire en C++/Assembly, allègement du DOM en Vanilla JS, limitation des requêtes API, etc.).


* [ ] **Relier la page à la navigation :** Ajouter l'ancre ou le lien dans le menu de navigation principal et dans le footer.

---

### Niveau 5 : Architecture de consultation des projets : Modale / Page dédiée & Chargement de données (Forte complexité)

*Mise en place de composants interactifs, gestion d'état et chargement asynchrone.*

* [ ] **Développer le composant de vue détaillée (Modal pop-up ou route dynamique `/projects/:id`) :**
* Créer le gabarit d'affichage complet intégrant la galerie des 4+ images, les tags d'outils, la démarche réflexive et le lien externe.
* Gérer l'accessibilité de la modale (focus trap, fermeture via touche `Échap`, scroll bloqué en arrière-plan).


* [ ] **Implémenter le système de chargement des données :**
* Mettre en place la récupération asynchrone (`fetch`, imports dynamiques ou state management) des détails complets du projet au clic sur une carte.
* Ajouter un état de chargement visuel (*skeleton loader* ou spinner) pour assurer une transition fluide avant l'affichage complet.


* [ ] **Gérer l'historique et le deep-linking (optionnel mais recommandé) :** Mettre à jour l'URL (via hash ou paramètre d'URL) à l'ouverture pour permettre de partager un lien direct vers un projet spécifique.