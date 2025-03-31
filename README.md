# Webflow Developer

Ce projet est un template pour le développement front-end avec Webflow. Il permet d'ajouter du JavaScript et du CSS personnalisé à un site Webflow, avec une structure organisée et des outils de développement modernes.

## Structure du projet

```
repo-cf-page/
├── bin/                  # Scripts de build
│   ├── build.js          # Script de build principal
│   ├── copy-page-css.js  # Script pour copier les CSS spécifiques aux pages
│   └── live-reload.js    # Script pour le rechargement automatique
├── dist/                 # Fichiers générés (non versionnés)
│   └── pages/            # CSS spécifiques aux pages
├── src/                  # Code source
│   ├── index.js          # Point d'entrée principal
│   ├── scripts/          # Code JavaScript
│   │   ├── main.js       # JavaScript global pour toutes les pages
│   │   └── pages/        # Code spécifique à chaque page
│   │       ├── blog-hub.js       # Code pour la page de listing blog
│   │       ├── blog-template.js  # Code pour les pages d'articles
│   │       ├── home.js           # Code pour la page d'accueil
│   │       └── contact.js        # Code pour la page de contact
│   ├── styles/           # Fichiers CSS
│   │   ├── main.css      # Styles globaux
│   │   └── pages/        # Styles spécifiques aux pages
│   │       ├── blog-hub.css
│   │       ├── blog-template.css
│   │       ├── home.css
│   │       └── contact.css
│   └── utils/            # Utilitaires réutilisables
│       ├── css-loader.js         # Chargement dynamique des CSS
│       ├── page-routing.js       # Détection et routage des pages
│       ├── webflow-breakpoints.js # Gestion des breakpoints
│       ├── webflow-css.js        # Classes CSS Webflow
│       ├── webflow-dropdown.js   # Gestion des dropdowns
│       ├── webflow-forms.js      # Validation des formulaires
│       └── webflow-restart.js    # Redémarrage de Webflow
└── package.json          # Dépendances et scripts
```

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start

# Construire pour la production
npm run build
```

## Développement

### Ajouter du code pour une nouvelle page

1. Créez un fichier CSS dans `src/styles/pages/` (ex: `nouvelle-page.css`)
2. Créez un fichier JavaScript dans `src/scripts/pages/` (ex: `nouvelle-page.js`)
3. Importez et initialisez la page dans `src/index.js`

Exemple pour `nouvelle-page.js` :

```javascript
import { loadPageCSS } from '../../utils/css-loader.js';

export function initNouvellePage() {
  console.log('Nouvelle page initialisée');
  loadPageCSS('nouvelle-page');
  
  // Votre code spécifique à la page ici
}
```

Mise à jour de `src/index.js` :

```javascript
import { initNouvellePage } from './scripts/pages/nouvelle-page.js';
import { initHomePage } from './scripts/pages/home.js';
// ... autres imports

// Déterminer quelle page est actuellement chargée
const currentPage = window.location.pathname;

// Initialiser la page appropriée
if (currentPage.includes('/nouvelle-page')) {
  initNouvellePage();
} else if (currentPage === '/' || currentPage.includes('/home')) {
  initHomePage();
}
// ... autres conditions
```

## Utilitaires disponibles

### CSS Loader

Permet de charger dynamiquement les CSS spécifiques à chaque page.

```javascript
import { loadCSS, loadPageCSS } from '../utils/css-loader.js';

// Charger un fichier CSS spécifique
loadCSS('/path/to/file.css');

// Charger le CSS correspondant à une page
loadPageCSS('home');
```

### Webflow Breakpoints

Permet de détecter les breakpoints Webflow.

```javascript
import { getCurrentBreakpoint } from '../utils/webflow-breakpoints.js';

const breakpoint = getCurrentBreakpoint();
console.log(breakpoint); // 'desktop', 'tablet', 'mobile landscape', 'mobile portrait'

if (breakpoint === 'mobile portrait') {
  // Code spécifique pour mobile
}
```

### Webflow Dropdowns

Gestion améliorée des dropdowns Webflow.

```javascript
import { setupAutoCloseDropdowns } from '../utils/webflow-dropdown.js';

// Ferme automatiquement les dropdowns ouverts lorsqu'on clique ailleurs
setupAutoCloseDropdowns();
```

### Webflow Forms

Validation et soumission de formulaires.

```javascript
import { setupForm, ValidationRules } from '../utils/webflow-forms.js';

const removeHandler = setupForm('#my-form', {
  validationRules: {
    '[name="email"]': [ValidationRules.required(), ValidationRules.email()],
    '[name="name"]': [ValidationRules.required(), ValidationRules.minLength(2)]
  },
  onSubmit: async (event, form) => {
    // Traitement du formulaire
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Exemple d'envoi à une API
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Succès
      } else {
        // Erreur
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }
});

// Nettoyage (à appeler lors du démontage du composant si nécessaire)
removeHandler();
```

### Webflow Restart

Permet de redémarrer les interactions Webflow après des modifications DOM.

```javascript
import { restartWebflow } from '../utils/webflow-restart.js';

// Après avoir modifié le DOM
await restartWebflow();

// Pour redémarrer des interactions spécifiques
await restartWebflow(['slider', 'tabs']);
```

## Fonctionnalités Webflow personnalisées

Le projet utilise le package npm `@justaa/scripts` qui contient des fonctionnalités personnalisées pour Webflow basées sur des attributs HTML. Ces fonctionnalités peuvent être importées et utilisées dans n'importe quelle page.

### Installation

Le package est déjà installé comme dépendance du projet. Si vous avez besoin de le mettre à jour :

```bash
npm install @justaa/scripts@latest
```

### Comment utiliser les fonctionnalités

Il existe deux façons principales d'utiliser ces fonctionnalités, selon leur type :

#### 1. Scripts auto-exécutables (la plupart des scripts)

La plupart des scripts dans `@justaa/scripts` sont auto-exécutables et basés sur des attributs. Pour les utiliser :

1. Importez simplement le script dans votre fichier JavaScript de page :

```javascript
// Dans src/scripts/pages/contact.js
import '@justaa/scripts/dist/forms/deactivate-option-select.js';

export function initContactPage() {
  console.log('Contact page initialized');
  loadPageCSS('contact');
  // Le script s'exécute automatiquement lors de l'import
  // et recherche les éléments avec les attributs correspondants
}
```

2. Ajoutez les attributs HTML nécessaires dans votre site Webflow :

```html
<!-- Dans l'éditeur Webflow -->
<select js-form-select="select">
  <option>Sélectionnez une option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

Le script s'exécutera automatiquement lorsque la page se charge et appliquera la fonctionnalité (dans cet exemple, désactiver la première option du select).

#### 2. Fonctions exportées (scripts plus complexes)

Pour les scripts qui exportent des fonctions :

1. Importez la fonction et appelez-la dans votre code :

```javascript
// Dans src/scripts/pages/home.js
import { nomDeLaFonctionnalité } from '@justaa/scripts/dist/nom-du-fichier.js';

export function initHomePage() {
  console.log('Home page initialized');
  loadPageCSS('home');
  
  // Initialiser la fonctionnalité avec des paramètres spécifiques
  nomDeLaFonctionnalité('#mon-element', { 
    option1: true,
    option2: 'valeur'
  });
}
```

### Avantages de cette approche

Cette approche basée sur les attributs et l'utilisation d'un package npm offre plusieurs avantages :

1. **Séparation du code et de la configuration** - Le JavaScript reste dans les fichiers, la configuration dans les attributs HTML
2. **Facilité de maintenance** - Modifiez le comportement directement dans l'éditeur Webflow
3. **Réutilisabilité** - Utilisez le même script sur différentes pages sans duplication
4. **Performance** - Chargez uniquement les scripts nécessaires pour chaque page
5. **Clarté** - L'intention est claire dans le HTML grâce aux attributs descriptifs
6. **Mises à jour facilitées** - Mettez à jour toutes les fonctionnalités en une seule commande npm
7. **Versionnement** - Contrôlez précisément quelle version des scripts vous utilisez

### Exemples de scripts disponibles

- **Forms**
  - `deactivate-option-select.js` - Désactive la première option d'un select (placeholder)
  
- **Autres catégories**
  - Consultez la documentation du package [@justaa/scripts](https://www.npmjs.com/package/@justaa/scripts) pour découvrir toutes les fonctionnalités disponibles

Pour plus de détails sur chaque fonctionnalité spécifique, consultez la documentation du package ou les commentaires dans les fichiers JavaScript correspondants.

## Fonctionnalités du build

- **Code splitting** : Divise le code en chunks pour optimiser le chargement
- **Minification** : Réduit la taille des fichiers pour la production
- **Live reload** : Rafraîchit automatiquement le navigateur pendant le développement
- **CSS par page** : Charge uniquement le CSS nécessaire pour chaque page

## Déploiement

Pour déployer sur Webflow, suivez ces étapes :

1. Construisez les fichiers pour la production :
   ```bash
   npm run build
   ```

2. Copiez le contenu du fichier `dist/main.js` dans le panneau "Custom Code" de Webflow (Paramètres du site > Custom Code > Footer Code)

3. Pour chaque page, copiez le CSS correspondant depuis `dist/pages/[nom-page].css` dans le panneau "Custom Code" de la page spécifique dans Webflow

## Licence

MIT
