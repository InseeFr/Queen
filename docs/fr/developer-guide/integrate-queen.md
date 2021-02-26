# Intégrer Queen en tant que Web Component (embarqué)

L'application Queen dispose de deux modes possibles : autonome et embarqué.

Pour utilisé Queen en mode embarqué, c'est relativement simple.

Admettons que l'application Queen est déservie via l'url `https://queen.dev.insee.io`.

## Charger l'application

Pour charger l'application, il suffit d'importer le script `https://queen.dev.insee.io/entry.js` dans le fichier `index.html` de l'application "parente".

```html
<script src="https://queen.dev.insee.io/entry.js"></script>
```

## Utiliser l'application

Une fois l'application chargée, pour l'utiliser, il suffit d'ajouter le tag `<queen-app></queen-tag>`.

L'application répondra à toutes les urls commençant par "https://application.parente.insee.fr/**queen**".

Afin d'éviter toutes interférences avec l'application, veuillez éviter que votre application réponde elle aussi à ce type d'urls.

En revanche, tant que le tag `<queen-app></queen-tag>` n'est pas écrit, l'application queen n'est pas active et n'est pas en mesure de répondre aux urls.

## Utiliser Queen en mode offline

Le mode offline fonctionne grâce à un service-worker qui intercepte les requêtes et répond via les réponses dans le cache du navigateur.

Pour utiliser Queen en mode offline, il faut importer le service-worker de Queen dans le service-worker de l'application parente via `importScripts`.

De plus afin de s'assurer du bon fonctionnement, il faut également définir la variable `self._QUEEN_URL` dans le service-worker de l'application mère avant d'importer le service-worker de Queen.
Cette variable est utilisée dans le service-worker de Queen.

Le service-worker de l'application parente doit ressembler à ça :

```js
self._QUEEN_URL = 'https://queen.insee.fr';
importScripts(`${self._QUEEN_URL}/queen-service-worker.js`);

/* le reste du service-worker */
```
