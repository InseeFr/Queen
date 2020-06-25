# API

L'application Queen fonctionne avec une api, le code source de l'api (Queen-back-office) est open-source et disponible sur [GitHub](https://github.com/InseeFr/Queen-Back-Office).

## Appel à l'API

Les appels api sont décrits dans le dossier [src/utils/api](https://github.com/InseeFr/Queen/tree/master/src/utils/api).

Il y a 4 end-points différents accessibles via l'api :

- survey-units : gestion des unités enquêtés, il y a deux types de données pour les unités enquêtés
  - data : données collectées de l'unité enquêté (GET/PUT)
  - comment : commentaires collectées liés aux questions (GET/PUT)
- questionnaire : gestion des modèles de questionnaire (GET uniquement)
- resources (nomenclature uniquement pour le moment) : gestion des ressources utiles pour un questionnaire donnée (GET uniquement)
- operations : gestion des opérartions concernées par l'utilisateur (GET uniquement)
  Les appels api sont écrits comme des promesses javascript.

Ils commencent tous pas la méthode d'authentification (prenant en paramètre le mode de d'authentification). Après résolution, une requête de type axios est utilisée selon ce qui est voulu, lorque la promesse est résolue, la réponse de l'api est retournée sinon une erreur est levée.

## Fonction utilitaires

Les fonctions utilisées par les différents appels api factorisables ont été externalisées dans le fichier [api.js](https://github.com/InseeFr/Queen/tree/master/src/utils/api/api.js).

Le code reste encore factorisable notamment avec `axios.interceptors`. Vous pouvez contribuez.
