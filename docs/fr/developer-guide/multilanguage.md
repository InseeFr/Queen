# Multi-langue

L'application gère le multi-langue (français / anglais). C'est à dire que la langue des textes de l'application s'adapte en fonction de langue définit par défaut dans le navigateur.

Un dictionnaire est crée dans l'application via le script `build-dictionary.js` en utilisant les messages présent dans le fichier `dictionary.js`.

Le dictionnaire est découpé en plusieurs fichiers afin de clarifier et faciliter le développement.

Pour ajouter un message il suffit d'ajouter une nouvelle clé JSON :

```json
newMessage : {
    "fr" : "Nouveau message en français",
    "en" : "New message in english"
}
```

Pour utiliser le dictionnaire dans un composant, il suffit d'importer le dictionnaire et d'utiliser le message comme ceci :

```js
import D from 'i18n';

<span>{D.newMessage}</span>;
```
