# Intégrer Queen : l'exemple de Pearl-Jam

Pearl-Jam est une application qui intègre Queen en tant que web-component. Elle utilise également react.

Son code source est disponible sur [GitHub](https://github.com/InseeFr/Pearl-Jam).

## Chargement de Queen

Le chargement de l'application dans Queen est fait de façon dynamique (l'url de Queen est déduite à partir d'un fichier de configuration).

Queen est chargée à partir du composant de plus haut niveau afin de la rendre disponible le plus tôt possible :
[Racine de l'application](https://github.com/InseeFr/Pearl-Jam/blob/master/src/App.js)
[hook d'importation](https://github.com/InseeFr/Pearl-Jam/blob/master/src/common-tools/hooks/useQueenFromConfig.js)

## Utilisation de Queen

Lorque l'url de Pearl-Jam commence par "/queen", l'application rend le composant [`<QueenContainer>`](https://github.com/InseeFr/Pearl-Jam/blob/master/src/components/panel-body/queen-container/component.js#L5) qui se contente d'écrire le tag html `<queen-app />`.

## Service-worker

L'url de Queen étant dynamique dans l'application, elle est passée via l'url d'enregistrement du service-worker : [code](https://github.com/InseeFr/Pearl-Jam/blob/master/src/serviceWorker.js#L33). (surcharge de serviceWorker.js créé lors du create-react-app)

L'url est ensuite récupérée dans le service-worker via l'url d'enregistrement toujours : [code](https://github.com/InseeFr/Pearl-Jam/blob/master/src/service-worker-custom.js#L1)
