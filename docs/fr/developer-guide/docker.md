# Docker

## Spécificité

L'image docker de Queen décrite [ici](https://github.com/InseeFr/Queen/blob/master/Dockerfile) est basée sur `nginx`.

La configuration du `nginx` est surchargée par le fichier [nginx.conf](https://github.com/InseeFr/Queen/blob/master/nginx.conf).
On y ajoute l'entête http : `Access-Control-Allow-Origin *` afin d'assurer le fonctionnement du Micro-Frontend (autrement dit : Queen en mode embarqué).

Dans l'image docker finale il y a :

- le build de l'application
- le fichier `.env`
- le script `env.sh`

Juste avant le lancement du `nginx`, le script `env.sh` est exécuté et permet de valoriser le fichier `configuration.json` et le fichier `oidc.json` avec les variables du fichier `.env` surchargées par les variables d'environnements passées à l'image docker.

Les variables d'environnements utilisées sont :

- Fichier configuration.json :

| Variable           | Valeur                                                                          | Valeur par défaut             |
| ------------------ | ------------------------------------------------------------------------------- | ----------------------------- |
| QUEEN_URL          | Final URL of the Queen application                                              | http://localhost:5000         |
| QUEEN_API_URL      | URL of the [back-office of Queen](https://github.com/InseeFr/Queen-Back-Office) | https://queen-bo.dev.insee.io |
| authenticationType | The mode of authentication: 'NONE' or 'OIDC'                                    | NONE                          |

- Fichier oidc.json :
  aucune valeur par défaut étant donné que le mode d'authentification par defaut est "NONE".

| Variable       | Valeur                             |
| -------------- | ---------------------------------- |
| oidc_authority | "authority"(server d'auth + realm) |
| oidc_client_id | "oidc_client_id" (id client )      |

## Récupérer l'image docker

`docker pull inseefr/queen`

## Builder l'image docker

A la racine du projet :

- `yarn build`
- `docker build -t example/queen .`

## Utiliser l'image docker

En ligne de commande en tapant simplement:
`docker run -p 5000:80 -t inseefr/queen`

Si vous souhaitez surcharger la configuration par défaut :
`docker run -p 80:80 -e QUEEN_URL=http://override.value.com -e QUEEN_API_URL=... -e authenticationType=... -t inseefr/queen`

Via `kubernetes` : un exemple de configuration est disponible [ici](https://github.com/InseeFr/Queen/blob/master/deployment.yml).
