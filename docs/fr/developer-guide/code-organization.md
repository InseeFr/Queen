# Organisation du code

## Racine du projet

### Fichiers à la racine

#### Gestion du code :

- `.eslintrc` : fichier de configuration du _linter_ ESLint
- `.prettierrc` : fichier de configuration du plugin _prettier_
- `jsconfig.json` : Fichier précisant la racine du code pour le compilateur.
- `.gitingore` : pour que Git ignore certains fichiers (par exemple le dossier _build_)
- `package.json` : Fichier listant les dépendances du projet et décrivant succinctement le projet en lui-même
- `yarn.lock` : Pour que l'installation de Yarn soit cohérente d'une machine à l'autre, il faut plus d'informations que les seules dépendances précisées dans fichier `package.json`. Yarn stocke la version exacte de chaque dépendance qui a été installée dans le fichier `yarn.lock`.

#### CI :

- `.travis.yml` : script d'intégration continue executé par [travis-ci.org](https://travis-ci.org)
- `.ci/comment-pr.sh` :script utilisé au sein du `.travis.yml`

#### Docker :

- `Dockerfile` : Fichier décrivant l'image docker
- `nginx.conf` : configuration du serveur `nginx` utilisé dans l'image docker
- `scripts/env.sh` : script utilisé au lancement de l'image Docker
- `.env` : Fichier listant les variables d'environnements sous forme de clé/valeur. Ce fichier est utilisé au sein de l'image docker par le script précédent. (voir section sur [docker](docker.md))

#### Kubernetes :

`deployment.yml`, `ingress.yml`, `service.yml` : fichiers pour la configuration de kubernetes

### Dossier `configuration`

- dossier build : scripts utilisé lors du build (cf [Étape du build](developer-guide/build.md))
- dossier files : fichiers finaux de configuration (`configuration.json` et `keycloak.json`)

### Dossier `docs`

Dossier contenant le documentation écrite en markdown.

### Dossier `public` et `src`

Code source de l'application.

### Dossier générés

- `build`
- `nodes_modules`

## Application

- dossier **components** :
  Il contient les composants graphiques react.

- dossier **i18n** (internationalisation en abrégé) : contient les messages / mots / phrases génériques de l'application en français et en anglais.

- dossier **img** : contient les images interne à l'application

- dossier **utils** : contient toutes les fonctions, les utilitaires utilisés par les composants react (api, hook, indexdbb, constantes, ...).
