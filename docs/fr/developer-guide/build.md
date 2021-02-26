# Build

L'étape du build se fait en trois temps :

- build classique par `react-scripts build`
- build pour le service-worker
- build final

## Problème : le problème du micro-frontend

Lorsque l'application est utilisée en mode embarquée, ses scripts sont directement importés dans l'application parente. Queen peut alors fonctionner normalement sauf pour les images.

### Explication

Prenons l'exemple où Queen est desservis par l'adresse `https://queen.com` et est utilisé au sein d'une autre application comme Pearl-Jam desservis par l'adresse `https://pearl.com`.

Lorsqu'une application react est construite avec un build classique, les URLs sont relatives. Par exemple si l'application a besoin de l'image `/static/media/insee.png`, le script final envoie une requête vers `/static/media/insee.png` qui est résolu par le navigateur par la concaténation de l'origine de la page et de la requête, ce qui donne pour un site dont l'origine est `https://example.com` -> `https://example.com/static/media/insee.png`.

Ainsi lorsque Queen est embarquée dans une autre application et qu'elle a besoin de l'image `/static/media/insee.png` de Queen, le navigateur va résoudre de la même manière mais comme Queen est en mode embarqué, l'origine au yeux du navigateur est l'origine de l'application parente, il va donc chercher l'image à l'adresse `https://pearl.com/static/media/insee.png` au lieu de `https://queen.com/static/media/insee.png` dans notre exemple. On aura donc une erreur 404 si l'image n'existe par sur le serveur `https://pearl.com`.

## Solution

Le problème étant identifié, il faut une solution sous les contraintes suivantes :

- le build doit être **indépendant** de l'environnement où il est déployé (modulo le fichier `configuration.json`).
- utiliser `react-scripts build` car déjà bien optimisé

La solution est relativement simple.
Lors du build par react, on peut définir la variable PUBLIC_URL (ou homepage dans `package.json`). Cette variable permet de palier au problème d'URL relative.

Dans l'exemple précédent, il suffit de définir `PUBLIC_URL=https://queen.com` lors du build pour régler le problème.

Cette solution ne respecte pas la contrainte d'indépendance du build.
Pour régler ce problème, on définit `PUBLIC_URL=__PUBLIC_URL_TO_REPLACE__`, une expression facilement identifiable après build qu'on remplace par une expression en javascript.
L'expression est la suivante : `(localStorage.getItem('QUEEN_URL') || '')`.
Au démarrage de l'application en mode embarqué, la valeur de QUEEN_URL est enregistrée dans le `localStorage` du navigateur via le script [`entry.js`](https://github.com/InseeFr/Queen/blob/master/public/entry.js)

Avec cette solution :

- quand Queen est autonome : `localStorage.getItem('QUEEN_URL')` n'est pas défini, on se retrouve après résolution avec `''`, cela ne pose pas de problème, on reste avec une adresse relative.
- quand Queen est embarqué : `localStorage.getItem('QUEEN_URL')` vaut dans l'exemple précédent `https://queen.com`, pour rechercher l'image on aura bien une adresse absolue grâce à la concaténation par le script de `localStorage.getItem('QUEEN_URL')` et de l'url de l'image : `/static/media/insee.png`.

## Votre aide est la bienvenue !

Si vous trouvez une meilleure solution, merci de la proposer via des Pull Request.

# Build final :

- **Etape 1 :** build par react :

`env PUBLIC_URL=__PUBLIC_URL_TO_REPLACE__ react-scripts build`

- **Etape 2 :** ajout du service-worker :
  `node ./configuration/build/build-sw.js`

  - creation du service-worker externe (à importer via `importScripts` par une application parente) via workbox (injectManifest)
  - remplacement dans le service-worker original (pour le mode autonome) généré par react de : `__PUBLIC_URL_TO_REPLACE__` par `''`

- **Etape 3:** remplacement de l'expression `__PUBLIC_URL_TO_REPLACE__` : `npm post-build`
  - `node ./configuration/build/manage-public-url.js` : Parcours des fichiers générés, on remplace l'expression `__PUBLIC_URL_TO_REPLACE__` par `(localStorage.getItem('QUEEN_URL') || '')`
  - `copy-and-watch configuration/* build` : On ajoute les fichiers `configuration.json` et `oidc.json` : à valoriser lors du déploiement de l'application.
